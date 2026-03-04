import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// MUTATION: Create project
export const CreateProject = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    owner: v.id("users"),
    tags: v.optional(v.array(v.string())),
    thumbnail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description || null,
      owner: args.owner,
      status: "active",
      tags: args.tags || [],
      thumbnail: args.thumbnail || null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastAccessedAt: Date.now(),
    });

    return projectId;
  },
});

// QUERY: Get all projects by owner
export const GetUserProjects = query({
  args: {
    userId: v.id("users"),
    status: v.optional(v.union(v.literal("active"), v.literal("archived"), v.literal("all"))),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("projects").filter((q) => q.eq(q.field("owner"), args.userId));

    if (args.status && args.status !== "all") {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    const projects = await query.order("desc").collect();
    return projects;
  },
});

// QUERY: Get single project
export const GetProject = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    return project;
  },
});

// MUTATION: Update project
export const UpdateProject = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    thumbnail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.tags !== undefined) updates.tags = args.tags;
    if (args.thumbnail !== undefined) updates.thumbnail = args.thumbnail;

    await ctx.db.patch(args.projectId, updates);
    return { success: true };
  },
});

// MUTATION: Archive project
export const ArchiveProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, {
      status: "archived",
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

// MUTATION: Delete project
export const DeleteProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, {
      status: "deleted",
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

// MUTATION: Update last accessed
export const UpdateProjectAccess = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, {
      lastAccessedAt: Date.now(),
    });
  },
});

// QUERY: Search projects
export const SearchProjects = query({
  args: {
    userId: v.id("users"),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("owner"), args.userId))
      .collect();

    const lowerQuery = args.query.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
        (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)))
    );
  },
});

// QUERY: Get projects by tag
export const GetProjectsByTag = query({
  args: {
    userId: v.id("users"),
    tag: v.string(),
  },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("owner"), args.userId))
      .collect();

    return projects.filter((p) => p.tags && p.tags.includes(args.tag));
  },
});
