import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// MUTATION: Create user account with email verification
export const CreateUserAccount = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    username: v.optional(v.string()),
    password: v.optional(v.string()),
    authMethod: v.union(v.literal("google"), v.literal("github"), v.literal("username")),
    picture: v.optional(v.union(v.string(), v.null())),
    uid: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Check if email exists
      const existingEmail = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email))
        .collect();

      if (existingEmail.length > 0) {
        throw new Error("Email already registered");
      }

      // Check username if provided
      if (args.username) {
        const existingUsername = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("username"), args.username))
          .collect();

        if (existingUsername.length > 0) {
          throw new Error("Username already taken");
        }
      }

      let hashedPassword = null;
      if (args.password && args.authMethod === "username") {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(args.password, salt);
      }

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString("hex");
      const emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      const userId = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        username: args.username || null,
        picture: args.picture || null,
        uid: args.uid || crypto.randomBytes(16).toString("hex"),
        password: hashedPassword,
        authMethod: args.authMethod,
        emailVerified: args.authMethod !== "username", // OAuth is auto-verified
        emailVerificationToken,
        emailVerificationExpiry,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isActive: true,
        role: "user",
      });

      // Create user profile
      await ctx.db.insert("userProfiles", {
        userId,
        displayName: args.name,
        preferences: {
          emailNotifications: true,
          twoFactorEnabled: false,
        },
        updatedAt: Date.now(),
      });

      return {
        userId,
        emailVerificationToken,
        requiresEmailVerification: args.authMethod === "username",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
});

// MUTATION: Verify email with token
export const VerifyEmail = mutation({
  args: {
    email: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (users.length === 0) {
      throw new Error("User not found");
    }

    const user = users[0];

    if (user.emailVerified) {
      throw new Error("Email already verified");
    }

    if (user.emailVerificationToken !== args.token) {
      throw new Error("Invalid verification token");
    }

    if (Date.now() > user.emailVerificationExpiry) {
      throw new Error("Verification token expired");
    }

    await ctx.db.patch(user._id, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
      updatedAt: Date.now(),
    });

    return { success: true, message: "Email verified successfully" };
  },
});

// MUTATION: Request password reset
export const RequestPasswordReset = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (users.length === 0) {
      // Don't reveal if email exists for security
      return { success: true, message: "If email exists, reset link sent" };
    }

    const user = users[0];
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    await ctx.db.patch(user._id, {
      resetToken,
      resetTokenExpiry,
      updatedAt: Date.now(),
    });

    // In production, send email with reset link
    return {
      success: true,
      message: "Password reset link sent to email",
      resetToken, // Only for testing/demo - remove in production
    };
  },
});

// MUTATION: Reset password with token
export const ResetPassword = mutation({
  args: {
    email: v.string(),
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (users.length === 0) {
      throw new Error("User not found");
    }

    const user = users[0];

    if (user.resetToken !== args.token) {
      throw new Error("Invalid reset token");
    }

    if (Date.now() > user.resetTokenExpiry) {
      throw new Error("Reset token expired");
    }

    if (args.newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(args.newPassword, salt);

    await ctx.db.patch(user._id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
      updatedAt: Date.now(),
    });

    return { success: true, message: "Password reset successfully" };
  },
});

// MUTATION: Update last login
export const UpdateLastLogin = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      lastLoginAt: Date.now(),
    });

    // Log activity
    await ctx.db.insert("activityLog", {
      userId: args.userId,
      action: "LOGIN",
      createdAt: Date.now(),
    });
  },
});

// QUERY: Get user by ID with profile
export const GetUserWithProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const profile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return {
      ...user,
      profile: profile[0] || null,
    };
  },
});

// QUERY: Get user sessions
export const GetUserSessions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return sessions.filter((session) => session.expiresAt > Date.now());
  },
});

// MUTATION: Create user session
export const CreateSession = mutation({
  args: {
    userId: v.id("users"),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    const sessionId = await ctx.db.insert("sessions", {
      userId: args.userId,
      token,
      ipAddress: args.ipAddress || null,
      userAgent: args.userAgent || null,
      expiresAt,
      createdAt: Date.now(),
    });

    return { sessionId, token };
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

// QUERY: Get activity log for user
export const GetActivityLog = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("activityLog")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .take(args.limit || 50);

    return activities;
  },
});

// MUTATION: Log activity
export const LogActivity = mutation({
  args: {
    userId: v.id("users"),
    action: v.string(),
    resource: v.optional(v.string()),
    resourceId: v.optional(v.string()),
    details: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activityLog", {
      userId: args.userId,
      action: args.action,
      resource: args.resource,
      resourceId: args.resourceId,
      details: args.details,
      createdAt: Date.now(),
    });
  },
});
