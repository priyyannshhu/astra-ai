import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// GET: Fetch user profile
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
      return await ctx.db
        .query("userProfiles")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();
    });

    return NextResponse.json(
      {
        success: true,
        profile: profile[0] || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT: Update user profile
export async function PUT(request) {
  try {
    const {
      userId,
      displayName,
      website,
      location,
      company,
      phoneNumber,
      bio,
    } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await convex.mutation(async (ctx) => {
      // Get existing profile
      const profiles = await ctx.db
        .query("userProfiles")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();

      const profileUpdate = { updatedAt: Date.now() };

      if (displayName !== undefined) profileUpdate.displayName = displayName;
      if (website !== undefined) profileUpdate.website = website || null;
      if (location !== undefined) profileUpdate.location = location || null;
      if (company !== undefined) profileUpdate.company = company || null;
      if (phoneNumber !== undefined)
        profileUpdate.phoneNumber = phoneNumber || null;

      if (profiles.length > 0) {
        await ctx.db.patch(profiles[0]._id, profileUpdate);
      } else {
        profileUpdate.userId = userId;
        await ctx.db.insert("userProfiles", profileUpdate);
      }

      // Update user bio if provided
      if (bio !== undefined) {
        await ctx.db.patch(userId, {
          bio: bio || null,
          updatedAt: Date.now(),
        });
      }
    });

    return NextResponse.json(
      { success: true, message: "Profile updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// POST: Add social link
export async function POST(request) {
  try {
    const { userId, action, platform, url } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (action === "add-social") {
      if (!platform || !url) {
        return NextResponse.json(
          { error: "Platform and URL are required" },
          { status: 400 }
        );
      }

      await convex.mutation(async (ctx) => {
        const profiles = await ctx.db
          .query("userProfiles")
          .filter((q) => q.eq(q.field("userId"), userId))
          .collect();

        if (profiles.length > 0) {
          const currentLinks = profiles[0].socialLinks || {};
          currentLinks[platform] = url;

          await ctx.db.patch(profiles[0]._id, {
            socialLinks: currentLinks,
            updatedAt: Date.now(),
          });
        }
      });

      return NextResponse.json(
        { success: true, message: "Social link added" },
        { status: 200 }
      );
    }

    if (action === "remove-social") {
      if (!platform) {
        return NextResponse.json(
          { error: "Platform is required" },
          { status: 400 }
        );
      }

      await convex.mutation(async (ctx) => {
        const profiles = await ctx.db
          .query("userProfiles")
          .filter((q) => q.eq(q.field("userId"), userId))
          .collect();

        if (profiles.length > 0) {
          const currentLinks = profiles[0].socialLinks || {};
          delete currentLinks[platform];

          await ctx.db.patch(profiles[0]._id, {
            socialLinks: currentLinks,
            updatedAt: Date.now(),
          });
        }
      });

      return NextResponse.json(
        { success: true, message: "Social link removed" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error managing social links:", error);
    return NextResponse.json(
      { error: "Failed to manage social links" },
      { status: 500 }
    );
  }
}
