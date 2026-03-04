import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const CreateWorkSpace = mutation({
  args: {
    messages: v.any(),
    user: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const workspaceId = await ctx.db.insert("workspace", {
        messages: args.messages,
        user: args.user,
      });
      console.log(workspaceId);
      return workspaceId;
    } catch (error) {
      throw new Error("Error creating workspace: " + error.message);
    }
  },
});

export const GetWorkspaceData = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    return workspace;
  },
});

export const UpdateMessages = mutation({
  args: {
    workspaceId: v.id("workspace"),
    messages: v.any(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.workspaceId, {
      messages: args.messages,
    });
    console.log(result);
    return result;
  },
});

export const UpdateFiles = mutation({
  args: {
    workspaceId: v.id("workspace"),
    files: v.any(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.workspaceId, {
      fileData: args.files,
    });
    console.log(result);
    return result;
  },
});

export const GetAllWorkspace = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("workspace")
      .filter((q) => q.eq(q.field("user"), args.userId))
      .order("desc")
      .collect();

    return result;
  },
});

// New: Update workspace title and description
export const UpdateWorkspaceInfo = mutation({
  args: {
    workspaceId: v.id("workspace"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const updates = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;

    await ctx.db.patch(args.workspaceId, updates);
    return { success: true };
  },
});

// New: Share workspace with users
export const AddCollaborator = mutation({
  args: {
    workspaceId: v.id("workspace"),
    collaboratorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const collaborators = workspace.collaborators || [];
    if (!collaborators.includes(args.collaboratorId)) {
      collaborators.push(args.collaboratorId);
    }

    await ctx.db.patch(args.workspaceId, {
      collaborators,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// New: Remove collaborator
export const RemoveCollaborator = mutation({
  args: {
    workspaceId: v.id("workspace"),
    collaboratorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const collaborators = (workspace.collaborators || []).filter(
      (id) => id !== args.collaboratorId
    );

    await ctx.db.patch(args.workspaceId, {
      collaborators,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// New: Toggle workspace public status
export const TogglePublic = mutation({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    await ctx.db.patch(args.workspaceId, {
      isPublic: !workspace.isPublic,
      updatedAt: Date.now(),
    });

    return { success: true, isPublic: !workspace.isPublic };
  },
});

// New: Get collaborators for workspace
export const GetCollaborators = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      return [];
    }

    if (!workspace.collaborators || workspace.collaborators.length === 0) {
      return [];
    }

    const collaborators = await Promise.all(
      workspace.collaborators.map((id) => ctx.db.get(id))
    );

    return collaborators.filter((c) => c !== null);
  },
});

// New: Delete workspace
export const DeleteWorkspace = mutation({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    await ctx.db.delete(args.workspaceId);
    return { success: true };
  },
});
