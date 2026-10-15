"use client";

import React, { useState } from "react";
import { LeadPriorityResult } from "@/lib/ai/types";
import {
  Sparkles,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  HardHat,
  MapPin,
  GraduationCap,
  Building2,
  ArrowRight,
} from "lucide-react";

interface LeadPriorityExplainerProps {
  company: any;
}

export function LeadPriorityExplainer({ company }: LeadPriorityExplainerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<LeadPriorityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = async () => {
    if (data) {
      setIsOpen(!isOpen);
      return;
    }

    setIsOpen(true);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/lead-priority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || "Failed to explain lead priority.");
      }

      setData(json.data);
    } catch (err: any) {
      console.error("[LeadPriorityExplainer] Error:", err);
      setError(err?.message || "Failed to load priority breakdown.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={fetchExplanation}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-[10px] font-bold transition-colors cursor-pointer"
        title="View AI Priority Explanation & Factor Breakdown"
      >
        <Sparkles className="h-3 w-3" />
        <span>Priority Rationale</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 left-0 w-80 sm:w-96 rounded-xl border border-border bg-surface p-3.5 shadow-xl text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span className="font-bold text-text-primary uppercase tracking-wider text-[11px]">
                Priority Scoring Analysis
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-text-primary text-[11px] font-bold p-0.5"
            >
              ✕
            </button>
          </div>

          {isLoading && (
            <div className="py-4 text-center space-y-2 animate-pulse">
              <div className="h-3 bg-border/40 rounded w-2/3 mx-auto"></div>
              <div className="h-2 bg-border/30 rounded w-1/2 mx-auto"></div>
              <p className="text-[10px] text-text-muted italic">Computing scoring baseline...</p>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {data && !isLoading && (
            <div className="space-y-3">
              {/* Score header */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-teal-500/5 border border-teal-500/20">
                <div>
                  <span className="text-[10px] text-text-muted font-bold uppercase block">
                    Calculated Level
                  </span>
                  <span className="text-sm font-extrabold text-teal-700 dark:text-teal-300">
                    {data.priorityLevel} PRIORITY ({data.priorityScore}/100)
                  </span>
                </div>
                <TrendingUp className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>

              {/* Factors grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-1.5 rounded bg-surface-subtle border border-border">
                  <span className="text-text-muted block text-[10px]">Industry Synergies</span>
                  <strong className="text-text-primary font-bold">
                    {data.deterministicFactors.industryRelevance} / 30
                  </strong>
                </div>
                <div className="p-1.5 rounded bg-surface-subtle border border-border">
                  <span className="text-text-muted block text-[10px]">Civil Alignment</span>
                  <strong className="text-text-primary font-bold">
                    {data.deterministicFactors.civilEngineeringFit} / 25
                  </strong>
                </div>
                <div className="p-1.5 rounded bg-surface-subtle border border-border">
                  <span className="text-text-muted block text-[10px]">Kerala Footprint</span>
                  <strong className="text-text-primary font-bold">
                    {data.deterministicFactors.keralaPresence} / 25
                  </strong>
                </div>
                <div className="p-1.5 rounded bg-surface-subtle border border-border">
                  <span className="text-text-muted block text-[10px]">Student Audience</span>
                  <strong className="text-text-primary font-bold">
                    {data.deterministicFactors.studentAudienceFit} / 20
                  </strong>
                </div>
              </div>

              {/* Why bullets */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-text-primary uppercase tracking-wider block">
                  Why Contact This Lead
                </span>
                <ul className="space-y-1">
                  {data.reasons.map((r, i) => (
                    <li key={i} className="text-[11px] text-text-secondary flex items-start gap-1.5">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Action */}
              <div className="pt-2 border-t border-border-subtle text-[11px]">
                <strong className="text-text-primary font-semibold block mb-0.5">
                  Recommended Immediate Step:
                </strong>
                <p className="text-text-secondary flex items-start gap-1">
                  <ArrowRight className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{data.nextRecommendedAction}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
