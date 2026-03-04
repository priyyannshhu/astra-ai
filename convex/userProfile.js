import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import bcrypt from "bcryptjs";

// MUTATION: Update user profile
export const UpdateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
    company: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profileUpdate = {
      updatedAt: Date.now(),
    };

    if (args.displayName !== undefined) profileUpdate.displayName = args.displayName;
    if (args.website !== undefined) profileUpdate.website = args.website || null;
    if (args.location !== undefined) profileUpdate.location = args.location || null;
    if (args.company !== undefined) profileUpdate.company = args.company || null;
    if (args.phoneNumber !== undefined) profileUpdate.phoneNumber = args.phoneNumber || null;

    // Get existing profile
    const profiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    if (profiles.length > 0) {
      await ctx.db.patch(profiles[0]._id, profileUpdate);
    } else {
      await ctx.db.insert("userProfiles", {
        userId: args.userId,
        ...profileUpdate,
      });
    }

    // Update user bio
    if (args.bio !== undefined) {
      await ctx.db.patch(args.userId, {
        bio: args.bio || null,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// QUERY: Get user profile
export const GetUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return profiles[0] || null;
  },
});

// MUTATION: Change password
export const ChangePassword = mutation({
  args: {
    userId: v.id("users"),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.password) {
      throw new Error("Your account does not have a password set");
    }

    // Verify current password
    const bcrypt = require("bcryptjs");
    const isValid = await bcrypt.compare(args.currentPassword, user.password);

    if (!isValid) {
      throw new Error("Current password is incorrect");
    }

    if (args.newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(args.newPassword, salt);

    await ctx.db.patch(args.userId, {
      password: hashedPassword,
      updatedAt: Date.now(),
    });

    return { success: true, message: "Password changed successfully" };
  },
});

// MUTATION: Update user preferences
export const UpdatePreferences = mutation({
  args: {
    userId: v.id("users"),
    preferences: v.any(),
  },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    if (profiles.length > 0) {
      const currentPrefs = profiles[0].preferences || {};
      const newPrefs = { ...currentPrefs, ...args.preferences };

      await ctx.db.patch(profiles[0]._id, {
        preferences: newPrefs,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// QUERY: Get user preferences
export const GetPreferences = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return profiles[0]?.preferences || {};
  },
});

// MUTATION: Add social link
export const AddSocialLink = mutation({
  args: {
    userId: v.id("users"),
    platform: v.string(), // 'twitter', 'linkedin', 'github', etc
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    if (profiles.length > 0) {
      const currentLinks = profiles[0].socialLinks || {};
      currentLinks[args.platform] = args.url;

      await ctx.db.patch(profiles[0]._id, {
        socialLinks: currentLinks,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// MUTATION: Remove social link
export const RemoveSocialLink = mutation({
  args: {
    userId: v.id("users"),
    platform: v.string(),
  },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    if (profiles.length > 0) {
      const currentLinks = profiles[0].socialLinks || {};
      delete currentLinks[args.platform];

      await ctx.db.patch(profiles[0]._id, {
        socialLinks: currentLinks,
        updatedAt: Date.now(),
      });
    }

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

    return { success: true, message: "Account deactivated" };
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

    return { success: true, message: "Account reactivated" };
  },
});
