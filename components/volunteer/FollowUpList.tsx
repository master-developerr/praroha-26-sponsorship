"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/components/providers/AuthProvider";
import {
  Calendar,
  Clock,
  AlertCircle,
  PhoneCall,
  CheckCircle2,
  Building2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PriorityBadge, ContactVerificationBadge } from "@/components/ui/badge";

interface FollowUpListProps {
  onStartCall: (lead: any) => void;
}

export function FollowUpList({ onStartCall }: FollowUpListProps) {
  const { user } = useAuthUser();
  const clerkId = user?.id || "";

  const followUps = useQuery(
    api.followUps.getVolunteerFollowUps,
    clerkId ? { volunteerClerkId: clerkId } : "skip"
  );

  const completeFollowUpMutation = useMutation(api.followUps.completeFollowUp);
  const [completingId, setCompletingId] = useState<Id<"followUps"> | null>(null);

  const handleComplete = async (id: Id<"followUps">) => {
    if (!clerkId) return;
    try {
      setCompletingId(id);
      await completeFollowUpMutation({
        volunteerClerkId: clerkId,
        followUpId: id,
      });
    } catch (err: any) {
      alert(`Failed to complete follow-up: ${err.message}`);
    } finally {
      setCompletingId(null);
    }
  };

  const overdue = followUps?.overdue || [];
  const dueToday = followUps?.dueToday || [];
  const upcoming = followUps?.upcoming || [];
  const totalCount = overdue.length + dueToday.length + upcoming.length;

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-bold text-text-primary">
            Follow-ups & Callbacks
          </h3>
          <span className="rounded-full bg-surface-subtle border border-border px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
            {totalCount} active
          </span>
        </div>
      </div>

      {followUps === undefined ? (
        <div className="py-6 text-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
        </div>
      ) : totalCount === 0 ? (
        <div className="py-4">
          <EmptyState
            icon={Clock}
            title="No Callbacks Scheduled"
            description="Callbacks scheduled during your outreach calls will queue here with 1-click dialing."
          />
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {/* 1. Overdue Callbacks (Urgent Coral / Rose Alert) */}
          {overdue.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Overdue Callbacks ({overdue.length})</span>
              </div>
              {overdue.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20 p-3 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary">
                      {item.companyName}
                    </span>
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/50 px-1.5 py-0.2 rounded">
                      Overdue
                    </span>
                  </div>

                  {item.primaryContact && (
                    <div className="text-[11px] text-text-secondary">
                      <span>{item.primaryContact.contactName}</span> •{" "}
                      <span className="font-mono">{item.primaryContact.phone}</span>
                    </div>
                  )}

                  <p className="text-[11px] text-text-muted italic bg-surface/80 p-2 rounded border border-border-subtle">
                    "{item.notes}"
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-text-muted">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleComplete(item._id)}
                        disabled={completingId === item._id}
                        className="rounded px-2 py-1 text-[11px] font-medium text-text-secondary hover:bg-surface border border-border transition-colors cursor-pointer"
                      >
                        Done
                      </button>
                      <Button
                        size="sm"
                        onClick={() =>
                          onStartCall({
                            _id: item.companyId,
                            companyName: item.companyName,
                            industry: item.companyIndustry,
                            niche: item.companyNiche,
                            priority: item.companyPriority,
                            primaryContact: item.primaryContact,
                          })
                        }
                        className="h-6 px-2.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-xs"
                      >
                        <PhoneCall className="h-3 w-3 mr-1" />
                        Call Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Due Today Callbacks */}
          {dueToday.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                <span>Due Today ({dueToday.length})</span>
              </div>
              {dueToday.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-amber-200 bg-amber-50/40 p-3 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary">
                      {item.companyName}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                      Due Today
                    </span>
                  </div>

                  {item.primaryContact && (
                    <div className="text-[11px] text-text-secondary">
                      <span>{item.primaryContact.contactName}</span> •{" "}
                      <span className="font-mono">{item.primaryContact.phone}</span>
                    </div>
                  )}

                  <p className="text-[11px] text-text-muted italic bg-surface/80 p-2 rounded border border-border-subtle">
                    "{item.notes}"
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-text-muted font-mono">
                      {new Date(item.dueDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleComplete(item._id)}
                        disabled={completingId === item._id}
                        className="rounded px-2 py-1 text-[11px] font-medium text-text-secondary hover:bg-surface border border-border transition-colors cursor-pointer"
                      >
                        Done
                      </button>
                      <Button
                        size="sm"
                        onClick={() =>
                          onStartCall({
                            _id: item.companyId,
                            companyName: item.companyName,
                            industry: item.companyIndustry,
                            niche: item.companyNiche,
                            priority: item.companyPriority,
                            primaryContact: item.primaryContact,
                          })
                        }
                        className="h-6 px-2.5 bg-primary hover:bg-primary/90 text-white text-[11px] font-bold"
                      >
                        <PhoneCall className="h-3 w-3 mr-1" />
                        Call Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. Upcoming Callbacks */}
          {upcoming.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                Upcoming Shifts ({upcoming.length})
              </span>
              {upcoming.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-border-subtle bg-surface-subtle/50 p-3 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary">
                      {item.companyName}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {new Date(item.dueDate).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-secondary truncate">
                    {item.notes}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
