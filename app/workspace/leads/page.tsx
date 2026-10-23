"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { useWorkspace } from "@/components/volunteer/WorkspaceContext";
import { LeadsTable } from "@/components/volunteer/LeadsTable";
import { Building2 } from "lucide-react";

export default function MyLeadsPage() {
  const { user, profile } = useAuthUser();
  const { openCompanyDossier, startCallMode, openEventInfo, openLeaderboard } = useWorkspace();
  const [activeTab, setActiveTab] = useState("all");

  const clerkId = user?.id || "";

  const assignedLeadsRaw = useQuery(
    api.assignments.getMyAssignedLeads,
    clerkId ? { volunteerClerkId: clerkId, tab: activeTab } : "skip"
  );

  const leads = assignedLeadsRaw || [];
  const firstName = profile?.name ? profile.name.split(" ")[0] : "Volunteer";

  return (
    <div className="space-y-8">
      {/* Editorial Page Header matching Admin Master Lead Directory */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              LEAD PORTFOLIO
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-text-primary sm:text-4xl">
              My Assigned Leads Directory
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
              Corporate entities allocated to your outreach portfolio for PRAROHA&apos;26 sponsorship solicitation.
            </p>
            <p className="mt-3 text-[11px] font-medium text-text-muted">
              DEC 04-05 · Division of Civil Engineering · Cochin University of Science and Technology (CUSAT)
            </p>
          </div>

          <div className="flex items-center divide-x divide-border border border-border bg-surface shadow-2xs">
            <div className="px-5 py-3 text-center min-w-[6rem]">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-muted">Allocated</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-text-primary">{leads.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Leads Directory Table */}
      <LeadsTable
        leads={leads}
        isLoading={assignedLeadsRaw === undefined}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSelectLead={(companyId) => openCompanyDossier(companyId)}
        onStartCall={(lead) => startCallMode(lead)}
        onOpenEventDeck={openEventInfo}
        onOpenLeaderboard={openLeaderboard}
        volunteerName={firstName}
      />
    </div>
  );
}
