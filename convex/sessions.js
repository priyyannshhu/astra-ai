import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// MUTATION: Create a new session
export const CreateSession = mutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("sessions", {
      userId: args.userId,
      token: args.token,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });
    return sessionId;
  },
});

// QUERY: Get session by token
export const GetSessionByToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("token"), args.token))
      .collect();
    return sessions[0] || null;
  },
});

// QUERY: Get all sessions for a user
export const GetUserSessions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
    return sessions;
  },
});

// MUTATION: Revoke session
export const RevokeSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.sessionId);
    return { success: true };
  },
});

// MUTATION: Revoke all sessions for user
export const RevokeAllSessions = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    return { success: true, count: sessions.length };
  },
});

// QUERY: Check if session is valid and not expired
export const IsSessionValid = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.runQuery("GetSessionByToken", { token: args.token });
    
    if (!session) {
      return { valid: false };
    }

    if (session.expiresAt < Date.now()) {
      return { valid: false };
    }

    return { valid: true, userId: session.userId };
  },
});
