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
import {
  PhoneCall,
  Calendar,
  Trophy,
  ArrowRight,
  Sparkles,
  Users,
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
    <div className="space-y-6">
      {/* 1. Operational Hero Header with Subtle Blended Illustration */}
      <SectionErrorBoundary sectionTitle="Command Header">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs">
          {/* Subtle decorative background illustration positioned in top-right */}
          <div className="pointer-events-none absolute -right-2 -top-2 bottom-0 w-[240px] sm:w-[300px] lg:w-[350px] hidden sm:block select-none overflow-hidden opacity-85">
            <div className="relative h-full w-full">
              <Image
                src="/images/praroha-outreach-banner.png"
                alt=""
                fill
                sizes="(max-width: 640px) 0vw, 350px"
                className="object-contain object-right-top mix-blend-multiply dark:mix-blend-lighten"
                priority
              />
              {/* Soft gradient fades on left & bottom edges to seamlessly blend into background */}
              <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
            </div>
          </div>

          {/* Primary Operational Content Layer */}
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-mint px-2.5 py-0.5 text-[11px] font-bold text-accent-mint-text mb-1">
                <Sparkles className="h-3 w-3 text-primary" />
                PRAROHA&apos;26 Outreach Active
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                {greeting}, {firstName}
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xl">
                Connect with corporate sponsors, confirm corporate deliverables, and advance deals through your pipeline.
              </p>
            </div>

            {/* Quick Summary Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="rounded-xl border border-border-subtle bg-surface-subtle/50 p-2.5 backdrop-blur-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                  <Users className="h-3 w-3 text-primary" />
                  Assigned
                </span>
                <p className="mt-1 text-lg font-bold text-text-primary">
                  {metrics ? metrics.totalAssigned : leads.length}
                </p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-subtle/50 p-2.5 backdrop-blur-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                  <PhoneCall className="h-3 w-3 text-emerald-600" />
                  Today&apos;s Calls
                </span>
                <p className="mt-1 text-lg font-bold text-emerald-700">
                  {displayMetrics.callsCompleted}{" "}
                  <span className="text-[11px] font-medium text-text-muted">
                    / {displayMetrics.dailyTarget}
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-subtle/50 p-2.5 backdrop-blur-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-amber-600" />
                  Follow-ups Due
                </span>
                <p className="mt-1 text-lg font-bold text-amber-700">
                  {displayMetrics.todayFollowUps}
                </p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-subtle/50 p-2.5 backdrop-blur-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                  <Trophy className="h-3 w-3 text-amber-500" />
                  Total Points
                </span>
                <p className="mt-1 text-lg font-bold text-text-primary">
                  {pointsSummary?.totalPoints ?? 0}
                </p>
              </div>
            </div>
          </div>
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
