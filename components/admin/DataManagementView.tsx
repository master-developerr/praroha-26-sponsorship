"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { downloadCSV } from "@/lib/export/csvExport";
import { DestructiveConfirmationModal } from "@/components/admin/DestructiveConfirmationModal";
import { StatCard } from "@/components/ui/stat-card";
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
  RefreshCw,
  Layers,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
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

  // Operational feedback toast/banner state
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

  const impacts = dataCounts?.impacts;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-rose-100 text-rose-900 border border-rose-300 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
              ADMIN GOVERNANCE
            </span>
            <span className="text-xs text-text-muted">PRAROHA'26 SOE CUSAT</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            Data Management & Operational Reset
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Audit system storage, generate certified RFC-4180 archives, and execute authorized server-side destructive operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-900 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4 text-sky-700" />
            <span>Admin Authorization Verified</span>
          </div>
        </div>
      </div>

      {/* Operation Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-start justify-between gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200"
              : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/50 text-rose-900 dark:text-rose-200"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-rose-700 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-sm">{feedback.message}</p>
              {feedback.deletedCounts && (
                <div className="mt-2 text-[11px] grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  {Object.entries(feedback.deletedCounts).map(([key, val]) => (
                    <span key={key} className="bg-white/60 dark:bg-surface px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800/40 text-text-primary">
                      {key}: <strong>{String(val)}</strong>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-bold text-text-muted hover:text-text-primary"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Top Live Storage Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard
          title="Total Leads"
          value={raw.companies}
          change={`${raw.contacts} Verified Contacts`}
          icon={Building2}
        />
        <StatCard
          title="Student SDRs"
          value={raw.students}
          change={`${raw.admins} System Admins`}
          icon={Users2}
        />
        <StatCard
          title="Outreach Calls"
          value={raw.calls}
          change={`${raw.callDebriefs} Audited Debriefs`}
          icon={PhoneCall}
        />
        <StatCard
          title="Follow-ups"
          value={raw.followUps}
          change={`${raw.assignments} Lead Allocations`}
          icon={Clock}
        />
        <StatCard
          title="Sponsorship Deals"
          value={raw.commitments}
          change={`${raw.proposals} Proposals Created`}
          icon={Award}
        />
        <StatCard
          title="Total System Records"
          value={
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
            raw.notifications
          }
          change="Across all database tables"
          icon={Database}
        />
      </div>

      {/* 3. SECTION 1: DATA EXPORT */}
      <div className="space-y-4">
        <div className="border-b border-border-subtle pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
            <Download className="h-4 w-4 text-teal-600" />
            Certified Data Export & Archival
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Download RFC-4180 compliant CSV backups before executing any destructive operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Export Leads */}
          <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  29 Canonical Fields
                </span>
                <span className="text-xs font-mono font-bold text-text-primary">
                  {raw.companies} records
                </span>
              </div>
              <h3 className="text-xs font-bold text-text-primary">Master Leads Archive</h3>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                Full corporate profiles, contact information, industry classification, and lifecycle states.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportLeads}
              disabled={downloadingType === "companies" || raw.companies === 0}
              className="mt-4 w-full text-xs font-bold gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              {downloadingType === "companies" ? "Exporting..." : "Export Leads CSV"}
            </Button>
          </div>

          {/* Export Students */}
          <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                  Team Roster
                </span>
                <span className="text-xs font-mono font-bold text-text-primary">
                  {raw.students} volunteers
                </span>
              </div>
              <h3 className="text-xs font-bold text-text-primary">Student SDR Roster</h3>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                Registered student SDRs, departments, semesters, verification states, and point totals.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportStudents}
              disabled={downloadingType === "students" || raw.students === 0}
              className="mt-4 w-full text-xs font-bold gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              {downloadingType === "students" ? "Exporting..." : "Export Students CSV"}
            </Button>
          </div>

          {/* Export Outreach */}
          <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                  Operations Logs
                </span>
                <span className="text-xs font-mono font-bold text-text-primary">
                  {raw.calls} calls
                </span>
              </div>
              <h3 className="text-xs font-bold text-text-primary">Outreach Activity & Debriefs</h3>
              <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                Call history, volunteer discussion notes, objection tags, durations, and callbacks.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportOutreach}
              disabled={downloadingType === "calls" || raw.calls === 0}
              className="mt-4 w-full text-xs font-bold gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              {downloadingType === "calls" ? "Exporting..." : "Export Outreach Data"}
            </Button>
          </div>
        </div>
      </div>

      {/* 4. SECTION 2: DATA MANAGEMENT (OPERATIONAL DESTRUCTIVE ACTIONS) */}
      <div className="space-y-4">
        <div className="border-b border-border-subtle pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-rose-600" />
            Operational Data Management
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Selectively purge specific operational collections with automatic cascading cleanup of dependent records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Delete All Leads */}
          <div className="p-5 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40">
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="text-xs font-extrabold font-mono text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800/50">
                  {raw.companies} Leads
                </span>
              </div>
              <h3 className="text-sm font-bold text-text-primary">Delete All Leads</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Permanently deletes all corporate company and contact records. Also removes all dependent allocations, follow-ups, calls, proposals, commitments, and AI analyses.
              </p>
              <div className="mt-3 pt-3 border-t border-border-subtle text-[11px] text-text-secondary">
                Affected Records: <strong className="text-text-primary">{impacts?.leadsImpact.total || 0}</strong>
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setActiveModal("DELETE_LEADS")}
              disabled={raw.companies === 0}
              className="mt-5 w-full text-xs font-bold gap-1.5 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete All Leads
            </Button>
          </div>

          {/* Card 2: Delete All Students / Volunteers */}
          <div className="p-5 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                  <Users2 className="h-5 w-5" />
                </div>
                <span className="text-xs font-extrabold font-mono text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/50">
                  {raw.students} Students
                </span>
              </div>
              <h3 className="text-sm font-bold text-text-primary">Delete All Students / Volunteers</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Removes all student SDR accounts, gamification points, and activity. Releases all assigned companies back to the UNASSIGNED pool. Preserves admin accounts.
              </p>
              <div className="mt-3 pt-3 border-t border-border-subtle text-[11px] text-text-secondary">
                Affected Records: <strong className="text-text-primary">{impacts?.studentsImpact.total || 0}</strong>
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setActiveModal("DELETE_STUDENTS")}
              disabled={raw.students === 0}
              className="mt-5 w-full text-xs font-bold gap-1.5 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete All Students
            </Button>
          </div>

          {/* Card 3: Delete All Outreach Data */}
          <div className="p-5 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <span className="text-xs font-extrabold font-mono text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {raw.calls} Calls
                </span>
              </div>
              <h3 className="text-sm font-bold text-text-primary">Delete All Outreach Data</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Clears calls, debrief transcripts, callbacks, proposals, and allocations. Resets lead statuses to UNASSIGNED. Preserves user accounts, companies, and contacts.
              </p>
              <div className="mt-3 pt-3 border-t border-border-subtle text-[11px] text-text-secondary">
                Affected Records: <strong className="text-text-primary">{impacts?.outreachImpact.total || 0}</strong>
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setActiveModal("DELETE_OUTREACH")}
              disabled={raw.calls === 0 && raw.followUps === 0 && raw.assignments === 0}
              className="mt-5 w-full text-xs font-bold gap-1.5 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete All Outreach
            </Button>
          </div>
        </div>
      </div>

      {/* 5. SECTION 3: DANGER ZONE (SYSTEM RESETS) */}
      <div className="p-6 rounded-2xl border-2 border-rose-300 dark:border-rose-900 bg-rose-50/20 shadow-xs space-y-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-rose-950 dark:text-rose-200 uppercase tracking-wide">
              Danger Zone — Irreversible System Resets
            </h2>
            <p className="text-xs text-rose-800 dark:text-rose-300 mt-0.5">
              These actions cause widespread, permanent deletion across the database. Confirmation phrases are strictly enforced.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Action 1: Reset Event Data */}
          <div className="p-5 rounded-xl border border-rose-200 bg-surface shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40">
                  Event Reset
                </span>
                <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400">
                  {impacts?.resetEventImpact.total || 0} records
                </span>
              </div>
              <h3 className="text-sm font-bold text-text-primary">Reset Event Data</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Clears all event operational data (leads, contacts, calls, commitments, proposals, and allocations). 
                <strong> Preserves:</strong> All admin and volunteer user accounts and event configuration.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-border-subtle flex items-center justify-between">
              <span className="text-[11px] font-mono text-text-muted">Phrase: RESET EVENT DATA</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal("RESET_EVENT")}
                className="text-xs font-bold border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset Event Data
              </Button>
            </div>
          </div>

          {/* Action 2: Factory Reset */}
          <div className="p-5 rounded-xl border-2 border-rose-400 dark:border-rose-900/80 bg-rose-50/50 dark:bg-rose-950/30 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-600 text-white">
                  Extreme Danger
                </span>
                <span className="text-xs font-mono font-bold text-rose-800 dark:text-rose-300">
                  {impacts?.factoryResetImpact.total || 0} records
                </span>
              </div>
              <h3 className="text-sm font-bold text-rose-950 dark:text-rose-100">Factory Reset PRAROHA'26</h3>
              <p className="text-xs text-rose-900/80 dark:text-rose-300/80 mt-1 leading-relaxed">
                Completely wipes the entire database back to a pristine installation state. Removes all volunteers, other admin accounts, all leads, calls, commitments, and notifications.
                <strong> Preserves ONLY:</strong> Your current admin user account.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-rose-200 dark:border-rose-900/50 flex items-center justify-between">
              <span className="text-[11px] font-mono text-rose-900 dark:text-rose-300 font-bold">Phrase: FACTORY RESET PRAROHA26</span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setActiveModal("FACTORY_RESET")}
                className="text-xs font-extrabold bg-rose-700 hover:bg-rose-800 text-white shadow-xs cursor-pointer gap-1.5"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                Factory Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. SECTION 4: RECENT DESTRUCTIVE AUDIT LOG */}
      <div className="space-y-4">
        <div className="border-b border-border-subtle pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <Clock className="h-4 w-4 text-sky-600" />
              Destructive Operations Audit Trail
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Forensic record of all data management operations executed by administrative users.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAuditTrail}
            className="text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export Audit Trail CSV
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-subtle/80 text-[11px] font-bold uppercase text-text-muted">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Admin Actor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Records Deleted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {!recentOperations || recentOperations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-text-muted">
                      No destructive operations executed in recent audit history.
                    </td>
                  </tr>
                ) : (
                  recentOperations.map((op: any) => (
                    <tr key={op._id} className="hover:bg-surface-subtle/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-text-muted">
                        {new Date(op.timestamp).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4 font-bold text-rose-700">
                        {op.action.replace("data:", "").replace(/_/g, " ").toUpperCase()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-text-primary block">{op.actorName}</span>
                        <span className="text-[10px] text-text-muted">{op.actorEmail}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {op.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-text-primary">
                        {op.deletedCounts?.total ?? Object.values(op.deletedCounts || {}).reduce((a: any, b: any) => (typeof b === "number" ? a + b : a), 0)} records
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 7. CONFIRMATION MODALS */}
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
