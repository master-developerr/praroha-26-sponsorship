"use client";

import React, { useState } from "react";
import { AuditLogConsole } from "@/components/admin/AuditLogConsole";
import { DataExportHub } from "@/components/admin/DataExportHub";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Download, History } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"audit" | "export">("audit");

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <AdminPageHeader
        category="AUDIT & DATA EXPORT"
        title="System activity, historical changes and operational records."
        description="Immutable operational activity logs, historical change tracking, and RFC-4180 canonical CSV dataset exports for PRAROHA'26."
        actions={
          <div className="flex items-center gap-4 border-b border-border-subtle pb-1">
            <button
              onClick={() => setActiveTab("audit")}
              className={`border-b-2 pb-2 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "audit"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>Audit Trail</span>
            </button>
            <button
              onClick={() => setActiveTab("export")}
              className={`border-b-2 pb-2 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "export"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              <Download className="h-3.5 w-3.5" />
              <span>1-Click Exports</span>
            </button>
          </div>
        }
      />

      {/* Main Content Area */}
      {activeTab === "audit" ? <AuditLogConsole /> : <DataExportHub />}
    </div>
  );
}
