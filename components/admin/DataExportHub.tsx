"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { downloadCSV } from "@/lib/export/csvExport";
import {
  Download,
  Building2,
  PhoneCall,
  Award,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  ArrowDownToLine,
  ShieldCheck,
} from "lucide-react";

export function DataExportHub() {
  const [downloadingType, setDownloadingType] = useState<string | null>(null);

  // Queries for the datasets
  const companiesData = useQuery(api.analytics.getExportData, { type: "companies" });
  const callsData = useQuery(api.analytics.getExportData, { type: "calls" });
  const commitmentsData = useQuery(api.analytics.getExportData, { type: "commitments" });

  const handleExportCompanies = async () => {
    if (!companiesData) return;
    setDownloadingType("companies");
    try {
      downloadCSV(companiesData, "praroha26_master_lead_directory");
    } finally {
      setTimeout(() => setDownloadingType(null), 500);
    }
  };

  const handleExportCalls = async () => {
    if (!callsData) return;
    setDownloadingType("calls");
    try {
      downloadCSV(callsData, "praroha26_outreach_calls_history");
    } finally {
      setTimeout(() => setDownloadingType(null), 500);
    }
  };

  const handleExportCommitments = async () => {
    if (!commitmentsData) return;
    setDownloadingType("commitments");
    try {
      downloadCSV(commitmentsData, "praroha26_ratified_sponsorship_commitments");
    } finally {
      setTimeout(() => setDownloadingType(null), 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50 text-sky-900 text-xs">
        <ShieldCheck className="h-5 w-5 text-sky-700 shrink-0" />
        <div>
          <p className="font-bold">Administrative Confidential Export Authority</p>
          <p className="text-[11px] text-sky-800 mt-0.5">
            Exports are generated directly from real-time Convex collections in canonical RFC-4180 CSV formats. All export operations are recorded in the audit trail.
          </p>
        </div>
      </div>

      {/* 3 Export Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Master Companies */}
        <div className="flex flex-col justify-between p-5 rounded-2xl border border-border bg-surface shadow-xs hover:border-primary/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                29 Canonical Fields
              </span>
            </div>

            <h3 className="text-sm font-bold text-text-primary">
              Master Lead Directory
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Complete corporate dossiers with industry classification, Kerala presence, ask ranges, verified contacts, and stage lifecycle states.
            </p>

            <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between text-xs">
              <span className="text-text-muted">Total Companies</span>
              <span className="font-bold text-text-primary">
                {companiesData ? `${companiesData.length} records` : "Loading..."}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={handleExportCompanies}
              disabled={!companiesData || companiesData.length === 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-primary hover:bg-primary-hover text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <ArrowDownToLine className="h-4 w-4" />
              {downloadingType === "companies" ? "Generating CSV..." : "Export Leads CSV"}
            </button>
          </div>
        </div>

        {/* Card 2: Call History & Debriefs */}
        <div className="flex flex-col justify-between p-5 rounded-2xl border border-border bg-surface shadow-xs hover:border-sky-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <PhoneCall className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                Audited Logs
              </span>
            </div>

            <h3 className="text-sm font-bold text-text-primary">
              Outreach Calls & Debriefs
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Every phone outreach session, call durations, outcomes, volunteer discussion notes, primary objections, and scheduled callback timestamps.
            </p>

            <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between text-xs">
              <span className="text-text-muted">Calls Logged</span>
              <span className="font-bold text-text-primary">
                {callsData ? `${callsData.length} sessions` : "Loading..."}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={handleExportCalls}
              disabled={!callsData || callsData.length === 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-sky-700 hover:bg-sky-800 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <ArrowDownToLine className="h-4 w-4" />
              {downloadingType === "calls" ? "Generating CSV..." : "Export Call Logs CSV"}
            </button>
          </div>
        </div>

        {/* Card 3: Sponsorship Commitments */}
        <div className="flex flex-col justify-between p-5 rounded-2xl border border-border bg-surface shadow-xs hover:border-emerald-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Award className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Ratified Deals
              </span>
            </div>

            <h3 className="text-sm font-bold text-text-primary">
              Sponsorship Commitments
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Ratified commercial commitments with contracted cash sums, in-kind valuation breakdown, deliverables checklists, and MoU references.
            </p>

            <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between text-xs">
              <span className="text-text-muted">Confirmed Deals</span>
              <span className="font-bold text-text-primary">
                {commitmentsData ? `${commitmentsData.length} contracts` : "Loading..."}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={handleExportCommitments}
              disabled={!commitmentsData || commitmentsData.length === 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <ArrowDownToLine className="h-4 w-4" />
              {downloadingType === "commitments" ? "Generating CSV..." : "Export Commitments CSV"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
