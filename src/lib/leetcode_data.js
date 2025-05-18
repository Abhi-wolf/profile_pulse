"use server";

/**
 * Fetches a user's LeetCode contest and problem-solving data using the LeetCode GraphQL API
 * @param {string} username - The LeetCode username to fetch data for
 * @returns {Promise<Object|null>} - The user's LeetCode data or null if an error occurs
 */
export const leetcodeData = async (username) => {
  console.log("Fetching LeetCode data for username:", username);

  if (!username) return null;

  try {
    // Missing await in original code
    const res = await fetch(`https://leetcode.com/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query userProfile($username: String!) {
            matchedUser(username: $username) {
              username
              submitStats: submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              profile {
                ranking
                reputation
                starRating
              }
            }
            userContestRanking(username: $username) {
              attendedContestsCount
              rating
              globalRanking
              totalParticipants
              topPercentage
            }
          }
        `,
        variables: {
          username,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch LeetCode data: ${res.status}`);
    }

    const data = await res.json();

    // Check if the data has the expected structure
    if (data.errors) {
      console.error("LeetCode API returned errors:", data.errors);
      throw new Error(data.errors[0]?.message || "Unknown LeetCode API error");
    }

    console.log("LeetCode data fetched successfully:", data);
    return {
      success: true,
      data: {
        user: data.data.matchedUser,
        contests: data.data.userContestRanking,
        submitStats: data.data.matchedUser.submitStats,
      },
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// export const githubData = async (username = "Abhi-wolf") => {
//   try {
//     // Fetch user profile
//     const userResponse = await fetch(
//       `https://api.github.com/users/${username}`,
//       {
//         headers: {
//           Accept: "application/vnd.github.v3+json",
//         },
//       }
//     );

//     if (!userResponse.ok) {
//       throw new Error("User not found or API rate limit exceeded");
//     }
//     const userData = await userResponse.json();

//     console.log("User data:", userData);

//     // Fetch user repositories
//     const reposResponse = await fetch(
//       `https://api.github.com/users/${username}/repos`,
//       {
//         headers: {
//           Accept: "application/vnd.github.v3+json",
//         },
//       }
//     );

//     if (!reposResponse.ok) {
//       throw new Error("Failed to fetch repositories");
//     }
//     const reposData = await reposResponse.json();

//     console.log("Repositories data:", reposData);

//     return {
//       success: true,
//       response: reposData,
//     };
//   } catch (error) {
//     console.error("Error generating roast:", error);
//   }
// };

export const githubData = async (username = "Abhi-wolf") => {
  try {
    // Fetch user profile
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error("User not found or API rate limit exceeded");
    }
    const userData = await userResponse.json();

    // Extract relevant user data
    const filteredUserData = {
      login: userData.login,
      name: userData.name || null,
      bio: userData.bio || null,
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      created_at: userData.created_at,
    };

    // Fetch user repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=10&sort=updated`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!reposResponse.ok) {
      throw new Error("Failed to fetch repositories");
    }
    const reposData = await reposResponse.json();

    // Extract relevant repository data
    const filteredReposData = reposData.map((repo) => ({
      name: repo.name,
      description: repo.description || null,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language || null,
      pushed_at: repo.pushed_at,
      open_issues_count: repo.open_issues_count,
    }));

    console.log("User data:", filteredUserData);
    console.log("Repositories data:", filteredReposData);

    // Return the filtered data

    return {
      success: true,
      data: {
        user: filteredUserData,
        repos: filteredReposData,
      },
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
