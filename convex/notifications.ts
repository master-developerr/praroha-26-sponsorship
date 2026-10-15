import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all notifications for current user
 */
export const getMyNotifications = query({
  args: {
    clerkId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!args.clerkId) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return [];

    const limit = args.limit || 20;

    const notifs = await ctx.db
      .query("notifications")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);

    const unreadCount = notifs.filter((n) => !n.read).length;

    return {
      notifications: notifs,
      unreadCount,
    };
  },
});

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = mutation({
  args: {
    clerkId: v.string(),
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const notif = await ctx.db.get(args.notificationId);
    if (!notif) return;

    await ctx.db.patch(args.notificationId, {
      read: true,
    });
  },
});

/**
 * Mark all notifications for the user as read
 */
export const markAllNotificationsAsRead = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return;

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) => q.eq("userId", user._id).eq("read", false))
      .collect();

    for (const notif of unread) {
      await ctx.db.patch(notif._id, { read: true });
    }
  },
});

/**
 * System helper: Create a notification for a user
 */
export const sendNotification = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("lead_assigned"),
      v.literal("follow_up_due"),
      v.literal("lead_reassigned"),
      v.literal("volunteer_approved"),
      v.literal("volunteer_rejected"),
      v.literal("volunteer_suspended"),
      v.literal("deal_won"),
      v.literal("announcement"),
      v.literal("general")
    ),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      userId: args.userId,
      title: args.title,
      message: args.message,
      type: args.type,
      read: false,
      link: args.link,
      createdAt: Date.now(),
    });
  },
});
