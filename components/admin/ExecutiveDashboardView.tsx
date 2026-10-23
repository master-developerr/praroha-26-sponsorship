"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatCurrencyINR } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Building2,
  Coins,
  PhoneCall,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LeaderboardPodium } from "@/components/volunteer/LeaderboardPodium";
import { eventConfig } from "@/lib/eventConfig";

function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="border-b border-border pb-6">
        <div className="h-3 w-32 rounded bg-surface-subtle" />
        <div className="mt-4 h-9 w-80 max-w-full rounded bg-surface-subtle" />
        <div className="mt-3 h-4 w-[28rem] max-w-full rounded bg-surface-subtle" />
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 border-l-2 border-border bg-surface-subtle/60" />
        ))}
      </div>
      <div className="h-72 border border-border bg-surface-subtle/50" />
    </div>
  );
}

export function ExecutiveDashboardView() {
  const dashboard = useQuery(api.analytics.getExecutiveDashboard);
  const [activeTab, setActiveTab] = useState<"overview" | "leaderboard">("overview");

  if (!dashboard) return <DashboardLoading />;

  const {
    kpis,
    volunteersBreakdown,
    leadsBreakdown,
    velocityTimeSeries,
    topObjections,
    sectorBreakdown,
    recentActivity,
  } = dashboard;

  return (
    <div className="space-y-8">
      <header className="border-b border-border pb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Sponsorship control room
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-text-primary sm:text-4xl">
              The work behind the pipeline.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
              A live view of outreach velocity, volunteer coverage, follow-up risk, and confirmed value for {eventConfig.name}.
            </p>
            <p className="mt-3 text-[11px] font-medium text-text-muted">
              {eventConfig.datesCompact} · {eventConfig.organizer} · {eventConfig.institution}
            </p>
          </div>

          <nav className="flex items-center gap-5 border-b border-border-subtle" aria-label="Dashboard views">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`border-b-2 px-0.5 pb-3 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              Operations overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("leaderboard")}
              className={`border-b-2 px-0.5 pb-3 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "leaderboard"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              Team performance
            </button>
          </nav>
        </div>
      </header>

      {activeTab === "leaderboard" ? (
        <LeaderboardPodium />
      ) : (
        <div className="space-y-8">
          <section aria-labelledby="portfolio-heading">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Portfolio at a glance</p>
                <h2 id="portfolio-heading" className="mt-1 text-base font-bold text-text-primary">Where attention is needed today</h2>
              </div>
              <Link href="/admin/analytics" className="hidden items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover sm:flex">
                View audit trail <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-6 border-y border-border py-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="border-l-2 border-success pl-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                  <Coins className="h-3.5 w-3.5 text-success" /> Confirmed value
                </div>
                <p className="mt-3 text-2xl font-bold tabular-nums text-text-primary">{formatCurrencyINR(kpis.confirmedTotal)}</p>
                <p className="mt-1 text-[11px] text-text-secondary">Cash {formatCurrencyINR(kpis.confirmedCash)} · In-kind {formatCurrencyINR(kpis.confirmedInKind)}</p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" /> Pipeline potential
                </div>
                <p className="mt-3 text-2xl font-bold tabular-nums text-text-primary">{formatCurrencyINR(kpis.totalPipelinePotential)}</p>
                <p className="mt-1 text-[11px] text-text-secondary">Across {kpis.totalSourcedLeads} sourced leads</p>
              </div>
              <div className="border-l-2 border-info pl-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                  <PhoneCall className="h-3.5 w-3.5 text-info" /> Outreach velocity
                </div>
                <p className="mt-3 text-2xl font-bold tabular-nums text-text-primary">{kpis.totalCallsLogged} calls</p>
                <p className="mt-1 text-[11px] text-text-secondary">{kpis.activeVolunteersCount} active volunteers · {kpis.dealsWonCount} won</p>
              </div>
              <div className={`border-l-2 pl-4 ${kpis.overdueFollowUpsCount > 0 ? "border-warning" : "border-border-strong"}`}>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                  <AlertTriangle className={`h-3.5 w-3.5 ${kpis.overdueFollowUpsCount > 0 ? "text-warning" : "text-text-muted"}`} /> Follow-up risk
                </div>
                <p className={`mt-3 text-2xl font-bold tabular-nums ${kpis.overdueFollowUpsCount > 0 ? "text-warning" : "text-text-primary"}`}>{kpis.overdueFollowUpsCount}</p>
                <p className="mt-1 text-[11px] text-text-secondary">Callbacks requiring intervention</p>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="border border-border bg-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-subtle pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-bold text-text-primary">Outreach velocity</h2>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">Calls, proposals, and wins logged over the last seven days.</p>
                </div>
                <div className="flex gap-4 text-[10px] font-semibold text-text-muted">
                  <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 bg-primary" /> Calls</span>
                  <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 bg-info" /> Proposals</span>
                  <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 bg-success" /> Won</span>
                </div>
              </div>
              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={velocityTimeSeries} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                    <defs>
                      <linearGradient id="adminCallsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="2 4" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--bg-surface-raised)", borderColor: "var(--border-default)", color: "var(--text-primary)", borderRadius: "6px", fontSize: "11px" }} />
                    <Area type="monotone" dataKey="calls" name="Calls" stroke="var(--brand-primary)" strokeWidth={2} fill="url(#adminCallsGradient)" />
                    <Area type="monotone" dataKey="proposals" name="Proposals" stroke="var(--info)" strokeWidth={2} fill="none" />
                    <Area type="monotone" dataKey="dealsWon" name="Won" stroke="var(--success)" strokeWidth={2} fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-4">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <h2 className="text-sm font-bold text-text-primary">Team readiness</h2>
                  <p className="mt-1 text-xs text-text-secondary">Verification and lead coverage.</p>
                </div>
              </div>
              <div className="mt-5 space-y-5">
                <div>
                  <div className="flex items-end justify-between gap-3">
                    <span className="text-xs font-semibold text-text-primary">Volunteers</span>
                    <span className="text-xs tabular-nums text-text-secondary">{volunteersBreakdown?.approved ?? 0} approved / {volunteersBreakdown?.total ?? 0}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-surface-subtle"><div className="h-full bg-success" style={{ width: `${volunteersBreakdown?.total ? Math.round(((volunteersBreakdown.approved ?? 0) / volunteersBreakdown.total) * 100) : 0}%` }} /></div>
                </div>
                <div>
                  <div className="flex items-end justify-between gap-3">
                    <span className="text-xs font-semibold text-text-primary">Leads in motion</span>
                    <span className="text-xs tabular-nums text-text-secondary">{leadsBreakdown?.inPipeline ?? 0} / {leadsBreakdown?.total ?? 0}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-surface-subtle"><div className="h-full bg-primary" style={{ width: `${leadsBreakdown?.total ? Math.round(((leadsBreakdown.inPipeline ?? 0) / leadsBreakdown.total) * 100) : 0}%` }} /></div>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border-subtle pt-4">
                  <div><p className="text-[10px] uppercase tracking-wider text-text-muted">Pending review</p><p className="mt-1 text-lg font-bold tabular-nums text-warning">{volunteersBreakdown?.pending ?? 0}</p></div>
                  <div><p className="text-[10px] uppercase tracking-wider text-text-muted">Unassigned leads</p><p className="mt-1 text-lg font-bold tabular-nums text-text-primary">{leadsBreakdown?.unassigned ?? 0}</p></div>
                  <div><p className="text-[10px] uppercase tracking-wider text-text-muted">Won</p><p className="mt-1 text-lg font-bold tabular-nums text-success">{leadsBreakdown?.won ?? 0}</p></div>
                  <div><p className="text-[10px] uppercase tracking-wider text-text-muted">Lost</p><p className="mt-1 text-lg font-bold tabular-nums text-text-secondary">{leadsBreakdown?.lost ?? 0}</p></div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <div className="border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-4">
                <ShieldAlert className="h-4 w-4 text-warning" />
                <div><h2 className="text-sm font-bold text-text-primary">Conversation friction</h2><p className="mt-1 text-xs text-text-secondary">Objections appearing most often in call debriefs.</p></div>
              </div>
              {topObjections.length === 0 ? (
                <p className="py-10 text-center text-xs text-text-muted">No objections recorded yet.</p>
              ) : (
                <div className="mt-5 space-y-4">
                  {topObjections.map((item, index) => {
                    const maxCount = Math.max(...topObjections.map((entry) => entry.count), 1);
                    const width = Math.max(Math.round((item.count / maxCount) * 100), 8);
                    return <div key={`${item.objection}-${index}`}><div className="flex items-center justify-between gap-4 text-xs"><span className="truncate font-medium text-text-primary">{item.objection}</span><span className="shrink-0 tabular-nums text-text-muted">{item.count} calls</span></div><div className="mt-2 h-1 bg-surface-subtle"><div className="h-full bg-warning" style={{ width: `${width}%` }} /></div></div>;
                  })}
                </div>
              )}
            </div>

            <div className="border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-4">
                <Building2 className="h-4 w-4 text-primary" />
                <div><h2 className="text-sm font-bold text-text-primary">Sector response</h2><p className="mt-1 text-xs text-text-secondary">Where conversations are turning into sponsorship value.</p></div>
              </div>
              {sectorBreakdown.length === 0 ? (
                <p className="py-10 text-center text-xs text-text-muted">No sector data recorded yet.</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead><tr className="border-b border-border-subtle text-[10px] uppercase tracking-wider text-text-muted"><th className="py-2 pr-3">Industry</th><th className="py-2 px-2 text-right">Reach</th><th className="py-2 px-2 text-right">Won</th><th className="py-2 pl-2 text-right">Value</th></tr></thead>
                    <tbody className="divide-y divide-border-subtle">
                      {sectorBreakdown.map((sector, index) => <tr key={`${sector.industry}-${index}`} className="hover:bg-surface-subtle/60"><td className="py-3 pr-3 font-semibold text-text-primary">{sector.industry}</td><td className="px-2 py-3 text-right text-text-secondary">{sector.contacted}/{sector.totalLeads}<span className="ml-1 text-[10px] text-text-muted">({sector.responsivenessRate}%)</span></td><td className="px-2 py-3 text-right font-bold text-success">{sector.won}</td><td className="py-3 pl-2 text-right font-semibold text-primary">{sector.totalValuation > 0 ? formatCurrencyINR(sector.totalValuation) : "—"}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          <section className="border border-border bg-surface p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border-subtle pb-4">
              <div><div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /><h2 className="text-sm font-bold text-text-primary">Recent operational activity</h2></div><p className="mt-1 text-xs text-text-secondary">The latest recorded changes across the sponsorship workspace.</p></div>
              <Link href="/admin/analytics" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover">Open full trail <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </div>
            {!recentActivity || recentActivity.length === 0 ? (
              <p className="py-10 text-center text-xs text-text-muted">No recent activity recorded.</p>
            ) : (
              <div className="divide-y divide-border-subtle">
                {recentActivity.map((log) => <div key={log._id} className="grid gap-2 py-3 text-xs sm:grid-cols-[9rem_1fr_auto] sm:items-center"><span className="font-mono text-[10px] font-semibold text-primary">{log.action}</span><span className="text-text-primary"><strong className="font-semibold">{log.actorName}</strong><span className="text-text-muted"> · {log.actorRole} · {log.entityType} {log.entityId.slice(-6)}</span></span><span className="font-mono text-[10px] text-text-muted sm:text-right">{new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span></div>)}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
