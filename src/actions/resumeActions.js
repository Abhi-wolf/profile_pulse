"use server";

import { and, db, eq, sql } from "@/db";
import { roast } from "@/db/schema/userSchema";
import { invalidateRequestsCache } from "@/lib/queries";
import { getSession } from "@/lib/session";
const apiURL = "https://feedlytic.vercel.app/api/events";

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

    const eventData = {
      eventName: `${type}`,    // required
      domain: "profile-pulse-mu.vercel.app",  // required
      eventDescription: `${type}  ${platformUserName}`, // optional
    };

    console.log("EVENT DATA = ", eventData);


    const res=await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FEEDLYTIC_API_KEY}`,
      body: JSON.stringify(eventData), 
    }});

    console.log("FEEDLYTIC RESPONSE = ", res)

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
