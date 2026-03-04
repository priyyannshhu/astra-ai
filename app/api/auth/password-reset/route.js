import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Request password reset
export async function POST(request) {
  try {
    const { email, action } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (action === "request") {
      // Check if user exists (don't reveal if they do)
      const users = await convex.query(async (ctx) => {
        return await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("email"), email))
          .collect();
      });

      if (users.length > 0) {
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        await convex.mutation(async (ctx) => {
          await ctx.db.patch(users[0]._id, {
            resetToken,
            resetTokenExpiry,
            updatedAt: Date.now(),
          });
        });

        // In production, send email with reset link
        // For now, return token for demo
        return NextResponse.json(
          {
            success: true,
            message: "If email exists, reset link sent",
            resetToken, // Remove in production
          },
          { status: 200 }
        );
      }

      // Don't reveal if email exists for security
      return NextResponse.json(
        { success: true, message: "If email exists, reset link sent" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 400 }
    );
  }
}

// Reset password with token
export async function PUT(request) {
  try {
    const { email, token, newPassword } = await request.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { error: "Email, token, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Find user
    const users = await convex.query(async (ctx) => {
      return await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), email))
        .collect();
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = users[0];

    if (user.resetToken !== token) {
      return NextResponse.json(
        { error: "Invalid reset token" },
        { status: 400 }
      );
    }

    if (Date.now() > user.resetTokenExpiry) {
      return NextResponse.json(
        { error: "Reset token expired" },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await convex.mutation(async (ctx) => {
      await ctx.db.patch(user._id, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: Date.now(),
      });
    });

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reset password" },
      { status: 400 }
    );
  }
}
