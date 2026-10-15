"use client";

import React, { useState } from "react";
import { AuditLogConsole } from "@/components/admin/AuditLogConsole";
import { DataExportHub } from "@/components/admin/DataExportHub";
import { ShieldAlert, Download, History, Database } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"audit" | "export">("audit");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-text-primary">
              Audit Trail & Data Export Hub
            </h1>
            <span className="rounded bg-sky-100 px-2 py-0.5 text-[11px] font-bold text-sky-800">
              Admin Only
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Immutable operational logs and RFC-4180 canonical CSV dataset downloads for PRAROHA'26.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-xl bg-surface-subtle p-1 border border-border">
          <button
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "audit"
                ? "bg-surface text-text-primary shadow-xs"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <History className="h-3.5 w-3.5 text-sky-600" />
            <span>Audit Trail</span>
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "export"
                ? "bg-surface text-text-primary shadow-xs"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <Download className="h-3.5 w-3.5 text-primary" />
            <span>1-Click Exports</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "audit" ? <AuditLogConsole /> : <DataExportHub />}
    </div>
  );
}
