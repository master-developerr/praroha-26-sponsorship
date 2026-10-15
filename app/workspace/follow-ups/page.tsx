"use client";

import React from "react";
import { useWorkspace } from "@/components/volunteer/WorkspaceContext";
import { FollowUpList } from "@/components/volunteer/FollowUpList";
import { Calendar, Clock, AlertCircle } from "lucide-react";

export default function FollowUpsPage() {
  const { startCallMode } = useWorkspace();

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1">
            <Calendar className="h-4 w-4" />
            <span>Scheduled Touchpoints</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Sponsorship Follow-Ups & Callbacks
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Keep commitments and nurture relationships with company representatives across Kerala and national hubs.
          </p>
        </div>
      </div>

      {/* Follow-Ups Schedule Component */}
      <FollowUpList onStartCall={startCallMode} />
    </div>
  );
}
