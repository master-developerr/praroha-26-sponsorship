"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trophy, Award, TrendingUp, PhoneCall, CheckCircle2 } from "lucide-react";

interface PersonalPerformanceCardProps {
  clerkId: string;
  onOpenLeaderboard?: () => void;
}

export function PersonalPerformanceCard({
  clerkId,
  onOpenLeaderboard,
}: PersonalPerformanceCardProps) {
  const profile = useQuery(api.gamification.getUserPointsSummary, { clerkId });

  if (!profile) return null;

  const isTopThree = profile.rank <= 3;
  const rankColor =
    profile.rank === 1
      ? "text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/30"
      : profile.rank === 2
      ? "text-slate-700 dark:text-slate-300 bg-slate-500/10 border-slate-400/30"
      : profile.rank === 3
      ? "text-amber-900 dark:text-amber-400 bg-amber-700/10 border-amber-700/30"
      : "text-teal-700 dark:text-teal-400 bg-teal-500/10 border-teal-500/20";

  return (
    <div className="rounded-xl border border-border bg-surface p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3">
        {/* Rank Badge */}
        <div
          className={`h-9 w-9 rounded-xl border flex flex-col items-center justify-center shrink-0 font-black ${rankColor}`}
        >
          <span className="text-[10px] uppercase font-bold leading-none">Rank</span>
          <span className="text-sm leading-none mt-0.5">#{profile.rank}</span>
        </div>

        {/* User points & stats */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-text-primary">
              {profile.totalPoints} pts
            </span>
            <span className="text-[11px] text-text-muted">
              ({profile.rank} of {profile.totalVolunteers} volunteers)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-text-secondary mt-0.5">
            <span className="flex items-center gap-1">
              <PhoneCall className="h-3 w-3 text-primary" />
              {profile.callsLogged} calls
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              {profile.dealsWon} deals won
            </span>
          </div>
        </div>
      </div>

      {onOpenLeaderboard && (
        <button
          onClick={onOpenLeaderboard}
          className="px-3 py-1.5 rounded-lg border border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Trophy className="h-3.5 w-3.5 text-amber-500" />
          View Team Leaderboard
        </button>
      )}
    </div>
  );
}
