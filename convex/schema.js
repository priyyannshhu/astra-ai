import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    username: v.optional(v.union(v.string(), v.null())),
    picture: v.optional(v.union(v.string(), v.null())),
    uid: v.string(),
    password: v.optional(v.union(v.string(), v.null())),
    authMethod: v.optional(v.union(v.literal("google"), v.literal("username"), v.literal("github"))),
    // Email verification fields
    emailVerified: v.optional(v.boolean()),
    emailVerificationToken: v.optional(v.union(v.string(), v.null())),
    emailVerificationExpiry: v.optional(v.number()),
    // Password reset fields
    resetToken: v.optional(v.union(v.string(), v.null())),
    resetTokenExpiry: v.optional(v.number()),
    // User profile
    bio: v.optional(v.union(v.string(), v.null())),
    role: v.optional(v.union(v.literal("user"), v.literal("admin"), v.literal("moderator"))),
    // Timestamps
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    lastLoginAt: v.optional(v.number()),
    // Account status
    isActive: v.optional(v.boolean()),
  })
    .index("by_email", ["email"])
    .index("by_username", ["username"])
    .index("by_uid", ["uid"]),

  workspace: defineTable({
    messages: v.any(),
    fileData: v.optional(v.any()),
    user: v.id("users"),
    title: v.optional(v.union(v.string(), v.null())),
    description: v.optional(v.union(v.string(), v.null())),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    // Sharing and collaboration
    isPublic: v.optional(v.boolean()),
    collaborators: v.optional(v.array(v.id("users"))),
  })
    .index("by_user", ["user"])
    .index("by_created", ["createdAt"]),

  // New: Projects/Workspaces library
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    owner: v.id("users"),
    status: v.union(v.literal("active"), v.literal("archived"), v.literal("deleted")),
    tags: v.optional(v.array(v.string())),
    thumbnail: v.optional(v.union(v.string(), v.null())),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastAccessedAt: v.optional(v.number()),
  })
    .index("by_owner", ["owner"])
    .index("by_status", ["status"]),

  // New: User sessions for tracking logins
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_token", ["token"]),

  // New: Activity log for auditing
  activityLog: defineTable({
    userId: v.id("users"),
    action: v.string(),
    resource: v.optional(v.string()),
    resourceId: v.optional(v.string()),
    details: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"]),

  // New: User profiles with extended info
  userProfiles: defineTable({
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    website: v.optional(v.union(v.string(), v.null())),
    location: v.optional(v.union(v.string(), v.null())),
    company: v.optional(v.union(v.string(), v.null())),
    phoneNumber: v.optional(v.union(v.string(), v.null())),
    socialLinks: v.optional(v.any()),
    preferences: v.optional(v.any()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),
});
