import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import bcrypt from "bcryptjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Change password (requires current password)
export async function POST(request) {
  try {
    const { userId, oldPassword, newPassword, confirmPassword } = await request.json();

    if (!userId || !oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New passwords do not match" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (oldPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from current password" },
        { status: 400 }
      );
    }

    // Get user
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

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await convex.mutation(async (ctx) => {
      await ctx.db.patch(userId, {
        password: hashedPassword,
        updatedAt: Date.now(),
      });
    });

    // Log activity
    await convex.mutation(async (ctx) => {
      await ctx.db.insert("activityLog", {
        userId,
        action: "PASSWORD_CHANGED",
        createdAt: Date.now(),
      });
    });

    return NextResponse.json(
      { success: true, message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to change password" },
      { status: 500 }
    );
  }
}
