"use client";

import React from "react";
import {
  PhoneCall,
  Target,
  AlertTriangle,
  Calendar,
  Flame,
  FileText,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TodayWorkBarProps {
  metrics: {
    totalAssigned: number;
    toContact: number;
    highPriority: number;
    callsCompleted: number;
    dailyTarget: number;
    callsRemaining: number;
    overdueFollowUps: number;
    todayFollowUps: number;
    interestedCount: number;
    inProgressCount: number;
  };
  onOpenEventDeck?: () => void;
  onQuickAction?: () => void;
}

export function TodayWorkBar({
  metrics,
  onOpenEventDeck,
  onQuickAction,
}: TodayWorkBarProps) {
  return (
    <section aria-labelledby="today-outreach-heading" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
            Daily Execution
          </p>
          <h2 id="today-outreach-heading" className="mt-1 text-base font-bold text-text-primary">
            Today&apos;s Outreach Command
          </h2>
          <p className="mt-0.5 text-xs text-text-secondary">
            Real-time daily quota pacing and active deal status
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenEventDeck && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenEventDeck}
              className="text-xs border-border text-text-secondary hover:text-text-primary"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Event Deck & Tiers
            </Button>
          )}
          {onQuickAction && (
            <Button
              variant="primary"
              size="sm"
              disabled={metrics.totalAssigned === 0}
              onClick={onQuickAction}
              className={`text-xs font-semibold ${
                metrics.totalAssigned === 0
                  ? "opacity-60 cursor-not-allowed bg-muted text-muted-foreground"
                  : "bg-primary hover:bg-primary-hover text-white"
              }`}
              title={
                metrics.totalAssigned === 0
                  ? "No assigned leads. Contact an admin to receive lead allocations."
                  : "Start next outreach call"
              }
            >
              <PhoneCall className="h-3.5 w-3.5 mr-1.5" />
              Start next call
            </Button>
          )}
        </div>
      </div>

      {/* Operational KPI Strip with thin dividers matching Admin Portfolio at a glance */}
      <div className="grid gap-6 border-y border-border py-5 sm:grid-cols-2 lg:grid-cols-5 bg-surface">
        {/* 1. Daily Quota */}
        <div className="border-l-2 border-primary pl-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            <Target className="h-3.5 w-3.5 text-primary" />
            Daily Quota
          </div>
          <p className="mt-3 text-2xl font-bold tabular-nums text-text-primary">
            {metrics.callsCompleted} <span className="text-sm font-normal text-text-muted">/ {metrics.dailyTarget || 15}</span>
          </p>
          <p className="mt-1 text-[11px] text-text-secondary">
            {metrics.totalAssigned === 0
              ? "Awaiting lead allocation"
              : `${metrics.callsRemaining} calls remaining`}
          </p>
        </div>

        {/* 2. High Priority */}
        <div className={`border-l-2 pl-4 ${metrics.highPriority > 0 ? "border-error" : "border-border-strong"}`}>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            <Flame className={`h-3.5 w-3.5 ${metrics.highPriority > 0 ? "text-error" : "text-text-muted"}`} />
            High Priority
          </div>
          <p className={`mt-3 text-2xl font-bold tabular-nums ${metrics.highPriority > 0 ? "text-error" : "text-text-primary"}`}>
            {metrics.highPriority}
          </p>
          <p className="mt-1 text-[11px] text-text-secondary">
            P0 Critical corporate leads
          </p>
        </div>

        {/* 3. Overdue */}
        <div className={`border-l-2 pl-4 ${metrics.overdueFollowUps > 0 ? "border-warning" : "border-border-strong"}`}>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            <AlertTriangle className={`h-3.5 w-3.5 ${metrics.overdueFollowUps > 0 ? "text-warning" : "text-text-muted"}`} />
            Overdue
          </div>
          <p className={`mt-3 text-2xl font-bold tabular-nums ${metrics.overdueFollowUps > 0 ? "text-warning" : "text-text-primary"}`}>
            {metrics.overdueFollowUps}
          </p>
          <p className="mt-1 text-[11px] text-text-secondary">
            Requires urgent callback
          </p>
        </div>

        {/* 4. Due Today */}
        <div className={`border-l-2 pl-4 ${metrics.todayFollowUps > 0 ? "border-accent-yellow-text" : "border-border-strong"}`}>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            <Calendar className="h-3.5 w-3.5 text-text-muted" />
            Due Today
          </div>
          <p className="mt-3 text-2xl font-bold tabular-nums text-text-primary">
            {metrics.todayFollowUps}
          </p>
          <p className="mt-1 text-[11px] text-text-secondary">
            Scheduled for this shift
          </p>
        </div>

        {/* 5. To Contact */}
        <div className="border-l-2 border-info pl-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            <Clock className="h-3.5 w-3.5 text-info" />
            To Contact
          </div>
          <p className="mt-3 text-2xl font-bold tabular-nums text-text-primary">
            {metrics.toContact}
          </p>
          <p className="mt-1 text-[11px] text-text-secondary">
            Assigned, not yet dialed
          </p>
        </div>
      </div>
    </section>
  );
}
