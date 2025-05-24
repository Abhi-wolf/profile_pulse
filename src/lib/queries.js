import { db } from "@/db";
import { roast, users } from "@/db/schema/userSchema";
import { eq, ilike, and, sql, desc, gte, lt, count } from "drizzle-orm";
import { getSession } from "./session";
import { revalidateTag, unstable_cache } from "next/cache";

// export const getFilteredRoasts = async (filters) => {
//   try {
//     const session = await getSession();
//     console.log("Filters:", filters, session);

//     if (!session) {
//       return {
//         error: "Unauthorized access",
//         success: false,
//       };
//     }

//     // Base query
//     let query = db.select().from(roast);

//     // Conditions: always include userId
//     const conditions = [eq(roast.userId, session.userId)];

//     if (filters?.type && filters.type !== "all") {
//       conditions.push(eq(roast.type, filters.type));
//     }

//     if (filters?.username) {
//       conditions.push(ilike(roast.platformUserName, `%${filters.username}%`));
//     }

//     // Apply all filters
//     query = query.where(and(...conditions)).orderBy(desc(roast.createdAt));

//     const items = await query;

//     return {
//       success: true,
//       items,
//     };
//   } catch (error) {
//     console.error("Error fetching filtered roasts:", error);
//     return { success: false, data: [], error: "Failed to fetch data" };
//   }
// };

export const getFilteredRoasts = async (filters) => {
  try {
    const session = await getSession();

    if (!session) {
      return {
        error: "Unauthorized access",
        success: false,
      };
    }

    const page = parseInt(filters?.page) || 1;
    const limit = parseInt(filters?.limit) || 10;
    const offset = (page - 1) * limit;

    // Base query conditions
    const conditions = [eq(roast.userId, session.userId)];

    if (filters?.type && filters.type !== "all") {
      conditions.push(eq(roast.type, filters.type));
    }

    if (filters?.username) {
      conditions.push(ilike(roast.platformUserName, `%${filters.username}%`));
    }

    // Get total count for pagination
    const countQuery = db
      .select({ count: count() })
      .from(roast)
      .where(and(...conditions));
    
    const countResult = await countQuery;
    const totalItems = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated items
    const itemsQuery = db
      .select()
      .from(roast)
      .where(and(...conditions))
      .orderBy(desc(roast.createdAt))
      .limit(limit)
      .offset(offset);

    const items = await itemsQuery;

    return {
      success: true,
      items,
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching filtered roasts:", error);
    return { 
      success: false, 
      items: [], 
      error: "Failed to fetch data",
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 10
    };
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

export const getRequestsMadeToday = unstable_cache(
  async (userId) => {
    try {
      // Start of today in UTC
      const startOfTodayUTC = new Date();
      startOfTodayUTC.setUTCHours(0, 0, 0, 0);

      // Start of tomorrow in UTC
      const startOfTomorrowUTC = new Date(
        startOfTodayUTC.getTime() + 24 * 60 * 60 * 1000
      );

      // Count roasts where createdAt is between start and end of today (UTC)
      const requestsToday = await db
        .select({ count: sql`count(*)` })
        .from(roast)
        .where(
          and(
            eq(roast.userId, userId),
            gte(roast.createdAt, startOfTodayUTC),
            lt(roast.createdAt, startOfTomorrowUTC)
          )
        );


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
  },
  // Cache per user per day
  ({ args: [userId] }) => [
    `requests-made-on-${new Date().toISOString().slice(0, 10)}`,
    `user-${userId}`,
  ],
  {
    revalidate: 300,
  }
);

export const invalidateRequestsCache = async () => {
  const session = await getSession();
  if (session) {
    // This would force a revalidation of the cache
    revalidateTag(`user-${session.userId}`);
  }
};
