"use client";

import React from "react";
import { CalTeamScheduler } from "@/components/volunteer/CalTeamScheduler";
import { CalendarClock, ShieldCheck, Sparkles } from "lucide-react";

export default function MeetingsPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
            <CalendarClock className="h-4 w-4" />
            <span>Cal.com Operational Dispatch Hub</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Team Outreach & Executive Meeting Scheduler
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Book structured SDR discovery calls, deliverable customization sessions, and executive MoU signing slots with verified company leads.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-mint/30 border border-teal-500/20 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>PRAROHA'26 Verified Calendar</span>
          </div>
        </div>
      </div>

      {/* Main Cal.com Team Hub Surface */}
      <div className="rounded-2xl border border-border bg-surface shadow-xs p-4 sm:p-6 md:p-8">
        <CalTeamScheduler />
      </div>
    </div>
  );
}
