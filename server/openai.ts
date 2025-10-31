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
