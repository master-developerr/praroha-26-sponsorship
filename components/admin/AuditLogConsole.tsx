"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ShieldAlert,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Activity,
  FileCode,
  CheckCircle2,
} from "lucide-react";

export function AuditLogConsole() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Fetch filtered audit logs from Convex
  const logs = useQuery(api.analytics.getAuditLogsFiltered, {
    action: actionFilter === "all" ? undefined : actionFilter,
    entityType: entityFilter === "all" ? undefined : entityFilter,
    search: searchTerm.trim() ? searchTerm.trim() : undefined,
    limit: 100,
  });

  const getActionBadge = (action: string) => {
    if (action.includes("authorize") || action.includes("approved")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (action.includes("reassign") || action.includes("adjust")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (action.includes("rejected") || action.includes("suspend")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-sky-50 text-sky-700 border-sky-200";
  };

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const renderJsonPretty = (rawJson: string) => {
    try {
      const parsed = JSON.parse(rawJson);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return rawJson;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 rounded-xl border border-border shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action, actor, or ID..."
            className="h-9 w-full rounded-lg border border-border bg-surface-subtle/50 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none"
          />
        </div>

        {/* Action Type Filter */}
        <div className="flex items-center gap-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="h-9 rounded-lg border border-border bg-surface px-3 text-xs text-text-secondary focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="all">All Actions</option>
            <option value="commitments:authorize">Sponsorship Authorizations</option>
            <option value="leads:reassign">Lead Reassignments</option>
            <option value="users:verify">Volunteer Verifications</option>
            <option value="points:adjust">Points Adjustments</option>
            <option value="proposals:create">Proposals Created</option>
            <option value="calls:log">Outreach Calls</option>
          </select>

          {/* Entity Type Filter */}
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="h-9 rounded-lg border border-border bg-surface px-3 text-xs text-text-secondary focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="all">All Entities</option>
            <option value="companies">Companies</option>
            <option value="users">Users / SDRs</option>
            <option value="proposals">Proposals</option>
            <option value="sponsorshipCommitments">Commitments</option>
            <option value="pointTransactions">Points</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/80 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {logs === undefined ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-muted">
                    Loading audit stream...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-muted">
                    No audit records matching criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isExpanded = expandedLogId === log._id;
                  return (
                    <React.Fragment key={log._id}>
                      <tr className="hover:bg-surface-subtle/40 transition-colors">
                        {/* Timestamp */}
                        <td className="py-3 px-4 text-text-muted font-mono whitespace-nowrap">
                          {formatTimestamp(log.timestamp)}
                        </td>

                        {/* Actor */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-700">
                              <User className="h-3 w-3" />
                            </div>
                            <div>
                              <p className="font-semibold text-text-primary text-xs">
                                {log.actorName}
                              </p>
                              <p className="text-[10px] text-text-muted">
                                {log.actorEmail}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Action Badge */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getActionBadge(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>
                        </td>

                        {/* Entity */}
                        <td className="py-3 px-4 font-mono text-[11px] text-text-secondary whitespace-nowrap">
                          <span className="font-semibold text-text-primary">
                            {log.entityType}
                          </span>
                          <span className="text-text-muted text-[10px] block truncate max-w-[120px]">
                            {log.entityId}
                          </span>
                        </td>

                        {/* Details Toggle */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() =>
                              setExpandedLogId(isExpanded ? null : log._id)
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-surface hover:bg-surface-subtle text-text-secondary text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            <span>Diff</span>
                            {isExpanded ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Changes Diff View */}
                      {isExpanded && (
                        <tr className="bg-surface-subtle/70">
                          <td colSpan={5} className="p-4 border-b border-border">
                            <div className="rounded-lg border border-border bg-slate-950 p-3 text-slate-100 font-mono text-[11px] overflow-x-auto">
                              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                                <span>Changes Payload / Mutation Context:</span>
                                <span>Action: {log.action}</span>
                              </div>
                              <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                                {renderJsonPretty(log.changes)}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
