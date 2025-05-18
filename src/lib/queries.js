import { db } from "@/db";
import { roast, users } from "@/db/schema/userSchema";
import { eq, ilike, and, sql, desc } from "drizzle-orm";
import { getSession } from "./session";

export const getFilteredRoasts = async (filters) => {
  try {
    const session = await getSession();
    console.log("Filters:", filters, session);

    if (!session) {
      return {
        error: "Unauthorized access",
        success: false,
      };
    }

    // Base query
    let query = db.select().from(roast);

    // Conditions: always include userId
    const conditions = [eq(roast.userId, session.userId)];

    if (filters?.type && filters.type !== "all") {
      conditions.push(eq(roast.type, filters.type));
    }

    if (filters?.username) {
      conditions.push(ilike(roast.platformUserName, `%${filters.username}%`));
    }

    // Apply all filters
    query = query.where(and(...conditions)).orderBy(desc(roast.createdAt));

    const items = await query;

    return {
      success: true,
      items,
    };
  } catch (error) {
    console.error("Error fetching filtered roasts:", error);
    return { success: false, data: [], error: "Failed to fetch data" };
  }
};

export const getRoastById = async (id) => {
  return await db
    .select()
    .from(roast)
    .where(eq(roast.id, id))
    .then((data) => data[0]);
};

export const getDashboardData = async () => {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const userId = session.userId;

  // Fetch user details
  const userDetails = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .then((data) => data[0]);

  if (!userDetails) {
    return {
      success: false,
      error: "User not found",
    };
  }

  // Roast type counts
  const [
    roastCountResult,
    githubCount,
    resumeRoastCount,
    resumeAnalysisCount,
    leetcodeCount,
  ] = await Promise.all([
    db
      .select({ count: sql`count(*)` })
      .from(roast)
      .where(eq(roast.userId, userId)),

    db
      .select({ count: sql`count(*)` })
      .from(roast)
      .where(and(eq(roast.userId, userId), eq(roast.type, "github_roast"))),

    db
      .select({ count: sql`count(*)` })
      .from(roast)
      .where(and(eq(roast.userId, userId), eq(roast.type, "resume_roast"))),

    db
      .select({ count: sql`count(*)` })
      .from(roast)
      .where(and(eq(roast.userId, userId), eq(roast.type, "resume_analysis"))),

    db
      .select({ count: sql`count(*)` })
      .from(roast)
      .where(and(eq(roast.userId, userId), eq(roast.type, "leetcode_roast"))),
  ]);

  const roastCount = roastCountResult[0]?.count ?? 0;

  // Recent 5 roasts
  const recentRoasts = await db
    .select()
    .from(roast)
    .where(eq(roast.userId, userId))
    .orderBy(sql`${roast.createdAt} DESC`)
    .limit(5);

  return {
    success: true,
    data: {
      userDetails,
      roastCount,
      recentRoasts,
      roastTypeCounts: {
        github: githubCount[0]?.count ?? 0,
        resumeRoast: resumeRoastCount[0]?.count ?? 0,
        resumeAnalysis: resumeAnalysisCount[0]?.count ?? 0,
        leetcode: leetcodeCount[0]?.count ?? 0,
      },
    },
  };
};

/**
 * Gets the number of requests (roasts) made by the current user today
 * @returns {Promise<{success: boolean, count?: number, error?: string}>} Request count or error
 */
export const getRequestsMadeToday = async () => {
  try {
    const session = await getSession();

    if (!session) {
      return {
        success: false,
        error: "Unauthorized access",
      };
    }

    const userId = session.userId;

    // Get today's date at midnight (start of day) in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Count requests made by the user today, respecting timezone in the database
    const requestsToday = await db
      .select({ count: sql`count(*)` })
      .from(roast)
      .where(and(eq(roast.userId, userId), gte(roast.createdAt, today)));

    return {
      success: true,
      count: Number(requestsToday[0]?.count ?? 0),
    };
  } catch (error) {
    console.error("Error counting today's requests:", error);
    return {
      success: false,
      error: "Failed to count today's requests",
    };
  }
};
