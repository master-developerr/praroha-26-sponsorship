/**
 * Centralized Gemini AI configuration for PRAROHA'26 Sponsorship System.
 * Never hard-code model names or API keys directly across application files.
 */

export const AI_CONFIG = {
  // Configured model, defaulting to Google Gemini 3.5 Flash (highest current uptime & availability)
  MODEL_NAME: process.env.GEMINI_MODEL || "gemini-3.5-flash",

  // Prompt versions to support evolvability without breaking cached records
  PROMPT_VERSIONS: {
    COMPANY_ANALYSIS: "v1.0",
    CALL_PREPARATION: "v1.0",
    ALTERNATIVE_ASK: "v1.0",
    CALL_DEBRIEF: "v1.0",
    VOICE_DEBRIEF: "v1.0",
    LEAD_PRIORITIZATION: "v1.0",
  },

  // Limits & guardrails
  MAX_OUTPUT_TOKENS: 4096,
  TEMPERATURE: 0.2, // Low temperature for factual, deterministic structured outputs
};

/**
 * Returns true if the Gemini API key is configured in the environment.
 */
export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");
}
