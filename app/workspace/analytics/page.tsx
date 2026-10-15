"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { useWorkspace } from "@/components/volunteer/WorkspaceContext";
import { PersonalPerformanceCard } from "@/components/volunteer/PersonalPerformanceCard";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Trophy,
  Target,
  Flame,
} from "lucide-react";

export default function VolunteerAnalyticsPage() {
  const { user } = useAuthUser();
  const { openLeaderboard } = useWorkspace();
  const clerkId = user?.id || "";

  const metrics = useQuery(
    api.assignments.getMyWorkstationMetrics,
    clerkId ? { volunteerClerkId: clerkId } : "skip"
  );

  const pointsSummary = useQuery(
    api.gamification.getUserPointsSummary,
    clerkId ? { clerkId } : "skip"
  );

  const totalAssigned = metrics?.totalAssigned || 0;
  const callsCompleted = metrics?.callsCompleted || 0;
  const interested = metrics?.interestedCount || 0;
  const inProgress = metrics?.inProgressCount || 0;

  const connectionRate = totalAssigned > 0 ? Math.round((callsCompleted / totalAssigned) * 100) : 0;
  const qualificationRate = callsCompleted > 0 ? Math.round((interested / callsCompleted) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <BarChart3 className="h-4 w-4" />
            <span>Personal Performance</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Outreach Velocity & Conversion Metrics
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Personal analytics on call consistency, qualified sponsor leads, and points earned.
          </p>
        </div>
      </div>

      {/* Rank & Points Banner */}
      {clerkId && (
        <PersonalPerformanceCard
          clerkId={clerkId}
          onOpenLeaderboard={openLeaderboard}
        />
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border bg-surface shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-primary" />
              Coverage Rate
            </span>
            <p className="text-2xl font-bold text-text-primary">{connectionRate}%</p>
            <p className="text-[10px] text-text-secondary">
              {callsCompleted} of {totalAssigned} assigned leads contacted
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              Qualification Rate
            </span>
            <p className="text-2xl font-bold text-emerald-700">{qualificationRate}%</p>
            <p className="text-[10px] text-text-secondary">
              Positive/interested reception on completed calls
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
              Qualified Leads
            </span>
            <p className="text-2xl font-bold text-teal-700">{interested}</p>
            <p className="text-[10px] text-text-secondary">
              Deals currently in proposal or negotiation stage
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              Pipeline In-Flight
            </span>
            <p className="text-2xl font-bold text-amber-700">{inProgress}</p>
            <p className="text-[10px] text-text-secondary">
              Accounts undergoing active follow-ups
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gamification Points Rules Card */}
      <Card className="border-border bg-surface shadow-xs">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                PRAROHA'26 Points System & Incentives
              </h3>
            </div>
            <span className="text-[10px] font-medium text-text-muted">
              Live automated ledger
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle flex items-center justify-between">
              <span className="text-text-secondary font-medium">Logged Outreach Call</span>
              <span className="font-bold text-primary bg-accent-mint px-2 py-0.5 rounded-full text-[11px]">
                +10 pts
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle flex items-center justify-between">
              <span className="text-text-secondary font-medium">Follow-Up Completed</span>
              <span className="font-bold text-primary bg-accent-mint px-2 py-0.5 rounded-full text-[11px]">
                +10 pts
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle flex items-center justify-between">
              <span className="text-text-secondary font-medium">Proposal Requested</span>
              <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full text-[11px]">
                +15 pts
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle flex items-center justify-between">
              <span className="text-text-secondary font-medium">Meeting Secured</span>
              <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full text-[11px]">
                +20 pts
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle flex items-center justify-between">
              <span className="text-text-secondary font-medium">In-Kind Deal Closed</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                +50 pts
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle flex items-center justify-between">
              <span className="text-text-secondary font-medium">Sponsorship Deal Won</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                +100 pts
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
