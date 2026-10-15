import crypto from "crypto";
import { AI_CONFIG, isGeminiConfigured } from "./config";
import { callGeminiStructured } from "./gemini";
import {
  companyAnalysisSchema,
  callPreparationSchema,
  alternativeAskSchema,
  callDebriefSchema,
  leadPrioritySchema,
} from "./schemas";
import {
  buildCompanyAnalysisPrompt,
  COMPANY_ANALYSIS_PROMPT_VERSION,
} from "./prompts/companyAnalysis";
import {
  buildCallPreparationPrompt,
  CALL_PREPARATION_PROMPT_VERSION,
} from "./prompts/callPreparation";
import {
  buildAlternativeAskPrompt,
  ALTERNATIVE_ASK_PROMPT_VERSION,
} from "./prompts/alternativeAsk";
import {
  buildCallDebriefPrompt,
  CALL_DEBRIEF_PROMPT_VERSION,
  DebriefAnalysisInput,
} from "./prompts/callDebrief";
import {
  buildLeadPrioritizationPrompt,
  LEAD_PRIORITIZATION_PROMPT_VERSION,
  LeadPrioritizationPromptInput,
} from "./prompts/leadPrioritization";
import {
  CompanyAnalysisResult,
  CallPreparationResult,
  AlternativeAskResult,
  CallDebriefAnalysisResult,
  LeadPriorityResult,
  AIServiceResponse,
} from "./types";
import {
  getFallbackCompanyAnalysis,
  getFallbackCallPreparation,
  getFallbackAlternativeAsk,
  getFallbackCallDebrief,
  getFallbackLeadPrioritization,
} from "./fallback";

/**
 * Reusable AI Service Abstraction for PRAROHA'26.
 * The application depends on AIService rather than calling Gemini or SDKs directly.
 * Allows swapping AI providers or testing offline without breaking business workflows.
 */
export interface AIService {
  generateCompanyAnalysis(
    company: any,
    options?: { forceFresh?: boolean; volunteerId?: string }
  ): Promise<AIServiceResponse<CompanyAnalysisResult>>;

  prepareCall(
    company: any,
    options?: { forceFresh?: boolean; volunteerId?: string }
  ): Promise<AIServiceResponse<CallPreparationResult>>;

  generateAlternativeAsk(
    company: any,
    options?: { forceFresh?: boolean; volunteerId?: string }
  ): Promise<AIServiceResponse<AlternativeAskResult>>;

  analyzeCallDebrief(
    input: DebriefAnalysisInput,
    options?: { volunteerId?: string }
  ): Promise<AIServiceResponse<CallDebriefAnalysisResult>>;

  prioritizeLead(
    company: any,
    options?: { forceFresh?: boolean }
  ): Promise<AIServiceResponse<LeadPriorityResult>>;
}

/**
 * Computes a deterministic SHA-256 fingerprint for caching.
 */
export function computeInputHash(data: unknown): string {
  const normalized = JSON.stringify(data, Object.keys(data as any).sort());
  return crypto.createHash("sha256").update(normalized).digest("hex").slice(0, 16);
}

/**
 * Google Gemini implementation of the AIService with operations-first resilience.
 */
export class GeminiAIService implements AIService {
  private modelName: string;

  constructor(modelName: string = AI_CONFIG.MODEL_NAME) {
    this.modelName = modelName;
  }

  /**
   * 1. Company Intelligence Analysis
   */
  async generateCompanyAnalysis(
    company: any,
    options?: { forceFresh?: boolean; volunteerId?: string }
  ): Promise<AIServiceResponse<CompanyAnalysisResult>> {
    const promptVersion = COMPANY_ANALYSIS_PROMPT_VERSION;
    const timestamp = Date.now();

    // Check if Gemini API is available
    if (!isGeminiConfigured()) {
      console.warn("[Gemini AI] GEMINI_API_KEY is not configured. Running Operations-First Fallback.");
      return {
        success: true,
        data: getFallbackCompanyAnalysis(company),
        isFallback: true,
        modelUsed: "local-operations-engine",
        promptVersion,
        timestamp,
      };
    }

    try {
      const prompt = buildCompanyAnalysisPrompt(company);
      const data = await callGeminiStructured<CompanyAnalysisResult>(
        prompt,
        companyAnalysisSchema,
        { model: this.modelName }
      );

      return {
        success: true,
        data,
        isFallback: false,
        modelUsed: this.modelName,
        promptVersion,
        timestamp,
      };
    } catch (err: any) {
      console.error("[Gemini AI] generateCompanyAnalysis failed, falling back:", err?.message);
      return {
        success: true,
        data: getFallbackCompanyAnalysis(company),
        isFallback: true,
        error: `AI provider error: ${err?.message}. Operating in high-reliability fallback mode.`,
        modelUsed: "local-operations-engine",
        promptVersion,
        timestamp,
      };
    }
  }

  /**
   * 2. Live Call Preparation (Concise Glanceable Bullets)
   */
  async prepareCall(
    company: any,
    options?: { forceFresh?: boolean; volunteerId?: string }
  ): Promise<AIServiceResponse<CallPreparationResult>> {
    const promptVersion = CALL_PREPARATION_PROMPT_VERSION;
    const timestamp = Date.now();

    if (!isGeminiConfigured()) {
      return {
        success: true,
        data: getFallbackCallPreparation(company),
        isFallback: true,
        modelUsed: "local-operations-engine",
        promptVersion,
        timestamp,
      };
    }

    try {
      const prompt = buildCallPreparationPrompt(company);
      const data = await callGeminiStructured<CallPreparationResult>(
        prompt,
        callPreparationSchema,
        { model: this.modelName }
      );

      return {
        success: true,
        data,
        isFallback: false,
        modelUsed: this.modelName,
        promptVersion,
        timestamp,
      };
    } catch (err: any) {
      console.error("[Gemini AI] prepareCall failed, falling back:", err?.message);
      return {
        success: true,
        data: getFallbackCallPreparation(company),
        isFallback: true,
        error: `AI provider error: ${err?.message}. Operating in high-reliability fallback mode.`,
        modelUsed: "local-operations-engine",
        promptVersion,
        timestamp,
      };
    }
  }

  /**
   * 3. Alternative Sponsorship Ask (13 Non-Cash Categories)
   */
  async generateAlternativeAsk(
    company: any,
    options?: { forceFresh?: boolean; volunteerId?: string }
  ): Promise<AIServiceResponse<AlternativeAskResult>> {
    const promptVersion = ALTERNATIVE_ASK_PROMPT_VERSION;
    const timestamp = Date.now();

    if (!isGeminiConfigured()) {
      return {
        success: true,
        data: getFallbackAlternativeAsk(company),
        isFallback: true,
        modelUsed: "local-operations-engine",
        promptVersion,
        timestamp,
      };
    }

    try {
      const prompt = buildAlternativeAskPrompt(company);
      const data = await callGeminiStructured<AlternativeAskResult>(
        prompt,
        alternativeAskSchema,
        { model: this.modelName }
      );

      return {
        success: true,
        data,
        isFallback: false,
        modelUsed: this.modelName,
        promptVersion,
        timestamp,
      };
    } catch (err: any) {
      console.error("[Gemini AI] generateAlternativeAsk failed, falling back:", err?.message);
      return {
        success: true,
        data: getFallbackAlternativeAsk(company),
        isFallback: true,
        error: `AI provider error: ${err?.message}. Operating in high-reliability fallback mode.`,
        modelUsed: "local-operations-engine",
        promptVersion,
        timestamp,
      };
    }
  }

  /**
   * 4. Call Debrief Analysis & Coaching
   */
  async analyzeCallDebrief(
    input: DebriefAnalysisInput,
    options?: { volunteerId?: string }
  ): Promise<AIServiceResponse<CallDebriefAnalysisResult>> {
    const promptVersion = CALL_DEBRIEF_PROMPT_VERSION;
    const timestamp = Date.now();

    if (!isGeminiConfigured()) {
      return {
        success: true,
        data: getFallbackCallDebrief(input),
        isFallback: true,
        modelUsed: "local-operations-engine",
        promptVersion,
        timestamp,
      };
    }

    try {
      const prompt = buildCallDebriefPrompt(input);
      const data = await callGeminiStructured<CallDebriefAnalysisResult>(
        prompt,
        callDebriefSchema,
        { model: this.modelName }
      );

      return {
        success: true,
        data,
        isFallback: false,
        modelUsed: this.modelName,
        promptVersion,
        timestamp,
      };
    } catch (err: any) {
      console.error("[Gemini AI] analyzeCallDebrief failed, falling back:", err?.message);
      return {
        success: true,
        data: getFallbackCallDebrief(input),
        isFallback: true,
        error: `AI provider error: ${err?.message}. Operating in high-reliability fallback mode.`,
        modelUsed: "local-operations-engine",
        promptVersion,
        timestamp,
      };
    }
  }

  /**
   * 5. Lead Prioritization Explanation
   */
  async prioritizeLead(
    company: any,
    options?: { forceFresh?: boolean }
  ): Promise<AIServiceResponse<LeadPriorityResult>> {
    const promptVersion = LEAD_PRIORITIZATION_PROMPT_VERSION;
    const timestamp = Date.now();

    const fallbackBaseline = getFallbackLeadPrioritization(company);

    if (!isGeminiConfigured()) {
      return {
        success: true,
        data: fallbackBaseline,
        isFallback: true,
        modelUsed: "local-operations-engine",
        promptVersion,
        timestamp,
      };
    }

    try {
      const promptInput: LeadPrioritizationPromptInput = {
        companyName: company.companyName,
        industry: company.industry,
        niche: company.niche,
        priority: company.priority,
        leadScore: company.leadScore,
        keralaPresence: company.keralaPresence,
        sponsorshipHistory: company.sponsorshipHistory,
        primaryContactName: company.primaryContactName,
        primaryContactDesignation: company.primaryContactDesignation,
        contactVerificationLevel: company.contactVerificationLevel,
        calculatedScore: fallbackBaseline.priorityScore,
        calculatedLevel: fallbackBaseline.priorityLevel,
        deterministicFactors: fallbackBaseline.deterministicFactors,
      };

      const prompt = buildLeadPrioritizationPrompt(promptInput);
      const data = await callGeminiStructured<LeadPriorityResult>(
        prompt,
        leadPrioritySchema,
        { model: this.modelName }
      );

      return {
        success: true,
        data,
        isFallback: false,
        modelUsed: this.modelName,
        promptVersion,
        timestamp,
      };
    } catch (err: any) {
      console.error("[Gemini AI] prioritizeLead failed, falling back:", err?.message);
      return {
        success: true,
        data: fallbackBaseline,
        isFallback: true,
        error: `AI provider error: ${err?.message}. Operating in high-reliability fallback mode.`,
        modelUsed: "local-operations-engine",
        promptVersion,
        timestamp,
      };
    }
  }
}

/**
 * Singleton instance of AIService for application consumption.
 */
export const aiService: AIService = new GeminiAIService();
