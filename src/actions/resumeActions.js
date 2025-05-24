"use server";

import { and, db, eq, sql } from "@/db";
import { roast } from "@/db/schema/userSchema";
import { invalidateRequestsCache } from "@/lib/queries";
import { getSession } from "@/lib/session";

export async function addResponseToDB(values) {
  const session = await getSession();

  if (!session) {
    return {
      error: "Unauthorized access",
      success: false,
    };
  }

  const {
    type,
    extractedData,
    jobDescription,
    aiResponse,
    platform,
    platformUserName,
  } = values;

  try {
    const response = await db.insert(roast).values({
      type,
      extractedData,
      platform,
      platformUserName,
      aiResponse,
      jobDescription,
      userId: session.userId,
    });


    invalidateRequestsCache();

    return {
      error: null,
      success: true,
      message: "Response added successfully",
    };
  } catch (e) {
    console.error(e);
    return { error: e.message, success: false };
  }
}
