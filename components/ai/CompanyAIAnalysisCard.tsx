"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CompanyAnalysisResult } from "@/lib/ai/types";
import { formatCurrencyINR } from "@/lib/utils";
import {
  Sparkles,
  RefreshCw,
  AlertCircle,
  Building2,
  TrendingUp,
  MapPin,
  GraduationCap,
  HardHat,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Coins,
} from "lucide-react";
import { PriorityBadge } from "@/components/ui/badge";

interface CompanyAIAnalysisCardProps {
  company: any;
  volunteerId?: string;
}

export function CompanyAIAnalysisCard({ company, volunteerId }: CompanyAIAnalysisCardProps) {
  const [analysis, setAnalysis] = useState<CompanyAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [modelUsed, setModelUsed] = useState<string | null>(null);

  // Check Convex cache for persisted analysis
  const cachedRecord = useQuery(
    api.ai.getCachedAnalysis,
    company?._id
      ? {
          companyId: company._id,
          type: "company_analysis",
        }
      : "skip"
  );

  const saveMutation = useMutation(api.ai.saveAnalysis);
  const clearCacheMutation = useMutation(api.ai.clearAnalysisCache);

  // Load from Convex cache if available
  useEffect(() => {
    if (cachedRecord?.result) {
      try {
        const parsed = JSON.parse(cachedRecord.result);
        setAnalysis(parsed);
        setModelUsed(cachedRecord.model);
        setIsFallback(cachedRecord.model === "local-operations-engine");
      } catch (err) {
        console.error("Failed to parse cached AI analysis:", err);
      }
    }
  }, [cachedRecord]);

  const fetchAnalysis = async (forceFresh = false) => {
    if (!company) return;
    setIsLoading(true);
    setError(null);

    try {
      if (forceFresh && company._id) {
        await clearCacheMutation({
          companyId: company._id,
          type: "company_analysis",
        });
      }

      const res = await fetch("/api/ai/company-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          forceFresh,
          volunteerId,
        }),
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || "Failed to generate AI analysis.");
      }

      setAnalysis(json.data);
      setIsFallback(Boolean(json.isFallback));
      setModelUsed(json.modelUsed || "gemini");

      // Save to Convex persistent cache
      if (company._id) {
        await saveMutation({
          companyId: company._id,
          type: "company_analysis",
          model: json.modelUsed || "gemini",
          promptVersion: json.promptVersion || "v1.0",
          inputHash: `${company._id}-${company.updatedAt || Date.now()}`,
          result: JSON.stringify(json.data),
          createdBy: volunteerId || "system",
        });
      }
    } catch (err: any) {
      console.error("[CompanyAIAnalysisCard] Error:", err);
      setError(err?.message || "AI analysis is temporarily unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  // If no analysis is loaded and not loading, show trigger prompt
  if (!analysis && !isLoading && !cachedRecord) {
    return (
      <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 text-center space-y-3">
        <div className="inline-flex items-center justify-center p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-primary">
            AI Strategic Company Intelligence
          </h4>
          <p className="text-xs text-text-muted max-w-md mx-auto mt-1">
            Synthesize civil engineering fit, regional Kerala presence, and tailored sponsorship ask ranges for {company.companyName}.
          </p>
        </div>

        <button
          onClick={() => fetchAnalysis(false)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Generate AI Company Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface-subtle/40 p-4 space-y-4">
      {/* Header with Title, Fit Meter, and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                AI Strategic Intelligence
              </h4>
              {isFallback ? (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted">
                  Deterministic Baseline
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300">
                  {modelUsed || "Gemini 2.5"}
                </span>
              )}
            </div>
            {analysis && (
              <p className="text-[11px] text-text-muted">
                Confidence rating: {Math.round(analysis.confidence * 100)}%
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {analysis && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border shadow-xs">
              <span className="text-[10px] text-text-muted font-semibold uppercase">Fit Score:</span>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                {analysis.companyFitScore}/100
              </span>
            </div>
          )}

          <button
            onClick={() => fetchAnalysis(true)}
            disabled={isLoading}
            title="Regenerate analysis with fresh reasoning"
            className="p-1.5 rounded-lg border border-border hover:bg-surface text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3 py-4 animate-pulse">
          <div className="h-4 bg-border/40 rounded w-3/4"></div>
          <div className="h-3 bg-border/30 rounded w-1/2"></div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="h-20 bg-border/20 rounded-lg"></div>
            <div className="h-20 bg-border/20 rounded-lg"></div>
          </div>
          <p className="text-xs text-center text-text-muted italic pt-2">
            Synthesizing PRAROHA'26 alignment parameters...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => fetchAnalysis(false)}
              className="mt-1 text-teal-600 hover:underline font-semibold"
            >
              Retry AI Analysis
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {analysis && !isLoading && (
        <div className="space-y-4 text-xs">
          {/* Key Relevance Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="rounded-lg border border-border bg-surface p-2.5 space-y-1">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                <HardHat className="h-3 w-3 text-amber-500" />
                Civil Synergy
              </span>
              <p className="text-text-secondary leading-relaxed">
                {analysis.civilEngineeringRelevance}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface p-2.5 space-y-1">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                <MapPin className="h-3 w-3 text-red-500" />
                Kerala Relevance
              </span>
              <p className="text-text-secondary leading-relaxed">
                {analysis.keralaRelevance}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface p-2.5 space-y-1">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="h-3 w-3 text-teal-500" />
                Student Demographics
              </span>
              <p className="text-text-secondary leading-relaxed">
                {analysis.studentAudienceFit}
              </p>
            </div>
          </div>

          {/* Recommended Ask Tier Box */}
          {analysis.recommendedAsk && (
            <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-teal-700 dark:text-teal-300 font-bold uppercase tracking-wider block">
                  Recommended Package Ask
                </span>
                <span className="text-sm font-bold text-text-primary">
                  {analysis.recommendedAsk.tier} Tier •{" "}
                  {formatCurrencyINR(analysis.recommendedAsk.minAmount)} –{" "}
                  {formatCurrencyINR(analysis.recommendedAsk.maxAmount)}
                </span>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {analysis.recommendedAsk.rationale}
                </p>
              </div>

              {analysis.recommendedContactDepartment && (
                <div className="text-right">
                  <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider block">
                    Target Department
                  </span>
                  <span className="text-xs font-semibold text-text-secondary">
                    {analysis.recommendedContactDepartment.join(", ")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Why This Company & Potential Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-text-muted" />
                Why Target This Company
              </span>
              <ul className="space-y-1">
                {analysis.whyThisCompany.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-text-secondary">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-text-muted" />
                Value Delivered to Sponsor
              </span>
              <ul className="space-y-1">
                {analysis.potentialBenefitsToCompany.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-text-secondary">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Tactical Approach */}
          {analysis.recommendedApproach && analysis.recommendedApproach.length > 0 && (
            <div className="pt-2 border-t border-border-subtle space-y-1.5">
              <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-text-muted" />
                Tactical Outreach Approach
              </span>
              <ul className="space-y-1">
                {analysis.recommendedApproach.map((appr, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-text-secondary">
                    <ArrowRight className="h-3 w-3 text-teal-600 shrink-0 mt-0.5" />
                    <span>{appr}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
