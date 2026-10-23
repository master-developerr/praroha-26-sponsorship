import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getVolunteerFollowUps = query({
  args: {
    volunteerClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.volunteerClerkId) {
      return { overdue: [], dueToday: [], upcoming: [], totalPending: 0 };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.volunteerClerkId))
      .unique();

    if (!user || user.verificationStatus === "suspended" || user.verificationStatus === "rejected") {
      return { overdue: [], dueToday: [], upcoming: [], totalPending: 0 };
    }
    if (user.role === "volunteer" && user.verificationStatus !== "approved") {
      return { overdue: [], dueToday: [], upcoming: [], totalPending: 0 };
    }

    const pending = await ctx.db
      .query("followUps")
      .withIndex("by_volunteer_and_status", (q) =>
        q.eq("volunteerId", user._id).eq("status", "pending")
      )
      .order("asc")
      .collect();

    const enriched = await Promise.all(
      pending.map(async (f) => {
        const company = await ctx.db.get(f.companyId);
        const contacts = await ctx.db
          .query("contacts")
          .withIndex("by_company_id", (q) => q.eq("companyId", f.companyId))
          .collect();

        const primaryContact =
          contacts.find((c) => c.isPrimary) || contacts[0] || null;

        return {
          ...f,
          companyName: company?.companyName || "Unknown Company",
          companyIndustry: company?.industry || "",
          companyNiche: company?.niche || "",
          companyPriority: company?.priority || "Normal",
          primaryContact,
        };
      })
    );

    const now = Date.now();
    const today = new Date(now);
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();
    const endOfToday = startOfToday + 24 * 60 * 60 * 1000;

    const overdue = enriched.filter((f) => f.dueDate < startOfToday);
    const dueToday = enriched.filter(
      (f) => f.dueDate >= startOfToday && f.dueDate < endOfToday
    );
    const upcoming = enriched.filter((f) => f.dueDate >= endOfToday);

    return {
      overdue,
      dueToday,
      upcoming,
      totalPending: enriched.length,
    };
  },
});

export const completeFollowUp = mutation({
  args: {
    volunteerClerkId: v.string(),
    followUpId: v.id("followUps"),
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
      throw new Error("Unauthorized: Only approved volunteers and active admins can manage follow-ups");
    }

    const followUp = await ctx.db.get(args.followUpId);
    if (!followUp) {
      throw new Error("Follow-up not found");
    }
    if (user.role === "volunteer" && followUp.volunteerId !== user._id) {
      throw new Error("Unauthorized: Follow-up is not assigned to this volunteer");
    }

    const now = Date.now();
    await ctx.db.patch(args.followUpId, {
      status: "completed",
      completedAt: now,
      updatedAt: now,
    });

    return { success: true };
  },
});

export const scheduleFollowUp = mutation({
  args: {
    volunteerClerkId: v.string(),
    companyId: v.id("companies"),
    dueDate: v.number(),
    priority: v.union(
      v.literal("High"),
      v.literal("Medium"),
      v.literal("Low")
    ),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.volunteerClerkId))
      .unique();

    if (!user || user.verificationStatus !== "approved") {
      throw new Error("Unauthorized");
    }

    const now = Date.now();
    const id = await ctx.db.insert("followUps", {
      companyId: args.companyId,
      volunteerId: user._id,
      dueDate: args.dueDate,
      priority: args.priority,
      notes: args.notes.trim(),
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    return { success: true, followUpId: id };
  },
});

export const rescheduleFollowUp = mutation({
  args: {
    volunteerClerkId: v.string(),
    followUpId: v.id("followUps"),
    dueDate: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.volunteerClerkId))
      .unique();
    const followUp = await ctx.db.get(args.followUpId);
    if (!user || !followUp || user.verificationStatus !== "approved") {
      throw new Error("Unauthorized");
    }
    if (user.role === "volunteer" && followUp.volunteerId !== user._id) {
      throw new Error("Unauthorized: Follow-up is not assigned to this volunteer");
    }
    if (args.dueDate <= Date.now()) {
      throw new Error("Choose a future follow-up date");
    }
    await ctx.db.patch(args.followUpId, {
      dueDate: args.dueDate,
      ...(args.notes !== undefined ? { notes: args.notes.trim() } : {}),
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

export const cancelFollowUp = mutation({
  args: {
    volunteerClerkId: v.string(),
    followUpId: v.id("followUps"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.volunteerClerkId))
      .unique();
    const followUp = await ctx.db.get(args.followUpId);
    if (!user || !followUp || user.verificationStatus !== "approved") {
      throw new Error("Unauthorized");
    }
    if (user.role === "volunteer" && followUp.volunteerId !== user._id) {
      throw new Error("Unauthorized: Follow-up is not assigned to this volunteer");
    }
    await ctx.db.patch(args.followUpId, { status: "cancelled", updatedAt: Date.now() });
    return { success: true };
  },
});
