// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session"; // Adjust import path as needed

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
