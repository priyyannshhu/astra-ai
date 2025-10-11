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
    authMethod: v.optional(v.union(v.literal("google"), v.literal("username"))),
  }),
  workspace: defineTable({
    messages: v.any(),
    fileData: v.optional(v.any()),
    user: v.id("users"),
  }),
});
