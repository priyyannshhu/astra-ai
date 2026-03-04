import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// PATCH: Update workspace
export async function PATCH(request) {
  try {
    const { workspaceId, title, description, action, userId } = await request.json();

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    // Handle different actions
    switch (action) {
      case "update-info":
        await convex.mutation(async (ctx) => {
          const updates = { updatedAt: Date.now() };
          if (title !== undefined) updates.title = title;
          if (description !== undefined) updates.description = description;
          await ctx.db.patch(workspaceId, updates);
        });
        break;

      case "toggle-public":
        const result = await convex.mutation(async (ctx) => {
          const workspace = await ctx.db.get(workspaceId);
          const newStatus = !workspace.isPublic;
          await ctx.db.patch(workspaceId, {
            isPublic: newStatus,
            updatedAt: Date.now(),
          });
          return newStatus;
        });
        return NextResponse.json(
          { success: true, isPublic: result },
          { status: 200 }
        );

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { success: true, message: "Workspace updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating workspace:", error);
    return NextResponse.json(
      { error: "Failed to update workspace" },
      { status: 500 }
    );
  }
}

// DELETE: Delete workspace
export async function DELETE(request) {
  try {
    const { workspaceId } = await request.json();

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    await convex.mutation(async (ctx) => {
      const workspace = await ctx.db.get(workspaceId);
      if (!workspace) {
        throw new Error("Workspace not found");
      }
      await ctx.db.delete(workspaceId);
    });

    return NextResponse.json(
      { success: true, message: "Workspace deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete workspace" },
      { status: 500 }
    );
  }
}

// POST: Add collaborator
export async function POST(request) {
  try {
    const { workspaceId, collaboratorId, action } = await request.json();

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    if (action === "add-collaborator") {
      if (!collaboratorId) {
        return NextResponse.json(
          { error: "Collaborator ID is required" },
          { status: 400 }
        );
      }

      await convex.mutation(async (ctx) => {
        const workspace = await ctx.db.get(workspaceId);
        if (!workspace) {
          throw new Error("Workspace not found");
        }

        const collaborators = workspace.collaborators || [];
        if (!collaborators.includes(collaboratorId)) {
          collaborators.push(collaboratorId);
        }

        await ctx.db.patch(workspaceId, {
          collaborators,
          updatedAt: Date.now(),
        });
      });

      return NextResponse.json(
        { success: true, message: "Collaborator added" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error adding collaborator:", error);
    return NextResponse.json(
      { error: "Failed to add collaborator" },
      { status: 500 }
    );
  }
}
