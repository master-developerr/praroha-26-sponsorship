"use client";

import React from "react";
import { LeaderboardPodium } from "@/components/volunteer/LeaderboardPodium";
import { Trophy, Award } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 mb-1">
            <Trophy className="h-4 w-4" />
            <span>Honors & Gamification</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            PRAROHA'26 Volunteer Leaderboard
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time rankings based on completed outreach calls, qualified corporate interest, and secured sponsorships.
          </p>
        </div>
      </div>

      {/* Leaderboard Podium & Standings */}
      <LeaderboardPodium />
    </div>
  );
}
