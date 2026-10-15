"use client";

import React, { useState } from "react";
import { CallDebriefAnalysisResult } from "@/lib/ai/types";
import {
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";

interface DebriefAnalysisCardProps {
  companyName: string;
  industry: string;
  leadStatus: string;
  discussionSummary: string;
  debriefTranscript?: string;
  primaryObjection?: string;
  onApplySuggestions?: (result: CallDebriefAnalysisResult) => void;
}

export function DebriefAnalysisCard({
  companyName,
  industry,
  leadStatus,
  discussionSummary,
  debriefTranscript,
  primaryObjection,
  onApplySuggestions,
}: DebriefAnalysisCardProps) {
  const [analysis, setAnalysis] = useState<CallDebriefAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [modelUsed, setModelUsed] = useState<string | null>(null);

  const runAnalysis = async () => {
    if (!discussionSummary.trim() && !debriefTranscript?.trim()) {
      setError("Please write brief call discussion notes before analyzing.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/call-debrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: {
            companyName,
            industry,
            leadStatus,
            discussionSummary,
            debriefTranscript,
            primaryObjection,
          },
        }),
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || "Failed to analyze call debrief.");
      }

      setAnalysis(json.data);
      setIsFallback(Boolean(json.isFallback));
      setModelUsed(json.modelUsed || "gemini");
    } catch (err: any) {
      console.error("[DebriefAnalysisCard] Error:", err);
      setError(err?.message || "Debrief analysis unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!analysis && !isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-teal-500/30 bg-teal-500/5 p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span className="text-xs text-text-secondary">
            Let AI analyze your call notes for signals, outcome detection, and coaching tips.
          </span>
        </div>
        <button
          type="button"
          onClick={runAnalysis}
          disabled={!discussionSummary.trim()}
          className="px-3 py-1.5 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="h-3 w-3" />
          Analyze Debrief with AI
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3.5 space-y-3 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span className="font-bold text-text-primary uppercase tracking-wider text-[11px]">
            AI Debrief Intelligence
          </span>
          {isFallback ? (
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-surface border border-border text-text-muted">
              Deterministic Review
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-medium">
              {modelUsed || "Gemini 2.5"}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={runAnalysis}
          disabled={isLoading}
          className="text-text-muted hover:text-text-primary p-1 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading && (
        <div className="space-y-2 py-2 animate-pulse">
          <div className="h-3 bg-border/40 rounded w-1/2"></div>
          <div className="h-3 bg-border/30 rounded w-3/4"></div>
          <p className="text-[11px] text-text-muted italic">
            Evaluating discussion signals and next recommended actions...
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-red-500 text-xs flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {analysis && !isLoading && (
        <div className="space-y-3">
          {/* Detected Outcome & Interest Meter */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-surface border border-border">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted font-bold uppercase">Detected:</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                {analysis.detectedOutcome}
              </span>
              <span className="text-[10px] text-text-muted">• Interest:</span>
              <span className="font-semibold text-text-primary">{analysis.interestLevel}</span>
            </div>

            {onApplySuggestions && (
              <button
                type="button"
                onClick={() => onApplySuggestions(analysis)}
                className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="h-3 w-3" />
                Apply AI Suggestions
              </button>
            )}
          </div>

          {/* Signals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analysis.positiveSignals.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 uppercase">
                  <ThumbsUp className="h-3 w-3" />
                  Positive Signals
                </span>
                <ul className="space-y-0.5">
                  {analysis.positiveSignals.map((sig, i) => (
                    <li key={i} className="text-[11px] text-text-secondary flex items-start gap-1">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.negativeSignals.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 uppercase">
                  <TrendingDown className="h-3 w-3" />
                  Risk / Friction Points
                </span>
                <ul className="space-y-0.5">
                  {analysis.negativeSignals.map((sig, i) => (
                    <li key={i} className="text-[11px] text-text-secondary flex items-start gap-1">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Coaching & Next Action */}
          <div className="pt-2 border-t border-border-subtle space-y-1">
            <span className="text-[10px] font-bold text-text-primary uppercase tracking-wider block">
              Recommended Next Action
            </span>
            <p className="text-[11px] text-text-secondary font-medium">
              {analysis.recommendedNextAction}
            </p>
          </div>

          {analysis.followUpSuggestion && (
            <div className="flex items-center gap-2 p-1.5 rounded bg-surface/80 border border-border text-[11px] text-text-secondary">
              <Calendar className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>
                Callback in <strong>{analysis.followUpSuggestion.recommendedDaysFromNow} days</strong> ({analysis.followUpSuggestion.priority} priority): {analysis.followUpSuggestion.notes}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
