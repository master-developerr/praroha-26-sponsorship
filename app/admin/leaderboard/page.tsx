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
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminKpiStrip } from "@/components/admin/AdminKpiStrip";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

type TimeframeOption = "today" | "this_week" | "this_month" | "all_time";

function HonorsLeaderboardContent() {
  const { user, role, profile } = useAuthUser();
  const canAdjust = role === "admin" && profile?.verificationStatus === "approved";
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

  const kpiItems = [
    {
      label: "Total Points Awarded",
      value: aggregateStats.totalPoints.toLocaleString(),
      subtext: "Across all verified SDRs",
      icon: Award,
      variant: "primary" as const,
    },
    {
      label: "Outreach Calls Completed",
      value: aggregateStats.totalCalls.toLocaleString(),
      subtext: `In ${timeframe.replace("_", " ")}`,
      icon: PhoneCall,
      variant: "info" as const,
    },
    {
      label: "Confirmed Deals Won",
      value: aggregateStats.totalDeals.toLocaleString(),
      subtext: "Ratified corporate commitments",
      icon: Trophy,
      variant: "success" as const,
    },
    {
      label: "Active SDR Volunteers",
      value: aggregateStats.activeVolunteers.toLocaleString(),
      subtext: "Approved outreach committee",
      icon: Users,
      variant: "neutral" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Editorial Header */}
      <AdminPageHeader
        category="HONORS LEADERBOARD"
        title="Recognize outreach performance across the sponsorship team."
        description="Real-time volunteer performance standings, verified call debriefs, and corporate commitments for PRAROHA'26."
        actions={
          <div className="flex items-center gap-3">
            {/* Timeframe Switcher */}
            <div className="flex border border-border bg-surface">
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
                  className={`px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    timeframe === t.value
                      ? "bg-primary text-white font-bold"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-subtle"
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
              className="gap-1.5 text-xs font-bold border-primary/30 text-primary hover:bg-primary/5"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Point Rules</span>
            </Button>
          </div>
        }
      />

      {/* 2. Aggregate KPI Strip */}
      <AdminKpiStrip items={kpiItems} columns={4} />

      {/* 3. Top 3 Executive Performance Cards */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topThree.map((item, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const isThird = idx === 2;

            return (
              <div
                key={item._id}
                className={`border bg-surface p-4 text-xs transition-colors ${
                  isFirst
                    ? "border-primary/50 bg-primary/5 border-l-2 border-l-primary"
                    : isSecond
                    ? "border-border-strong border-l-2 border-l-border-strong"
                    : "border-border border-l-2 border-l-border"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <div className="flex items-center gap-1.5">
                    {isFirst ? (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                        <Crown className="h-3.5 w-3.5" /> Rank #1
                      </span>
                    ) : isSecond ? (
                      <span className="font-bold text-text-secondary">Rank #2</span>
                    ) : (
                      <span className="font-bold text-text-muted">Rank #3</span>
                    )}
                  </div>
                  <span className="font-mono text-xs font-bold text-primary">
                    {item.totalPoints} pts
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-sm text-text-primary line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {item.department || "Civil Engineering"}{" "}
                    {item.semester ? `• Sem ${item.semester}` : ""}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-secondary">
                  <span>{item.callsCount} calls logged</span>
                  <span className="font-semibold text-text-primary">
                    {item.dealsWonCount} deals won
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Full Leaderboard Table Container */}
      <div className="border border-border bg-surface overflow-hidden">
        <div className="p-4 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-subtle/30">
          <div>
            <h3 className="font-bold text-sm text-text-primary">
              Outreach Leaderboard ({filteredLeaderboard.length} Volunteers)
            </h3>
            <p className="text-[11px] text-text-secondary">
              Verified corporate outreach velocity and secured sponsorship commitments
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search volunteer or dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full border border-border bg-background pl-8 pr-3 text-xs text-text-primary focus:border-primary focus:outline-none"
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
                {canAdjust && <th className="p-3 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan={canAdjust ? 10 : 9} className="p-8 text-center text-text-muted text-xs">
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
                      {canAdjust && (
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
                      )}
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
      {canAdjust && selectedUserForAdjustment && (
        <AdjustPointsModal
          isOpen={!!selectedUserForAdjustment}
          onClose={() => setSelectedUserForAdjustment(null)}
          targetUser={selectedUserForAdjustment}
        />
      )}
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
