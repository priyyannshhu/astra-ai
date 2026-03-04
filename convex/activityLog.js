import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// MUTATION: Log user activity
export const LogActivity = mutation({
  args: {
    userId: v.id("users"),
    action: v.string(),
    resource: v.optional(v.string()),
    resourceId: v.optional(v.string()),
    details: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const logId = await ctx.db.insert("activityLog", {
      userId: args.userId,
      action: args.action,
      resource: args.resource,
      resourceId: args.resourceId,
      details: args.details,
      createdAt: Date.now(),
    });
    return logId;
  },
});

// QUERY: Get activity logs for user
export const GetUserActivityLogs = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("activityLog")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc");

    if (args.limit) {
      query = query.take(args.limit);
    }

    const logs = await query.collect();
    return logs;
  },
});

// QUERY: Get activity logs by action type
export const GetLogsByAction = query({
  args: {
    userId: v.id("users"),
    action: v.string(),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("activityLog")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("action"), args.action)
        )
      )
      .order("desc")
      .collect();
    return logs;
  },
});

// QUERY: Get activity logs for a specific resource
export const GetResourceLogs = query({
  args: {
    userId: v.id("users"),
    resourceId: v.string(),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("activityLog")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("resourceId"), args.resourceId)
        )
      )
      .order("desc")
      .collect();
    return logs;
  },
});

// QUERY: Get recent activity across all users (admin only)
export const GetRecentActivity = query({
  args: {
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("activityLog")
      .order("desc")
      .take(args.limit)
      .collect();
    return logs;
  },
});

// MUTATION: Delete old activity logs (cleanup)
export const DeleteOldLogs = mutation({
  args: {
    daysOld: v.number(),
  },
  handler: async (ctx, args) => {
    const cutoffTime = Date.now() - args.daysOld * 24 * 60 * 60 * 1000;
    const oldLogs = await ctx.db
      .query("activityLog")
      .filter((q) => q.lt(q.field("createdAt"), cutoffTime))
      .collect();

    let deletedCount = 0;
    for (const log of oldLogs) {
      await ctx.db.delete(log._id);
      deletedCount++;
    }

    return { success: true, deletedCount };
  },
});
