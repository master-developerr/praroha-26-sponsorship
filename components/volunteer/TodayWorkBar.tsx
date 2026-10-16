"use client";

import React from "react";
import {
  PhoneCall,
  Target,
  AlertCircle,
  Calendar,
  Flame,
  FileText,
  Clock,
  Sparkles,
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
  const percentComplete = Math.min(
    100,
    Math.round((metrics.callsCompleted / (metrics.dailyTarget || 15)) * 100)
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
      {/* Top row: Section title & quick utility buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary tracking-tight">
              Today's Outreach Command
            </h2>
            <p className="text-[11px] text-text-secondary">
              Real-time daily quota pacing and active deal status
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenEventDeck && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenEventDeck}
              className="text-xs text-text-secondary hover:text-text-primary border-border"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Event Deck & Tiers
            </Button>
          )}
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-accent-mint/30 px-3 py-1 text-[11px] font-semibold text-primary border border-primary/20">
            <Sparkles className="h-3 w-3" />
            Active Shift
          </div>
        </div>
      </div>

      {/* Metric Cards Grid: 2-col on mobile/tablet (with wide quota bar), 5-col on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
        {/* 1. Daily Quota Progress */}
        <div className="col-span-2 lg:col-span-1 rounded-xl border border-border-subtle bg-surface-subtle/60 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span className="font-semibold text-text-primary flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5 text-primary" />
              Daily Quota
            </span>
            <span className="text-[11px] font-bold text-primary tabular-nums">
              {metrics.callsCompleted} / {metrics.dailyTarget}
            </span>
          </div>

          <div className="mt-2.5 space-y-1.5">
            <div className="h-2 w-full rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-text-muted">
              <span className="tabular-nums">{percentComplete}% of daily goal</span>
              <span className="font-semibold text-text-secondary tabular-nums">
                {metrics.callsRemaining} remaining
              </span>
            </div>
          </div>
        </div>

        {/* 2. High-Priority Leads Badge */}
        <div className="rounded-xl border border-border-subtle bg-surface-subtle/60 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-rose-600" />
              High Priority
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                metrics.highPriority > 0
                  ? "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50"
                  : "bg-surface text-text-muted border border-border"
              }`}
            >
              {metrics.highPriority}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-text-primary tabular-nums">
              {metrics.highPriority}
            </p>
            <p className="text-[10px] text-text-muted">
              P0 Critical sponsorship leads
            </p>
          </div>
        </div>

        {/* 3. Overdue Follow-ups (Urgent Coral / Rose Alert) */}
        <div
          className={`rounded-xl border p-3 flex flex-col justify-between transition-colors ${
            metrics.overdueFollowUps > 0
              ? "border-rose-300 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/20 text-text-primary"
              : "border-border-subtle bg-surface-subtle/60 text-text-secondary"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <AlertCircle
                className={`h-3.5 w-3.5 ${
                  metrics.overdueFollowUps > 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-text-muted"
                }`}
              />
              Overdue
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                metrics.overdueFollowUps > 0
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-surface text-text-muted border border-border"
              }`}
            >
              {metrics.overdueFollowUps}
            </span>
          </div>
          <div className="mt-2">
            <p
              className={`text-xl font-bold tabular-nums ${
                metrics.overdueFollowUps > 0
                  ? "text-rose-700 dark:text-rose-300"
                  : "text-text-primary"
              }`}
            >
              {metrics.overdueFollowUps}
            </p>
            <p className="text-[10px] text-text-muted">Requires urgent callback</p>
          </div>
        </div>

        {/* 4. Due Today Callbacks */}
        <div className="rounded-xl border border-border-subtle bg-surface-subtle/60 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-amber-600" />
              Due Today
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                metrics.todayFollowUps > 0
                  ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50"
                  : "bg-surface text-text-muted border border-border"
              }`}
            >
              {metrics.todayFollowUps}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-text-primary tabular-nums">
              {metrics.todayFollowUps}
            </p>
            <p className="text-[10px] text-text-muted">Scheduled for this shift</p>
          </div>
        </div>

        {/* 5. To Contact / Uncontacted Queue */}
        <div className="rounded-xl border border-border-subtle bg-surface-subtle/60 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
              To Contact
            </span>
            <span className="rounded-full bg-blue-100 dark:bg-blue-950/40 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 tabular-nums">
              {metrics.toContact}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-text-primary tabular-nums">
              {metrics.toContact}
            </p>
            <p className="text-[10px] text-text-muted">Assigned, not yet called</p>
          </div>
        </div>
      </div>
    </div>
  );
}
