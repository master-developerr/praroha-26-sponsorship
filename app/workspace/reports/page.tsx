"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { useWorkspace } from "@/components/volunteer/WorkspaceContext";
import { PhoneCall, Clock, MessageSquare, AlertCircle, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallReportsPage() {
  const { user } = useAuthUser();
  const { openCompanyDossier } = useWorkspace();
  const clerkId = user?.id || "";

  const recentCalls = useQuery(
    api.calls.getMyRecentCalls,
    clerkId ? { volunteerClerkId: clerkId } : "skip"
  );

  const calls = recentCalls || [];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case "Interested":
      case "Meeting requested":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Asked for proposal":
      case "Asked for budget":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "Call back":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Rejected":
      case "Wrong person":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <PhoneCall className="h-4 w-4" />
            <span>Audit & Verification</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Call Reports & Debrief Logs
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Historical log of all corporate outreach calls, structured debriefs, and AI extracted insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-secondary bg-surface-subtle border border-border px-3 py-1.5 rounded-lg">
            Calls Logged: <strong className="text-text-primary">{calls.length}</strong>
          </span>
        </div>
      </div>

      {/* Calls List / Table */}
      {recentCalls === undefined ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent mx-auto" />
          <p className="mt-3 text-xs text-text-secondary">Loading call debrief history...</p>
        </div>
      ) : calls.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-mint/60 text-primary">
            <PhoneCall className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">No calls logged yet</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            When you complete outreach calls and submit debrief notes or voice recordings, they will appear here with automated AI analysis.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Quick Outcome</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Debrief Notes & Signals</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {calls.map((call) => (
                  <tr key={call._id} className="hover:bg-surface-subtle/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-text-muted whitespace-nowrap">
                      {new Date(call.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-text-primary">{call.companyName}</p>
                      <p className="text-[11px] text-text-muted">{call.companyIndustry || "Corporate"}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getOutcomeBadge(
                          call.quickOutcome
                        )}`}
                      >
                        {call.quickOutcome}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary flex items-center gap-1">
                      <Clock className="h-3 w-3 text-text-muted" />
                      <span>{formatDuration(call.durationSeconds)}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      {call.debrief?.discussionSummary ? (
                        <p className="line-clamp-2 text-text-secondary text-[11px]">
                          {call.debrief.discussionSummary}
                        </p>
                      ) : (
                        <span className="text-text-muted italic">No debrief summary</span>
                      )}
                      {call.debrief?.primaryObjection && (
                        <span className="mt-1 inline-block text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-medium">
                          Objection: {call.debrief.primaryObjection}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openCompanyDossier(call.companyId)}
                        className="text-xs text-primary hover:bg-accent-mint/30"
                      >
                        View Lead
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
