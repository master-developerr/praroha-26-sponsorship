"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { useWorkspace } from "@/components/volunteer/WorkspaceContext";
import { LeadsTable } from "@/components/volunteer/LeadsTable";
import { Users, Filter, Plus, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyLeadsPage() {
  const { user } = useAuthUser();
  const { openCompanyDossier, openNotionDossier, openCalScheduler, startCallMode } = useWorkspace();
  const [activeTab, setActiveTab] = useState("all");

  const clerkId = user?.id || "";

  const assignedLeadsRaw = useQuery(
    api.assignments.getMyAssignedLeads,
    clerkId ? { volunteerClerkId: clerkId, tab: activeTab } : "skip"
  );

  const leads = assignedLeadsRaw || [];

  const tabOptions = [
    { id: "all", label: "All Assigned" },
    { id: "to_contact", label: "To Contact" },
    { id: "in_progress", label: "In Progress" },
    { id: "follow_up_due", label: "Follow-up Due" },
    { id: "high_priority", label: "P0 High Priority" },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <Users className="h-4 w-4" />
            <span>Volunteer Directory</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            My Assigned Corporate Leads
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Companies allocated to your outreach portfolio for PRAROHA'26 sponsorship solicitation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-secondary bg-surface-subtle border border-border px-3 py-1.5 rounded-lg">
            Total Allocated: <strong className="text-text-primary">{leads.length}</strong>
          </span>
        </div>
      </div>

      {/* Leads Table */}
      <LeadsTable
        leads={leads}
        isLoading={assignedLeadsRaw === undefined}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSelectLead={(companyId) => openCompanyDossier(companyId)}
        onOpenNotionDoc={(companyId) => openNotionDossier(companyId)}
        onScheduleMeeting={(lead) => openCalScheduler(lead)}
        onStartCall={(lead) => startCallMode(lead)}
      />
    </div>
  );
}
