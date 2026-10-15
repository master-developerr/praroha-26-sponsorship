"use client";

import React, { Suspense, useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/components/providers/AuthProvider";
import {
  Trophy,
  Award,
  Medal,
  Crown,
  PhoneCall,
  CheckCircle2,
  TrendingUp,
  Settings,
  ShieldCheck,
  Search,
  Sliders,
  Calendar,
  Sparkles,
  Users,
} from "lucide-react";
import { formatCurrencyINR } from "@/lib/utils";
import { AdjustPointsModal } from "@/components/admin/AdjustPointsModal";
import { PointConfigDrawer } from "@/components/admin/PointConfigDrawer";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

type TimeframeOption = "today" | "this_week" | "this_month" | "all_time";

function HonorsLeaderboardContent() {
  const { user } = useAuthUser();
  const [timeframe, setTimeframe] = useState<TimeframeOption>("all_time");
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false);
  const [selectedUserForAdjustment, setSelectedUserForAdjustment] = useState<{
    _id: Id<"users">;
    name: string;
    totalPoints: number;
    department?: string;
  } | null>(null);

  // Live Convex query using timeframe
  const leaderboard = useQuery(api.gamification.getLeaderboard, { timeframe });
  const pointConfigs = useQuery(api.gamification.getPointConfigurations);

  const filteredLeaderboard = useMemo(() => {
    if (!leaderboard) return [];
    if (!searchQuery.trim()) return leaderboard;
    const q = searchQuery.toLowerCase().trim();
    return leaderboard.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        (v.department && v.department.toLowerCase().includes(q)) ||
        (v.semester && v.semester.toLowerCase().includes(q))
    );
  }, [leaderboard, searchQuery]);

  const topThree = useMemo(() => {
    return filteredLeaderboard.slice(0, 3);
  }, [filteredLeaderboard]);

  // Aggregate stats
  const aggregateStats = useMemo(() => {
    if (!leaderboard) return { totalPoints: 0, totalCalls: 0, totalDeals: 0, activeVolunteers: 0 };
    return {
      totalPoints: leaderboard.reduce((acc, v) => acc + (v.totalPoints || 0), 0),
      totalCalls: leaderboard.reduce((acc, v) => acc + (v.callsCount || 0), 0),
      totalDeals: leaderboard.reduce((acc, v) => acc + (v.dealsWonCount || 0), 0),
      activeVolunteers: leaderboard.length,
    };
  }, [leaderboard]);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 text-[10px] font-bold">
              P3 TEAM MANAGEMENT & GAMIFICATION
            </span>
            <span className="text-xs text-text-muted">PRAROHA'26 SOE CUSAT</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            Honors Leaderboard & SDR Rankings
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time student volunteer outreach ranking podium, conversion telemetry, and gamification point ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe Switcher */}
          <div className="flex rounded-xl border border-border bg-surface p-1 shadow-2xs">
            {(
              [
                { label: "Today", value: "today" },
                { label: "This Week", value: "this_week" },
                { label: "This Month", value: "this_month" },
                { label: "All Time", value: "all_time" },
              ] as const
            ).map((t) => (
              <button
                key={t.value}
                onClick={() => setTimeframe(t.value)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  timeframe === t.value
                    ? "bg-primary text-white shadow-xs font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Configure Point Rules */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConfigDrawerOpen(true)}
            className="h-8 gap-1.5 text-xs font-bold border-primary/30 text-primary hover:bg-primary/5"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Point Rules</span>
          </Button>
        </div>
      </div>

      {/* 2. Aggregate KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="Total Points Awarded"
          value={aggregateStats.totalPoints.toLocaleString()}
          change="Across all verified SDRs"
          icon={Award}
        />
        <StatCard
          title="Outreach Calls Completed"
          value={aggregateStats.totalCalls.toLocaleString()}
          change={`In ${timeframe.replace("_", " ")}`}
          icon={PhoneCall}
        />
        <StatCard
          title="Confirmed Deals Won"
          value={aggregateStats.totalDeals.toLocaleString()}
          change="Ratified corporate commitments"
          icon={Trophy}
        />
        <StatCard
          title="Active SDR Volunteers"
          value={aggregateStats.activeVolunteers.toLocaleString()}
          change="Approved outreach committee"
          icon={Users}
        />
      </div>

      {/* 3. Top 3 Podium Cards */}
      {topThree.length > 0 && (
        <div className="rounded-2xl border border-border bg-gradient-to-b from-surface to-surface-subtle p-6 shadow-xs">
          <div className="text-center mb-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-700 dark:text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
              PRAROHA'26 TOP PERFORMERS
            </span>
            <h3 className="text-lg font-black text-text-primary mt-2">
              Outreach Honors Podium
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Top SDR volunteers recognized for exceptional lead generation and deal velocity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto items-end">
            {/* Rank #2 - Silver */}
            {topThree[1] && (
              <div className="order-2 md:order-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-surface p-4 text-center space-y-3 shadow-xs hover:border-zinc-300 transition-all">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 shadow-2xs">
                  <Medal className="h-6 w-6 text-zinc-500" />
                </div>
                <div>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-extrabold text-zinc-700 uppercase">
                    Rank #2 • Silver
                  </span>
                  <h4 className="font-bold text-sm text-text-primary mt-1 line-clamp-1">
                    {topThree[1].name}
                  </h4>
                  <p className="text-[11px] text-text-secondary">
                    {topThree[1].department} {topThree[1].semester ? `• Sem ${topThree[1].semester}` : ""}
                  </p>
                </div>
                <div className="pt-2 border-t border-border-subtle flex justify-around text-xs">
                  <div>
                    <span className="text-[10px] text-text-muted block">Calls</span>
                    <strong className="text-text-primary">{topThree[1].callsCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Won</span>
                    <strong className="text-emerald-700 font-bold">{topThree[1].dealsWonCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Points</span>
                    <strong className="text-primary font-black text-sm">{topThree[1].totalPoints}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Rank #1 - Gold */}
            {topThree[0] && (
              <div className="order-1 md:order-2 rounded-2xl border-2 border-amber-400 bg-amber-50/20 dark:bg-amber-950/10 p-5 text-center space-y-3 shadow-md scale-105 z-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 text-amber-900 shadow-xs">
                  <Crown className="h-7 w-7 text-amber-900" />
                </div>
                <div>
                  <span className="rounded-full bg-amber-200/80 px-3 py-0.5 text-[10px] font-black text-amber-950 uppercase tracking-wide">
                    👑 Rank #1 • Gold Laureate
                  </span>
                  <h4 className="font-black text-base text-text-primary mt-1.5 line-clamp-1">
                    {topThree[0].name}
                  </h4>
                  <p className="text-[11px] text-text-secondary font-medium">
                    {topThree[0].department} {topThree[0].semester ? `• Sem ${topThree[0].semester}` : ""}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-amber-200/50 flex justify-around text-xs">
                  <div>
                    <span className="text-[10px] text-text-muted block">Calls</span>
                    <strong className="text-text-primary text-sm">{topThree[0].callsCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Deals Won</span>
                    <strong className="text-emerald-700 font-bold text-sm">{topThree[0].dealsWonCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Points</span>
                    <strong className="text-amber-800 dark:text-amber-300 font-black text-base">{topThree[0].totalPoints}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Rank #3 - Bronze */}
            {topThree[2] && (
              <div className="order-3 rounded-2xl border border-amber-200/60 bg-surface p-4 text-center space-y-3 shadow-xs hover:border-amber-300 transition-all">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100/60 text-amber-800 shadow-2xs">
                  <Medal className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-900 uppercase">
                    Rank #3 • Bronze
                  </span>
                  <h4 className="font-bold text-sm text-text-primary mt-1 line-clamp-1">
                    {topThree[2].name}
                  </h4>
                  <p className="text-[11px] text-text-secondary">
                    {topThree[2].department} {topThree[2].semester ? `• Sem ${topThree[2].semester}` : ""}
                  </p>
                </div>
                <div className="pt-2 border-t border-border-subtle flex justify-around text-xs">
                  <div>
                    <span className="text-[10px] text-text-muted block">Calls</span>
                    <strong className="text-text-primary">{topThree[2].callsCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Won</span>
                    <strong className="text-emerald-700 font-bold">{topThree[2].dealsWonCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Points</span>
                    <strong className="text-primary font-black text-sm">{topThree[2].totalPoints}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Full Leaderboard Table */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-text-primary">
              Complete SDR Rankings ({filteredLeaderboard.length} Volunteers)
            </h3>
            <p className="text-[11px] text-text-secondary">
              Conversion rate reflects won sponsorships vs. total companies reached
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search volunteer or dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded-lg border border-border bg-surface-subtle/50 pl-8 pr-3 text-xs text-text-primary focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/70 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                <th className="p-3 text-center w-14">Rank</th>
                <th className="p-3">Volunteer SDR</th>
                <th className="p-3">Department & Sem</th>
                <th className="p-3 text-center">Calls</th>
                <th className="p-3 text-center">Interested</th>
                <th className="p-3 text-center">Meetings</th>
                <th className="p-3 text-center">Won</th>
                <th className="p-3 text-center">Conversion</th>
                <th className="p-3 text-right">Points</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-text-muted text-xs">
                    No volunteers found matching your query.
                  </td>
                </tr>
              ) : (
                filteredLeaderboard.map((v) => {
                  const isTopOne = v.rank === 1;
                  const isTopThree = v.rank <= 3;

                  return (
                    <tr
                      key={v._id}
                      className={`hover:bg-surface-subtle/50 transition-colors ${
                        isTopOne ? "bg-amber-50/20 font-medium" : ""
                      }`}
                    >
                      {/* Rank */}
                      <td className="p-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-black ${
                            v.rank === 1
                              ? "bg-amber-400 text-amber-950 shadow-2xs"
                              : v.rank === 2
                              ? "bg-zinc-200 text-zinc-800"
                              : v.rank === 3
                              ? "bg-amber-100 text-amber-900"
                              : "text-text-muted font-bold"
                          }`}
                        >
                          {v.rank}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="p-3 font-bold text-text-primary">
                        <div className="flex items-center gap-1.5">
                          <span>{v.name}</span>
                          {isTopOne && <Crown className="h-3.5 w-3.5 text-amber-500 inline" />}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="p-3 text-text-secondary">
                        {v.department} {v.semester ? `(S${v.semester})` : ""}
                      </td>

                      {/* Calls */}
                      <td className="p-3 text-center font-semibold text-text-primary">
                        {v.callsCount}
                      </td>

                      {/* Positive Responses */}
                      <td className="p-3 text-center font-medium text-text-secondary">
                        {v.positiveResponses}
                      </td>

                      {/* Meetings */}
                      <td className="p-3 text-center font-medium text-text-secondary">
                        {v.meetingsCount}
                      </td>

                      {/* Won Deals */}
                      <td className="p-3 text-center">
                        {v.dealsWonCount > 0 ? (
                          <span className="rounded bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.5 text-[11px]">
                            {v.dealsWonCount}
                          </span>
                        ) : (
                          <span className="text-text-muted">0</span>
                        )}
                      </td>

                      {/* Conversion Rate */}
                      <td className="p-3 text-center font-semibold text-text-primary">
                        {v.conversionRate}%
                      </td>

                      {/* Total Points */}
                      <td className="p-3 text-right">
                        <span className="font-extrabold text-sm text-primary">
                          {v.totalPoints.toLocaleString()}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedUserForAdjustment({
                              _id: v._id,
                              name: v.name,
                              totalPoints: v.totalPoints,
                              department: v.department,
                            })
                          }
                          className="h-6 px-2 text-[11px] text-text-muted hover:text-primary hover:bg-primary/5"
                        >
                          Adjust Pts
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Point Rules Configuration Drawer */}
      <PointConfigDrawer
        isOpen={isConfigDrawerOpen}
        onClose={() => setIsConfigDrawerOpen(false)}
      />

      {/* Adjust Points Modal */}
      <AdjustPointsModal
        isOpen={!!selectedUserForAdjustment}
        onClose={() => setSelectedUserForAdjustment(null)}
        targetUser={selectedUserForAdjustment}
      />
    </div>
  );
}

export default function HonorsLeaderboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <HonorsLeaderboardContent />
    </Suspense>
  );
}
