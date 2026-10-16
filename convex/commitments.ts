import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAllCommitments = query({
  args: {
    status: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let commitments = await ctx.db
      .query("sponsorshipCommitments")
      .order("desc")
      .collect();

    if (args.status && args.status !== "all") {
      commitments = commitments.filter((c) => (c.status || "CONFIRMED") === args.status);
    }

    const companies = await ctx.db.query("companies").collect();
    const compMap = new Map(companies.map((c) => [c._id, c]));

    const users = await ctx.db.query("users").collect();
    const userMap = new Map(users.map((u) => [u._id, u]));

    const contacts = await ctx.db.query("contacts").collect();
    const contactMap = new Map<string, typeof contacts[0]>();
    for (const ct of contacts) {
      if (ct.isPrimary || !contactMap.has(ct.companyId)) {
        contactMap.set(ct.companyId, ct);
      }
    }

    let enriched = commitments.map((c) => {
      const comp = compMap.get(c.companyId);
      const volunteer = userMap.get(c.volunteerId);
      const authorizer = userMap.get(c.authorizedBy);
      const contact = contactMap.get(c.companyId);

      return {
        ...c,
        status: c.status || "CONFIRMED",
        companyName: comp?.companyName || "Unknown Company",
        industry: comp?.industry || "Other",
        niche: comp?.niche || "",
        companyLeadStatus: comp?.leadStatus || "WON",
        volunteerName: volunteer?.name || "Unassigned",
        volunteerEmail: volunteer?.email || "",
        volunteerDepartment: volunteer?.department || "",
        authorizerName: authorizer?.name || "Admin",
        contactName: contact?.contactName || "",
        contactPhone: contact?.phone || "",
        contactEmail: contact?.email || "",
        contactDesignation: contact?.designation || "",
      };
    });

    if (args.search && args.search.trim()) {
      const q = args.search.toLowerCase().trim();
      enriched = enriched.filter(
        (c) =>
          c.companyName.toLowerCase().includes(q) ||
          c.packageTier.toLowerCase().includes(q) ||
          (c.mouReference && c.mouReference.toLowerCase().includes(q)) ||
          c.volunteerName.toLowerCase().includes(q) ||
          c.contactName.toLowerCase().includes(q) ||
          (c.inKindDescription && c.inKindDescription.toLowerCase().includes(q))
      );
    }

    return enriched;
  },
});

export const getCommitmentById = query({
  args: { commitmentId: v.id("sponsorshipCommitments") },
  handler: async (ctx, args) => {
    const commitment = await ctx.db.get(args.commitmentId);
    if (!commitment) return null;

    const comp = await ctx.db.get(commitment.companyId);
    const volunteer = await ctx.db.get(commitment.volunteerId);
    const authorizer = await ctx.db.get(commitment.authorizedBy);

    return {
      ...commitment,
      status: commitment.status || "CONFIRMED",
      companyName: comp?.companyName || "Unknown Company",
      industry: comp?.industry || "",
      volunteerName: volunteer?.name || "Unassigned",
      authorizerName: authorizer?.name || "Admin",
    };
  },
});

export const createCommitment = mutation({
  args: {
    adminClerkId: v.string(),
    companyId: v.id("companies"),
    volunteerId: v.optional(v.id("users")),
    proposalId: v.optional(v.id("proposals")),
    packageTier: v.string(),
    status: v.union(
      v.literal("PROSPECT"),
      v.literal("NEGOTIATING"),
      v.literal("PROPOSED"),
      v.literal("VERBAL_COMMITMENT"),
      v.literal("CONFIRMED"),
      v.literal("DELIVERABLES_PENDING"),
      v.literal("COMPLETED"),
      v.literal("CANCELLED")
    ),
    cashAmount: v.number(),
    inKindEstimatedValue: v.number(),
    inKindCategory: v.optional(v.string()),
    inKindDescription: v.optional(v.string()),
    deliverablesCommitment: v.array(v.string()),
    mouReference: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Authorize Admin
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .first();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can create sponsorship commitments.");
    }

    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error("Target company not found.");
    }

    // Determine volunteer
    let volunteerId = args.volunteerId;
    if (!volunteerId) {
      const activeAssignment = await ctx.db
        .query("leadAssignments")
        .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
        .filter((q) => q.eq(q.field("status"), "active"))
        .first();
      volunteerId = activeAssignment ? activeAssignment.volunteerId : admin._id;
    }

    const totalValuation = Math.max(0, args.cashAmount) + Math.max(0, args.inKindEstimatedValue);
    const now = Date.now();

    // 2. Insert commitment
    const commitmentId = await ctx.db.insert("sponsorshipCommitments", {
      companyId: args.companyId,
      proposalId: args.proposalId,
      volunteerId,
      authorizedBy: admin._id,
      packageTier: args.packageTier,
      status: args.status,
      cashAmount: Math.max(0, args.cashAmount),
      inKindEstimatedValue: Math.max(0, args.inKindEstimatedValue),
      totalValuation,
      inKindCategory: args.inKindCategory,
      inKindDescription: args.inKindDescription,
      deliverablesCommitment: args.deliverablesCommitment,
      mouReference: args.mouReference,
      notes: args.notes,
      authorizedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // 3. Update company lead status if confirmed or completed
    if (args.status === "CONFIRMED" || args.status === "COMPLETED") {
      await ctx.db.patch(args.companyId, {
        leadStatus: "WON",
        updatedAt: now,
      });
    } else if (args.status === "NEGOTIATING" || args.status === "VERBAL_COMMITMENT") {
      if (company.leadStatus !== "WON") {
        await ctx.db.patch(args.companyId, {
          leadStatus: "NEGOTIATION",
          updatedAt: now,
        });
      }
    }

    // 4. If linked to proposal, update proposal
    if (args.proposalId) {
      await ctx.db.patch(args.proposalId, {
        status: args.status === "CONFIRMED" || args.status === "COMPLETED" ? "accepted" : "sent",
        updatedAt: now,
      });
    }

    // 5. Emit Audit Log
    await ctx.db.insert("auditLogs", {
      actorId: admin._id,
      action: "commitments:create",
      entityType: "sponsorshipCommitments",
      entityId: commitmentId,
      changes: JSON.stringify({
        companyName: company.companyName,
        packageTier: args.packageTier,
        status: args.status,
        cashAmount: args.cashAmount,
        inKindEstimatedValue: args.inKindEstimatedValue,
        totalValuation,
        volunteerId,
        mouReference: args.mouReference,
      }),
      timestamp: now,
    });

    return { commitmentId, totalValuation };
  },
});

export const updateCommitment = mutation({
  args: {
    adminClerkId: v.string(),
    commitmentId: v.id("sponsorshipCommitments"),
    packageTier: v.string(),
    status: v.union(
      v.literal("PROSPECT"),
      v.literal("NEGOTIATING"),
      v.literal("PROPOSED"),
      v.literal("VERBAL_COMMITMENT"),
      v.literal("CONFIRMED"),
      v.literal("DELIVERABLES_PENDING"),
      v.literal("COMPLETED"),
      v.literal("CANCELLED")
    ),
    cashAmount: v.number(),
    inKindEstimatedValue: v.number(),
    inKindCategory: v.optional(v.string()),
    inKindDescription: v.optional(v.string()),
    deliverablesCommitment: v.array(v.string()),
    mouReference: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .first();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can modify sponsorship commitments.");
    }

    const commitment = await ctx.db.get(args.commitmentId);
    if (!commitment) {
      throw new Error("Commitment record not found.");
    }

    const totalValuation = Math.max(0, args.cashAmount) + Math.max(0, args.inKindEstimatedValue);
    const now = Date.now();

    await ctx.db.patch(args.commitmentId, {
      packageTier: args.packageTier,
      status: args.status,
      cashAmount: Math.max(0, args.cashAmount),
      inKindEstimatedValue: Math.max(0, args.inKindEstimatedValue),
      totalValuation,
      inKindCategory: args.inKindCategory,
      inKindDescription: args.inKindDescription,
      deliverablesCommitment: args.deliverablesCommitment,
      mouReference: args.mouReference,
      notes: args.notes,
      updatedAt: now,
    });

    // Update company leadStatus if status transitioned
    if (args.status === "CONFIRMED" || args.status === "COMPLETED") {
      await ctx.db.patch(commitment.companyId, {
        leadStatus: "WON",
        updatedAt: now,
      });
    } else if (args.status === "CANCELLED") {
      await ctx.db.patch(commitment.companyId, {
        leadStatus: "LOST",
        updatedAt: now,
      });
    }

    // Audit log
    await ctx.db.insert("auditLogs", {
      actorId: admin._id,
      action: "commitments:update",
      entityType: "sponsorshipCommitments",
      entityId: args.commitmentId,
      changes: JSON.stringify({
        previousStatus: commitment.status,
        newStatus: args.status,
        packageTier: args.packageTier,
        cashAmount: args.cashAmount,
        inKindEstimatedValue: args.inKindEstimatedValue,
        totalValuation,
        mouReference: args.mouReference,
      }),
      timestamp: now,
    });

    return { success: true };
  },
});

export const updateCommitmentStatus = mutation({
  args: {
    adminClerkId: v.string(),
    commitmentId: v.id("sponsorshipCommitments"),
    status: v.union(
      v.literal("PROSPECT"),
      v.literal("NEGOTIATING"),
      v.literal("PROPOSED"),
      v.literal("VERBAL_COMMITMENT"),
      v.literal("CONFIRMED"),
      v.literal("DELIVERABLES_PENDING"),
      v.literal("COMPLETED"),
      v.literal("CANCELLED")
    ),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .first();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can update commitment statuses.");
    }

    const commitment = await ctx.db.get(args.commitmentId);
    if (!commitment) {
      throw new Error("Commitment record not found.");
    }

    const now = Date.now();
    await ctx.db.patch(args.commitmentId, {
      status: args.status,
      updatedAt: now,
    });

    if (args.status === "CONFIRMED" || args.status === "COMPLETED") {
      await ctx.db.patch(commitment.companyId, {
        leadStatus: "WON",
        updatedAt: now,
      });
    } else if (args.status === "CANCELLED") {
      await ctx.db.patch(commitment.companyId, {
        leadStatus: "LOST",
        updatedAt: now,
      });
    }

    await ctx.db.insert("auditLogs", {
      actorId: admin._id,
      action: "commitments:status_change",
      entityType: "sponsorshipCommitments",
      entityId: args.commitmentId,
      changes: JSON.stringify({
        previousStatus: commitment.status,
        newStatus: args.status,
      }),
      timestamp: now,
    });

    return { success: true, newStatus: args.status };
  },
});

export const deleteCommitment = mutation({
  args: {
    adminClerkId: v.string(),
    commitmentId: v.id("sponsorshipCommitments"),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .first();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can delete commitments.");
    }

    const commitment = await ctx.db.get(args.commitmentId);
    if (!commitment) {
      throw new Error("Commitment record not found.");
    }

    const now = Date.now();
    await ctx.db.delete(args.commitmentId);

    await ctx.db.insert("auditLogs", {
      actorId: admin._id,
      action: "commitments:delete",
      entityType: "sponsorshipCommitments",
      entityId: args.commitmentId,
      changes: JSON.stringify({
        deletedCommitment: {
          companyId: commitment.companyId,
          packageTier: commitment.packageTier,
          totalValuation: commitment.totalValuation,
          status: commitment.status,
        },
      }),
      timestamp: now,
    });

    return { success: true };
  },
});
