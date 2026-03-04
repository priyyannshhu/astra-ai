import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Add collaborator to workspace
export async function POST(request) {
  try {
    const { workspaceId, collaboratorId } = await request.json();

    if (!workspaceId || !collaboratorId) {
      return NextResponse.json(
        { error: "Workspace ID and collaborator ID are required" },
        { status: 400 }
      );
    }

    const result = await convex.mutation(async (ctx) => {
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

      return { success: true, collaborators };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Add collaborator error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add collaborator" },
      { status: 500 }
    );
  }
}

// Remove collaborator from workspace
export async function DELETE(request) {
  try {
    const { workspaceId, collaboratorId } = await request.json();

    if (!workspaceId || !collaboratorId) {
      return NextResponse.json(
        { error: "Workspace ID and collaborator ID are required" },
        { status: 400 }
      );
    }

    const result = await convex.mutation(async (ctx) => {
      const workspace = await ctx.db.get(workspaceId);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      const collaborators = (workspace.collaborators || []).filter(
        (id) => id !== collaboratorId
      );

      await ctx.db.patch(workspaceId, {
        collaborators,
        updatedAt: Date.now(),
      });

      return { success: true, collaborators };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Remove collaborator error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove collaborator" },
      { status: 500 }
    );
  }
}

// Get collaborators
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

    const collaborators = await convex.query(async (ctx) => {
      const workspace = await ctx.db.get(workspaceId);

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      if (!workspace.collaborators || workspace.collaborators.length === 0) {
        return [];
      }

      const collaboratorsData = await Promise.all(
        workspace.collaborators.map((id) => ctx.db.get(id))
      );

      return collaboratorsData.filter((c) => c !== null);
    });

    return NextResponse.json({ collaborators }, { status: 200 });
  } catch (error) {
    console.error("Get collaborators error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get collaborators" },
      { status: 500 }
    );
  }
}
