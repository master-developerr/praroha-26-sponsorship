"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { formatCurrencyINR } from "@/lib/utils";
import { AdjustPointsModal } from "@/components/admin/AdjustPointsModal";

interface LeaderboardPodiumProps {
  compact?: boolean;
}

export function LeaderboardPodium({ compact = false }: LeaderboardPodiumProps) {
  const { user, role } = useAuthUser();
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
      <div className="rounded-xl border border-border bg-surface p-6 text-center space-y-2 animate-pulse text-xs text-text-muted">
        <Trophy className="h-6 w-6 text-text-muted mx-auto opacity-50" />
        <p>Calculating team outreach rankings...</p>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  const filteredLeaderboard = leaderboard.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. Visual Podium for Top 3 SDRs or Empty State */}
      {leaderboard.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto mb-3.5 border border-amber-200 dark:border-amber-500/20">
            <Trophy className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-text-primary">
            No outreach activity recorded yet
          </h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto mt-1 leading-relaxed">
            Volunteer rankings and the PRAROHA&apos;26 Honors Podium will automatically activate once student SDRs begin logging calls, debriefs, and secured sponsorship commitments.
          </p>
        </div>
      ) : topThree.length > 0 ? (
        <div className="rounded-2xl border border-border bg-gradient-to-b from-surface to-surface-subtle p-6 shadow-xs">
          <div className="text-center mb-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-700 dark:text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
              PRAROHA&apos;26 Outreach Standings
            </span>
            <h3 className="text-lg font-black text-text-primary mt-2">
              Volunteer Honors Podium
            </h3>
            <p className="text-xs text-text-secondary max-w-md mx-auto mt-0.5">
              Rewarding verified corporate calls, proposal requests, and finalized sponsorship partnerships.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-xl mx-auto pt-4 pb-2">
            {/* 2nd Place (Silver - Left) */}
            {second ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-slate-300 bg-slate-100 flex items-center justify-center font-black text-slate-700 shadow-sm text-base sm:text-lg">
                    {second.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="absolute -top-2 -right-1 h-6 w-6 rounded-full bg-slate-200 border border-slate-400 flex items-center justify-center text-[10px] font-bold text-slate-700">
                    2nd
                  </div>
                </div>
                <span className="text-xs font-bold text-text-primary truncate max-w-[100px] sm:max-w-[120px] text-center">
                  {second.name}
                </span>
                <span className="text-[11px] font-extrabold text-teal-600 dark:text-teal-400 mt-0.5">
                  {second.totalPoints} pts
                </span>
                <span className="text-[10px] text-text-muted">
                  {second.dealsWonCount} deals ({second.callsCount} calls)
                </span>
                <div className="w-full h-20 sm:h-24 bg-surface-subtle border border-border border-b-0 rounded-t-lg mt-3 flex items-center justify-center font-bold text-text-secondary text-sm shadow-xs">
                  SILVER
                </div>
              </div>
            ) : (
              <div className="h-20"></div>
            )}

            {/* 1st Place (Gold - Elevated Center) */}
            {first ? (
              <div className="flex flex-col items-center">
                <Crown className="h-6 w-6 text-amber-500 mb-1 transition-transform duration-300 hover:scale-110 drop-shadow-xs" />
                <div className="relative mb-2">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center font-black text-amber-800 dark:text-amber-300 shadow-sm text-lg sm:text-xl">
                    {first.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="absolute -top-2 -right-1 h-7 w-7 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center text-xs font-black text-amber-950 shadow-xs">
                    1st
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-text-primary truncate max-w-[110px] sm:max-w-[140px] text-center">
                  {first.name}
                </span>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 mt-0.5">
                  {first.totalPoints} pts
                </span>
                <span className="text-[10px] text-text-muted">
                  {first.dealsWonCount} deals ({first.callsCount} calls)
                </span>
                <div className="w-full h-28 sm:h-32 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-400/30 border-b-0 rounded-t-lg mt-3 flex flex-col items-center justify-center font-extrabold text-amber-700 dark:text-amber-400 text-sm shadow-xs">
                  <span>GOLD</span>
                  <Trophy className="h-4 w-4 mt-1 text-amber-500" />
                </div>
              </div>
            ) : (
              <div className="h-28"></div>
            )}

            {/* 3rd Place (Bronze - Right) */}
            {third ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-amber-700/40 bg-amber-700/10 dark:bg-amber-950/30 flex items-center justify-center font-black text-amber-900 dark:text-amber-400 shadow-sm text-base sm:text-lg">
                    {third.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="absolute -top-2 -right-1 h-6 w-6 rounded-full bg-amber-700/20 border border-amber-700/50 flex items-center justify-center text-[10px] font-bold text-amber-900 dark:text-amber-300">
                    3rd
                  </div>
                </div>
                <span className="text-xs font-bold text-text-primary truncate max-w-[100px] sm:max-w-[120px] text-center">
                  {third.name}
                </span>
                <span className="text-[11px] font-extrabold text-teal-600 dark:text-teal-400 mt-0.5">
                  {third.totalPoints} pts
                </span>
                <span className="text-[10px] text-text-muted">
                  {third.dealsWonCount} deals ({third.callsCount} calls)
                </span>
                <div className="w-full h-16 sm:h-18 bg-surface-subtle border border-border border-b-0 rounded-t-lg mt-3 flex items-center justify-center font-bold text-text-secondary text-xs sm:text-sm shadow-xs">
                  BRONZE
                </div>
              </div>
            ) : (
              <div className="h-16"></div>
            )}
          </div>
        </div>
      ) : null}

      {/* 2. Full Ranked Team Roster */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-3">
          <div>
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Sponsorship Committee Rankings
            </h4>
            <p className="text-[11px] text-text-secondary">
              Verified call volume, corporate conversions, and point ledger totals.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search volunteer by name..."
              className="w-full h-8 pl-8 pr-3 rounded-lg border border-border bg-surface text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase font-bold text-text-muted">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Volunteer SDR</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 text-right">Points</th>
                <th className="py-2.5 px-3 text-right">Calls Logged</th>
                <th className="py-2.5 px-3 text-right">Deals Won</th>
                <th className="py-2.5 px-3 text-right">Valuation Won</th>
                <th className="py-2.5 px-3 text-right">Conversion</th>
                {role === "admin" && (
                  <th className="py-2.5 px-3 text-center">Admin</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredLeaderboard.length === 0 ? (
                <tr>
                  <td
                    colSpan={role === "admin" ? 9 : 8}
                    className="py-10 text-center text-text-muted"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Trophy className="h-8 w-8 text-text-muted/40" />
                      <p className="text-xs font-semibold text-text-primary">
                        {leaderboard.length === 0
                          ? "No ranking data yet."
                          : "No volunteers match your search."}
                      </p>
                      <p className="text-[11px] text-text-secondary max-w-sm">
                        {leaderboard.length === 0
                          ? "Ranking will appear once outreach activity begins."
                          : "Try adjusting your search criteria to find team members."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeaderboard.map((v) => {
                  const isTop = v.rank <= 3;
                  return (
                    <tr
                      key={v._id}
                      className={`hover:bg-surface-subtle/60 transition-colors ${
                        v.rank === 1
                          ? "bg-amber-500/5 font-semibold"
                          : v.rank === 2
                          ? "bg-slate-50/50"
                          : v.rank === 3
                          ? "bg-amber-700/5"
                          : ""
                      }`}
                    >
                      <td className="py-2.5 px-3 font-extrabold">
                        {v.rank === 1 ? (
                          <span className="inline-flex items-center gap-1 text-amber-600">
                            <Crown className="h-3.5 w-3.5" /> #1
                          </span>
                        ) : v.rank === 2 ? (
                          <span className="text-slate-600 font-bold">#2</span>
                        ) : v.rank === 3 ? (
                          <span className="text-amber-800 font-bold">#3</span>
                        ) : (
                          <span className="text-text-muted">#{v.rank}</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-bold text-text-primary">{v.name}</div>
                        <div className="text-[10px] text-text-muted">{v.email}</div>
                      </td>

                      <td className="py-2.5 px-3 text-text-secondary">
                        {v.department} (Sem {v.semester})
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <span className="inline-block px-2 py-0.5 rounded-md font-bold text-[11px] bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                          {v.totalPoints} pts
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right text-text-secondary">
                        {v.callsCount}
                      </td>

                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                        {v.dealsWonCount}
                      </td>

                      <td className="py-2.5 px-3 text-right font-semibold text-text-primary">
                        {v.totalValuationWon > 0
                          ? formatCurrencyINR(v.totalValuationWon)
                          : "—"}
                      </td>

                      <td className="py-2.5 px-3 text-right text-text-secondary">
                        {v.conversionRate}%
                      </td>

                      {role === "admin" && (
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() =>
                              setSelectedUserForAdjustment({
                                _id: v._id,
                                name: v.name,
                                totalPoints: v.totalPoints,
                                department: v.department,
                              })
                            }
                            className="px-2 py-1 rounded border border-border hover:bg-surface text-[10px] font-bold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                            title="Adjust points"
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
