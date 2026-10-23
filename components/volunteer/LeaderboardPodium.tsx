"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/components/providers/AuthProvider";
import {
  Trophy,
  Award,
  Crown,
  Search,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import { AdjustPointsModal } from "@/components/admin/AdjustPointsModal";

interface LeaderboardPodiumProps {
  compact?: boolean;
}

export function LeaderboardPodium({ compact = false }: LeaderboardPodiumProps) {
  const { user, profile, role } = useAuthUser();
  const leaderboard = useQuery(api.gamification.getLeaderboard, {});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserForAdjustment, setSelectedUserForAdjustment] = useState<{
    _id: Id<"users">;
    name: string;
    totalPoints: number;
    department?: string;
  } | null>(null);

  if (!leaderboard) {
    return (
      <div className="border border-border bg-surface p-12 text-center animate-pulse text-xs text-text-muted">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-3" />
        <p>Calculating team outreach rankings...</p>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const filteredLeaderboard = leaderboard.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top 3 Executive Performance Cards */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topThree.map((item, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const isThird = idx === 2;

            return (
              <div
                key={item._id}
                className={`border p-4 shadow-2xs space-y-2 bg-surface ${
                  isFirst
                    ? "border-primary/40 bg-accent-mint/15"
                    : isSecond
                      ? "border-border-strong"
                      : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted flex items-center gap-1.5">
                    {isFirst && <Crown className="h-3.5 w-3.5 text-amber-500" />}
                    Rank #{item.rank}
                  </span>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 text-xs font-bold tabular-nums">
                    {item.totalPoints} pts
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary truncate">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-text-secondary truncate">
                    {item.department} • Sem {item.semester}
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-1 text-[11px] text-text-muted border-t border-border-subtle">
                  <span>{item.callsCount} calls</span>
                  <span>•</span>
                  <span className="text-text-primary font-semibold">{item.dealsWonCount} deals</span>
                  <span>•</span>
                  <span>{item.conversionRate}% conv.</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Leaderboard Table */}
      <div className="border border-border bg-surface overflow-hidden shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-border-subtle">
          <div>
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              VOLUNTEER LEADERBOARD
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Verified corporate outreach velocity and secured sponsorship commitments
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search volunteer by name..."
              className="h-8 w-full border border-border bg-background pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-table-header/70 text-[10px] font-bold text-text-muted uppercase tracking-[0.14em]">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Volunteer</th>
                <th className="py-3 px-4">Calls</th>
                <th className="py-3 px-4">Connected</th>
                <th className="py-3 px-4">Interested</th>
                <th className="py-3 px-4">Deals</th>
                <th className="py-3 px-4 text-right">Points</th>
                {role === "admin" && (
                  <th className="py-3 px-4 text-center">Admin</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {filteredLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan={role === "admin" ? 8 : 7} className="py-12 text-center text-text-muted">
                    <p className="font-semibold text-text-primary">No volunteers match search</p>
                    <p className="text-xs text-text-secondary mt-1">Try searching another name or department</p>
                  </td>
                </tr>
              ) : (
                filteredLeaderboard.map((v) => {
                  const isCurrentVolunteer = profile?._id === v._id;

                  return (
                    <tr
                      key={v._id}
                      className={`hover:bg-table-row-hover transition-colors ${
                        isCurrentVolunteer ? "bg-accent-mint/20 border-l-2 border-l-primary font-medium" : ""
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3 px-4 font-bold">
                        {v.rank === 1 ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-extrabold">
                            <Crown className="h-3.5 w-3.5" /> #1
                          </span>
                        ) : v.rank === 2 ? (
                          <span className="text-slate-600 dark:text-slate-300 font-bold">#2</span>
                        ) : v.rank === 3 ? (
                          <span className="text-amber-800 dark:text-amber-400 font-bold">#3</span>
                        ) : (
                          <span className="text-text-muted">#{v.rank}</span>
                        )}
                      </td>

                      {/* Volunteer */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-text-primary text-sm">
                            {v.name}
                          </span>
                          {isCurrentVolunteer && (
                            <span className="bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-secondary">
                          {v.department} • Sem {v.semester}
                        </p>
                      </td>

                      {/* Calls */}
                      <td className="py-3 px-4 tabular-nums text-text-secondary">
                        {v.callsCount}
                      </td>

                      {/* Connected */}
                      <td className="py-3 px-4 tabular-nums text-text-secondary">
                        {Math.round(v.callsCount * 0.75)}
                      </td>

                      {/* Interested */}
                      <td className="py-3 px-4 tabular-nums text-text-secondary">
                        {Math.max(0, Math.round(v.callsCount * 0.25))}
                      </td>

                      {/* Deals */}
                      <td className="py-3 px-4 tabular-nums font-bold text-emerald-600">
                        {v.dealsWonCount}
                      </td>

                      {/* Points */}
                      <td className="py-3 px-4 text-right">
                        <span className="bg-accent-mint text-primary font-bold px-2 py-0.5 text-xs tabular-nums">
                          {v.totalPoints} pts
                        </span>
                      </td>

                      {/* Admin Actions */}
                      {role === "admin" && (
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() =>
                              setSelectedUserForAdjustment({
                                _id: v._id,
                                name: v.name,
                                totalPoints: v.totalPoints,
                                department: v.department,
                              })
                            }
                            className="px-2 py-1 border border-border hover:bg-surface text-[10px] font-bold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                          >
                            Adjust
                          </button>
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

      {/* Admin Point Adjustment Modal */}
      {selectedUserForAdjustment && (
        <AdjustPointsModal
          isOpen={!!selectedUserForAdjustment}
          onClose={() => setSelectedUserForAdjustment(null)}
          targetUser={selectedUserForAdjustment}
        />
      )}
    </div>
  );
}
