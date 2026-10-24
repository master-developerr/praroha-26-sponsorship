"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser, devLog } from "@/components/providers/AuthProvider";
import { useWorkspace } from "@/components/volunteer/WorkspaceContext";
import { TodayWorkBar } from "@/components/volunteer/TodayWorkBar";
import { LeadsTable } from "@/components/volunteer/LeadsTable";
import { SectionErrorBoundary } from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function VolunteerDashboardPage() {
  const { user, profile } = useAuthUser();
  const { openCompanyDossier, startCallMode, openGlobalLogCall, openEventInfo, openLeaderboard } = useWorkspace();
  const [activeTab, setActiveTab] = useState("all");

  const clerkId = user?.id || "";

  useEffect(() => {
    if (clerkId) {
      devLog("WORKSPACE", `Loading volunteer workspace for user: ${clerkId}`);
    }
  }, [clerkId]);

  // Live Convex Subscriptions
  const assignedLeadsRaw = useQuery(
    api.assignments.getMyAssignedLeads,
    clerkId ? { volunteerClerkId: clerkId, tab: activeTab } : "skip"
  );

  const metrics = useQuery(
    api.assignments.getMyWorkstationMetrics,
    clerkId ? { volunteerClerkId: clerkId } : "skip"
  );

  const pointsSummary = useQuery(
    api.gamification.getUserPointsSummary,
    clerkId ? { clerkId } : "skip"
  );

  // Dynamic Greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = profile?.name ? profile.name.split(" ")[0] : "Volunteer";

  // Prioritized leads: show High Priority and freshly assigned first
  const leads = useMemo(() => assignedLeadsRaw || [], [assignedLeadsRaw]);

  useEffect(() => {
    if (assignedLeadsRaw !== undefined) {
      devLog("LEADS", `Loaded ${leads.length} assigned leads for volunteer`);
    }
  }, [assignedLeadsRaw, leads.length]);

  const prioritizedLeads = useMemo(() => {
    return [...leads].sort((a, b) => {
      // 1. High priority
      if (a.priority === "High" && b.priority !== "High") return -1;
      if (a.priority !== "High" && b.priority === "High") return 1;
      // 2. Freshly assigned
      if (a.leadStatus === "ASSIGNED" && b.leadStatus !== "ASSIGNED") return -1;
      if (a.leadStatus !== "ASSIGNED" && b.leadStatus === "ASSIGNED") return 1;
      return 0;
    });
  }, [leads]);

  // Fallback metrics while loading so shell renders immediately
  const displayMetrics = useMemo(() => {
    if (metrics) return metrics;
    let toContact = 0;
    let highPriority = 0;
    for (const l of leads) {
      if (l.leadStatus === "ASSIGNED") toContact++;
      if (l.priority === "High") highPriority++;
    }
    return {
      totalAssigned: leads.length,
      toContact,
      highPriority,
      callsCompleted: 0,
      dailyTarget: 15,
      callsRemaining: 15,
      overdueFollowUps: 0,
      todayFollowUps: 0,
      interestedCount: 0,
      inProgressCount: 0,
    };
  }, [metrics, leads]);

  const handleStartNextCall = useCallback(() => {
    if (leads.length === 0) {
      alert("No assigned leads: You do not have any active leads assigned. Contact an administrator to receive lead allocations.");
      return;
    }

    // Only pick an assigned lead that has a valid phone and is not in terminal stage
    const nextCallableLead = prioritizedLeads.find(
      (lead) =>
        lead.leadStatus !== "WON" &&
        lead.leadStatus !== "LOST" &&
        Boolean(lead.primaryContact?.phone?.trim())
    );

    if (nextCallableLead) {
      startCallMode(nextCallableLead);
    } else {
      alert("No verified contact available: None of your assigned leads have a valid phone number recorded.");
    }
  }, [leads.length, prioritizedLeads, startCallMode]);

  return (
    <div className="space-y-8">
      {/* 1. Operational editorial page header matching Admin Control Room */}
      <SectionErrorBoundary sectionTitle="Command Header">
        <header className="border-b border-border pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                OUTREACH DESK
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-text-primary sm:text-4xl">
                {greeting}, {firstName}.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
                Your next sponsor, callback, and pipeline action — kept in one operational view.
              </p>
              <p className="mt-3 text-[11px] font-medium text-text-muted">
                DEC 04-05 · Division of Civil Engineering · Cochin University of Science and Technology (CUSAT)
              </p>
            </div>

            <div className="flex items-center divide-x divide-border border border-border bg-surface shadow-2xs">
              <div className="px-5 py-3 text-center min-w-[5.5rem]">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-muted">Assigned</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-text-primary">{metrics ? metrics.totalAssigned : leads.length}</p>
              </div>
              <div className="px-5 py-3 text-center min-w-[5.5rem]">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-muted">Priority</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-error">{displayMetrics.highPriority}</p>
              </div>
              <div className="px-5 py-3 text-center min-w-[5.5rem]">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-muted">Points</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-primary">{pointsSummary?.totalPoints ?? 0}</p>
              </div>
            </div>
          </div>
        </header>
      </SectionErrorBoundary>

      {/* 2. Today's Outreach Command Bar */}
      <SectionErrorBoundary sectionTitle="Today's Outreach Command Bar">
        <TodayWorkBar
          metrics={displayMetrics}
          onOpenEventDeck={openEventInfo}
          onQuickAction={handleStartNextCall}
        />
      </SectionErrorBoundary>

      {/* 3. Action-First Priority Leads Section */}
      <SectionErrorBoundary sectionTitle="Assigned Leads Queue">
        <section aria-labelledby="assigned-leads-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Active Pipeline</p>
              <h2 id="assigned-leads-heading" className="mt-1 text-base font-bold text-text-primary tracking-tight">
                My Assigned Leads
              </h2>
              <p className="mt-0.5 text-xs text-text-secondary">
                Urgent callbacks and high-priority accounts surfaced first for action
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/workspace/leads">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold text-primary border-border hover:bg-surface-subtle"
                >
                  <span>View All Leads ({leads.length})</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Priority Assigned Leads Data Grid */}
          <LeadsTable
            leads={prioritizedLeads}
            isLoading={assignedLeadsRaw === undefined}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSelectLead={(companyId) => openCompanyDossier(companyId)}
            onStartCall={(lead) => startCallMode(lead)}
            onOpenEventDeck={openEventInfo}
            onOpenLeaderboard={openLeaderboard}
            volunteerName={firstName}
          />
        </section>
      </SectionErrorBoundary>
    </div>
  );
}
