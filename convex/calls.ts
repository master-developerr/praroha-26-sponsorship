import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const logCallAndDebrief = mutation({
  args: {
    volunteerClerkId: v.string(),
    companyId: v.id("companies"),
    contactId: v.optional(v.id("contacts")),
    startedAt: v.number(),
    endedAt: v.number(),
    durationSeconds: v.number(),
    quickOutcome: v.union(
      v.literal("Interested"),
      v.literal("Asked for proposal"),
      v.literal("Asked for budget"),
      v.literal("Wrong person"),
      v.literal("Call back"),
      v.literal("Rejected"),
      v.literal("Non-cash opportunity"),
      v.literal("Meeting requested"),
      v.literal("Other")
    ),
    discussionSummary: v.string(),
    interestLevel: v.union(
      v.literal("High"),
      v.literal("Medium"),
      v.literal("Low"),
      v.literal("None")
    ),
    decisionMakerStatus: v.string(),
    primaryObjection: v.optional(v.string()),
    importantInfoLearned: v.optional(v.string()),
    requestedAction: v.optional(v.string()),
    nextAction: v.optional(v.string()),
    targetLeadStatus: v.optional(
      v.union(
        v.literal("UNASSIGNED"),
        v.literal("ASSIGNED"),
        v.literal("CONTACTED"),
        v.literal("INTERESTED"),
        v.literal("FOLLOW_UP"),
        v.literal("PROPOSAL_REQUESTED"),
        v.literal("PROPOSAL_SENT"),
        v.literal("NEGOTIATION"),
        v.literal("WON"),
        v.literal("LOST")
      )
    ),
    scheduleFollowUp: v.optional(
      v.object({
        dueDate: v.number(),
        priority: v.union(
          v.literal("High"),
          v.literal("Medium"),
          v.literal("Low")
        ),
        notes: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.volunteerClerkId))
      .unique();

    if (!user || user.verificationStatus === "suspended" || user.verificationStatus === "rejected") {
      throw new Error("Unauthorized: Account is suspended or rejected");
    }
    if (user.role === "volunteer" && user.verificationStatus !== "approved") {
      throw new Error("Unauthorized: Only approved volunteers and active admins can log calls and debriefs");
    }

    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error("Company lead record not found");
    }

    const now = Date.now();

    // 1. Insert Call Session Record
    const callId = await ctx.db.insert("calls", {
      companyId: args.companyId,
      contactId: args.contactId,
      volunteerId: user._id,
      quickOutcome: args.quickOutcome,
      startedAt: args.startedAt,
      endedAt: args.endedAt,
      durationSeconds: args.durationSeconds,
      createdAt: now,
    });

    // 2. Insert Structured Call Debrief
    const debriefId = await ctx.db.insert("callDebriefs", {
      callId,
      companyId: args.companyId,
      volunteerId: user._id,
      discussionSummary: args.discussionSummary.trim(),
      interestLevel: args.interestLevel,
      decisionMakerStatus: args.decisionMakerStatus,
      primaryObjection: args.primaryObjection?.trim(),
      importantInfoLearned: args.importantInfoLearned?.trim(),
      requestedAction: args.requestedAction?.trim(),
      nextAction: args.nextAction?.trim(),
      isVerifiedByAdmin: false,
      createdAt: now,
    });

    // 3. Optional Follow-Up Scheduling
    let followUpId: Id<"followUps"> | undefined = undefined;
    if (args.scheduleFollowUp) {
      followUpId = await ctx.db.insert("followUps", {
        companyId: args.companyId,
        volunteerId: user._id,
        callId,
        dueDate: args.scheduleFollowUp.dueDate,
        priority: args.scheduleFollowUp.priority,
        notes: args.scheduleFollowUp.notes.trim(),
        status: "pending",
        createdAt: now,
        updatedAt: now,
      });
    }

    // 4. Determine Updated Company Lead Status
    let nextStatus = args.targetLeadStatus;
    if (!nextStatus) {
      switch (args.quickOutcome) {
        case "Interested":
        case "Meeting requested":
        case "Non-cash opportunity":
          nextStatus = "INTERESTED";
          break;
        case "Asked for proposal":
          nextStatus = "PROPOSAL_REQUESTED";
          break;
        case "Call back":
          nextStatus = "FOLLOW_UP";
          break;
        case "Rejected":
          nextStatus = "LOST";
          break;
        default:
          nextStatus = "CONTACTED";
      }
    }

    if (nextStatus === "WON" && user.role !== "admin") {
      throw new Error(
        "Exclusive Authority Gate: Only Sponsorship Committee Admins can authorize a binding deal as WON."
      );
    }

    // 5. Patch Company Lead
    await ctx.db.patch(args.companyId, {
      leadStatus: nextStatus,
      lastContactedAt: args.endedAt,
      updatedAt: now,
    });

    // 6. Audit Trail Logging
    await ctx.db.insert("auditLogs", {
      actorId: user._id,
      action: "call_logged",
      entityType: "companies",
      entityId: args.companyId,
      changes: JSON.stringify({
        companyName: company.companyName,
        volunteerName: user.name,
        quickOutcome: args.quickOutcome,
        interestLevel: args.interestLevel,
        durationSeconds: args.durationSeconds,
        newStatus: nextStatus,
        hasFollowUpScheduled: !!args.scheduleFollowUp,
      }),
      timestamp: now,
    });

    // 7. Automated Gamification Points (Idempotent)
    let pointsToAdd = 10; // Base: verified call logged
    const pointReasons: string[] = ["Logged outreach call"];

    if (
      args.decisionMakerStatus.toLowerCase().includes("decision-maker") ||
      args.decisionMakerStatus.toLowerCase().includes("spoke directly")
    ) {
      pointsToAdd += 15;
      pointReasons.push("Connected with decision-maker");
    }

    if (
      args.quickOutcome === "Asked for proposal" ||
      nextStatus === "PROPOSAL_REQUESTED"
    ) {
      pointsToAdd += 50;
      pointReasons.push("Secured formal proposal request");
    }

    const sourceId = `call_${callId}`;
    const existingTx = await ctx.db
      .query("pointTransactions")
      .withIndex("by_source_id", (q) => q.eq("sourceId", sourceId))
      .first();

    if (!existingTx) {
      await ctx.db.insert("pointTransactions", {
        userId: user._id,
        points: pointsToAdd,
        reason: pointReasons.join(" + "),
        category: "call_logged",
        sourceId,
        createdAt: now,
      });

      const currentTotal = user.totalPoints || 0;
      await ctx.db.patch(user._id, {
        totalPoints: currentTotal + pointsToAdd,
        updatedAt: now,
      });
    }

    return {
      success: true,
      callId,
      debriefId,
      followUpId,
      updatedStatus: nextStatus,
      pointsAwarded: pointsToAdd,
    };
  },
});

/**
 * Get call and debrief interaction history for a company
 */
export const getCallsByCompany = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const calls = await ctx.db
      .query("calls")
      .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .collect();

    return await Promise.all(
      calls.map(async (call) => {
        const debrief = await ctx.db
          .query("callDebriefs")
          .withIndex("by_call_id", (q) => q.eq("callId", call._id))
          .unique();

        const volunteer = await ctx.db.get(call.volunteerId);
        const contact = call.contactId ? await ctx.db.get(call.contactId) : null;

        return {
          ...call,
          debrief,
          volunteerName: volunteer?.name || "Unknown SDR",
          contactName: contact?.contactName || "Direct / Reception",
          contactDesignation: contact?.designation || "",
        };
      })
    );
  },
});

/**
 * Get recent call logs for the authenticated volunteer
 */
export const getMyRecentCalls = query({
  args: {
    volunteerClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.volunteerClerkId) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.volunteerClerkId))
      .unique();

    if (!user || user.verificationStatus !== "approved") return [];

    const calls = await ctx.db
      .query("calls")
      .withIndex("by_volunteer_id", (q) => q.eq("volunteerId", user._id))
      .order("desc")
      .take(20);

    return await Promise.all(
      calls.map(async (call) => {
        const company = await ctx.db.get(call.companyId);
        const debrief = await ctx.db
          .query("callDebriefs")
          .withIndex("by_call_id", (q) => q.eq("callId", call._id))
          .unique();

        return {
          ...call,
          companyName: company?.companyName || "Unknown Company",
          companyIndustry: company?.industry || "",
          debrief,
        };
      })
    );
  },
});
