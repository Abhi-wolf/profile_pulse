import { NextResponse } from "next/server";
import { getSession } from "@/lib/session"; // Adjust import path as needed
import { db } from "@/db"; // Adjust import path as needed
import { users } from "@/db/schema/userSchema"; // Adjust import path as needed
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Fetch additional user data from your database
    const userData = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        firstName: users.firstName,
        lastName: users.lastName,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .then((rows) => rows[0]);

    if (!userData) {
      // User found in session but not in database (unusual case)
      return NextResponse.json(
        { authenticated: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Return user information (excluding sensitive data)
    return NextResponse.json({
      authenticated: true,
      userId: session.userId,
      userData: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
      },
    });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
