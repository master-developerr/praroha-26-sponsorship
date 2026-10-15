"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AlternativeAskResult, AlternativeItem } from "@/lib/ai/types";
import { formatCurrencyINR } from "@/lib/utils";
import {
  Sparkles,
  RefreshCw,
  AlertCircle,
  Gift,
  Coins,
  CheckCircle2,
  Layers,
  ArrowRight,
  PlusCircle,
} from "lucide-react";

interface AlternativeAskCardProps {
  company: any;
  volunteerId?: string;
  onSelectAlternative?: (item: AlternativeItem) => void;
}

export function AlternativeAskCard({
  company,
  volunteerId,
  onSelectAlternative,
}: AlternativeAskCardProps) {
  const [altData, setAltData] = useState<AlternativeAskResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [modelUsed, setModelUsed] = useState<string | null>(null);

  // Check Convex cache
  const cachedRecord = useQuery(
    api.ai.getCachedAnalysis,
    company?._id
      ? {
          companyId: company._id,
          type: "alternative_ask",
        }
      : "skip"
  );

  const saveMutation = useMutation(api.ai.saveAnalysis);
  const clearCacheMutation = useMutation(api.ai.clearAnalysisCache);

  useEffect(() => {
    if (cachedRecord?.result) {
      try {
        const parsed = JSON.parse(cachedRecord.result);
        setAltData(parsed);
        setModelUsed(cachedRecord.model);
        setIsFallback(cachedRecord.model === "local-operations-engine");
      } catch (err) {
        console.error("Failed to parse cached alternative ask:", err);
      }
    }
  }, [cachedRecord]);

  const fetchAlternatives = async (forceFresh = false) => {
    if (!company) return;
    setIsLoading(true);
    setError(null);

    try {
      if (forceFresh && company._id) {
        await clearCacheMutation({
          companyId: company._id,
          type: "alternative_ask",
        });
      }

      const res = await fetch("/api/ai/alternative-ask", {
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
        throw new Error(json.error || "Failed to generate alternative sponsorship asks.");
      }

      setAltData(json.data);
      setIsFallback(Boolean(json.isFallback));
      setModelUsed(json.modelUsed || "gemini");

      // Save to Convex persistent cache
      if (company._id) {
        await saveMutation({
          companyId: company._id,
          type: "alternative_ask",
          model: json.modelUsed || "gemini",
          promptVersion: json.promptVersion || "v1.0",
          inputHash: `${company._id}-${company.updatedAt || Date.now()}`,
          result: JSON.stringify(json.data),
          createdBy: volunteerId || "system",
        });
      }
    } catch (err: any) {
      console.error("[AlternativeAskCard] Error:", err);
      setError(err?.message || "Alternative sponsorship suggestions unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!altData && !isLoading && !cachedRecord) {
    return (
      <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 text-center space-y-3">
        <div className="inline-flex items-center justify-center p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
          <Gift className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-primary">
            Find Alternative (In-Kind) Sponsorship Asks
          </h4>
          <p className="text-xs text-text-muted max-w-md mx-auto mt-1">
            When {company.companyName} says &ldquo;We don&apos;t provide financial sponsorship&rdquo;, generate high-value non-cash proposals across 13 festival categories.
          </p>
        </div>

        <button
          onClick={() => fetchAlternatives(false)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Find Alternative Asks with AI
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface-subtle/40 p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Gift className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                In-Kind Partnership Alternatives
              </h4>
              {isFallback ? (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted">
                  Deterministic Portfolio
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300">
                  {modelUsed || "Gemini 2.5"}
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-muted">
              Pivots when financial budgets are frozen
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchAlternatives(true)}
          disabled={isLoading}
          title="Regenerate alternative asks"
          className="p-1.5 rounded-lg border border-border hover:bg-surface text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading && (
        <div className="space-y-3 py-4 animate-pulse">
          <div className="h-4 bg-border/40 rounded w-3/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="h-24 bg-border/20 rounded-lg"></div>
            <div className="h-24 bg-border/20 rounded-lg"></div>
          </div>
          <p className="text-xs text-center text-text-muted italic">
            Matching company capability with 13 PRAROHA'26 in-kind categories...
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => fetchAlternatives(false)}
              className="mt-1 text-teal-600 hover:underline font-semibold"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {altData && !isLoading && (
        <div className="space-y-3 text-xs">
          <p className="text-text-secondary italic">
            {altData.summary}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {altData.alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-surface p-3 space-y-2 hover:border-teal-500/30 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300">
                      {alt.category}
                    </span>
                    <h5 className="text-xs font-bold text-text-primary">
                      {alt.title}
                    </h5>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                      Est. {formatCurrencyINR(alt.estimatedValueINR)}
                    </span>
                    {onSelectAlternative && (
                      <button
                        onClick={() => onSelectAlternative(alt)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                      >
                        <PlusCircle className="h-3 w-3" />
                        Draft Proposal
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-text-secondary leading-relaxed">
                  {alt.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-border-subtle text-[11px]">
                  <div>
                    <strong className="text-text-primary font-semibold block">Value to PRAROHA:</strong>
                    <span className="text-text-muted">{alt.valueToPraroha}</span>
                  </div>
                  <div>
                    <strong className="text-text-primary font-semibold block">Company Feasibility:</strong>
                    <span className="text-text-muted">{alt.companyFeasibility}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
