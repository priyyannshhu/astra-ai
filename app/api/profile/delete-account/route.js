import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import bcrypt from "bcryptjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// DELETE: Request account deletion (requires password confirmation)
export async function POST(request) {
  try {
    const { userId, password } = await request.json();

    if (!userId || !password) {
      return NextResponse.json(
        { error: "User ID and password are required" },
        { status: 400 }
      );
    }

    const user = await convex.query(async (ctx) => {
      return await ctx.db.get(userId);
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { error: "This account does not have a password set" },
        { status: 400 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Password is incorrect" },
        { status: 401 }
      );
    }

    // Generate deletion token valid for 30 minutes
    const deletionToken = Math.random().toString(36).substring(2, 15) + 
                         Math.random().toString(36).substring(2, 15);
    const deletionTokenExpiry = Date.now() + 30 * 60 * 1000;

    await convex.mutation(async (ctx) => {
      await ctx.db.patch(userId, {
        deletionToken,
        deletionTokenExpiry,
        updatedAt: Date.now(),
      });
    });

    // In production, send deletion confirmation email
    return NextResponse.json(
      {
        success: true,
        message: "Confirmation email sent. Please check your email to complete account deletion.",
        deletionToken, // Remove in production
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Account deletion request error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process deletion request" },
      { status: 500 }
    );
  }
}

// PUT: Confirm account deletion with token
export async function PUT(request) {
  try {
    const { userId, deletionToken } = await request.json();

    if (!userId || !deletionToken) {
      return NextResponse.json(
        { error: "User ID and deletion token are required" },
        { status: 400 }
      );
    }

    const user = await convex.query(async (ctx) => {
      return await ctx.db.get(userId);
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.deletionToken !== deletionToken) {
      return NextResponse.json(
        { error: "Invalid deletion token" },
        { status: 401 }
      );
    }

    if (!user.deletionTokenExpiry || user.deletionTokenExpiry < Date.now()) {
      return NextResponse.json(
        { error: "Deletion token has expired" },
        { status: 401 }
      );
    }

    // Delete user data and mark account as deleted
    await convex.mutation(async (ctx) => {
      // Deactivate user account instead of hard delete (for audit trail)
      await ctx.db.patch(userId, {
        isActive: false,
        deletionToken: null,
        deletionTokenExpiry: null,
        password: null,
        email: `deleted_${userId}@deleted.local`,
        updatedAt: Date.now(),
      });

      // Delete user profile
      const profiles = await ctx.db
        .query("userProfiles")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();

      for (const profile of profiles) {
        await ctx.db.delete(profile._id);
      }

      // Revoke all sessions
      const sessions = await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();

      for (const session of sessions) {
        await ctx.db.delete(session._id);
      }

      // Log deletion activity
      await ctx.db.insert("activityLog", {
        userId,
        action: "ACCOUNT_DELETED",
        details: { deletedAt: Date.now() },
        createdAt: Date.now(),
      });
    });

    return NextResponse.json(
      { success: true, message: "Account successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete account" },
      { status: 500 }
    );
  }
}
