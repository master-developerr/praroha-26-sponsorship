"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatCurrencyINR } from "@/lib/utils";
import {
  Coins,
  TrendingUp,
  PhoneCall,
  Award,
  Users,
  AlertTriangle,
  Building2,
  PieChart as PieIcon,
  BarChart3,
  ShieldAlert,
  ArrowUpRight,
  Trophy,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { LeaderboardPodium } from "@/components/volunteer/LeaderboardPodium";

export function ExecutiveDashboardView() {
  const dashboard = useQuery(api.analytics.getExecutiveDashboard);
  const [activeTab, setActiveTab] = useState<"overview" | "leaderboard">("overview");

  if (!dashboard) {
    return (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-8 bg-border/40 rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 bg-border/20 rounded-xl"></div>
          <div className="h-28 bg-border/20 rounded-xl"></div>
          <div className="h-28 bg-border/20 rounded-xl"></div>
          <div className="h-28 bg-border/20 rounded-xl"></div>
        </div>
        <div className="h-64 bg-border/20 rounded-xl"></div>
      </div>
    );
  }

  const { kpis, volunteersBreakdown, leadsBreakdown, velocityTimeSeries, topObjections, sectorBreakdown, recentActivity } = dashboard;

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-700 dark:text-teal-300 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
            PRAROHA&apos;26 Executive Cockpit
          </span>
          <h2 className="text-xl font-black text-text-primary mt-1">
            Sponsorship Operations Overview
          </h2>
          <p className="text-xs text-text-secondary">
            Macro pipeline health, outreach velocity, team gamification, and corporate conversion metrics.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border text-xs font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "bg-primary text-white shadow-xs font-bold"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Executive Metrics & Velocity
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "leaderboard"
                ? "bg-primary text-white shadow-xs font-bold"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Trophy className="h-3.5 w-3.5 text-amber-300" />
            Team Leaderboard & Points
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* 1. Macro Financial KPI Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Confirmed Revenue Card */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800 dark:text-emerald-300">
                  Confirmed Sponsorship
                </span>
                <Coins className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                  {formatCurrencyINR(kpis.confirmedTotal)}
                </span>
                <div className="text-[11px] text-text-secondary mt-1 flex items-center justify-between">
                  <span>Cash: {formatCurrencyINR(kpis.confirmedCash)}</span>
                  <span>•</span>
                  <span>In-Kind: {formatCurrencyINR(kpis.confirmedInKind)}</span>
                </div>
              </div>
            </div>

            {/* Total Pipeline Potential */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  Pipeline Potential
                </span>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-2xl font-black text-text-primary">
                  {formatCurrencyINR(kpis.totalPipelinePotential)}
                </span>
                <div className="text-[11px] text-text-secondary mt-1">
                  Across {kpis.totalSourcedLeads} target corporate leads
                </div>
              </div>
            </div>

            {/* Outreach Velocity & Calls */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  Outreach Velocity
                </span>
                <PhoneCall className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <span className="text-2xl font-black text-text-primary">
                  {kpis.totalCallsLogged} calls
                </span>
                <div className="text-[11px] text-text-secondary mt-1 flex items-center justify-between">
                  <span>{kpis.dealsWonCount} deals closed</span>
                  <span>•</span>
                  <span>{kpis.activeVolunteersCount} active SDRs</span>
                </div>
              </div>
            </div>

            {/* Follow-up Alerts */}
            <div
              className={`rounded-xl border p-4 space-y-2 shadow-2xs ${
                kpis.overdueFollowUpsCount > 0
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-border bg-surface"
              }`}
            >
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 dark:text-amber-400">
                  Follow-Up Status
                </span>
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <span className="text-2xl font-black text-amber-700 dark:text-amber-400">
                  {kpis.overdueFollowUpsCount} overdue
                </span>
                <div className="text-[11px] text-text-secondary mt-1">
                  Callbacks requiring volunteer intervention
                </div>
              </div>
            </div>
          </div>

          {/* 2. Operational Health Bento: Volunteers Governance & Lead Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Volunteer Governance */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-bold text-text-primary flex items-center gap-1.5 uppercase tracking-wider">
                  <Users className="h-4 w-4 text-primary" />
                  Volunteer SDR Governance
                </span>
                <span className="text-xs font-bold text-text-primary">
                  {volunteersBreakdown?.total ?? 0} Total Registered
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Approved</span>
                  <span className="text-lg font-black text-emerald-700">{volunteersBreakdown?.approved ?? 0}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Pending</span>
                  <span className="text-lg font-black text-amber-700">{volunteersBreakdown?.pending ?? 0}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100">
                  <span className="text-[10px] font-bold text-rose-800 uppercase block">Rejected</span>
                  <span className="text-lg font-black text-rose-700">{volunteersBreakdown?.rejected ?? 0}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-100 border border-zinc-200">
                  <span className="text-[10px] font-bold text-zinc-700 uppercase block">Suspended</span>
                  <span className="text-lg font-black text-zinc-800">{volunteersBreakdown?.suspended ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Lead Lifecycle Distribution */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-bold text-text-primary flex items-center gap-1.5 uppercase tracking-wider">
                  <Building2 className="h-4 w-4 text-primary" />
                  Lead Lifecycle Distribution
                </span>
                <span className="text-xs font-bold text-text-primary">
                  {leadsBreakdown?.total ?? 0} Total Leads
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Unassigned</span>
                  <span className="text-lg font-black text-amber-700">{leadsBreakdown?.unassigned ?? 0}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-100">
                  <span className="text-[10px] font-bold text-sky-800 uppercase block">In Outreach</span>
                  <span className="text-lg font-black text-sky-700">{leadsBreakdown?.inPipeline ?? 0}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Won</span>
                  <span className="text-lg font-black text-emerald-700">{leadsBreakdown?.won ?? 0}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-100 border border-zinc-200">
                  <span className="text-[10px] font-bold text-zinc-700 uppercase block">Lost</span>
                  <span className="text-lg font-black text-zinc-800">{leadsBreakdown?.lost ?? 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Daily Outreach Velocity Chart (Recharts) */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
              <div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Daily Outreach Velocity (Last 7 Days)
                </h4>
                <p className="text-[11px] text-text-secondary">
                  Real-time calls logged, proposals requested, and ratified partnerships.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <div className="h-2.5 w-2.5 rounded-full bg-teal-600"></div>
                  <span>Calls Logged</span>
                </div>
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <div className="h-2.5 w-2.5 rounded-full bg-indigo-500"></div>
                  <span>Proposals</span>
                </div>
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                  <span>Deals Won</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={velocityTimeSeries}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#237E72" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#237E72" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="propGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E5DE" opacity={0.6} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#818982" }}
                    tickLine={false}
                    axisLine={{ stroke: "#E2E5DE" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#818982" }}
                    tickLine={false}
                    axisLine={{ stroke: "#E2E5DE" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E5DE",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="calls"
                    name="Calls Logged"
                    stroke="#237E72"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#callsGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="proposals"
                    name="Proposals Sent"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#propGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="dealsWon"
                    name="Deals Won"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="#10B981"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Team Intelligence & Sector Responsiveness */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Primary Corporate Objections */}
            <div className="rounded-xl border border-border bg-surface p-5 shadow-2xs space-y-4">
              <div className="border-b border-border-subtle pb-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  Primary Corporate Objections (Team Roadblocks)
                </h4>
                <p className="text-[11px] text-text-secondary">
                  Most frequent friction points logged across volunteer debrief reports.
                </p>
              </div>

              {topObjections.length === 0 ? (
                <div className="py-8 text-center text-xs text-text-muted">
                  No corporate objections recorded yet. Objections will populate as SDRs log call reports.
                </div>
              ) : (
                <div className="space-y-3">
                  {topObjections.map((item, idx) => {
                    const maxCount = Math.max(...topObjections.map((o) => o.count), 1);
                    const pct = Math.round((item.count / maxCount) * 100);
                    return (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex items-center justify-between text-text-primary font-medium">
                          <span className="truncate pr-2">{item.objection}</span>
                          <span className="font-bold text-text-muted shrink-0">
                            {item.count} calls
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-surface-subtle border border-border overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${item.count > 0 ? Math.max(pct, 8) : 2}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sector Responsiveness */}
            <div className="rounded-xl border border-border bg-surface p-5 shadow-2xs space-y-4">
              <div className="border-b border-border-subtle pb-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-primary" />
                  Sector Responsiveness & Pipeline Performance
                </h4>
                <p className="text-[11px] text-text-secondary">
                  Outreach conversion and confirmed sponsorship by industry niche.
                </p>
              </div>

              {sectorBreakdown.length === 0 ? (
                <div className="py-8 text-center text-xs text-text-muted">
                  No sector outreach data recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-[10px] uppercase font-bold text-text-muted">
                        <th className="py-2 px-2">Industry</th>
                        <th className="py-2 px-2 text-right">Leads</th>
                        <th className="py-2 px-2 text-right">Contacted</th>
                        <th className="py-2 px-2 text-right">Won</th>
                        <th className="py-2 px-2 text-right">Valuation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {sectorBreakdown.map((s, idx) => (
                        <tr key={idx} className="hover:bg-surface-subtle transition-colors">
                          <td className="py-2 px-2 font-semibold text-text-primary">
                            {s.industry}
                          </td>
                          <td className="py-2 px-2 text-right text-text-muted">
                            {s.totalLeads}
                          </td>
                          <td className="py-2 px-2 text-right text-text-secondary font-medium">
                            {s.contacted} ({s.responsivenessRate}%)
                          </td>
                          <td className="py-2 px-2 text-right font-bold text-emerald-600">
                            {s.won}
                          </td>
                          <td className="py-2 px-2 text-right font-bold text-primary">
                            {s.totalValuation > 0
                              ? formatCurrencyINR(s.totalValuation)
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* 5. Live Recent Activity Stream from Audit Logs */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-sky-600" />
                  Live Operational Activity Feed
                </h4>
                <p className="text-[11px] text-text-secondary">
                  Real-time immutable audit records from volunteer registrations, lead allocations, and commitments.
                </p>
              </div>
            </div>

            {!recentActivity || recentActivity.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                No recent activity recorded in the audit trail yet.
              </div>
            ) : (
              <div className="divide-y divide-border-subtle">
                {recentActivity.map((log: any) => (
                  <div key={log._id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-surface-subtle border border-border px-2 py-0.5 text-[10px] font-mono font-bold text-text-muted">
                        {log.action}
                      </span>
                      <span className="text-text-primary font-medium">
                        {log.actorName} ({log.actorRole})
                      </span>
                      <span className="text-text-muted text-[11px]">
                        on {log.entityType} ({log.entityId.slice(-6)})
                      </span>
                    </div>
                    <span className="text-text-muted text-[11px] font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "leaderboard" && (
        <LeaderboardPodium />
      )}
    </div>
  );
}
