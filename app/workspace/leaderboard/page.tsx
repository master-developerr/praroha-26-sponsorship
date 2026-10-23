"use client";

import React from "react";
import { LeaderboardPodium } from "@/components/volunteer/LeaderboardPodium";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      {/* Editorial Page Header matching Admin Control Room */}
      <header className="border-b border-border pb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            TEAM PERFORMANCE
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-text-primary sm:text-4xl">
            Volunteer Honors & Outreach Leaderboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            Real-time standings based on completed corporate calls, verified debriefs, and confirmed sponsorship commitments for PRAROHA&apos;26.
          </p>
          <p className="mt-3 text-[11px] font-medium text-text-muted">
            DEC 04-05 · Division of Civil Engineering · Cochin University of Science and Technology (CUSAT)
          </p>
        </div>
      </header>

      {/* Leaderboard Table Surface */}
      <LeaderboardPodium />
    </div>
  );
}
