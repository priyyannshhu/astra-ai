import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Update workspace settings (title, description, visibility)
export async function PUT(request) {
  try {
    const { workspaceId, title, description, isPublic } = await request.json();

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    const result = await convex.mutation(async (ctx) => {
      const workspace = await ctx.db.get(workspaceId);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      const updates = {
        updatedAt: Date.now(),
      };

      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (isPublic !== undefined) updates.isPublic = isPublic;

      await ctx.db.patch(workspaceId, updates);

      return { success: true, updates };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Update workspace settings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update workspace settings" },
      { status: 500 }
    );
  }
}

// Get workspace details
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    const workspace = await convex.query(async (ctx) => {
      return await ctx.db.get(workspaceId);
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ workspace }, { status: 200 });
  } catch (error) {
    console.error("Get workspace error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get workspace" },
      { status: 500 }
    );
  }
}

// Delete workspace
export async function DELETE(request) {
  try {
    const { workspaceId } = await request.json();

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    const result = await convex.mutation(async (ctx) => {
      const workspace = await ctx.db.get(workspaceId);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      await ctx.db.delete(workspaceId);

      return { success: true };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Delete workspace error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete workspace" },
      { status: 500 }
    );
  }
}
