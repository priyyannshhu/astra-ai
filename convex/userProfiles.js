import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// MUTATION: Create or update user profile
export const SetUserProfile = mutation({
  args: {
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
    company: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    socialLinks: v.optional(v.any()),
    preferences: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Check if profile exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const profileData = {
      displayName: args.displayName,
      website: args.website || null,
      location: args.location || null,
      company: args.company || null,
      phoneNumber: args.phoneNumber || null,
      socialLinks: args.socialLinks,
      preferences: args.preferences,
      updatedAt: Date.now(),
    };

    if (existingProfile.length > 0) {
      // Update existing profile
      await ctx.db.patch(existingProfile[0]._id, profileData);
      return { success: true, isNew: false };
    } else {
      // Create new profile
      const profileId = await ctx.db.insert("userProfiles", {
        userId: args.userId,
        ...profileData,
      });
      return { success: true, isNew: true, profileId };
    }
  },
});

// QUERY: Get user profile
export const GetUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return profile[0] || null;
  },
});

// MUTATION: Update user preferences
export const UpdatePreferences = mutation({
  args: {
    userId: v.id("users"),
    preferences: v.any(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    if (profile.length > 0) {
      await ctx.db.patch(profile[0]._id, {
        preferences: args.preferences,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("userProfiles", {
        userId: args.userId,
        preferences: args.preferences,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// MUTATION: Update social links
export const UpdateSocialLinks = mutation({
  args: {
    userId: v.id("users"),
    socialLinks: v.any(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    if (profile.length > 0) {
      await ctx.db.patch(profile[0]._id, {
        socialLinks: args.socialLinks,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("userProfiles", {
        userId: args.userId,
        socialLinks: args.socialLinks,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// MUTATION: Update notification preferences
export const UpdateNotificationPreferences = mutation({
  args: {
    userId: v.id("users"),
    emailNotifications: v.optional(v.boolean()),
    pushNotifications: v.optional(v.boolean()),
    smsNotifications: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const preferences = {
      emailNotifications: args.emailNotifications,
      pushNotifications: args.pushNotifications,
      smsNotifications: args.smsNotifications,
    };

    if (profile.length > 0) {
      const existingPrefs = profile[0].preferences || {};
      await ctx.db.patch(profile[0]._id, {
        preferences: { ...existingPrefs, ...preferences },
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("userProfiles", {
        userId: args.userId,
        preferences,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// MUTATION: Delete user profile
export const DeleteProfile = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    if (profile.length > 0) {
      await ctx.db.delete(profile[0]._id);
      return { success: true };
    }

    return { success: false, error: "Profile not found" };
  },
});
