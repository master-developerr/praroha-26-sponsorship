import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

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
    // 1. Idempotency Check
    const existing = await ctx.db
      .query("pointTransactions")
      .withIndex("by_source_id", (q) => q.eq("sourceId", args.sourceId))
      .first();

    if (existing) {
      console.log(`[Gamification] Skipped duplicate point award for sourceId: ${args.sourceId}`);
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
 * Real-time Team Leaderboard with Podium calculation.
 */
export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    // 1. Fetch approved volunteers and active SDRs
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("verificationStatus"), "approved"))
      .collect();

    // 2. Fetch calls and commitments to compute stats
    const allCalls = await ctx.db.query("calls").collect();
    const allCommitments = await ctx.db.query("sponsorshipCommitments").collect();

    // Map metrics per volunteer
    const volunteerStats = users.map((u) => {
      const userCalls = allCalls.filter((c) => c.volunteerId === u._id);
      const userDeals = allCommitments.filter((cm) => cm.volunteerId === u._id);
      const totalPoints = u.totalPoints || 0;

      const totalValuationWon = userDeals.reduce((sum, d) => sum + (d.totalValuation || 0), 0);
      const conversionRate = userCalls.length > 0
        ? Math.round((userDeals.length / userCalls.length) * 100)
        : 0;

      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        semester: u.semester,
        department: u.department,
        role: u.role,
        totalPoints,
        callsCount: userCalls.length,
        dealsWonCount: userDeals.length,
        totalValuationWon,
        conversionRate,
      };
    });

    // Sort descending by totalPoints, then by dealsWon, then by calls
    volunteerStats.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (b.dealsWonCount !== a.dealsWonCount) {
        return b.dealsWonCount - a.dealsWonCount;
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

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only verified administrators can adjust volunteer points.");
    }

    if (!args.reason || args.reason.trim() === "") {
      throw new Error("A justification reason is required for administrative points adjustments.");
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
