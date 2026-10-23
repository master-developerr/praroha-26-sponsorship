"use client";

import React, { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { useWorkspace } from "@/components/volunteer/WorkspaceContext";
import {
  BarChart3,
  TrendingUp,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Trophy,
  Target,
  Flame,
  Award,
  Coins,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrencyINR } from "@/lib/utils";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export default function VolunteerAnalyticsPage() {
  const { user, profile } = useAuthUser();
  const { openLeaderboard } = useWorkspace();
  const clerkId = user?.id || "";

  const metrics = useQuery(
    api.assignments.getMyWorkstationMetrics,
    clerkId ? { volunteerClerkId: clerkId } : "skip"
  );

  const pointsSummary = useQuery(
    api.gamification.getUserPointsSummary,
    clerkId ? { clerkId } : "skip"
  );

  const recentCalls = useQuery(
    api.calls.getMyRecentCalls,
    clerkId ? { volunteerClerkId: clerkId } : "skip"
  );

  const assignedLeadsRaw = useQuery(
    api.assignments.getMyAssignedLeads,
    clerkId ? { volunteerClerkId: clerkId, tab: "all" } : "skip"
  );

  const totalAssigned = metrics?.totalAssigned || 0;
  const callsCompleted = metrics?.callsCompleted || 0;
  const interested = metrics?.interestedCount || 0;
  const inProgress = metrics?.inProgressCount || 0;

  const connectionRate = totalAssigned > 0 ? Math.round((callsCompleted / totalAssigned) * 100) : 0;
  const qualificationRate = callsCompleted > 0 ? Math.round((interested / Math.max(1, callsCompleted)) * 100) : 0;
  const followUpRate = callsCompleted > 0 ? Math.round(((metrics?.todayFollowUps || 0) + (metrics?.overdueFollowUps || 0)) / Math.max(1, callsCompleted) * 100) : 0;

  // Compute pipeline progression funnel
  const pipelineFunnel = useMemo(() => {
    const leads = assignedLeadsRaw || [];
    let assigned = 0;
    let contacted = 0;
    let qualified = 0;
    let proposal = 0;
    let negotiation = 0;
    let won = 0;

    for (const l of leads) {
      if (l.leadStatus === "ASSIGNED") assigned++;
      if (l.leadStatus === "CONTACTED") contacted++;
      if (l.leadStatus === "INTERESTED") qualified++;
      if (["PROPOSAL_REQUESTED", "PROPOSAL_SENT"].includes(l.leadStatus)) proposal++;
      if (l.leadStatus === "NEGOTIATION") negotiation++;
      if (l.leadStatus === "WON") won++;
    }

    return [
      { stage: "Assigned", count: assigned, color: "var(--text-muted)" },
      { stage: "Contacted", count: contacted, color: "var(--brand-primary)" },
      { stage: "Interested", count: qualified, color: "var(--status-info)" },
      { stage: "Proposal", count: proposal, color: "var(--status-warning)" },
      { stage: "Negotiation", count: negotiation, color: "var(--accent-coral-text)" },
      { stage: "Won", count: won, color: "var(--status-success)" },
    ];
  }, [assignedLeadsRaw]);

  // 7-day activity chart data
  const activityData = useMemo(() => {
    const calls = recentCalls || [];
    const days: Record<string, { date: string; calls: number }> = {};
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      days[key] = { date: key, calls: 0 };
    }

    for (const c of calls) {
      const key = new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (days[key]) {
        days[key].calls++;
      }
    }

    return Object.values(days);
  }, [recentCalls]);

  return (
    <div className="space-y-8">
      {/* Editorial Page Header matching Admin Control Room */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              OUTREACH ANALYTICS
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-text-primary sm:text-4xl">
              Personal Outreach Velocity & Pipeline Conversion
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
              Personal analytics on call consistency, conversion rates, and points earned for PRAROHA&apos;26.
            </p>
            <p className="mt-3 text-[11px] font-medium text-text-muted">
              DEC 04-05 · Division of Civil Engineering · Cochin University of Science and Technology (CUSAT)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={openLeaderboard}
              className="text-xs border-border text-text-secondary hover:text-text-primary"
            >
              <Trophy className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
              View Team Leaderboard
            </Button>
          </div>
        </div>
      </header>

      {/* Operational KPI Strip */}
      <section aria-labelledby="analytics-kpi-heading" className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Conversion Efficiency</p>
          <h2 id="analytics-kpi-heading" className="mt-1 text-base font-bold text-text-primary">
            Key Execution Indicators
          </h2>
        </div>

        <div className="grid gap-6 border-y border-border py-5 sm:grid-cols-2 lg:grid-cols-7 bg-surface">
          <div className="border-l-2 border-primary pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Outreach Velocity</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-text-primary">{callsCompleted} <span className="text-xs font-normal text-text-muted">calls</span></p>
            <p className="mt-0.5 text-[10px] text-text-secondary">Daily pacing</p>
          </div>
          <div className="border-l-2 border-border-strong pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Calls Completed</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-text-primary">{callsCompleted}</p>
            <p className="mt-0.5 text-[10px] text-text-secondary">Logged in portal</p>
          </div>
          <div className="border-l-2 border-success pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Connection Rate</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-success">{connectionRate}%</p>
            <p className="mt-0.5 text-[10px] text-text-secondary">Assigned vs dialed</p>
          </div>
          <div className="border-l-2 border-warning pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Follow-up Rate</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-warning">{followUpRate}%</p>
            <p className="mt-0.5 text-[10px] text-text-secondary">Callback queue</p>
          </div>
          <div className="border-l-2 border-primary pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Interested</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-primary">{interested}</p>
            <p className="mt-0.5 text-[10px] text-text-secondary">Qualified accounts</p>
          </div>
          <div className="border-l-2 border-info pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">In Progress</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-info">{inProgress}</p>
            <p className="mt-0.5 text-[10px] text-text-secondary">Active dialogs</p>
          </div>
          <div className="border-l-2 border-success pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Points Earned</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-primary">{pointsSummary?.totalPoints ?? 0}</p>
            <p className="mt-0.5 text-[10px] text-text-secondary">SDR ledger total</p>
          </div>
        </div>
      </section>

      {/* Grid: Outreach Activity Chart & Pipeline Progression */}
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Left: Outreach Activity Area Chart */}
        <div className="border border-border bg-surface p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-subtle pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-text-primary">Outreach Activity</h2>
              </div>
              <p className="mt-1 text-xs text-text-secondary">
                Daily call volume executed over the last seven days.
              </p>
            </div>
          </div>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsCallsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--text-muted)" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-default)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="calls" stroke="var(--brand-primary)" strokeWidth={2} fillOpacity={1} fill="url(#analyticsCallsGrad)" name="Calls" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pipeline Progression */}
        <div className="border border-border bg-surface p-5 sm:p-6 shadow-2xs">
          <div className="border-b border-border-subtle pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-text-primary">Pipeline Progression</h2>
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              Stage distribution of your assigned accounts.
            </p>
          </div>
          <div className="mt-6 space-y-3">
            {pipelineFunnel.map((item) => {
              const pct = totalAssigned > 0 ? Math.round((item.count / totalAssigned) * 100) : 0;
              return (
                <div key={item.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-primary">{item.stage}</span>
                    <span className="tabular-nums font-bold text-text-secondary">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-subtle overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Points Ledger Card */}
      <div className="border border-border bg-surface p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-bold text-text-primary">Gamification Points Ledger</h2>
          </div>
          <span className="text-xs font-semibold text-primary tabular-nums">
            Total: {pointsSummary?.totalPoints ?? 0} pts
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-border bg-surface-subtle/30 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Outreach Call Logged</span>
            <p className="text-lg font-bold text-text-primary">+10 pts</p>
            <p className="text-[11px] text-text-secondary">Awarded for each verified call debrief</p>
          </div>
          <div className="border border-border bg-surface-subtle/30 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Proposal Requested</span>
            <p className="text-lg font-bold text-text-primary">+15 pts</p>
            <p className="text-[11px] text-text-secondary">Advanced to official pitch dispatch</p>
          </div>
          <div className="border border-border bg-surface-subtle/30 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Meeting Secured</span>
            <p className="text-lg font-bold text-text-primary">+20 pts</p>
            <p className="text-[11px] text-text-secondary">Corporate decision-maker meeting booked</p>
          </div>
        </div>
      </div>
    </div>
  );
}
