"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { useWorkspace } from "@/components/volunteer/WorkspaceContext";
import { TodayWorkBar } from "@/components/volunteer/TodayWorkBar";
import { LeadsTable } from "@/components/volunteer/LeadsTable";
import { Button } from "@/components/ui/button";
import {
  PhoneCall,
  Calendar,
  Trophy,
  ArrowRight,
  Sparkles,
  Users,
  Flame,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function VolunteerDashboardPage() {
  const { user, profile } = useAuthUser();
  const { openCompanyDossier, startCallMode, openEventInfo } = useWorkspace();
  const [activeTab, setActiveTab] = useState("all");

  const clerkId = user?.id || "";

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
  const prioritizedLeads = [...leads].sort((a, b) => {
    // 1. High priority
    if (a.priority === "High" && b.priority !== "High") return -1;
    if (a.priority !== "High" && b.priority === "High") return 1;
    // 2. Freshly assigned
    if (a.leadStatus === "ASSIGNED" && b.leadStatus !== "ASSIGNED") return -1;
    if (a.leadStatus !== "ASSIGNED" && b.leadStatus === "ASSIGNED") return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* 1. Contained Split-Hero Header with Strategic Banner Illustration */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Personalized Command Summary */}
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-mint px-2.5 py-0.5 text-[11px] font-bold text-accent-mint-text mb-1">
                <Sparkles className="h-3 w-3 text-primary" />
                PRAROHA'26 Outreach Active
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                {greeting}, {firstName}
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Connect with corporate sponsors, confirm corporate deliverables, and advance deals through your pipeline.
              </p>
            </div>

            {/* Quick Summary Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="rounded-xl border border-border-subtle bg-surface-subtle/50 p-2.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                  <Users className="h-3 w-3 text-primary" />
                  Assigned
                </span>
                <p className="mt-1 text-lg font-bold text-text-primary">
                  {metrics?.totalAssigned ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-subtle/50 p-2.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                  <PhoneCall className="h-3 w-3 text-emerald-600" />
                  Today's Calls
                </span>
                <p className="mt-1 text-lg font-bold text-emerald-700">
                  {metrics?.callsCompleted ?? 0}{" "}
                  <span className="text-[11px] font-medium text-text-muted">
                    / {metrics?.dailyTarget ?? 15}
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-subtle/50 p-2.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-amber-600" />
                  Follow-ups Due
                </span>
                <p className="mt-1 text-lg font-bold text-amber-700">
                  {metrics?.todayFollowUps ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-subtle/50 p-2.5">
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

          {/* Right Column: Strategic PRAROHA Illustration */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="relative h-44 w-full rounded-xl overflow-hidden border border-[#BEE3D3] shadow-xs">
              <Image
                src="/images/praroha-outreach-banner.png"
                alt="PRAROHA'26 Outreach"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-surface/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Outreach Command Bar */}
      {metrics && (
        <TodayWorkBar
          metrics={metrics}
          onOpenEventDeck={openEventInfo}
          onQuickAction={() => {
            if (prioritizedLeads.length > 0) {
              const topLead = prioritizedLeads[0];
              startCallMode(topLead);
            }
          }}
        />
      )}

      {/* 3. Action-First Priority Leads Section */}
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
    </div>
  );
}
