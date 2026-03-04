import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import jwt from "jsonwebtoken";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Create session
export async function POST(request) {
  try {
    const { userId, ipAddress, userAgent } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId, iat: Date.now() },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" }
    );

    // Store session in database
    const sessionId = await convex.mutation(async (ctx) => {
      return await ctx.db.insert("sessions", {
        userId,
        token,
        ipAddress,
        userAgent,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
      });
    });

    // Set httpOnly cookie
    const response = NextResponse.json(
      { success: true, token, sessionId },
      { status: 201 }
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create session" },
      { status: 500 }
    );
  }
}

// Get current session
export async function GET(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Get session from database
    const session = await convex.query(async (ctx) => {
      const sessions = await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("token"), token))
        .collect();
      return sessions[0];
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 401 }
      );
    }

    if (session.expiresAt < Date.now()) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      );
    }

    // Get user info
    const user = await convex.query(async (ctx) => {
      return await ctx.db.get(session.userId);
    });

    return NextResponse.json(
      { success: true, user, session },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session retrieval error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get session" },
      { status: 401 }
    );
  }
}

// Revoke session (logout)
export async function DELETE(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      );
    }

    // Find and delete session
    await convex.mutation(async (ctx) => {
      const sessions = await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("token"), token))
        .collect();

      if (sessions.length > 0) {
        await ctx.db.delete(sessions[0]._id);
      }
    });

    // Clear cookie
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.delete("auth_token");

    return response;
  } catch (error) {
    console.error("Session logout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to logout" },
      { status: 500 }
    );
  }
}
