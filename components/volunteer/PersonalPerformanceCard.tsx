"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trophy, PhoneCall, CheckCircle2 } from "lucide-react";

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

  const rankColor =
    profile.rank === 1
      ? "text-warning bg-accent-yellow border-warning/30"
      : profile.rank === 2
        ? "text-text-secondary bg-surface-subtle border-border"
        : profile.rank === 3
          ? "text-warning bg-accent-yellow border-warning/30"
          : "text-accent-mint-text bg-accent-mint border-primary/20";

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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-sm text-text-primary tabular-nums">
              {profile.totalPoints} pts
            </span>
            <span className="text-[11px] text-text-muted">
              ({profile.rank} of {profile.totalVolunteers} volunteers)
            </span>
            {profile.rank === 1 && (
              <span className="rounded-full bg-accent-yellow border border-warning/25 px-2 py-0.2 text-[10px] font-black text-accent-yellow-text">
                Podium Leader 👑
              </span>
            )}
            {profile.dealsWon > 0 && profile.rank > 1 && (
              <span className="rounded-full bg-accent-mint border border-primary/20 px-2 py-0.2 text-[10px] font-bold text-success tabular-nums">
                {profile.dealsWon} Deals Won 🏆
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-text-secondary mt-0.5">
            <span className="flex items-center gap-1">
              <PhoneCall className="h-3 w-3 text-primary" />
              {profile.callsLogged} calls
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-success" />
              {profile.dealsWon} deals won
            </span>
          </div>
        </div>
      </div>

      {onOpenLeaderboard && (
        <button
          onClick={onOpenLeaderboard}
          className="px-3 py-1.5 rounded-md border border-primary/25 bg-accent-mint hover:bg-accent-mint/70 text-accent-mint-text font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Trophy className="h-3.5 w-3.5 text-amber-500" />
          View Team Leaderboard
        </button>
      )}
    </div>
  );
}
