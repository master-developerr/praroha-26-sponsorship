import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createProposal = mutation({
  args: {
    companyId: v.id("companies"),
    clerkId: v.string(),
    packageTier: v.union(
      v.literal("Title"),
      v.literal("Co-Sponsor"),
      v.literal("Associate"),
      v.literal("Supporting"),
      v.literal("Community"),
      v.literal("Event Sponsor"),
      v.literal("Powered By"),
      v.literal("Custom"),
      v.literal("In-Kind")
    ),
    cashAmount: v.number(),
    inKindCategory: v.optional(
      v.union(
        v.literal("CASH"),
        v.literal("PRODUCT"),
        v.literal("SERVICES"),
        v.literal("TECHNICAL_SUPPORT"),
        v.literal("WORKSHOP"),
        v.literal("SPEAKER"),
        v.literal("PRIZES"),
        v.literal("SOFTWARE"),
        v.literal("MERCHANDISE"),
        v.literal("VENUE"),
        v.literal("PRINTING"),
        v.literal("TRANSPORTATION"),
        v.literal("OTHER_IN_KIND")
      )
    ),
    inKindDescription: v.optional(v.string()),
    inKindEstimatedValue: v.optional(v.number()),
    deliverables: v.array(v.string()),
    customDeliverables: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("superseded")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Authorize user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user || user.verificationStatus === "suspended" || user.verificationStatus === "rejected") {
      throw new Error("Unauthorized: Account is suspended or rejected");
    }
    if (user.role === "volunteer" && user.verificationStatus !== "approved") {
      throw new Error("Unauthorized: Only approved volunteers and active admins can create proposals.");
    }

    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error("Company not found.");
    }

    const inKindVal = args.inKindEstimatedValue || 0;
    const totalValuation = args.cashAmount + inKindVal;
    const now = Date.now();

    // 2. Insert proposal record
    const proposalId = await ctx.db.insert("proposals", {
      companyId: args.companyId,
      volunteerId: user._id,
      packageTier: args.packageTier,
      cashAmount: args.cashAmount,
      inKindCategory: args.inKindCategory,
      inKindDescription: args.inKindDescription,
      inKindEstimatedValue: inKindVal,
      totalValuation,
      deliverables: args.deliverables,
      customDeliverables: args.customDeliverables,
      status: args.status,
      sentAt: args.status === "sent" ? now : undefined,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    // 3. Automatically advance lifecycle status if appropriate
    let newStatus = company.leadStatus;
    if (args.status === "sent") {
      if (
        company.leadStatus === "UNASSIGNED" ||
        company.leadStatus === "ASSIGNED" ||
        company.leadStatus === "CONTACTED" ||
        company.leadStatus === "INTERESTED" ||
        company.leadStatus === "FOLLOW_UP" ||
        company.leadStatus === "PROPOSAL_REQUESTED"
      ) {
        newStatus = "PROPOSAL_SENT";
      }
    } else if (args.status === "draft") {
      if (
        company.leadStatus === "UNASSIGNED" ||
        company.leadStatus === "ASSIGNED" ||
        company.leadStatus === "CONTACTED" ||
        company.leadStatus === "INTERESTED" ||
        company.leadStatus === "FOLLOW_UP"
      ) {
        newStatus = "PROPOSAL_REQUESTED";
      }
    }

    if (newStatus !== company.leadStatus) {
      await ctx.db.patch(args.companyId, {
        leadStatus: newStatus,
        updatedAt: now,
      });
    }

    // 4. Record audit log
    await ctx.db.insert("auditLogs", {
      actorId: user._id,
      action: "CREATE_PROPOSAL",
      entityType: "companies",
      entityId: args.companyId,
      changes: JSON.stringify({
        proposalId,
        packageTier: args.packageTier,
        cashAmount: args.cashAmount,
        inKindEstimatedValue: inKindVal,
        totalValuation,
        status: args.status,
        updatedLeadStatus: newStatus,
      }),
      timestamp: now,
    });

    return { proposalId, totalValuation, newStatus };
  },
});

export const getProposalsByCompany = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const rawProposals = await ctx.db
      .query("proposals")
      .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
      .collect();

    // Attach volunteer info
    const enriched = await Promise.all(
      rawProposals.map(async (p) => {
        const volunteer = await ctx.db.get(p.volunteerId);
        return {
          ...p,
          volunteerName: volunteer?.name || "Unknown Volunteer",
        };
      })
    );

    // Sort newest first
    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const updateProposalStatus = mutation({
  args: {
    proposalId: v.id("proposals"),
    clerkId: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("superseded")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user || user.verificationStatus !== "approved") {
      throw new Error("Unauthorized");
    }

    const proposal = await ctx.db.get(args.proposalId);
    if (!proposal) {
      throw new Error("Proposal not found");
    }

    const now = Date.now();
    await ctx.db.patch(args.proposalId, {
      status: args.status,
      sentAt: args.status === "sent" && !proposal.sentAt ? now : proposal.sentAt,
      notes: args.notes || proposal.notes,
      updatedAt: now,
    });

    // If accepted, transition company to NEGOTIATION
    if (args.status === "accepted") {
      const company = await ctx.db.get(proposal.companyId);
      if (company && company.leadStatus !== "WON") {
        await ctx.db.patch(proposal.companyId, {
          leadStatus: "NEGOTIATION",
          updatedAt: now,
        });
      }
    }

    await ctx.db.insert("auditLogs", {
      actorId: user._id,
      action: "UPDATE_PROPOSAL_STATUS",
      entityType: "proposals",
      entityId: args.proposalId,
      changes: JSON.stringify({
        previousStatus: proposal.status,
        newStatus: args.status,
      }),
      timestamp: now,
    });

    return { success: true };
  },
});
