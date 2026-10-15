"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CallPreparationResult } from "@/lib/ai/types";
import {
  Sparkles,
  RefreshCw,
  AlertCircle,
  PhoneCall,
  Target,
  MessageSquare,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Gift,
  CheckCircle2,
} from "lucide-react";

interface CallPreparationCardProps {
  company: any;
  volunteerId?: string;
  compact?: boolean;
}

export function CallPreparationCard({
  company,
  volunteerId,
  compact = false,
}: CallPreparationCardProps) {
  const [prep, setPrep] = useState<CallPreparationResult | null>(null);
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
          type: "call_prep",
        }
      : "skip"
  );

  const saveMutation = useMutation(api.ai.saveAnalysis);
  const clearCacheMutation = useMutation(api.ai.clearAnalysisCache);

  useEffect(() => {
    if (cachedRecord?.result) {
      try {
        const parsed = JSON.parse(cachedRecord.result);
        setPrep(parsed);
        setModelUsed(cachedRecord.model);
        setIsFallback(cachedRecord.model === "local-operations-engine");
      } catch (err) {
        console.error("Failed to parse cached call prep:", err);
      }
    }
  }, [cachedRecord]);

  const fetchPrep = async (forceFresh = false) => {
    if (!company) return;
    setIsLoading(true);
    setError(null);

    try {
      if (forceFresh && company._id) {
        await clearCacheMutation({
          companyId: company._id,
          type: "call_prep",
        });
      }

      const res = await fetch("/api/ai/call-prep", {
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
        throw new Error(json.error || "Failed to generate live call briefing.");
      }

      setPrep(json.data);
      setIsFallback(Boolean(json.isFallback));
      setModelUsed(json.modelUsed || "gemini");

      // Save to Convex persistent cache
      if (company._id) {
        await saveMutation({
          companyId: company._id,
          type: "call_prep",
          model: json.modelUsed || "gemini",
          promptVersion: json.promptVersion || "v1.0",
          inputHash: `${company._id}-${company.updatedAt || Date.now()}`,
          result: JSON.stringify(json.data),
          createdBy: volunteerId || "system",
        });
      }
    } catch (err: any) {
      console.error("[CallPreparationCard] Error:", err);
      setError(err?.message || "Call preparation is temporarily unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!prep && !isLoading && !cachedRecord) {
    return (
      <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 text-center space-y-3">
        <div className="inline-flex items-center justify-center p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
          <PhoneCall className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-primary">
            AI Live Call Preparation Battlecard
          </h4>
          <p className="text-xs text-text-muted max-w-md mx-auto mt-1">
            Generate rapid, glanceable talking points, opening angle, objection counter-phrases, and in-kind pivots tailored for {company.companyName}.
          </p>
        </div>

        <button
          onClick={() => fetchPrep(false)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Prepare for Call with AI
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
            <PhoneCall className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Live Call Battlecard
              </h4>
              {isFallback ? (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted">
                  Deterministic Rapid Brief
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300">
                  {modelUsed || "Gemini 2.5"}
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-muted">
              Glanceable bullets for live phone conversation
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchPrep(true)}
          disabled={isLoading}
          title="Regenerate call prep"
          className="p-1.5 rounded-lg border border-border hover:bg-surface text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading && (
        <div className="space-y-3 py-4 animate-pulse">
          <div className="h-4 bg-border/40 rounded w-2/3"></div>
          <div className="h-16 bg-border/20 rounded-lg"></div>
          <div className="h-16 bg-border/20 rounded-lg"></div>
          <p className="text-xs text-center text-text-muted italic">
            Structuring live call brief and tactical counter-phrases...
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => fetchPrep(false)}
              className="mt-1 text-teal-600 hover:underline font-semibold"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {prep && !isLoading && (
        <div className="space-y-3 text-xs">
          {/* Call Objective & Opening Angle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-surface p-3 space-y-1.5">
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1">
                <Target className="h-3 w-3" />
                Call Objective
              </span>
              <ul className="space-y-1">
                {prep.callObjective.map((obj, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-text-secondary">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-surface p-3 space-y-1.5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                Opening Angle
              </span>
              <ul className="space-y-1">
                {prep.openingAngle.map((angle, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-text-secondary font-medium">
                    <span className="text-primary font-bold">›</span>
                    <span>{angle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Talking Points & What to Ask */}
          <div className="rounded-lg border border-border bg-surface p-3 space-y-2">
            <span className="text-[10px] font-bold text-text-primary uppercase tracking-wider block">
              Key Talking Points & Ask
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-text-muted font-semibold block">FESTIVAL STATURE:</span>
                <ul className="space-y-1">
                  {prep.keyTalkingPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-text-secondary">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-text-muted font-semibold block">DIRECT QUESTIONS TO ASK:</span>
                <ul className="space-y-1">
                  {prep.whatToAsk.map((q, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-text-secondary italic">
                      <span className="text-amber-500 font-bold">?</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Likely Objections & How to Respond */}
          {prep.likelyObjections && prep.likelyObjections.length > 0 && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 space-y-2">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5" />
                Live Objection Counter-Strategies
              </span>
              <div className="space-y-2">
                {prep.likelyObjections.map((item, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-md bg-surface border border-amber-500/20 space-y-1"
                  >
                    <div className="font-semibold text-text-primary text-[11px] flex items-center gap-1">
                      <span className="text-red-500 font-bold">IF:</span> &ldquo;{item.objection}&rdquo;
                    </div>
                    <div className="text-text-secondary text-[11px] pl-3 border-l-2 border-teal-500/50">
                      <span className="text-teal-600 dark:text-teal-400 font-semibold mr-1">RESPOND:</span>
                      {item.howToRespond}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In-Kind Fallback & Next Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prep.alternativeRequests && prep.alternativeRequests.length > 0 && (
              <div className="rounded-lg border border-border bg-surface p-2.5 space-y-1">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                  <Gift className="h-3 w-3 text-purple-500" />
                  If They Reject Cash (Pivots)
                </span>
                <ul className="space-y-0.5">
                  {prep.alternativeRequests.map((alt, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-text-secondary">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{alt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {prep.nextStep && prep.nextStep.length > 0 && (
              <div className="rounded-lg border border-border bg-surface p-2.5 space-y-1">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  Next Immediate Action
                </span>
                <ul className="space-y-0.5">
                  {prep.nextStep.map((step, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-text-secondary">
                      <ArrowRight className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
