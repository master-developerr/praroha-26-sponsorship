"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser, devLog } from "@/components/providers/AuthProvider";
import { useWorkspace } from "@/components/volunteer/WorkspaceContext";
import { TodayWorkBar } from "@/components/volunteer/TodayWorkBar";
import { LeadsTable } from "@/components/volunteer/LeadsTable";
import { SectionErrorBoundary } from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";
import { PrarohaHeroVisual } from "@/components/ui/PrarohaHeroVisual";
import {
  PhoneCall,
  Calendar,
  Trophy,
  ArrowRight,
  Sparkles,
  Users,
  Flame,
  Target,
} from "lucide-react";

export default function VolunteerDashboardPage() {
  const { user, profile } = useAuthUser();
  const { openCompanyDossier, startCallMode, openEventInfo } = useWorkspace();
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
  const leads = assignedLeadsRaw || [];

  useEffect(() => {
    if (assignedLeadsRaw !== undefined) {
      devLog("LEADS", `Loaded ${leads.length} assigned leads for volunteer`);
    }
  }, [assignedLeadsRaw, leads.length]);

  const prioritizedLeads = [...leads].sort((a, b) => {
    // 1. High priority
    if (a.priority === "High" && b.priority !== "High") return -1;
    if (a.priority !== "High" && b.priority === "High") return 1;
    // 2. Freshly assigned
    if (a.leadStatus === "ASSIGNED" && b.leadStatus !== "ASSIGNED") return -1;
    if (a.leadStatus !== "ASSIGNED" && b.leadStatus === "ASSIGNED") return 1;
    return 0;
  });

  // Fallback metrics while loading so shell renders immediately
  const displayMetrics = metrics || {
    totalAssigned: leads.length,
    toContact: leads.filter((l) => l.leadStatus === "ASSIGNED").length,
    highPriority: leads.filter((l) => l.priority === "High").length,
    callsCompleted: 0,
    dailyTarget: 15,
    callsRemaining: 15,
    overdueFollowUps: 0,
    todayFollowUps: 0,
    interestedCount: 0,
    inProgressCount: 0,
  };

  return (
    <div className="space-y-5">
      {/* 1. Compact, Focused Command Header (~200px height) */}
      <SectionErrorBoundary sectionTitle="Command Header">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-xs min-h-[160px] md:h-[195px] lg:h-[205px] flex flex-col md:flex-row justify-between">
          {/* LEFT Operational Content Layer */}
          <div className="relative z-10 w-full md:w-[56%] lg:w-[54%] p-5 sm:p-6 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary leading-tight">
                  {greeting}, {firstName}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-mint px-2.5 py-0.5 text-[11px] font-semibold text-accent-mint-text border border-primary/20">
                  <Sparkles className="h-3 w-3 text-primary" />
                  PRAROHA&apos;26 Active
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed max-w-md line-clamp-2">
                Connect with corporate sponsors, confirm corporate deliverables, and advance deals through your pipeline.
              </p>
            </div>

            {/* 4 Distinct Operational Stats (Non-redundant with TodayWorkBar) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="rounded-lg border border-border-subtle bg-surface-subtle/70 px-2.5 py-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                  <Users className="h-3 w-3 text-primary" />
                  Assigned
                </span>
                <p className="mt-0.5 text-lg font-black text-text-primary tabular-nums">
                  {metrics ? metrics.totalAssigned : leads.length}
                </p>
              </div>

              <div className="rounded-lg border border-border-subtle bg-surface-subtle/70 px-2.5 py-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1">
                  <Flame className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                  High Priority
                </span>
                <p className="mt-0.5 text-lg font-black text-rose-700 dark:text-rose-400 tabular-nums">
                  {displayMetrics.highPriority}
                </p>
              </div>

              <div className="rounded-lg border border-border-subtle bg-surface-subtle/70 px-2.5 py-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <Target className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  In Progress
                </span>
                <p className="mt-0.5 text-lg font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {displayMetrics.inProgressCount}
                </p>
              </div>

              <div className="rounded-lg border border-border-subtle bg-surface-subtle/70 px-2.5 py-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Trophy className="h-3 w-3 text-amber-500" />
                  Total Points
                </span>
                <p className="mt-0.5 text-lg font-black text-text-primary tabular-nums">
                  {pointsSummary?.totalPoints ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT Integrated Editorial Artwork (Desktop / Tablet) */}
          <PrarohaHeroVisual
            variant="dashboard-hero"
            className="w-[44%] lg:w-[46%]"
            priority
          />
        </div>
      </SectionErrorBoundary>

      {/* 2. Today's Outreach Command Bar */}
      <SectionErrorBoundary sectionTitle="Today's Outreach Command Bar">
        <TodayWorkBar
          metrics={displayMetrics}
          onOpenEventDeck={openEventInfo}
          onQuickAction={() => {
            if (prioritizedLeads.length > 0) {
              const topLead = prioritizedLeads[0];
              startCallMode(topLead);
            }
          }}
        />
      </SectionErrorBoundary>

      {/* 3. Action-First Priority Leads Section */}
      <SectionErrorBoundary sectionTitle="Assigned Leads Queue">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-text-primary tracking-tight">
                My Assigned Leads
              </h2>
              <p className="text-xs text-text-secondary">
                Urgent callbacks and high-priority accounts surfaced first for action
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/workspace/leads">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold text-primary hover:bg-accent-mint/30 border-border"
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
          />
        </div>
      </SectionErrorBoundary>
    </div>
  );
}
