import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(request) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and verification token are required" },
        { status: 400 }
      );
    }

    // Query to find user and verify
    const result = await convex.query(async (ctx) => {
      const users = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), email))
        .collect();

      if (users.length === 0) {
        throw new Error("User not found");
      }

      const user = users[0];

      if (user.emailVerified) {
        throw new Error("Email already verified");
      }

      if (user.emailVerificationToken !== token) {
        throw new Error("Invalid verification token");
      }

      if (!user.emailVerificationExpiry || Date.now() > user.emailVerificationExpiry) {
        throw new Error("Verification token expired");
      }

      return user;
    });

    // Update user to mark email as verified
    await convex.mutation(async (ctx) => {
      const users = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), email))
        .collect();

      if (users.length > 0) {
        await ctx.db.patch(users[0]._id, {
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpiry: null,
          updatedAt: Date.now(),
        });
      }
    });

    return NextResponse.json(
      { success: true, message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: error.message || "Email verification failed" },
      { status: 400 }
    );
  }
}
