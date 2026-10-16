import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get current user profile by Clerk user ID
 */
export const getCurrentUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    if (!args.clerkId) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

/**
 * Register or update volunteer profile upon first login
 */
export const registerVolunteerProfile = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.string(),
    semester: v.string(),
    department: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name.trim(),
        phone: args.phone.trim(),
        semester: args.semester,
        department: args.department,
        verificationStatus: "pending",
        rejectionReason: undefined,
        updatedAt: now,
      });

      await ctx.db.insert("auditLogs", {
        actorId: existing._id,
        action: "profile_update",
        entityType: "users",
        entityId: existing._id,
        changes: JSON.stringify({
          name: args.name,
          phone: args.phone,
          semester: args.semester,
          department: args.department,
          verificationStatus: "pending",
        }),
        timestamp: now,
      });

      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name.trim(),
      phone: args.phone.trim(),
      semester: args.semester,
      department: args.department,
      role: "volunteer",
      verificationStatus: "pending",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      actorId: userId,
      action: "profile_update",
      entityType: "users",
      entityId: userId,
      changes: JSON.stringify({
        action: "initial_registration",
        name: args.name,
        phone: args.phone,
      }),
      timestamp: now,
    });

    return userId;
  },
});

/**
 * Get all users filtered by verification status
 */
export const getUsersByVerification = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected"),
        v.literal("suspended")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("users")
        .withIndex("by_verification", (q) => q.eq("verificationStatus", args.status!))
        .collect();
    }
    return await ctx.db.query("users").collect();
  },
});

/**
 * Admin action: Approve volunteer
 */
export const approveVolunteer = mutation({
  args: {
    userId: v.id("users"),
    adminClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .unique();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can approve volunteer registrations");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("Volunteer user not found");
    }

    const now = Date.now();

    await ctx.db.patch(args.userId, {
      verificationStatus: "approved",
      rejectionReason: undefined,
      reviewedBy: admin?._id,
      reviewedAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      actorId: admin?._id ?? args.adminClerkId,
      action: "verify_volunteer",
      entityType: "users",
      entityId: args.userId,
      changes: JSON.stringify({
        previousStatus: targetUser.verificationStatus,
        newStatus: "approved",
      }),
      timestamp: now,
    });

    return { success: true };
  },
});

/**
 * Admin action: Reject volunteer with mandatory reason
 */
export const rejectVolunteer = mutation({
  args: {
    userId: v.id("users"),
    adminClerkId: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.reason || args.reason.trim().length === 0) {
      throw new Error("Rejection reason is required");
    }

    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .unique();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can reject volunteer registrations");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("Volunteer user not found");
    }

    const now = Date.now();

    await ctx.db.patch(args.userId, {
      verificationStatus: "rejected",
      rejectionReason: args.reason.trim(),
      reviewedBy: admin._id,
      reviewedAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      actorId: admin._id,
      action: "reject_volunteer",
      entityType: "users",
      entityId: args.userId,
      changes: JSON.stringify({
        previousStatus: targetUser.verificationStatus,
        newStatus: "rejected",
        reason: args.reason.trim(),
      }),
      timestamp: now,
    });

    return { success: true };
  },
});

/**
 * Admin action: Suspend volunteer
 */
export const suspendVolunteer = mutation({
  args: {
    userId: v.id("users"),
    adminClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .unique();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can suspend volunteers");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("Volunteer user not found");
    }

    const now = Date.now();

    await ctx.db.patch(args.userId, {
      verificationStatus: "suspended",
      reviewedBy: admin._id,
      reviewedAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      actorId: admin._id,
      action: "suspend_volunteer",
      entityType: "users",
      entityId: args.userId,
      changes: JSON.stringify({
        previousStatus: targetUser.verificationStatus,
        newStatus: "suspended",
      }),
      timestamp: now,
    });

    return { success: true };
  },
});

/**
 * Change role (Admin / Volunteer)
 */
export const setUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("volunteer")),
    adminClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .unique();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can modify user roles");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    const now = Date.now();
    await ctx.db.patch(args.userId, {
      role: args.role,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      actorId: args.adminClerkId,
      action: "role_change",
      entityType: "users",
      entityId: args.userId,
      changes: JSON.stringify({
        previousRole: targetUser.role,
        newRole: args.role,
      }),
      timestamp: now,
    });

    return { success: true };
  },
});

/**
 * Internal dev helper: Set user verification status directly for testing personas
 */
export const seedDevUserStatus = mutation({
  args: {
    clerkId: v.string(),
    verificationStatus: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("suspended")
    ),
    rejectionReason: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("volunteer"))),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, {
        verificationStatus: args.verificationStatus,
        rejectionReason: args.rejectionReason,
        ...(args.role ? { role: args.role } : {}),
      });
      return user._id;
    }
    return null;
  },
});

/**
 * Get audit logs for administrative tracking
 */
export const getAuditLogs = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 25;
    return await ctx.db
      .query("auditLogs")
      .order("desc")
      .take(limit);
  },
});

/**
 * Sync or upsert Clerk user into Convex (called on sign-in or client init)
 */
export const syncClerkUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      if (args.name && args.name !== existing.name) {
        await ctx.db.patch(existing._id, {
          name: args.name,
          updatedAt: Date.now(),
        });
      }
      return existing._id;
    }

    // Check if user was already provisioned or promoted by email
    const cleanEmail = args.email.trim().toLowerCase();
    const users = await ctx.db.query("users").collect();
    const emailMatch = users.find((u) => u.email.trim().toLowerCase() === cleanEmail);

    if (emailMatch) {
      await ctx.db.patch(emailMatch._id, {
        clerkId: args.clerkId,
        name: args.name || emailMatch.name,
        updatedAt: Date.now(),
      });
      return emailMatch._id;
    }

    const now = Date.now();
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name || "New Volunteer",
      phone: "",
      semester: "",
      department: "",
      role: "volunteer",
      verificationStatus: "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Bootstrap helper: Promote user to admin by email address (for manual first admin setup)
 */
export const promoteUserToAdminByEmail = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    const users = await ctx.db.query("users").collect();
    const matchingUsers = users.filter((u) => u.email.trim().toLowerCase() === cleanEmail);

    let targetUser = args.clerkId
      ? users.find((u) => u.clerkId === args.clerkId) || matchingUsers[0]
      : matchingUsers[0];

    const now = Date.now();
    if (!targetUser) {
      // Pre-provision user as verified Admin
      const newUserId = await ctx.db.insert("users", {
        clerkId: args.clerkId || "",
        email: cleanEmail,
        name: args.name || "Admin",
        phone: "",
        semester: "",
        department: "",
        role: "admin",
        verificationStatus: "approved",
        reviewedAt: now,
        createdAt: now,
        updatedAt: now,
      });
      targetUser = (await ctx.db.get(newUserId))!;
    } else {
      for (const u of matchingUsers) {
        await ctx.db.patch(u._id, {
          role: "admin",
          verificationStatus: "approved",
          ...(args.name ? { name: args.name } : {}),
          ...(args.clerkId && (u.clerkId === args.clerkId || !u.clerkId) ? { clerkId: args.clerkId } : {}),
          updatedAt: now,
        });
      }
      targetUser = (await ctx.db.get(targetUser._id))!;
    }

    await ctx.db.insert("auditLogs", {
      actorId: targetUser._id,
      action: "bootstrap_admin",
      entityType: "users",
      entityId: targetUser._id,
      changes: JSON.stringify({
        email: cleanEmail,
        newRole: "admin",
        newVerificationStatus: "approved",
      }),
      timestamp: now,
    });

    return {
      success: true,
      userId: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
      role: "admin",
      verificationStatus: "approved",
    };
  },
});

/**
 * Admin action: Restore volunteer to approved status
 */
export const restoreVolunteer = mutation({
  args: {
    userId: v.id("users"),
    adminClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .unique();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can restore volunteers");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("Volunteer user not found");
    }

    const now = Date.now();
    await ctx.db.patch(args.userId, {
      verificationStatus: "approved",
      rejectionReason: undefined,
      reviewedBy: admin._id,
      reviewedAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      actorId: admin._id,
      action: "restore_volunteer",
      entityType: "users",
      entityId: args.userId,
      changes: JSON.stringify({
        previousStatus: targetUser.verificationStatus,
        newStatus: "approved",
      }),
      timestamp: now,
    });

    return { success: true };
  },
});

/**
 * Admin query: Get detailed activity and metrics for a single volunteer
 */
export const getVolunteerDetailedProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const assignments = await ctx.db
      .query("leadAssignments")
      .withIndex("by_volunteer_and_status", (q) =>
        q.eq("volunteerId", user._id).eq("status", "active")
      )
      .collect();

    const calls = await ctx.db
      .query("calls")
      .withIndex("by_volunteer_id", (q) => q.eq("volunteerId", user._id))
      .collect();

    const deals = await ctx.db
      .query("sponsorshipCommitments")
      .withIndex("by_volunteer_id", (q) => q.eq("volunteerId", user._id))
      .collect();

    const points = await ctx.db
      .query("pointTransactions")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(10);

    return {
      ...user,
      activeLeadsCount: assignments.length,
      callsCount: calls.length,
      dealsWonCount: deals.length,
      recentPoints: points,
    };
  },
});

