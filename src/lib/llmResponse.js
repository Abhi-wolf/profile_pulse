"use server";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { getRequestsMadeToday } from "./queries";
import { getSession } from "./session";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY,
});

const isResumeLike = (text) => {
  // Keywords that are commonly found in resumes
  const resumeKeywords = [
    "experience",
    "education",
    "skills",
    "projects",
    "work history",
    "certifications",
    "summary",
    "contact",
  ];

  // Check if at least 2 keywords are found in the text
  return resumeKeywords.some((word) => text.toLowerCase().includes(word));
};

export const checkResumeIsGoodForTheGob = async (text, jobdescription) => {
  const session = await getSession();

  if (!isResumeLike(text)) {
    return {
      error: "The uploaded file does not seem to contain a resume.",
      alignment_score: 0,
      key_strengths: [],
      gaps: [],
      recommendations: [],
      overall_feedback: "The uploaded file does not seem to contain a resume.",
    };
  }


  if (!session) {
    return {
      error: "Unauthorized access",
      success: false,
    };
  }
  const userId = session.userId;

  const res = await getRequestsMadeToday(userId);

  if (!res.success) {
    return {
      error: res.error,
      success: false,
    };
  }

  if (res.error) {
    return {
      error: res.error,
      success: false,
    };
  }

  if (res.count >= 10) {
    return {
      error: "You have reached the maximum number of requests for today.",
      success: false,
    };
  }

  try {
    const res = await model.invoke([
      [
        "human",
        `You are a career advisor and hiring expert. Your task is to carefully analyze the provided resume text and job description.

IMPORTANT INSTRUCTIONS:
1. Only analyze the specific content provided in the resume text - do not make assumptions or infer information that isn't explicitly stated
2. If the resume text is unclear, incomplete, or missing key information, note this in the gaps section
3. Base your alignment score strictly on the match between the actual resume content and job requirements
4. If you cannot find specific information in the resume, include this as a gap rather than making assumptions

Return a JSON object with your analysis:
{
"alignment_score": "Score from 0 to 100 based ONLY on the explicitly stated qualifications matching the job requirements",
"key_strengths": ["Only list strengths that are explicitly mentioned in the resume AND relevant to the job"],
"gaps": ["List missing or unclear information, and requirements from the job description that aren't evidenced in the resume"],
"recommendations": ["Specific suggestions based on the actual content gaps identified"],
"overall_feedback": "An honest assessment based solely on the provided content"
}

Resume Text:
${text}

Job Description:
${jobdescription}`,
      ],
    ]);


    let rawResponse = res.content.trim();

    rawResponse = rawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON found in response.");

    const jsonString = jsonMatch[0];


    const structuredResponse = JSON.parse(jsonString);

    return structuredResponse;
  } catch (err) {
    console.error("Failed to parse response as JSON:", err);
    return {
      error: "Failed to generate a response. Please try again.",
      alignment_score: 0,
      key_strengths: [],
      gaps: [],
      recommendations: [],
      overall_feedback: "Failed to generate a response. Please try again.",
    };
  }
};

/**
 * A reusable function for generating AI-powered roasts for different developer inputs
 * @param {Object} options - Configuration options for the roast
 * @param {string} options.content - The content to be roasted (resume text, GitHub data, etc.)
 * @param {string} options.contentType - The type of content being roasted ('resume', 'github', 'leetcode')
 * @param {Object} options.model - The AI model to use for generating the roast
 * @param {number} options.minBulletPoints - Minimum number of bullet points (default: 4)
 * @param {number} options.maxBulletPoints - Maximum number of bullet points (default: 6)
 * @returns {Promise<Object>} - The result of the roast generation
 */
export async function generateRoast({
  content,
  contentType = "resume",
  minBulletPoints = 4,
  maxBulletPoints = 6,
}) {
  // Validate inputs
  if (!content || !model) {
    return {
      success: false,
      error: "Missing required parameters (content or model)",
    };
  }

  // Configure the prompt based on content type
  const prompts = {
    resume: `You are a developer's friend who will roast their resume in a funny but not overly mean way.
        
IMPORTANT INSTRUCTIONS:
1. Create a witty, tech-related roast about the resume
2. Format your response as ${minBulletPoints}-${maxBulletPoints} bullet points, each focused on a different aspect of the resume
3. Make sure each point is humorous but not cruel
4. Include specific tech jokes and puns related to their experience
5. End with one slightly encouraging line
        
Resume Text: ${JSON.stringify(content)}`,

    github: `You are a developer's friend who will roast their GitHub profile in a funny but not overly mean way.
        
IMPORTANT INSTRUCTIONS:
1. Create a witty, tech-related roast about their GitHub profile
2. Format your response as ${minBulletPoints}-${maxBulletPoints} bullet points, each focused on a different aspect
3. Make sure each point is humorous but not cruel
4. Include specific jokes about repos, commit patterns, languages used, etc.
5. End with one slightly encouraging line
        
GitHub Profile Data: ${JSON.stringify(content)}`,

    leetcode: `You are a developer's friend who will roast their LeetCode profile in a funny but not overly mean way.
        
IMPORTANT INSTRUCTIONS:
1. Create a witty, tech-related roast about their LeetCode profile
2. Format your response as ${minBulletPoints}-${maxBulletPoints} bullet points, each focused on a different aspect
3. Make sure each point is humorous but not cruel
4. Include specific jokes about their problem-solving skills, contest participation, etc.
5. End with one slightly encouraging line
        
LeetCode Profile Data: ${JSON.stringify(content)}`,
  };

  const formatInstructions = `
FORMAT YOUR RESPONSE LIKE THIS (without the markdown):
• [First roast point]
• [Second roast point]
• [Third roast point]
• [Fourth roast point]
${maxBulletPoints > 4 ? "• [Optional fifth roast]\n" : ""}${
    maxBulletPoints > 5 ? "• [Optional sixth roast]\n" : ""
  }
[One slightly encouraging line at the end]`;

  const prompt = prompts[contentType] + formatInstructions;

  try {
    // Invoke the AI model with the prompt
    const res = await model.invoke([["human", prompt]]);

    let rawResponse = res.content.trim();

    console.log("LLM RESPONSE = ", rawResponse);

    // Format the response to display nicely
    return {
      success: true,
      response: rawResponse,
    };
  } catch (err) {
    console.error(`Error generating ${contentType} roast:`, err);
    return {
      error: `Failed to generate a roast. Please try again.`,
      success: false,
    };
  }
}

/**
 * Generate a roast for a resume
 * @param {string} text - The resume text to roast
 * @param {Object} model - The AI model to use
 * @returns {Promise<Object>} - The result of the roast generation
 */
export async function roastResume(text, model) {
  const session = await getSession();

  if (!session) {
    return {
      error: "Unauthorized access",
      success: false,
    };
  }
  const userId = session.userId;

  const res = await getRequestsMadeToday(userId);

  if (!res.success) {
    return {
      error: res.error,
      success: false,
    };
  }

  if (res.error) {
    return {
      error: res.error,
      success: false,
    };
  }

  if (res.count >= 10) {
    return {
      error: "You have reached the maximum number of requests for today.",
      success: false,
    };
  }

  return generateRoast({
    content: text,
    contentType: "resume",
    minBulletPoints: 4,
    maxBulletPoints: 6,
  });
}

/**
 * Generate a roast for a GitHub profile
 * @param {Object} githubData - The GitHub profile data to roast
 * @param {Object} model - The AI model to use
 * @returns {Promise<Object>} - The result of the roast generation
 */
export async function roastGitHub(githubData, model) {
  const session = await getSession();

  if (!session) {
    return {
      error: "Unauthorized access",
      success: false,
    };
  }
  const userId = session.userId;

  const res = await getRequestsMadeToday(userId);

  if (!res.success) {
    return {
      error: res.error,
      success: false,
    };
  }

  if (res.count >= 10) {
    return {
      error: "You have reached the maximum number of requests for today.",
      success: false,
    };
  }
  // console.log("Requests made today:", res.count);

  return generateRoast({
    content: githubData,
    contentType: "github",
    minBulletPoints: 4,
    maxBulletPoints: 6,
  });
}

/**
 * Generate a roast for a LeetCode profile
 * @param {Object} leetcodeData - The LeetCode profile data to roast
 * @param {Object} model - The AI model to use
 * @returns {Promise<Object>} - The result of the roast generation
 */
export async function roastLeetCode(leetcodeData, model) {
  const res = await getRequestsMadeToday();

  if (!res.success) {
    return {
      error: res.error,
      success: false,
    };
  }

  if (res.error) {
    return {
      error: res.error,
      success: false,
    };
  }

  if (res.count >= 10) {
    return {
      error: "You have reached the maximum number of requests for today.",
      success: false,
    };
  }

  return generateRoast({
    content: leetcodeData,
    contentType: "leetcode",
    minBulletPoints: 4,
    maxBulletPoints: 6,
  });
}
