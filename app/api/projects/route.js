import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// GET: Fetch user projects
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const status = searchParams.get("status") || "all";

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const projects = await convex.query(async (ctx) => {
      let query = ctx.db
        .query("projects")
        .filter((q) => q.eq(q.field("owner"), userId));

      if (status !== "all") {
        query = query.filter((q) => q.eq(q.field("status"), status));
      }

      return await query.order("desc").collect();
    });

    return NextResponse.json({ success: true, projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST: Create project
export async function POST(request) {
  try {
    const { userId, name, description, tags, thumbnail } = await request.json();

    if (!userId || !name) {
      return NextResponse.json(
        { error: "User ID and project name are required" },
        { status: 400 }
      );
    }

    const projectId = await convex.mutation(async (ctx) => {
      return await ctx.db.insert("projects", {
        name,
        description: description || null,
        owner: userId,
        status: "active",
        tags: tags || [],
        thumbnail: thumbnail || null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastAccessedAt: Date.now(),
      });
    });

    return NextResponse.json(
      { success: true, projectId, message: "Project created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
