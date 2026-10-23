"use client";

import React from "react";
import { useWorkspace } from "@/components/volunteer/WorkspaceContext";
import { FollowUpList } from "@/components/volunteer/FollowUpList";
import { Calendar } from "lucide-react";

export default function FollowUpsPage() {
  const { startCallMode } = useWorkspace();

  return (
    <div className="space-y-8">
      {/* Editorial Page Header matching Admin Control Room */}
      <header className="border-b border-border pb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            FOLLOW-UP DESK
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-text-primary sm:text-4xl">
            Never miss the next sponsor conversation.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            Schedule callbacks, review due touchpoints, and keep corporate commitments across Kerala and national hubs.
          </p>
          <p className="mt-3 text-[11px] font-medium text-text-muted">
            DEC 04-05 · Division of Civil Engineering · Cochin University of Science and Technology (CUSAT)
          </p>
        </div>
      </header>

      {/* Operational Follow-Up Table */}
      <FollowUpList onStartCall={startCallMode} />
    </div>
  );
}
