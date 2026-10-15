"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { TodayWorkBar } from "@/components/volunteer/TodayWorkBar";
import { LeadsTable, AssignedLeadItem } from "@/components/volunteer/LeadsTable";
import { CompanyDossierDrawer } from "@/components/admin/CompanyDossierDrawer";
import { CallModeOverlay } from "@/components/volunteer/CallModeOverlay";
import { CallReportModal } from "@/components/volunteer/CallReportModal";
import { FollowUpList } from "@/components/volunteer/FollowUpList";
import { EventInfoModal } from "@/components/volunteer/EventInfoModal";
import { PersonalPerformanceCard } from "@/components/volunteer/PersonalPerformanceCard";
import { LeaderboardPodium } from "@/components/volunteer/LeaderboardPodium";
import { Dialog } from "@/components/ui/dialog";
import {
  PhoneCall,
  Building2,
  Calendar,
  Trophy,
  Target,
  ArrowRight,
  CheckCircle2,
  Clock,
  Activity,
  Sparkles,
  PhoneForwarded,
} from "lucide-react";
import { QuickCallOutcome } from "@/types";

export function VolunteerDashboardView() {
  const { profile, user } = useAuthUser();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCompanyId, setSelectedCompanyId] = useState<Id<"companies"> | null>(
    null
  );
  const [isEventInfoOpen, setIsEventInfoOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Call Mode & Debrief state
  const [callLead, setCallLead] = useState<any | null>(null);
  const [isCallModeOpen, setIsCallModeOpen] = useState(false);
  const [isDebriefModalOpen, setIsDebriefModalOpen] = useState(false);
  const [debriefCallData, setDebriefCallData] = useState<{
    outcome: QuickCallOutcome;
    durationSeconds: number;
    startedAt: number;
    endedAt: number;
  }>({
    outcome: "Interested",
    durationSeconds: 0,
    startedAt: Date.now(),
    endedAt: Date.now(),
  });

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

  const recentCalls = useQuery(
    api.calls.getMyRecentCalls,
    clerkId ? { volunteerClerkId: clerkId } : "skip"
  );

  // Selected company full details for drawer
  const selectedCompany = useQuery(
    api.companies.getCompanyDetails,
    selectedCompanyId ? { companyId: selectedCompanyId } : "skip"
  );

  const todayStr = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(new Date())
    .toUpperCase();

  const firstName = profile?.name
    ? profile.name.split(" ")[0]
    : user?.fullName
    ? user.fullName.split(" ")[0]
    : "Volunteer";

  const safeMetrics = metrics || {
    totalAssigned: 0,
    toContact: 0,
    highPriority: 0,
    callsCompleted: 0,
    dailyTarget: 15,
    callsRemaining: 15,
    overdueFollowUps: 0,
    todayFollowUps: 0,
    interestedCount: 0,
    inProgressCount: 0,
  };

  const assignedLeads: AssignedLeadItem[] = (
    (assignedLeadsRaw as any[]) || []
  ).map((lead: any) => ({
    _id: lead._id,
    companyName: lead.companyName,
    industry: lead.industry,
    niche: lead.niche,
    priority: lead.priority,
    leadStatus: lead.leadStatus,
    location: lead.location,
    leadScore: lead.leadScore,
    assignedAt: lead.assignedAt,
    lastContactedAt: lead.lastContactedAt,
    primaryContact: lead.primaryContact
      ? {
          _id: lead.primaryContact._id,
          contactName: lead.primaryContact.contactName,
          designation: lead.primaryContact.designation,
          phone: lead.primaryContact.phone,
          phoneType: lead.primaryContact.phoneType,
          contactVerification: lead.primaryContact.contactVerification,
          email: lead.primaryContact.email,
        }
      : null,
    totalContacts: lead.totalContacts,
  }));

  // Handler: Start Call Mode
  const handleStartCall = (lead: any) => {
    setCallLead(lead);
    setIsCallModeOpen(true);
  };

  // Handler: Outcome Selected from Call Mode -> Open Debrief Modal
  const handleOutcomeSelected = (
    outcome: QuickCallOutcome,
    durationSeconds: number,
    startedAt: number,
    endedAt: number
  ) => {
    setDebriefCallData({
      outcome,
      durationSeconds,
      startedAt,
      endedAt,
    });
    setIsCallModeOpen(false);
    setIsDebriefModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Greeting Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-surface via-surface to-accent-mint/20 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-[11px] font-bold tracking-wider text-text-muted uppercase">
              {todayStr}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              Good day, {firstName}
            </h1>
            <p className="text-xs text-text-secondary leading-relaxed">
              You currently have{" "}
              <strong className="text-text-primary font-semibold">
                {safeMetrics.totalAssigned} assigned sponsorship leads
              </strong>
              ,{" "}
              <strong className="text-text-primary font-semibold">
                {safeMetrics.callsCompleted} calls completed today
              </strong>
              , and{" "}
              <strong className="text-text-primary font-semibold">
                {safeMetrics.overdueFollowUps + safeMetrics.todayFollowUps} follow-ups requiring attention
              </strong>
              .
            </p>

            {/* Motivational Quote Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3 py-1.5 text-xs text-text-secondary shadow-xs">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-yellow/40 text-accent-yellow-text">
                <Target className="h-3 w-3" />
              </div>
              <span className="font-medium text-text-primary">
                "Direct conversations turn corporate interest into signed festival partnerships."
              </span>
            </div>
          </div>

          {/* Festival Editorial Card */}
          <div className="relative hidden lg:flex items-center justify-center w-72 h-40 rounded-xl border border-border bg-gradient-to-br from-surface to-[#F0F7F4] p-4 shadow-xs overflow-hidden">
            <div className="text-center space-y-1 z-10">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-accent-mint text-primary shadow-xs">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-text-primary">
                PRAROHA'26 Outreach Cockpit
              </p>
              <p className="text-[10px] text-text-secondary">
                Department of Civil Engineering • SOE CUSAT Kochi
              </p>
            </div>
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary/5 pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-accent-mint/20 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. Today's Work Command Bar (Real-Time Pacing) */}
      <TodayWorkBar
        metrics={safeMetrics}
        onOpenEventDeck={() => setIsEventInfoOpen(true)}
      />

      {/* 2.1 Personal Gamification & Verified Points */}
      {clerkId && (
        <PersonalPerformanceCard
          clerkId={clerkId}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        />
      )}

      {/* 3. 4 Live Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Calls Completed Today"
          value={safeMetrics.callsCompleted.toString()}
          change={`${safeMetrics.callsRemaining} to daily goal`}
          changeType={safeMetrics.callsRemaining === 0 ? "positive" : "neutral"}
          icon={PhoneCall}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          sparklineColor="#10B981"
        />
        <StatCard
          title="Assigned Leads"
          value={safeMetrics.totalAssigned.toString()}
          change={`${safeMetrics.toContact} uncontacted`}
          changeType="neutral"
          icon={Building2}
          iconBgColor="bg-sky-50"
          iconColor="text-sky-600"
          sparklineColor="#0284C7"
        />
        <StatCard
          title="Callbacks Pending"
          value={(safeMetrics.overdueFollowUps + safeMetrics.todayFollowUps).toString()}
          change={
            safeMetrics.overdueFollowUps > 0
              ? `${safeMetrics.overdueFollowUps} overdue`
              : "On schedule"
          }
          changeType={safeMetrics.overdueFollowUps > 0 ? "negative" : "neutral"}
          icon={Calendar}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
          sparklineColor="#F59E0B"
        />
        <StatCard
          title="Outreach Pipeline"
          value={safeMetrics.inProgressCount.toString()}
          change={`${safeMetrics.interestedCount} positive`}
          changeType={safeMetrics.interestedCount > 0 ? "positive" : "neutral"}
          icon={Trophy}
          iconBgColor="bg-teal-50"
          iconColor="text-teal-600"
          sparklineColor="#0D7A68"
        />
      </div>

      {/* 4. Main Section: "My Assigned Leads" + Right Context Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Leads Table */}
        <div className="xl:col-span-2 space-y-4">
          <LeadsTable
            leads={assignedLeads}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSelectLead={(id) => setSelectedCompanyId(id)}
            onStartCall={(lead) => handleStartCall(lead)}
            isLoading={assignedLeadsRaw === undefined}
          />
        </div>

        {/* Right 1 Col: Contextual Widgets */}
        <div className="space-y-4">
          {/* Widget 1: Today's Call Tasks Progress */}
          <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div>
                <h3 className="text-xs font-bold text-text-primary">
                  Today's Call Target
                </h3>
                <p className="text-[11px] text-text-muted">
                  {safeMetrics.callsCompleted}/{safeMetrics.dailyTarget} calls logged
                </p>
              </div>
              <span className="rounded-full bg-surface-subtle border border-border px-2 py-0.5 text-[11px] font-semibold text-text-secondary">
                {safeMetrics.callsRemaining} left
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-2 w-full rounded-full bg-border-subtle overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(
                      (safeMetrics.callsCompleted / (safeMetrics.dailyTarget || 15)) *
                        100
                    )
                  )}%`,
                }}
              />
            </div>

            <div className="mt-3 py-1">
              {safeMetrics.callsCompleted >= safeMetrics.dailyTarget ? (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">
                    Daily target achieved! Excellent momentum.
                  </span>
                </div>
              ) : safeMetrics.toContact > 0 ? (
                <div className="rounded-lg bg-surface-subtle border border-border-subtle p-3 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-text-primary">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Next: Call uncontacted leads</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    You have {safeMetrics.toContact} uncontacted leads ready in queue.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-text-muted">
                  Keep dialing active leads or schedule callbacks.
                </p>
              )}
            </div>
          </div>

          {/* Widget 2: Actionable Follow-ups & Callbacks List */}
          <FollowUpList onStartCall={(lead) => handleStartCall(lead)} />

          {/* Widget 3: Live Outreach Activity Audit Feed */}
          <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold text-text-primary">
                  Recent Outreach Log
                </h3>
              </div>
              <span className="text-[11px] font-medium text-text-muted">
                Today
              </span>
            </div>

            {recentCalls === undefined ? (
              <div className="py-6 text-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
              </div>
            ) : recentCalls.length === 0 ? (
              <div className="mt-3 py-3">
                <EmptyState
                  icon={Activity}
                  title="No calls logged yet"
                  description="Calls logged during this session will record your verified outreach trail here."
                />
              </div>
            ) : (
              <div className="divide-y divide-border-subtle max-h-60 overflow-y-auto mt-2">
                {recentCalls.map((c) => (
                  <div key={c._id} className="py-2.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-primary truncate max-w-[150px]">
                        {c.companyName}
                      </span>
                      <span className="rounded bg-accent-mint/30 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                        {c.quickOutcome}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-text-muted">
                      <span>{Math.floor(c.durationSeconds / 60)}m {c.durationSeconds % 60}s</span>
                      <span>{new Date(c.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Slide-Over Company Dossier Drawer */}
      <CompanyDossierDrawer
        company={selectedCompany}
        isOpen={!!selectedCompanyId}
        onClose={() => setSelectedCompanyId(null)}
        onStartCall={(c) => {
          setSelectedCompanyId(null);
          handleStartCall(c);
        }}
      />

      {/* 6. Call Mode Overlay (Minimalist In-Call View) */}
      <CallModeOverlay
        isOpen={isCallModeOpen}
        onClose={() => setIsCallModeOpen(false)}
        lead={callLead}
        onSelectOutcome={handleOutcomeSelected}
      />

      {/* 7. Post-Call Debrief Modal */}
      <CallReportModal
        isOpen={isDebriefModalOpen}
        onClose={() => setIsDebriefModalOpen(false)}
        lead={callLead}
        initialOutcome={debriefCallData.outcome}
        durationSeconds={debriefCallData.durationSeconds}
        startedAt={debriefCallData.startedAt}
        endedAt={debriefCallData.endedAt}
      />

      {/* 8. Event Deck & Tiers Information Modal */}
      <EventInfoModal
        isOpen={isEventInfoOpen}
        onClose={() => setIsEventInfoOpen(false)}
      />

      {/* 9. Team Leaderboard & Points Podium Modal */}
      <Dialog
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        maxWidth="xl"
        title="PRAROHA'26 Volunteer Leaderboard"
        description="Real-time points ledger, verified outreach standings, and honors podium."
      >
        <div className="pt-2 max-h-[75vh] overflow-y-auto pr-1">
          <LeaderboardPodium />
        </div>
      </Dialog>
    </div>
  );
}
