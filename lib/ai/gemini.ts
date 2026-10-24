import { GoogleGenAI } from "@google/genai";
import { ZodSchema } from "zod";
import { AI_CONFIG, isGeminiConfigured } from "./config";

let geminiClient: GoogleGenAI | null = null;

/**
 * Returns a cached singleton GoogleGenAI client instance.
 * Throws a clean descriptive error if GEMINI_API_KEY is not configured.
 */
export function getGeminiClient(): GoogleGenAI {
  if (geminiClient) {
    return geminiClient;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "GEMINI_API_KEY environment variable is not configured. AI requests cannot reach Google Gemini directly."
    );
  }

  geminiClient = new GoogleGenAI({ apiKey: apiKey.trim() });
  return geminiClient;
}

export type GeminiContentPart =
  | string
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

export type GeminiContents = string | GeminiContentPart[];

/**
 * Executes a Gemini request with structured JSON mode and validates the output with Zod.
 * Never leaks the API key in logs or error messages.
 */
export async function callGeminiStructured<T>(
  prompt: GeminiContents,
  schema: ZodSchema<T>,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<T> {
  const client = getGeminiClient();
  const candidateModels = Array.from(
    new Set([
      options?.model || AI_CONFIG.MODEL_NAME,
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-3.5-flash",
    ])
  );

  let lastError: any = null;

  try {
    for (const model of candidateModels) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt as any,
        config: {
          responseMimeType: "application/json",
          temperature: options?.temperature ?? AI_CONFIG.TEMPERATURE,
          maxOutputTokens: options?.maxTokens ?? AI_CONFIG.MAX_OUTPUT_TOKENS,
        },
      });

      const text = response.text;
      if (!text || text.trim() === "") {
        throw new Error("Received empty response from Gemini API.");
      }

      // Clean any markdown code fences if present despite JSON mime type
      let cleanedText = text.trim();
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(cleanedText);
      } catch (parseError: any) {
        console.error("[Gemini AI] JSON parse error:", parseError?.message || parseError);
        throw new Error(`Failed to parse Gemini response as JSON: ${parseError?.message}`);
      }

      // Validate strictly with provided Zod schema
      const validationResult = schema.safeParse(parsedJson);
      if (!validationResult.success) {
        console.error(
          "[Gemini AI] Zod validation failed:",
          JSON.stringify(validationResult.error.flatten(), null, 2)
        );
        throw new Error(
          `Gemini output did not match expected structure: ${validationResult.error.issues.map((i) => i.message).join(", ")}`
        );
      }

      return validationResult.data;
    } catch (err: any) {
      lastError = err;
      const isCapacityError =
        err?.message?.includes("503") ||
        err?.message?.includes("UNAVAILABLE") ||
        err?.message?.includes("high demand") ||
        err?.message?.includes("RESOURCE_EXHAUSTED");

      if (isCapacityError && model !== candidateModels[candidateModels.length - 1]) {
        console.warn(
          `[Gemini AI] Model ${model} is experiencing high demand. Retrying with fallback model...`
        );
        continue;
      }
      throw err;
    }
  }

  throw lastError;
  } catch (error: any) {
    // Sanitize any error messages to prevent credential leakage
    const rawMsg = error?.message || "Unknown Gemini API error";
    const sanitizedMsg = rawMsg.replace(/AIza[0-9A-Za-z-_]{35}/g, "[REDACTED_API_KEY]");
    console.error("[Gemini AI Error]", sanitizedMsg);
    throw new Error(sanitizedMsg);
  }
}
