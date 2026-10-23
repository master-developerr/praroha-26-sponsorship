"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { downloadCSV } from "@/lib/export/csvExport";
import { DestructiveConfirmationModal } from "@/components/admin/DestructiveConfirmationModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminKpiStrip } from "@/components/admin/AdminKpiStrip";
import { Button } from "@/components/ui/button";
import {
  Database,
  Building2,
  Users2,
  PhoneCall,
  Award,
  AlertTriangle,
  Download,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Clock,
  CheckCircle2,
  X,
  FileSpreadsheet,
} from "lucide-react";

export function DataManagementView() {
  const { user } = useAuthUser();
  const adminClerkId = user?.id || "";

  // Queries
  const dataCounts = useQuery(
    api.dataManagement.getSystemDataCounts,
    adminClerkId ? { adminClerkId } : "skip"
  );

  const recentOperations = useQuery(
    api.dataManagement.getRecentDestructiveOperations,
    adminClerkId ? { adminClerkId } : "skip"
  );

  // Export queries
  const companiesData = useQuery(api.analytics.getExportData, { type: "companies" });
  const studentsData = useQuery(api.analytics.getExportData, { type: "students" });
  const callsData = useQuery(api.analytics.getExportData, { type: "calls" });
  const auditLogsData = useQuery(api.analytics.getExportData, { type: "audit_logs" });

  // Mutations
  const deleteAllLeadsMutation = useMutation(api.dataManagement.deleteAllLeads);
  const deleteAllStudentsMutation = useMutation(api.dataManagement.deleteAllStudents);
  const deleteAllOutreachMutation = useMutation(api.dataManagement.deleteAllOutreach);
  const resetEventDataMutation = useMutation(api.dataManagement.resetEventData);
  const factoryResetMutation = useMutation(api.dataManagement.factoryReset);

  // Active destructive modal state
  const [activeModal, setActiveModal] = useState<
    "DELETE_LEADS" | "DELETE_STUDENTS" | "DELETE_OUTREACH" | "RESET_EVENT" | "FACTORY_RESET" | null
  >(null);

  // Operational feedback banner state
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
    deletedCounts?: any;
  } | null>(null);

  const [downloadingType, setDownloadingType] = useState<string | null>(null);

  // Export Handlers
  const handleExportLeads = async () => {
    if (!companiesData) return;
    setDownloadingType("companies");
    try {
      downloadCSV(companiesData, "praroha26_leads_backup");
    } finally {
      setTimeout(() => setDownloadingType(null), 500);
    }
  };

  const handleExportStudents = async () => {
    if (!studentsData) return;
    setDownloadingType("students");
    try {
      downloadCSV(studentsData, "praroha26_students_backup");
    } finally {
      setTimeout(() => setDownloadingType(null), 500);
    }
  };

  const handleExportOutreach = async () => {
    if (!callsData) return;
    setDownloadingType("calls");
    try {
      downloadCSV(callsData, "praroha26_outreach_backup");
    } finally {
      setTimeout(() => setDownloadingType(null), 500);
    }
  };

  const handleExportAuditTrail = async () => {
    if (!auditLogsData) return;
    setDownloadingType("audit_logs");
    try {
      downloadCSV(auditLogsData, "praroha26_audit_trail_backup");
    } finally {
      setTimeout(() => setDownloadingType(null), 500);
    }
  };

  // Destructive Execution Handlers
  const handleExecuteDeleteLeads = async () => {
    if (!adminClerkId) return;
    const res = await deleteAllLeadsMutation({
      adminClerkId,
      confirmationPhrase: "DELETE ALL LEADS",
    });
    setFeedback({
      type: "success",
      message: res.message,
      deletedCounts: res.deletedCounts,
    });
  };

  const handleExecuteDeleteStudents = async () => {
    if (!adminClerkId) return;
    const res = await deleteAllStudentsMutation({
      adminClerkId,
      confirmationPhrase: "DELETE ALL STUDENTS",
    });
    setFeedback({
      type: "success",
      message: res.message,
      deletedCounts: res.deletedCounts,
    });
  };

  const handleExecuteDeleteOutreach = async () => {
    if (!adminClerkId) return;
    const res = await deleteAllOutreachMutation({
      adminClerkId,
      confirmationPhrase: "DELETE ALL OUTREACH",
    });
    setFeedback({
      type: "success",
      message: res.message,
      deletedCounts: res.deletedCounts,
    });
  };

  const handleExecuteResetEvent = async () => {
    if (!adminClerkId) return;
    const res = await resetEventDataMutation({
      adminClerkId,
      confirmationPhrase: "RESET EVENT DATA",
    });
    setFeedback({
      type: "success",
      message: res.message,
      deletedCounts: res.deletedCounts,
    });
  };

  const handleExecuteFactoryReset = async () => {
    if (!adminClerkId) return;
    const res = await factoryResetMutation({
      adminClerkId,
      confirmationPhrase: "FACTORY RESET PRAROHA26",
    });
    setFeedback({
      type: "success",
      message: res.message,
      deletedCounts: res.deletedCounts,
    });
  };

  const raw = dataCounts?.rawCounts || {
    companies: 0,
    contacts: 0,
    students: 0,
    admins: 1,
    assignments: 0,
    calls: 0,
    callDebriefs: 0,
    followUps: 0,
    proposals: 0,
    commitments: 0,
    pointTransactions: 0,
    notifications: 0,
    aiAnalyses: 0,
    auditLogs: 0,
  };

  const totalSystemRecords =
    raw.companies +
    raw.contacts +
    raw.students +
    raw.calls +
    raw.callDebriefs +
    raw.followUps +
    raw.proposals +
    raw.commitments +
    raw.assignments +
    raw.pointTransactions +
    raw.aiAnalyses +
    raw.notifications;

  const impacts = dataCounts?.impacts;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Standardized Admin Page Header */}
      <AdminPageHeader
        category="ADMIN GOVERNANCE"
        title="Data management & system control."
        description="Audit database volumes, generate certified RFC-4180 archives, and execute authorized server-side administrative operations."
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Auth Verified
            </span>
          </div>
        }
      />

      {/* Operational Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-start justify-between gap-3 rounded-lg border p-4 text-xs transition-all ${
            feedback.type === "success"
              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-900 dark:text-emerald-300"
              : "border-rose-500/20 bg-rose-500/5 text-rose-900 dark:text-rose-300"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            )}
            <div>
              <p className="font-semibold text-[13px]">{feedback.message}</p>
              {feedback.deletedCounts && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  {Object.entries(feedback.deletedCounts).map(([key, val]) => (
                    <span
                      key={key}
                      className="rounded border border-border/40 bg-surface px-2 py-1 text-text-primary"
                    >
                      {key}: <strong>{String(val)}</strong>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-text-muted hover:text-text-primary transition-colors p-1"
            aria-label="Dismiss feedback"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. Standardized KPI Strip: Live Storage Overview */}
      <AdminKpiStrip
        columns={6}
        items={[
          {
            label: "Total Leads",
            value: raw.companies,
            subtext: `${raw.contacts} verified contacts`,
            variant: "primary",
          },
          {
            label: "Student SDRs",
            value: raw.students,
            subtext: `${raw.admins} system admin${raw.admins > 1 ? "s" : ""}`,
            variant: "info",
          },
          {
            label: "Outreach Calls",
            value: raw.calls,
            subtext: `${raw.callDebriefs} voice debriefs`,
            variant: "warning",
          },
          {
            label: "Follow-ups",
            value: raw.followUps,
            subtext: `${raw.assignments} active allocations`,
            variant: "neutral",
          },
          {
            label: "Sponsorship Deals",
            value: raw.commitments,
            subtext: `${raw.proposals} proposals dispatched`,
            variant: "success",
          },
          {
            label: "Total System Records",
            value: totalSystemRecords,
            subtext: "Across all database tables",
            variant: "primary",
          },
        ]}
      />

      {/* 3. SECTION 1: CERTIFIED DATA EXPORT & ARCHIVAL */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[13px] font-semibold text-text-primary flex items-center gap-2">
              <Download className="h-4 w-4 text-[var(--brand-primary)]" />
              Certified Data Export & Archival
            </h2>
            <p className="text-[11px] text-text-muted mt-0.5">
              Download RFC-4180 compliant CSV archives before executing administrative operations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Export Leads */}
          <div className="rounded-lg border border-border bg-surface p-4 flex flex-col justify-between transition-colors hover:border-border/80">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  29 Canonical Fields
                </span>
                <span className="font-mono text-xs font-semibold text-text-primary">
                  {raw.companies} leads
                </span>
              </div>
              <h3 className="text-xs font-semibold text-text-primary">Master Leads Archive</h3>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                Full corporate profiles, verified contacts, sector classifications, and pipeline stages.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportLeads}
              disabled={downloadingType === "companies" || raw.companies === 0}
              className="mt-4 w-full h-8 text-xs font-medium gap-1.5"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              {downloadingType === "companies" ? "Exporting..." : "Export Leads CSV"}
            </Button>
          </div>

          {/* Export Students */}
          <div className="rounded-lg border border-border bg-surface p-4 flex flex-col justify-between transition-colors hover:border-border/80">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-500/10 text-sky-700 dark:text-sky-400">
                  Team Roster
                </span>
                <span className="font-mono text-xs font-semibold text-text-primary">
                  {raw.students} volunteers
                </span>
              </div>
              <h3 className="text-xs font-semibold text-text-primary">Student SDR Roster</h3>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                Registered student SDRs, departments, semesters, verification records, and point balances.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportStudents}
              disabled={downloadingType === "students" || raw.students === 0}
              className="mt-4 w-full h-8 text-xs font-medium gap-1.5"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              {downloadingType === "students" ? "Exporting..." : "Export Students CSV"}
            </Button>
          </div>

          {/* Export Outreach */}
          <div className="rounded-lg border border-border bg-surface p-4 flex flex-col justify-between transition-colors hover:border-border/80">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-700 dark:text-purple-400">
                  Operations Logs
                </span>
                <span className="font-mono text-xs font-semibold text-text-primary">
                  {raw.calls} calls
                </span>
              </div>
              <h3 className="text-xs font-semibold text-text-primary">Outreach Activity & Debriefs</h3>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                Call history, conversation debriefs, objection tags, durations, callbacks, and outcomes.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportOutreach}
              disabled={downloadingType === "calls" || raw.calls === 0}
              className="mt-4 w-full h-8 text-xs font-medium gap-1.5"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              {downloadingType === "calls" ? "Exporting..." : "Export Outreach CSV"}
            </Button>
          </div>
        </div>
      </div>

      {/* 4. SECTION 2: OPERATIONAL PURGE OPERATIONS */}
      <div className="space-y-3">
        <div>
          <h2 className="text-[13px] font-semibold text-text-primary flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-rose-500" />
            Operational Collection Management
          </h2>
          <p className="text-[11px] text-text-muted mt-0.5">
            Selectively purge specific operational collections with automatic cascading cleanup of dependent records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Purge Leads */}
          <div className="rounded-lg border border-border bg-surface p-4 flex flex-col justify-between transition-colors hover:border-rose-500/30">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-700 dark:text-rose-400">
                  {raw.companies} Leads
                </span>
                <span className="text-[11px] font-mono text-text-muted">
                  Affected: {impacts?.leadsImpact.total || 0}
                </span>
              </div>
              <h3 className="text-xs font-semibold text-text-primary">Delete All Leads</h3>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                Permanently purges all corporate company and contact records. Cascades to allocations, callbacks, proposals, and commitments.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveModal("DELETE_LEADS")}
              disabled={raw.companies === 0}
              className="mt-4 w-full h-8 text-xs font-medium text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/5 hover:border-rose-500/40"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Purge Leads
            </Button>
          </div>

          {/* Purge Students */}
          <div className="rounded-lg border border-border bg-surface p-4 flex flex-col justify-between transition-colors hover:border-rose-500/30">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  {raw.students} Students
                </span>
                <span className="text-[11px] font-mono text-text-muted">
                  Affected: {impacts?.studentsImpact.total || 0}
                </span>
              </div>
              <h3 className="text-xs font-semibold text-text-primary">Delete All Students / Volunteers</h3>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                Removes all student SDR accounts and points. Releases assigned companies back to the UNASSIGNED pool. Preserves admin accounts.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveModal("DELETE_STUDENTS")}
              disabled={raw.students === 0}
              className="mt-4 w-full h-8 text-xs font-medium text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/5 hover:border-rose-500/40"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Purge Students
            </Button>
          </div>

          {/* Purge Outreach */}
          <div className="rounded-lg border border-border bg-surface p-4 flex flex-col justify-between transition-colors hover:border-rose-500/30">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-700 dark:text-purple-400">
                  {raw.calls} Calls
                </span>
                <span className="text-[11px] font-mono text-text-muted">
                  Affected: {impacts?.outreachImpact.total || 0}
                </span>
              </div>
              <h3 className="text-xs font-semibold text-text-primary">Delete All Outreach Data</h3>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                Clears call logs, debrief transcripts, follow-ups, and active allocations. Resets lead statuses. Preserves company records and user accounts.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveModal("DELETE_OUTREACH")}
              disabled={raw.calls === 0 && raw.followUps === 0 && raw.assignments === 0}
              className="mt-4 w-full h-8 text-xs font-medium text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/5 hover:border-rose-500/40"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Purge Outreach
            </Button>
          </div>
        </div>
      </div>

      {/* 5. SECTION 3: DANGER ZONE (SYSTEM RESETS) */}
      <div className="rounded-lg border border-rose-500/20 bg-rose-500/[0.02] dark:bg-rose-950/[0.1] p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-rose-900 dark:text-rose-200">
              Danger Zone — Irreversible System Resets
            </h2>
            <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80 mt-0.5">
              These operations execute irreversible server-side purges. Explicit confirmation phrases are strictly enforced.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Action 1: Reset Event Data */}
          <div className="rounded-md border border-rose-500/20 bg-surface p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  Event Reset
                </span>
                <span className="font-mono text-xs text-text-muted">
                  {impacts?.resetEventImpact.total || 0} records
                </span>
              </div>
              <h3 className="text-xs font-semibold text-text-primary">Reset Event Data</h3>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                Clears all event operational records (leads, contacts, calls, commitments, proposals, and allocations). 
                <strong> Preserves:</strong> All admin and volunteer user accounts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[10px] font-mono text-text-muted">Phrase: RESET EVENT DATA</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal("RESET_EVENT")}
                className="h-7 text-xs font-medium text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/5"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset Event Data
              </Button>
            </div>
          </div>

          {/* Action 2: Factory Reset */}
          <div className="rounded-md border border-rose-500/40 bg-surface p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-600 text-white">
                  Factory Reset
                </span>
                <span className="font-mono text-xs text-text-muted">
                  {impacts?.factoryResetImpact.total || 0} records
                </span>
              </div>
              <h3 className="text-xs font-semibold text-rose-950 dark:text-rose-200">Factory Reset PRAROHA'26</h3>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                Completely wipes the entire database back to a pristine installation state. Removes volunteers, other admin accounts, all leads, and calls.
                <strong> Preserves ONLY:</strong> Your current admin user account.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[10px] font-mono text-text-muted font-semibold">Phrase: FACTORY RESET PRAROHA26</span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setActiveModal("FACTORY_RESET")}
                className="h-7 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
              >
                <ShieldAlert className="h-3 w-3 mr-1" />
                Factory Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. SECTION 4: RECENT DESTRUCTIVE AUDIT LOG */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[13px] font-semibold text-text-primary flex items-center gap-2">
              <Clock className="h-4 w-4 text-text-muted" />
              Destructive Operations Audit Trail
            </h2>
            <p className="text-[11px] text-text-muted mt-0.5">
              Forensic log of all data management operations executed by administrative users.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAuditTrail}
            className="h-7 text-xs font-medium gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export Audit Trail CSV
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-[11px] font-medium text-text-muted uppercase tracking-wider">
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">Admin Actor</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Records Deleted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {!recentOperations || recentOperations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-text-muted text-xs">
                      No destructive operations executed in recent audit history.
                    </td>
                  </tr>
                ) : (
                  recentOperations.map((op: any) => (
                    <tr key={op._id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-[11px] text-text-muted">
                        {new Date(op.timestamp).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-rose-600 dark:text-rose-400">
                        {op.action.replace("data:", "").replace(/_/g, " ").toUpperCase()}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-medium text-text-primary block">{op.actorName}</span>
                        <span className="text-[10px] text-text-muted">{op.actorEmail}</span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          {op.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-medium text-text-primary">
                        {op.deletedCounts?.total ??
                          Object.values(op.deletedCounts || {}).reduce(
                            (a: any, b: any) => (typeof b === "number" ? a + b : a),
                            0
                          )}{" "}
                        records
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 7. CONFIRMATION MODALS (Preserve all existing logic) */}
      {/* Modal 1: Delete All Leads */}
      <DestructiveConfirmationModal
        isOpen={activeModal === "DELETE_LEADS"}
        onClose={() => setActiveModal(null)}
        title="Delete All Corporate Leads?"
        operationKey="DELETE_LEADS"
        description="Permanently delete ALL company and contact records from the database, including cascading assignments, follow-ups, calls, proposals, and commitments."
        requiredPhrase="DELETE ALL LEADS"
        impactSummary={impacts?.leadsImpact || {}}
        onExportData={handleExportLeads}
        exportLabel="Export Leads CSV"
        onConfirm={handleExecuteDeleteLeads}
      />

      {/* Modal 2: Delete All Students */}
      <DestructiveConfirmationModal
        isOpen={activeModal === "DELETE_STUDENTS"}
        onClose={() => setActiveModal(null)}
        title="Delete All Students / Volunteers?"
        operationKey="DELETE_STUDENTS"
        description="Permanently delete ALL student SDR accounts, their gamification points, call records, and allocations. Preserves system admin accounts."
        requiredPhrase="DELETE ALL STUDENTS"
        impactSummary={impacts?.studentsImpact || {}}
        onExportData={handleExportStudents}
        exportLabel="Export Students CSV"
        onConfirm={handleExecuteDeleteStudents}
      />

      {/* Modal 3: Delete All Outreach */}
      <DestructiveConfirmationModal
        isOpen={activeModal === "DELETE_OUTREACH"}
        onClose={() => setActiveModal(null)}
        title="Delete All Outreach Data?"
        operationKey="DELETE_OUTREACH"
        description="Clear all call history, debrief transcripts, follow-ups, and allocations. Leads will be reset to UNASSIGNED. Preserves user accounts and company records."
        requiredPhrase="DELETE ALL OUTREACH"
        impactSummary={impacts?.outreachImpact || {}}
        onExportData={handleExportOutreach}
        exportLabel="Export Outreach CSV"
        onConfirm={handleExecuteDeleteOutreach}
      />

      {/* Modal 4: Reset Event Data */}
      <DestructiveConfirmationModal
        isOpen={activeModal === "RESET_EVENT"}
        onClose={() => setActiveModal(null)}
        title="Reset All Event Data?"
        operationKey="RESET_EVENT"
        description="Purge all leads, contacts, calls, commitments, proposals, and allocations. Preserves all user accounts (admins & volunteers) and event configuration."
        requiredPhrase="RESET EVENT DATA"
        impactSummary={impacts?.resetEventImpact || {}}
        onExportData={handleExportLeads}
        exportLabel="Export Leads Backup"
        onConfirm={handleExecuteResetEvent}
      />

      {/* Modal 5: Factory Reset */}
      <DestructiveConfirmationModal
        isOpen={activeModal === "FACTORY_RESET"}
        onClose={() => setActiveModal(null)}
        title="Factory Reset PRAROHA'26 System?"
        operationKey="FACTORY_RESET"
        description="Irreversible action: Restores the application to a clean production state. Wipes all data across all collections except your current admin account."
        requiredPhrase="FACTORY RESET PRAROHA26"
        isExtremeDanger={true}
        impactSummary={impacts?.factoryResetImpact || {}}
        onExportData={handleExportLeads}
        exportLabel="Export Emergency Backup"
        onConfirm={handleExecuteFactoryReset}
      />
    </div>
  );
}
