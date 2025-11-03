import OpenAI from "openai";
import pRetry, { AbortError } from "p-retry";

// This uses Replit's AI Integrations service for OpenAI-compatible API access
// without requiring your own OpenAI API key. Charges are billed to your Replit credits.
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

// Helper function to check if error is rate limit or quota violation
function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

export interface ExtractedContactInfo {
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  website?: string;
}

export interface ResumeAnalysisResult {
  matchScore: number; // 0-100
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  keywordsToAdd: string[];
  sectionsToImprove: string[];
}

export interface CompanyResearchResult {
  summary: string;
  history: string;
  currentState: string;
  challenges: string;
  culture: string;
  recentNews: string[];
}

/**
 * Extracts contact information from a business card image using OpenAI vision API
 * @param imageBase64 - Base64 encoded image string (with or without data URL prefix)
 * @returns Extracted contact information
 */
export async function extractBusinessCardInfo(
  imageBase64: string
): Promise<ExtractedContactInfo> {
  // Remove data URL prefix if present
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  
  return await pRetry(
    async () => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Extract the contact information from this business card image. Return a JSON object with these fields (use null for any field not found):
- name: person's full name
- title: job title or position
- company: company/organization name
- email: email address
- phone: phone number (any format)
- linkedin: LinkedIn profile URL
- website: website URL

Return ONLY the JSON object, no other text.`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Data}`
                  }
                }
              ]
            }
          ],
          max_completion_tokens: 500,
          response_format: { type: "json_object" }
        });

        const content = response.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(content);
        
        // Clean up the data - remove null values and trim strings
        const cleaned: ExtractedContactInfo = {};
        if (parsed.name) cleaned.name = String(parsed.name).trim();
        if (parsed.title) cleaned.title = String(parsed.title).trim();
        if (parsed.company) cleaned.company = String(parsed.company).trim();
        if (parsed.email) cleaned.email = String(parsed.email).trim();
        if (parsed.phone) cleaned.phone = String(parsed.phone).trim();
        if (parsed.linkedin) cleaned.linkedin = String(parsed.linkedin).trim();
        if (parsed.website) cleaned.website = String(parsed.website).trim();
        
        return cleaned;
      } catch (error: any) {
        if (isRateLimitError(error)) {
          throw error; // Rethrow to trigger p-retry
        }
        // For non-rate-limit errors, throw immediately (don't retry)
        throw new AbortError(error);
      }
    },
    {
      retries: 3,
      minTimeout: 2000,
      maxTimeout: 10000,
      factor: 2,
    }
  );
}

/**
 * Analyzes a resume against a job posting and provides tailored recommendations
 * @param resumeContent - The full text content of the resume
 * @param jobDescription - The job posting description and requirements
 * @returns Analysis with match score and specific recommendations
 */
export async function analyzeResumeForJob(
  resumeContent: string,
  jobDescription: string
): Promise<ResumeAnalysisResult> {
  return await pRetry(
    async () => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert career coach and resume consultant. Analyze resumes against job postings and provide actionable, specific recommendations."
            },
            {
              role: "user",
              content: `Analyze this resume against the job posting and provide detailed feedback:

JOB POSTING:
${jobDescription}

RESUME:
${resumeContent}

Provide a JSON response with:
- matchScore: number from 0-100 indicating overall fit
- strengths: array of strings highlighting resume strengths that match the job
- gaps: array of strings identifying missing skills/experience from job requirements
- recommendations: array of specific, actionable suggestions to improve the resume for this job
- keywordsToAdd: array of keywords/skills from the job posting that should be added to the resume
- sectionsToImprove: array of resume sections (e.g., "Experience", "Skills") that need work

Be specific and actionable in your recommendations.`
            }
          ],
          max_completion_tokens: 2000,
          response_format: { type: "json_object" }
        });

        const content = response.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(content);
        
        return {
          matchScore: parsed.matchScore || 0,
          strengths: parsed.strengths || [],
          gaps: parsed.gaps || [],
          recommendations: parsed.recommendations || [],
          keywordsToAdd: parsed.keywordsToAdd || [],
          sectionsToImprove: parsed.sectionsToImprove || [],
        };
      } catch (error: any) {
        if (isRateLimitError(error)) {
          throw error;
        }
        throw new AbortError(error);
      }
    },
    {
      retries: 3,
      minTimeout: 2000,
      maxTimeout: 10000,
      factor: 2,
    }
  );
}

/**
 * Conducts comprehensive company research using web search results and AI synthesis
 * @param companyName - Name of the company to research
 * @param webSearchResults - Search results from web about the company
 * @returns Structured company research including history, current state, and challenges
 */
export async function conductCompanyResearch(
  companyName: string,
  webSearchResults: string
): Promise<CompanyResearchResult> {
  return await pRetry(
    async () => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a professional business researcher. Synthesize web search results into comprehensive, well-organized company profiles that help job seekers prepare for applications and interviews."
            },
            {
              role: "user",
              content: `Research ${companyName} using the following search results and create a comprehensive company profile:

SEARCH RESULTS:
${webSearchResults}

Provide a JSON response with:
- summary: 2-3 paragraph executive summary of the company
- history: Company's founding, evolution, major milestones (2-3 paragraphs)
- currentState: Current business focus, products/services, market position (2-3 paragraphs)
- challenges: Current challenges, competitive pressures, industry trends affecting them (2 paragraphs)
- culture: Company culture, values, work environment based on available information (1-2 paragraphs)
- recentNews: array of 3-5 recent news items or developments with brief descriptions

Focus on information that would help a job applicant understand the company and prepare for interviews.`
            }
          ],
          max_completion_tokens: 3000,
          response_format: { type: "json_object" }
        });

        const content = response.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(content);
        
        return {
          summary: parsed.summary || "",
          history: parsed.history || "",
          currentState: parsed.currentState || "",
          challenges: parsed.challenges || "",
          culture: parsed.culture || "",
          recentNews: parsed.recentNews || [],
        };
      } catch (error: any) {
        if (isRateLimitError(error)) {
          throw error;
        }
        throw new AbortError(error);
      }
    },
    {
      retries: 3,
      minTimeout: 2000,
      maxTimeout: 10000,
      factor: 2,
    }
  );
}

/**
 * Generates a personalized cover letter based on resume content and job details
 * @param resumeContent - The full text content of the resume
 * @param jobTitle - The job title/position
 * @param companyName - The company name
 * @param jobDescription - The job posting description (optional but recommended)
 * @returns Generated cover letter text
 */
export async function generateCoverLetter(
  resumeContent: string,
  jobTitle: string,
  companyName: string,
  jobDescription?: string
): Promise<string> {
  return await pRetry(
    async () => {
      try {
        const jobContext = jobDescription 
          ? `\n\nJOB DESCRIPTION:\n${jobDescription}` 
          : '';

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert career coach specializing in crafting compelling, personalized cover letters. Write professional cover letters that highlight relevant experience, demonstrate genuine interest in the role, and show cultural fit."
            },
            {
              role: "user",
              content: `Write a professional cover letter for the following position using my resume:

POSITION: ${jobTitle}
COMPANY: ${companyName}${jobContext}

MY RESUME:
${resumeContent}

Write a compelling cover letter that:
- Opens with a strong, specific statement about why I'm interested in this role
- Highlights 2-3 key achievements from my resume that are most relevant to this position
- Demonstrates understanding of the company and the role
- Shows enthusiasm and cultural fit
- Closes with a clear call to action
- Is concise (3-4 paragraphs, under 400 words)
- Uses a professional but personable tone
- Avoids clichés and generic statements

Return ONLY the cover letter text, no additional formatting or explanations.`
            }
          ],
          max_completion_tokens: 1500
        });

        const content = response.choices[0]?.message?.content || "";
        return content.trim();
      } catch (error: any) {
        if (isRateLimitError(error)) {
          throw error;
        }
        throw new AbortError(error);
      }
    },
    {
      retries: 3,
      minTimeout: 2000,
      maxTimeout: 10000,
      factor: 2,
    }
  );
}
