import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import bcrypt from "bcryptjs";

// ACTION: Create User (uses bcrypt)
export const CreateUser = action({
  args: {
    name: v.string(),
    email: v.string(),
    username: v.optional(v.string()),
    picture: v.union(v.string(), v.null()),
    uid: v.string(),
    password: v.optional(v.string()),
    authMethod: v.union(v.literal("google"), v.literal("username")),
  },
  handler: async (ctx, args) => {
    try {
      // Check if user exists by email
      const existingEmail = await ctx.runQuery(api.users.CheckEmailExists, {
        email: args.email,
      });

      if (existingEmail) {
        throw new Error("Email already exists");
      }

      // Check if username exists (for username auth)
      if (args.authMethod === "username" && args.username) {
        const existingUsername = await ctx.runQuery(api.users.CheckUsernameExists, {
          username: args.username,
        });

        if (existingUsername) {
          throw new Error("Username already taken");
        }
      }

      let hashedPassword = null;

      // Hash password only for username auth
      if (args.authMethod === "username" && args.password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(args.password, salt);
      }

      // Insert user via mutation
      const result = await ctx.runMutation(api.users.InsertUser, {
        name: args.name,
        email: args.email,
        username: args.username || null,
        picture: args.picture,
        uid: args.uid,
        password: hashedPassword,
        authMethod: args.authMethod,
      });

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },
});

// MUTATION: Insert User (internal, called by action)
export const InsertUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    username: v.union(v.string(), v.null()),
    picture: v.union(v.string(), v.null()),
    uid: v.string(),
    password: v.union(v.string(), v.null()),
    authMethod: v.union(v.literal("google"), v.literal("username")),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      username: args.username,
      picture: args.picture,
      uid: args.uid,
      password: args.password,
      authMethod: args.authMethod,
    });
    return result;
  },
});

// QUERY: Check if email exists
export const CheckEmailExists = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return users.length > 0;
  },
});

// QUERY: Check if username exists
export const CheckUsernameExists = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .collect();
    return users.length > 0;
  },
});

// ACTION: Login with Username (uses bcrypt)
export const LoginWithUsername = action({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user data
    const userData = await ctx.runQuery(api.users.GetUserByUsername, {
      username: args.username,
    });

    if (!userData) {
      throw new Error("User not found");
    }

    if (userData.authMethod !== "username") {
      throw new Error("This account uses Google OAuth. Please sign in with Google.");
    }

    if (!userData.password) {
      throw new Error("Invalid account configuration");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(args.password, userData.password);

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    return userData;
  },
});

// QUERY: Get User by Email
export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return user[0];
  },
});

// QUERY: Get User by Username
export const GetUserByUsername = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .collect();
    return user[0];
  },
});

// MUTATION: Send email verification token
export const SendEmailVerification = mutation({
  args: {
    userId: v.id("users"),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate verification token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await ctx.db.patch(args.userId, {
      emailVerificationToken: token,
      emailVerificationExpiry: expiryTime,
    });

    return { token, email: args.email };
  },
});

// MUTATION: Verify email
export const VerifyEmail = mutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.emailVerificationToken || user.emailVerificationToken !== args.token) {
      throw new Error("Invalid verification token");
    }

    if (!user.emailVerificationExpiry || user.emailVerificationExpiry < Date.now()) {
      throw new Error("Verification token has expired");
    }

    await ctx.db.patch(args.userId, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    });

    return { success: true };
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
      return { success: true };
    }

    const user = users[0];
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiryTime = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    await ctx.db.patch(user._id, {
      resetToken: token,
      resetTokenExpiry: expiryTime,
    });

    return { success: true, token, email: args.email };
  },
});

// MUTATION: Reset password with token
export const ResetPassword = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by reset token
    const users = await ctx.db
      .query("users")
      .collect();

    const user = users.find((u) => u.resetToken === args.token);

    if (!user) {
      throw new Error("Invalid reset token");
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
      throw new Error("Reset token has expired");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(args.newPassword, salt);

    await ctx.db.patch(user._id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// ACTION: Change password (requires old password)
export const ChangePassword = action({
  args: {
    userId: v.id("users"),
    oldPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.password) {
      throw new Error("This account doesn't have a password set");
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(args.oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(args.newPassword, salt);

    await ctx.db.patch(args.userId, {
      password: hashedPassword,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// MUTATION: Update user login timestamp
export const UpdateLastLogin = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      lastLoginAt: Date.now(),
    });
    return { success: true };
  },
});

// MUTATION: Deactivate account
export const DeactivateAccount = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      isActive: false,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

// MUTATION: Reactivate account
export const ReactivateAccount = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      isActive: true,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});
