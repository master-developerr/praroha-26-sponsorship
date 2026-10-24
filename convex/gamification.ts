import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const DEFAULT_POINT_RULES = [
  { eventType: "call_completed", points: 5, label: "Call Completed", description: "Logged structured call outcome" },
  { eventType: "lead_contacted", points: 10, label: "Lead Contacted", description: "First contact established with company" },
  { eventType: "positive_response", points: 15, label: "Positive Response", description: "Decision maker expressed interest" },
  { eventType: "meeting_obtained", points: 30, label: "Meeting Scheduled", description: "Formal sponsorship meeting booked" },
  { eventType: "proposal_generated", points: 40, label: "Proposal Dispatched", description: "Formal pitch proposal sent" },
  { eventType: "sponsorship_won", points: 100, label: "Sponsorship Ratified", description: "Corporate sponsorship deal confirmed" },
];

/**
 * Get all configurable point weights.
 * Auto-seeds defaults if table is empty.
 */
export const getPointConfigurations = query({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("pointConfigurations").collect();
    if (existing.length === 0) {
      return DEFAULT_POINT_RULES.map((rule) => ({
        ...rule,
        _id: rule.eventType as any,
        updatedAt: Date.now(),
      }));
    }
    return existing;
  },
});

/**
 * Admin action: Update point weight for a specific operational milestone.
 */
export const updatePointConfiguration = mutation({
  args: {
    eventType: v.string(),
    points: v.number(),
    label: v.optional(v.string()),
    description: v.optional(v.string()),
    adminClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .first();

    if (!admin || admin.role !== "admin" || admin.verificationStatus !== "approved") {
      throw new Error("Unauthorized: Only verified administrators can configure point weights.");
    }

    if (args.points < 0 || args.points > 1000) {
      throw new Error("Point values must be between 0 and 1000.");
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("pointConfigurations")
      .withIndex("by_event_type", (q) => q.eq("eventType", args.eventType))
      .first();

    const defaultRule = DEFAULT_POINT_RULES.find((r) => r.eventType === args.eventType);
    const label = defaultRule?.label || args.eventType;
    const description = defaultRule?.description || "Milestone points award";

    let prevPoints = defaultRule?.points || 0;

    if (existing) {
      prevPoints = existing.points;
      await ctx.db.patch(existing._id, {
        points: args.points,
        updatedBy: admin.clerkId,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("pointConfigurations", {
        eventType: args.eventType,
        points: args.points,
        label,
        description,
        updatedBy: admin.clerkId,
        updatedAt: now,
      });
    }

    // Insert into immutable audit log
    await ctx.db.insert("auditLogs", {
      actorId: admin.clerkId,
      action: "UPDATE_POINT_RULE",
      entityType: "pointConfigurations",
      entityId: args.eventType,
      changes: JSON.stringify({
        eventType: args.eventType,
        previousPoints: prevPoints,
        newPoints: args.points,
      }),
      timestamp: now,
    });

    return { success: true, eventType: args.eventType, points: args.points };
  },
});

/**
 * Idempotently awards gamification points to a student SDR.
 * Checks if a transaction with the same sourceId already exists to eliminate double-awarding.
 */
export const awardPoints = mutation({
  args: {
    userId: v.id("users"),
    points: v.number(),
    reason: v.string(),
    category: v.union(
      v.literal("call_logged"),
      v.literal("decision_maker_reached"),
      v.literal("proposal_requested"),
      v.literal("sponsorship_won"),
      v.literal("admin_adjustment")
    ),
    sourceId: v.string(), // e.g. "call_<id>", "deal_<id>"
    awardedBy: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    if (args.category === "admin_adjustment") {
      throw new Error("Direct admin_adjustment via awardPoints is forbidden. Use adminAdjustPoints.");
    }

    // 1. Idempotency Check
    const existing = await ctx.db
      .query("pointTransactions")
      .withIndex("by_source_id", (q) => q.eq("sourceId", args.sourceId))
      .first();

    if (existing) {
      return existing._id;
    }

    const now = Date.now();

    // 2. Insert transaction
    const txId = await ctx.db.insert("pointTransactions", {
      userId: args.userId,
      points: args.points,
      reason: args.reason,
      category: args.category,
      sourceId: args.sourceId,
      awardedBy: args.awardedBy,
      createdAt: now,
    });

    // 3. Atomically update user cached totalPoints
    const user = await ctx.db.get(args.userId);
    if (user) {
      const current = user.totalPoints || 0;
      await ctx.db.patch(args.userId, {
        totalPoints: Math.max(0, current + args.points),
        updatedAt: now,
      });
    }

    return txId;
  },
});

/**
 * Real-time Honors Leaderboard with timeframe filtering (Today, This Week, This Month, All Time)
 */
export const getLeaderboard = query({
  args: {
    timeframe: v.optional(
      v.union(
        v.literal("today"),
        v.literal("this_week"),
        v.literal("this_month"),
        v.literal("all_time")
      )
    ),
  },
  handler: async (ctx, args) => {
    const timeframe = args.timeframe || "all_time";
    const now = new Date();
    let startTime = 0;

    if (timeframe === "today") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startTime = today.getTime();
    } else if (timeframe === "this_week") {
      const day = now.getDay() || 7; // Monday = 1
      const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1);
      startTime = monday.getTime();
    } else if (timeframe === "this_month") {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      startTime = monthStart.getTime();
    }

    // 1. Fetch approved volunteers and active SDRs
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("verificationStatus"), "approved"))
      .collect();

    // 2. Fetch calls, commitments, proposals, and transactions
    const allCalls = await ctx.db.query("calls").collect();
    const allCommitments = await ctx.db.query("sponsorshipCommitments").collect();
    const allTransactions = await ctx.db.query("pointTransactions").collect();

    // Filter by timeframe
    const timeCalls = startTime > 0 ? allCalls.filter((c) => c.createdAt >= startTime) : allCalls;
    const timeDeals = startTime > 0 ? allCommitments.filter((d) => d.createdAt >= startTime) : allCommitments;
    const timeTx = startTime > 0 ? allTransactions.filter((t) => t.createdAt >= startTime) : allTransactions;

    // Map metrics per volunteer
    const volunteerStats = users.map((u) => {
      const userCalls = timeCalls.filter((c) => c.volunteerId === u._id);
      const userDeals = timeDeals.filter((cm) => cm.volunteerId === u._id);
      const userTransactions = timeTx.filter((t) => t.userId === u._id);

      // Points earned in the timeframe
      const periodPoints = startTime > 0
        ? userTransactions.reduce((acc, t) => acc + t.points, 0)
        : u.totalPoints || 0;

      // Unique leads contacted
      const leadsContacted = new Set(userCalls.map((c) => c.companyId)).size;

      // Positive responses
      const positiveResponses = userCalls.filter((c) =>
        ["Interested", "Asked for proposal", "Meeting requested"].includes(c.quickOutcome)
      ).length;

      // Meetings obtained
      const meetingsCount = userCalls.filter((c) => c.quickOutcome === "Meeting requested").length;

      const totalValuationWon = userDeals.reduce((sum, d) => sum + (d.totalValuation || 0), 0);
      const conversionRate = userCalls.length > 0
        ? Math.round((userDeals.length / userCalls.length) * 100)
        : 0;

      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        semester: u.semester,
        department: u.department,
        role: u.role,
        totalPoints: periodPoints,
        callsCount: userCalls.length,
        leadsContacted,
        positiveResponses,
        meetingsCount,
        dealsWonCount: userDeals.length,
        totalValuationWon,
        conversionRate,
      };
    });

    // Sort descending by totalPoints, then by dealsWon, then by positive responses, then by calls
    volunteerStats.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (b.dealsWonCount !== a.dealsWonCount) {
        return b.dealsWonCount - a.dealsWonCount;
      }
      if (b.positiveResponses !== a.positiveResponses) {
        return b.positiveResponses - a.positiveResponses;
      }
      return b.callsCount - a.callsCount;
    });

    // Assign rank
    return volunteerStats.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  },
});

/**
 * Returns current volunteer's personal gamification summary for /workspace.
 */
export const getUserPointsSummary = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return null;

    const allApproved = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("verificationStatus"), "approved"))
      .collect();

    allApproved.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    const rankIndex = allApproved.findIndex((u) => u._id === user._id);
    const rank = rankIndex >= 0 ? rankIndex + 1 : 1;

    // Get recent transactions for this user
    const transactions = await ctx.db
      .query("pointTransactions")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(10);

    // Get total calls logged
    const calls = await ctx.db
      .query("calls")
      .withIndex("by_volunteer_id", (q) => q.eq("volunteerId", user._id))
      .collect();

    // Get deals won
    const deals = await ctx.db
      .query("sponsorshipCommitments")
      .withIndex("by_volunteer_id", (q) => q.eq("volunteerId", user._id))
      .collect();

    return {
      userId: user._id,
      name: user.name,
      totalPoints: user.totalPoints || 0,
      rank,
      totalVolunteers: allApproved.length,
      callsLogged: calls.length,
      dealsWon: deals.length,
      recentTransactions: transactions,
    };
  },
});

/**
 * Admin manual points adjustment with mandatory audit logging.
 */
export const adminAdjustPoints = mutation({
  args: {
    adminClerkId: v.string(),
    targetUserId: v.id("users"),
    points: v.number(), // positive or negative
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .first();

    if (!admin || admin.role !== "admin" || admin.verificationStatus !== "approved") {
      throw new Error("Unauthorized: Only verified administrators can adjust volunteer points.");
    }

    if (!args.reason || args.reason.trim() === "") {
      throw new Error("A justification reason is required for administrative points adjustments.");
    }

    if (args.points === 0) {
      throw new Error("Point adjustment must be a non-zero value.");
    }

    if (Math.abs(args.points) > 10000) {
      throw new Error("Point adjustment magnitude cannot exceed 10,000 points in a single transaction.");
    }

    const targetUser = await ctx.db.get(args.targetUserId);
    if (!targetUser) {
      throw new Error("Target volunteer not found.");
    }

    const now = Date.now();
    const sourceId = `admin_adj_${now}_${args.targetUserId}`;

    // 1. Insert transaction
    await ctx.db.insert("pointTransactions", {
      userId: args.targetUserId,
      points: args.points,
      reason: args.reason.trim(),
      category: "admin_adjustment",
      sourceId,
      awardedBy: admin._id,
      createdAt: now,
    });

    // 2. Update user cached total
    const current = targetUser.totalPoints || 0;
    const newTotal = Math.max(0, current + args.points);
    await ctx.db.patch(args.targetUserId, {
      totalPoints: newTotal,
      updatedAt: now,
    });

    // 3. Write immutable audit log
    await ctx.db.insert("auditLogs", {
      actorId: admin.clerkId,
      action: "POINTS_ADJUSTMENT",
      entityType: "users",
      entityId: args.targetUserId,
      changes: JSON.stringify({
        adjustedPoints: args.points,
        previousTotal: current,
        newTotal,
        reason: args.reason.trim(),
      }),
      timestamp: now,
    });

    return { success: true, newTotal };
  },
});
