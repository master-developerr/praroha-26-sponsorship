import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { LeadStage } from "../types";

const ALL_10_STAGES: LeadStage[] = [
  "UNASSIGNED",
  "ASSIGNED",
  "CONTACTED",
  "INTERESTED",
  "FOLLOW_UP",
  "PROPOSAL_REQUESTED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
];

export const getPipelineMetrics = query({
  args: {
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx) => {
    const allCompanies = await ctx.db.query("companies").collect();
    const allCommitments = await ctx.db.query("sponsorshipCommitments").collect();
    const allProposals = await ctx.db.query("proposals").collect();

    // Confirmed Financials from Commitments
    let confirmedCash = 0;
    let confirmedInKind = 0;
    for (const c of allCommitments) {
      confirmedCash += c.cashAmount || 0;
      confirmedInKind += c.inKindEstimatedValue || 0;
    }
    const totalConfirmedRevenue = confirmedCash + confirmedInKind;

    // Active opportunities
    const activeStages = new Set([
      "INTERESTED",
      "FOLLOW_UP",
      "PROPOSAL_REQUESTED",
      "PROPOSAL_SENT",
      "NEGOTIATION",
    ]);

    let activeOpportunities = 0;
    let pipelinePotentialValue = 0;
    let wonCount = 0;
    let negotiationCount = 0;

    for (const comp of allCompanies) {
      if (comp.leadStatus === "WON") {
        wonCount++;
      } else if (comp.leadStatus === "NEGOTIATION") {
        negotiationCount++;
      }

      if (activeStages.has(comp.leadStatus)) {
        activeOpportunities++;
        // Find latest proposal valuation or fallback to recommendedAskMax / min
        const compProposals = allProposals.filter((p) => p.companyId === comp._id);
        if (compProposals.length > 0) {
          const latest = compProposals.sort((a, b) => b.createdAt - a.createdAt)[0];
          pipelinePotentialValue += latest.totalValuation;
        } else {
          pipelinePotentialValue += comp.recommendedAskMax || comp.recommendedAskMin || 100000;
        }
      }
    }

    return {
      totalLeads: allCompanies.length,
      activeOpportunities,
      pipelinePotentialValue,
      confirmedCash,
      confirmedInKind,
      totalConfirmedRevenue,
      wonCount,
      negotiationCount,
    };
  },
});

export const getPipelineBoard = query({
  args: {
    clerkId: v.optional(v.string()),
    search: v.optional(v.string()),
    priorityFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let allCompanies = await ctx.db.query("companies").collect();

    if (args.search && args.search.trim()) {
      const q = args.search.toLowerCase().trim();
      allCompanies = allCompanies.filter(
        (c) =>
          c.companyName.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.niche.toLowerCase().includes(q)
      );
    }

    if (args.priorityFilter && args.priorityFilter !== "all") {
      allCompanies = allCompanies.filter((c) => c.priority === args.priorityFilter);
    }

    // Load active assignments, contacts, proposals, and commitments in bulk
    const allAssignments = await ctx.db
      .query("leadAssignments")
      .withIndex("by_volunteer_and_status")
      .collect();

    const activeAssignments = allAssignments.filter((a) => a.status === "active");

    const users = await ctx.db.query("users").collect();
    const userMap = new Map(users.map((u) => [u._id, u]));

    const allContacts = await ctx.db.query("contacts").collect();
    const contactMap = new Map<string, typeof allContacts[0]>();
    for (const ct of allContacts) {
      if (ct.isPrimary || !contactMap.has(ct.companyId)) {
        contactMap.set(ct.companyId, ct);
      }
    }

    const allProposals = await ctx.db.query("proposals").collect();
    const proposalMap = new Map<string, typeof allProposals[0]>();
    for (const prop of allProposals) {
      const existing = proposalMap.get(prop.companyId);
      if (!existing || prop.createdAt > existing.createdAt) {
        proposalMap.set(prop.companyId, prop);
      }
    }

    const allCommitments = await ctx.db.query("sponsorshipCommitments").collect();
    const commitmentMap = new Map(allCommitments.map((c) => [c.companyId, c]));

    // Construct enriched company cards
    const enrichedCompanies = allCompanies.map((c) => {
      const assignment = activeAssignments.find((a) => a.companyId === c._id);
      const volunteer = assignment ? userMap.get(assignment.volunteerId) : null;
      const contact = contactMap.get(c._id);
      const latestProposal = proposalMap.get(c._id);
      const commitment = commitmentMap.get(c._id);

      return {
        ...c,
        assignedVolunteer: volunteer
          ? {
              _id: volunteer._id,
              name: volunteer.name,
              email: volunteer.email,
              department: volunteer.department,
            }
          : null,
        primaryContact: contact
          ? {
              _id: ctIdToString(contact._id),
              contactName: contact.contactName,
              designation: contact.designation,
              phone: contact.phone,
              phoneType: contact.phoneType,
              contactVerification: contact.contactVerification,
            }
          : null,
        latestProposal: latestProposal
          ? {
              _id: latestProposal._id,
              packageTier: latestProposal.packageTier,
              cashAmount: latestProposal.cashAmount,
              inKindEstimatedValue: latestProposal.inKindEstimatedValue || 0,
              totalValuation: latestProposal.totalValuation,
              status: latestProposal.status,
            }
          : null,
        commitment: commitment
          ? {
              _id: commitment._id,
              packageTier: commitment.packageTier,
              cashAmount: commitment.cashAmount,
              inKindEstimatedValue: commitment.inKindEstimatedValue,
              totalValuation: commitment.totalValuation,
              authorizedAt: commitment.authorizedAt,
            }
          : null,
      };
    });

    // Group by exact 10 stages
    const columns: Record<LeadStage, typeof enrichedCompanies> = {
      UNASSIGNED: [],
      ASSIGNED: [],
      CONTACTED: [],
      INTERESTED: [],
      FOLLOW_UP: [],
      PROPOSAL_REQUESTED: [],
      PROPOSAL_SENT: [],
      NEGOTIATION: [],
      WON: [],
      LOST: [],
    };

    for (const comp of enrichedCompanies) {
      if (columns[comp.leadStatus]) {
        columns[comp.leadStatus].push(comp);
      }
    }

    return {
      columns,
      totalCount: enrichedCompanies.length,
    };
  },
});

function ctIdToString(id: any): any {
  return id;
}

export const updateLeadStage = mutation({
  args: {
    companyId: v.id("companies"),
    clerkId: v.string(),
    targetStage: v.union(
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
    ),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user || user.verificationStatus !== "approved") {
      throw new Error("Unauthorized: Approved user profile required.");
    }

    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error("Company not found.");
    }

    // CRITICAL SECURITY ENFORCEMENT:
    // Only Admin can execute a transition to WON.
    if (args.targetStage === "WON" && user.role !== "admin") {
      throw new Error(
        "Exclusive Authority Gate: Only Sponsorship Committee Admins can authorize a binding deal as WON."
      );
    }

    const now = Date.now();
    await ctx.db.patch(args.companyId, {
      leadStatus: args.targetStage,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      actorId: user._id,
      action: "UPDATE_LEAD_STAGE",
      entityType: "companies",
      entityId: args.companyId,
      changes: JSON.stringify({
        fromStage: company.leadStatus,
        toStage: args.targetStage,
        reason: args.reason || null,
        actorRole: user.role,
      }),
      timestamp: now,
    });

    return { success: true, updatedStage: args.targetStage };
  },
});

export const authorizeCommitment = mutation({
  args: {
    companyId: v.id("companies"),
    clerkId: v.string(),
    proposalId: v.optional(v.id("proposals")),
    packageTier: v.string(),
    cashAmount: v.number(),
    inKindEstimatedValue: v.number(),
    inKindCategory: v.optional(v.string()),
    inKindDescription: v.optional(v.string()),
    deliverablesCommitment: v.array(v.string()),
    mouReference: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Assert Admin privileges
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!admin || admin.role !== "admin" || admin.verificationStatus !== "approved") {
      throw new Error("Unauthorized: Only Admins have signing authority over commitments.");
    }

    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error("Company lead record not found.");
    }

    // Find assigned volunteer if available, else credit admin
    const assignment = await ctx.db
      .query("leadAssignments")
      .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    const volunteerId = assignment ? assignment.volunteerId : admin._id;
    const totalValuation = args.cashAmount + args.inKindEstimatedValue;
    const now = Date.now();

    // 2. Insert commitment record
    const commitmentId = await ctx.db.insert("sponsorshipCommitments", {
      companyId: args.companyId,
      proposalId: args.proposalId,
      volunteerId,
      authorizedBy: admin._id,
      packageTier: args.packageTier,
      cashAmount: args.cashAmount,
      inKindEstimatedValue: args.inKindEstimatedValue,
      totalValuation,
      inKindCategory: args.inKindCategory,
      inKindDescription: args.inKindDescription,
      deliverablesCommitment: args.deliverablesCommitment,
      mouReference: args.mouReference,
      notes: args.notes,
      authorizedAt: now,
      createdAt: now,
    });

    // 3. Mark company as WON
    await ctx.db.patch(args.companyId, {
      leadStatus: "WON",
      updatedAt: now,
    });

    // 4. If linked to a proposal, mark proposal as accepted
    if (args.proposalId) {
      await ctx.db.patch(args.proposalId, {
        status: "accepted",
        updatedAt: now,
      });
    }

    // 5. Immutable audit entry
    await ctx.db.insert("auditLogs", {
      actorId: admin._id,
      action: "AUTHORIZE_SPONSORSHIP_COMMITMENT",
      entityType: "sponsorshipCommitments",
      entityId: commitmentId,
      changes: JSON.stringify({
        companyId: args.companyId,
        companyName: company.companyName,
        packageTier: args.packageTier,
        cashAmount: args.cashAmount,
        inKindEstimatedValue: args.inKindEstimatedValue,
        totalValuation,
        volunteerId,
      }),
      timestamp: now,
    });

    // 6. Award Gamification Points (Idempotent: +200 pts for deal won)
    const sourceId = `deal_${commitmentId}`;
    const existingTx = await ctx.db
      .query("pointTransactions")
      .withIndex("by_source_id", (q) => q.eq("sourceId", sourceId))
      .first();

    if (!existingTx) {
      await ctx.db.insert("pointTransactions", {
        userId: volunteerId,
        points: 200,
        reason: `Sponsorship Ratified: ${company.companyName} (${args.packageTier})`,
        category: "sponsorship_won",
        sourceId,
        awardedBy: admin._id,
        createdAt: now,
      });

      const credUser = await ctx.db.get(volunteerId);
      if (credUser) {
        await ctx.db.patch(volunteerId, {
          totalPoints: (credUser.totalPoints || 0) + 200,
          updatedAt: now,
        });
      }
    }

    return { commitmentId, totalValuation };
  },
});

export const getCompanyRelationshipTimeline = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const timeline: Array<{
      id: string;
      type: "call" | "debrief" | "follow_up" | "proposal" | "commitment" | "stage_change" | "assignment";
      title: string;
      description: string;
      timestamp: number;
      actorName?: string;
      badgeLabel?: string;
      badgeClass?: string;
      metadata?: Record<string, any>;
    }> = [];

    // 1. Fetch Calls
    const calls = await ctx.db
      .query("calls")
      .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
      .collect();

    for (const c of calls) {
      const vol = await ctx.db.get(c.volunteerId);
      const mins = Math.floor(c.durationSeconds / 60);
      const secs = c.durationSeconds % 60;
      timeline.push({
        id: `call-${c._id}`,
        type: "call",
        title: `Outreach Call: ${c.quickOutcome}`,
        description: `Duration: ${mins > 0 ? `${mins}m ` : ""}${secs}s. Initiated by ${vol?.name || "Volunteer"}.`,
        timestamp: c.startedAt,
        actorName: vol?.name,
        badgeLabel: c.quickOutcome,
        badgeClass: "bg-teal-50 text-teal-800 border-teal-200",
        metadata: { durationSeconds: c.durationSeconds, outcome: c.quickOutcome },
      });
    }

    // 2. Fetch Call Debriefs
    const debriefs = await ctx.db
      .query("callDebriefs")
      .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
      .collect();

    for (const d of debriefs) {
      const vol = await ctx.db.get(d.volunteerId);
      timeline.push({
        id: `debrief-${d._id}`,
        type: "debrief",
        title: `Post-Call Debrief: Interest Level ${d.interestLevel}`,
        description: d.discussionSummary,
        timestamp: d.createdAt,
        actorName: vol?.name,
        badgeLabel: `DM: ${d.decisionMakerStatus.replace("_", " ")}`,
        badgeClass: "bg-indigo-50 text-indigo-800 border-indigo-200",
        metadata: {
          interestLevel: d.interestLevel,
          primaryObjection: d.primaryObjection,
          nextAction: d.nextAction,
        },
      });
    }

    // 3. Fetch Follow-Ups
    const followUps = await ctx.db
      .query("followUps")
      .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
      .collect();

    for (const f of followUps) {
      const vol = await ctx.db.get(f.volunteerId);
      const isDone = f.status === "completed";
      timeline.push({
        id: `followup-${f._id}`,
        type: "follow_up",
        title: isDone ? "Callback Completed" : "Callback Scheduled",
        description: f.notes,
        timestamp: f.completedAt || f.createdAt,
        actorName: vol?.name,
        badgeLabel: `${f.priority} Priority`,
        badgeClass: isDone
          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
          : "bg-yellow-50 text-yellow-800 border-yellow-200",
        metadata: { dueDate: f.dueDate, status: f.status },
      });
    }

    // 4. Fetch Proposals
    const proposals = await ctx.db
      .query("proposals")
      .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
      .collect();

    for (const p of proposals) {
      const vol = await ctx.db.get(p.volunteerId);
      timeline.push({
        id: `prop-${p._id}`,
        type: "proposal",
        title: `Proposal Generated: ${p.packageTier} Tier (₹${p.totalValuation.toLocaleString("en-IN")})`,
        description: `Cash: ₹${p.cashAmount.toLocaleString("en-IN")}${
          p.inKindEstimatedValue
            ? ` + In-Kind: ₹${p.inKindEstimatedValue.toLocaleString("en-IN")} (${p.inKindCategory})`
            : ""
        }. Status: ${p.status.toUpperCase()}`,
        timestamp: p.sentAt || p.createdAt,
        actorName: vol?.name,
        badgeLabel: p.status.toUpperCase(),
        badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
        metadata: {
          packageTier: p.packageTier,
          cashAmount: p.cashAmount,
          inKindEstimatedValue: p.inKindEstimatedValue,
          deliverablesCount: p.deliverables.length,
        },
      });
    }

    // 5. Fetch Commitments
    const commitments = await ctx.db
      .query("sponsorshipCommitments")
      .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
      .collect();

    for (const com of commitments) {
      const admin = await ctx.db.get(com.authorizedBy);
      timeline.push({
        id: `com-${com._id}`,
        type: "commitment",
        title: `★ Official Corporate Commitment Signed (₹${com.totalValuation.toLocaleString("en-IN")})`,
        description: `Ratified by Admin ${admin?.name || "Committee Head"}. Package: ${com.packageTier}. Cash: ₹${com.cashAmount.toLocaleString("en-IN")}${com.inKindEstimatedValue ? `, In-Kind: ₹${com.inKindEstimatedValue.toLocaleString("en-IN")}` : ""}.`,
        timestamp: com.authorizedAt,
        actorName: admin?.name,
        badgeLabel: "WON / CONFIRMED",
        badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold",
        metadata: {
          totalValuation: com.totalValuation,
          packageTier: com.packageTier,
        },
      });
    }

    // 6. Fetch Assignment & Ownership Events
    const assignmentLogs = await ctx.db
      .query("auditLogs")
      .withIndex("by_entity", (q) =>
        q.eq("entityType", "companies").eq("entityId", args.companyId)
      )
      .collect();

    for (const log of assignmentLogs) {
      if (!["lead_assigned", "lead_reassigned", "lead_unassigned"].includes(log.action)) {
        continue;
      }

      let parsed: any = {};
      try {
        parsed = JSON.parse(log.changes);
      } catch {
        parsed = {};
      }

      let actorName = "Admin";
      try {
        const actor = await ctx.db.get(log.actorId as Id<"users">);
        if (actor && "name" in actor) actorName = actor.name;
      } catch {
        // Fallback
      }

      let title = "Lead Assignment Event";
      let description = parsed.reason ? `Reason: ${parsed.reason}` : `Executed by ${actorName}`;
      let badgeLabel = "ASSIGNMENT";
      let badgeClass = "bg-surface-subtle text-text-secondary border-border";

      if (log.action === "lead_assigned") {
        title = `Lead Assigned: ${parsed.assignedTo || "Volunteer"}`;
        badgeLabel = "ASSIGNED";
        badgeClass = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50";
        description = parsed.instructions
          ? `Directives: ${parsed.instructions} (Assigned by ${actorName})`
          : `Assigned to ${parsed.assignedTo || "Volunteer"} by ${actorName}`;
      } else if (log.action === "lead_reassigned") {
        title = `Lead Reassigned: ${parsed.fromVolunteer || "Previous"} → ${parsed.reassignedTo || "New Owner"}`;
        badgeLabel = "REASSIGNED";
        badgeClass = "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50";
        description = `From: ${parsed.fromVolunteer || "Unknown"} → To: ${parsed.reassignedTo || "New Volunteer"}.${parsed.reason ? ` Reason: ${parsed.reason}` : ""} (Executed by ${actorName})`;
      } else if (log.action === "lead_unassigned") {
        title = `Lead Unassigned: Returned to Pool`;
        badgeLabel = "UNASSIGNED";
        badgeClass = "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/50";
        description = `Previous owner: ${parsed.previousVolunteer || parsed.fromVolunteer || "Unknown"}.${parsed.reason ? ` Reason: ${parsed.reason}` : ""} (Executed by ${actorName})`;
      }

      timeline.push({
        id: `audit-${log._id}`,
        type: "assignment",
        title,
        description,
        timestamp: log.timestamp,
        actorName,
        badgeLabel,
        badgeClass,
        metadata: parsed,
      });
    }

    // Sort descending by timestamp
    return timeline.sort((a, b) => b.timestamp - a.timestamp);
  },
});
