import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// GET: Fetch notification preferences
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const profile = await convex.query(async (ctx) => {
      const profiles = await ctx.db
        .query("userProfiles")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();
      return profiles[0] || null;
    });

    const preferences = profile?.preferences || {
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: false,
      collabNotifications: true,
      projectUpdates: true,
      weeklyDigest: true,
    };

    return NextResponse.json(
      { success: true, preferences },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

// PUT: Update notification preferences
export async function PUT(request) {
  try {
    const { userId, preferences } = await request.json();

    if (!userId || !preferences) {
      return NextResponse.json(
        { error: "User ID and preferences are required" },
        { status: 400 }
      );
    }

    const result = await convex.mutation(async (ctx) => {
      const profiles = await ctx.db
        .query("userProfiles")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();

      if (profiles.length > 0) {
        const existingPrefs = profiles[0].preferences || {};
        await ctx.db.patch(profiles[0]._id, {
          preferences: { ...existingPrefs, ...preferences },
          updatedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("userProfiles", {
          userId,
          preferences,
          updatedAt: Date.now(),
        });
      }

      return { success: true };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
