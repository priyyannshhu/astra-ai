import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(request) {
  try {
    const { name, email, username, password, authMethod } = await request.json();

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    if (authMethod === "username") {
      if (!username || !password) {
        return NextResponse.json(
          { error: "Username and password are required for username auth" },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Call Convex mutation
    const result = await convex.mutation(async (ctx) => {
      // Check email uniqueness
      const existingUsers = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), email))
        .collect();

      if (existingUsers.length > 0) {
        throw new Error("Email already registered");
      }

      // Check username uniqueness if provided
      if (username) {
        const existingUsernames = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("username"), username))
          .collect();

        if (existingUsernames.length > 0) {
          throw new Error("Username already taken");
        }
      }

      // Since we can't use Convex actions directly, we'll create the user with a mutation
      // Password hashing should be handled on the client or in a secure way
      const userId = await ctx.db.insert("users", {
        name,
        email,
        username: username || null,
        picture: null,
        uid: `user_${Date.now()}`,
        password: null, // Will be handled by client or separate mutation
        authMethod: authMethod || "username",
        emailVerified: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isActive: true,
        role: "user",
      });

      // Create user profile
      await ctx.db.insert("userProfiles", {
        userId,
        displayName: name,
        preferences: {
          emailNotifications: true,
          twoFactorEnabled: false,
        },
        updatedAt: Date.now(),
      });

      return { success: true, userId };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please verify your email.",
        userId: result.userId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 400 }
    );
  }
}
