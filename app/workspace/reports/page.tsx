"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { useWorkspace } from "@/components/volunteer/WorkspaceContext";
import { PhoneCall, Clock, ArrowRight, BarChart3, CheckCircle2, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function CallReportsPage() {
  const { user } = useAuthUser();
  const { openCompanyDossier } = useWorkspace();
  const clerkId = user?.id || "";

  const recentCalls = useQuery(
    api.calls.getMyRecentCalls,
    clerkId ? { volunteerClerkId: clerkId } : "skip"
  );

  const calls = useMemo(() => recentCalls || [], [recentCalls]);

  // Compute operational reporting metrics
  const metrics = useMemo(() => {
    const now = Date.now();
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const startOfWeek = now - 7 * 24 * 60 * 60 * 1000;

    let callsToday = 0;
    let callsThisWeek = 0;
    let connected = 0;
    let noAnswer = 0;
    let followUpsCreated = 0;
    let interested = 0;
    let converted = 0;

    for (const c of calls) {
      if (c.createdAt >= startOfToday) callsToday++;
      if (c.createdAt >= startOfWeek) callsThisWeek++;

      if (["Interested", "Asked for proposal", "Asked for budget", "Call back", "Meeting requested", "Non-cash opportunity"].includes(c.quickOutcome)) {
        connected++;
      } else {
        noAnswer++;
      }

      if (c.quickOutcome === "Call back") followUpsCreated++;
      if (["Interested", "Asked for proposal", "Asked for budget", "Meeting requested", "Non-cash opportunity"].includes(c.quickOutcome)) {
        interested++;
      }
      if (c.quickOutcome === "Meeting requested") converted++;
    }

    return {
      callsToday,
      callsThisWeek,
      connected,
      noAnswer,
      followUpsCreated,
      interested,
      converted,
    };
  }, [calls]);

  // 7-day time series data for chart
  const timeSeriesData = useMemo(() => {
    const days: Record<string, { date: string; calls: number; interested: number }> = {};
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      days[key] = { date: key, calls: 0, interested: 0 };
    }

    for (const c of calls) {
      const key = new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (days[key]) {
        days[key].calls++;
        if (["Interested", "Asked for proposal", "Meeting requested"].includes(c.quickOutcome)) {
          days[key].interested++;
        }
      }
    }

    return Object.values(days);
  }, [calls]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case "Interested":
      case "Meeting requested":
        return "bg-accent-mint text-success border-primary/20";
      case "Asked for proposal":
      case "Asked for budget":
        return "bg-accent-mint text-accent-mint-text border-primary/20";
      case "Call back":
        return "bg-accent-yellow text-accent-yellow-text border-amber-500/25";
      case "Rejected":
      case "Wrong person":
        return "bg-accent-coral text-accent-coral-text border-red-500/25";
      default:
        return "bg-surface-subtle text-text-secondary border-border";
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Page Header matching Admin Control Room */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5" />
              AUDIT & VERIFICATION
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-text-primary sm:text-4xl">
              Call Reports & Outreach Activity
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
              Historical record of corporate outreach calls, structured debriefs, and AI extracted intelligence.
            </p>
            <p className="mt-3 text-[11px] font-medium text-text-muted">
              DEC 04-05 · Division of Civil Engineering · Cochin University of Science and Technology (CUSAT)
            </p>
          </div>

          <div className="flex items-center divide-x divide-border border border-border bg-surface shadow-2xs">
            <div className="px-5 py-3 text-center min-w-[6rem]">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-muted">Total Calls</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-text-primary">{calls.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Operational KPI Strip */}
      <section aria-labelledby="call-stats-heading" className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Execution Metrics</p>
          <h2 id="call-stats-heading" className="mt-1 text-base font-bold text-text-primary">
            Outreach Velocity Breakdown
          </h2>
        </div>

        <div className="grid gap-6 border-y border-border py-5 sm:grid-cols-2 lg:grid-cols-7 bg-surface">
          <div className="border-l-2 border-primary pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Calls Today</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-text-primary">{metrics.callsToday}</p>
            <p className="mt-0.5 text-[10px] text-text-secondary">Shift velocity</p>
          </div>
          <div className="border-l-2 border-border-strong pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">This Week</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-text-primary">{metrics.callsThisWeek}</p>
            <p className="mt-0.5 text-[10px] text-text-secondary">Past 7 days</p>
          </div>
          <div className="border-l-2 border-success pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Connected</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-success">{metrics.connected}</p>
            <p className="mt-0.5 text-[10px] text-text-secondary">Direct conversation</p>
          </div>
          <div className="border-l-2 border-border-strong pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">No Answer</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-text-primary">{metrics.noAnswer}</p>
            <p className="mt-0.5 text-[10px] text-text-secondary">Unreached / wrong</p>
          </div>
          <div className="border-l-2 border-warning pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Follow-ups</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-warning">{metrics.followUpsCreated}</p>
            <p className="mt-0.5 text-[10px] text-text-secondary">Scheduled callbacks</p>
          </div>
          <div className="border-l-2 border-primary pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Interested</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-primary">{metrics.interested}</p>
            <p className="mt-0.5 text-[10px] text-text-secondary">Qualified interest</p>
          </div>
          <div className="border-l-2 border-success pl-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">Converted</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-success">{metrics.converted}</p>
            <p className="mt-0.5 text-[10px] text-text-secondary">Meetings locked</p>
          </div>
        </div>
      </section>

      {/* Call Activity Chart */}
      <section className="border border-border bg-surface p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-subtle pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-text-primary">Call Activity</h2>
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              Daily volume of outreach calls dialed over the last 7 days.
            </p>
          </div>
          <div className="flex gap-4 text-[10px] font-semibold text-text-muted">
            <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 bg-primary" /> Total Calls</span>
            <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 bg-success" /> Interested</span>
          </div>
        </div>
        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="volunteerCallsGrad" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="calls" stroke="var(--brand-primary)" strokeWidth={2} fillOpacity={1} fill="url(#volunteerCallsGrad)" name="Calls" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Calls Log Table */}
      <section className="border border-border bg-surface overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-border-subtle">
          <h2 className="text-base font-bold text-text-primary tracking-tight">
            RECENT OUTREACH CALLS & DEBRIEFS
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Click &quot;View Lead&quot; to inspect full company details and historical notes
          </p>
        </div>

        {recentCalls === undefined ? (
          <div className="p-12 text-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            <p className="mt-3 text-xs text-text-secondary">Loading call debrief history...</p>
          </div>
        ) : calls.length === 0 ? (
          <div className="p-10 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground">
              <PhoneCall className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-text-primary">No calls logged yet</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                When you dial company decision makers and record debrief notes, they will appear in this audit log.
              </p>
            </div>
            <Link href="/workspace">
              <Button variant="primary" size="sm" className="text-xs">
                Open Outreach Workstation
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-table-header/70 text-[10px] font-bold text-text-muted uppercase tracking-[0.14em]">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Quick Outcome</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Debrief Notes & Signals</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-xs">
                {calls.map((call) => (
                  <tr key={call._id} className="hover:bg-table-row-hover transition-colors">
                    <td className="py-3 px-4 font-mono text-text-muted whitespace-nowrap">
                      {new Date(call.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-text-primary">{call.companyName}</p>
                      <p className="text-[11px] text-text-muted">{call.companyIndustry || "Corporate"}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold border ${getOutcomeBadge(call.quickOutcome)}`}>
                        {call.quickOutcome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-text-muted" />
                        <span>{formatDuration(call.durationSeconds)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      {call.debrief?.discussionSummary ? (
                        <p className="line-clamp-2 text-text-secondary text-[11px]">
                          {call.debrief.discussionSummary}
                        </p>
                      ) : (
                        <span className="text-text-muted italic text-[11px]">No debrief summary</span>
                      )}
                      {call.debrief?.primaryObjection && (
                        <span className="mt-1 inline-block text-[10px] text-amber-800 dark:text-amber-300 bg-accent-yellow px-1.5 py-0.2 font-medium">
                          Objection: {call.debrief.primaryObjection}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCompanyDossier(call.companyId)}
                        className="text-xs text-primary border-border hover:bg-surface-subtle"
                      >
                        View Lead
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
