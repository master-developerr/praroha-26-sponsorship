"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  PhoneCall,
  FileText,
  Calendar,
  Trophy,
  Award,
  ArrowRightLeft,
  Clock,
  User,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface CompanyTimelineProps {
  companyId: Id<"companies">;
}

export function CompanyTimeline({ companyId }: CompanyTimelineProps) {
  const timelineEvents = useQuery(api.pipeline.getCompanyRelationshipTimeline, {
    companyId,
  });

  if (timelineEvents === undefined) {
    return (
      <div className="py-8 flex flex-col items-center justify-center gap-2 text-text-muted">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-xs">Loading relationship activity...</span>
      </div>
    );
  }

  if (timelineEvents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center">
        <Clock className="h-8 w-8 text-text-muted mx-auto mb-2 opacity-50" />
        <p className="text-xs font-semibold text-text-primary">
          No Activity Recorded Yet
        </p>
        <p className="text-[11px] text-text-secondary mt-0.5 max-w-xs mx-auto">
          Start an outreach call, schedule a callback, or draft a proposal to build the chronological relationship history.
        </p>
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "call":
        return <PhoneCall className="h-3.5 w-3.5 text-teal-700" />;
      case "debrief":
        return <FileText className="h-3.5 w-3.5 text-indigo-700" />;
      case "follow_up":
        return <Calendar className="h-3.5 w-3.5 text-yellow-700" />;
      case "proposal":
        return <Trophy className="h-3.5 w-3.5 text-sky-700" />;
      case "commitment":
        return <Award className="h-3.5 w-3.5 text-emerald-700" />;
      default:
        return <ArrowRightLeft className="h-3.5 w-3.5 text-zinc-600" />;
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case "call":
        return "bg-teal-50 text-teal-800 border-teal-200";
      case "debrief":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "follow_up":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "proposal":
        return "bg-sky-50 text-sky-800 border-sky-200";
      case "commitment":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      default:
        return "bg-zinc-50 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-text-muted pb-1 border-b border-border-subtle">
        <span className="font-semibold text-text-primary">
          Chronological Activity Stream ({timelineEvents.length} events)
        </span>
        <span>Newest First</span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {timelineEvents.map((event) => {
          const dateStr = new Date(event.timestamp).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={event.id} className="relative group">
              {/* Event bullet node */}
              <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-surface border border-border shadow-xs">
                {getEventIcon(event.type)}
              </div>

              {/* Event card */}
              <div className="rounded-xl border border-border bg-surface p-3 space-y-1.5 shadow-2xs hover:border-primary/40 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="text-xs font-bold text-text-primary leading-tight">
                    {event.title}
                  </span>
                  <div className="flex items-center gap-2">
                    {event.badgeLabel && (
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                          event.badgeClass || getEventBadge(event.type)
                        }`}
                      >
                        {event.badgeLabel}
                      </span>
                    )}
                    <span className="text-[10px] text-text-muted font-medium">
                      {dateStr}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {event.description}
                </p>

                {event.actorName && (
                  <div className="flex items-center gap-1 text-[11px] text-text-muted pt-1">
                    <User className="h-3 w-3" />
                    <span>Logged by <strong>{event.actorName}</strong></span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
