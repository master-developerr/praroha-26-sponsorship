import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCachedAnalysis = query({
  args: {
    companyId: v.id("companies"),
    type: v.union(
      v.literal("company_analysis"),
      v.literal("call_prep"),
      v.literal("alternative_ask"),
      v.literal("call_debrief"),
      v.literal("lead_priority")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiAnalyses")
      .withIndex("by_company_and_type", (q) =>
        q.eq("companyId", args.companyId).eq("type", args.type)
      )
      .first();
  },
});

export const getCompanyAnalyses = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiAnalyses")
      .filter((q) => q.eq(q.field("companyId"), args.companyId))
      .collect();
  },
});

export const saveAnalysis = mutation({
  args: {
    companyId: v.id("companies"),
    type: v.union(
      v.literal("company_analysis"),
      v.literal("call_prep"),
      v.literal("alternative_ask"),
      v.literal("call_debrief"),
      v.literal("lead_priority")
    ),
    model: v.string(),
    promptVersion: v.string(),
    inputHash: v.string(),
    result: v.string(), // JSON string of validated analysis
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("aiAnalyses")
      .withIndex("by_company_and_type", (q) =>
        q.eq("companyId", args.companyId).eq("type", args.type)
      )
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        model: args.model,
        promptVersion: args.promptVersion,
        inputHash: args.inputHash,
        result: args.result,
        createdBy: args.createdBy,
        updatedAt: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("aiAnalyses", {
        companyId: args.companyId,
        type: args.type,
        model: args.model,
        promptVersion: args.promptVersion,
        inputHash: args.inputHash,
        result: args.result,
        createdBy: args.createdBy,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

export const clearAnalysisCache = mutation({
  args: {
    companyId: v.id("companies"),
    type: v.union(
      v.literal("company_analysis"),
      v.literal("call_prep"),
      v.literal("alternative_ask"),
      v.literal("call_debrief"),
      v.literal("lead_priority")
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("aiAnalyses")
      .withIndex("by_company_and_type", (q) =>
        q.eq("companyId", args.companyId).eq("type", args.type)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return true;
    }
    return false;
  },
});
