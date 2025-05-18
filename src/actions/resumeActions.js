"use server";

import { db } from "@/db";
import { roast } from "@/db/schema/userSchema";
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

    console.log(response);

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
