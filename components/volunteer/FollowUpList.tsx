"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/components/providers/AuthProvider";
import {
  Calendar,
  Clock,
  AlertTriangle,
  PhoneCall,
  Check,
  CalendarDays,
  Trash2,
  Building2,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { PriorityBadge } from "@/components/ui/badge";
import type { WorkspaceLeadInput } from "@/components/volunteer/WorkspaceContext";

interface FollowUpListProps {
  onStartCall: (lead: WorkspaceLeadInput) => void;
}

export function FollowUpList({ onStartCall }: FollowUpListProps) {
  const { user, profile } = useAuthUser();
  const clerkId = user?.id || "";

  const followUps = useQuery(
    api.followUps.getVolunteerFollowUps,
    clerkId ? { volunteerClerkId: clerkId } : "skip"
  );

  const completeFollowUpMutation = useMutation(api.followUps.completeFollowUp);
  const rescheduleFollowUpMutation = useMutation(api.followUps.rescheduleFollowUp);
  const cancelFollowUpMutation = useMutation(api.followUps.cancelFollowUp);

  const [activeTab, setActiveTab] = useState<"all" | "due_today" | "overdue" | "upcoming">("all");
  const [completingId, setCompletingId] = useState<Id<"followUps"> | null>(null);
  const [updatingId, setUpdatingId] = useState<Id<"followUps"> | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Id<"followUps"> | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<{ id: Id<"followUps">; companyName: string } | null>(null);

  const overdue = useMemo(() => followUps?.overdue || [], [followUps?.overdue]);
  const dueToday = useMemo(() => followUps?.dueToday || [], [followUps?.dueToday]);
  const upcoming = useMemo(() => followUps?.upcoming || [], [followUps?.upcoming]);

  const allActive = useMemo(() => {
    // Show overdue first, then due today, then upcoming
    return [...overdue, ...dueToday, ...upcoming];
  }, [overdue, dueToday, upcoming]);

  const displayedList = useMemo(() => {
    if (activeTab === "overdue") return overdue;
    if (activeTab === "due_today") return dueToday;
    if (activeTab === "upcoming") return upcoming;
    return allActive;
  }, [activeTab, overdue, dueToday, upcoming, allActive]);

  const handleComplete = async (id: Id<"followUps">) => {
    if (!clerkId) return;
    try {
      setCompletingId(id);
      await completeFollowUpMutation({
        volunteerClerkId: clerkId,
        followUpId: id,
      });
    } catch (err: unknown) {
      alert(`Failed to complete follow-up: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setCompletingId(null);
    }
  };

  const openReschedule = (id: Id<"followUps">, dueDate: number) => {
    setRescheduleTarget(id);
    setRescheduleDate(new Date(dueDate).toISOString().slice(0, 10));
    setRescheduleError(null);
  };

  const handleReschedule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!clerkId) return;
    if (!rescheduleTarget || !rescheduleDate) {
      setRescheduleError("Choose a date before saving.");
      return;
    }
    const nextDate = new Date(`${rescheduleDate}T09:00:00`).getTime();
    if (!Number.isFinite(nextDate) || nextDate <= Date.now()) {
      setRescheduleError("Choose a future date.");
      return;
    }
    try {
      setUpdatingId(rescheduleTarget);
      await rescheduleFollowUpMutation({ volunteerClerkId: clerkId, followUpId: rescheduleTarget, dueDate: nextDate });
      setRescheduleTarget(null);
    } catch (err) {
      setRescheduleError(err instanceof Error ? err.message : "Unable to reschedule this follow-up.");
    } finally {
      setUpdatingId(null);
    }
  };

  const openCancel = (id: Id<"followUps">, companyName: string) => {
    setCancelTarget({ id, companyName });
  };

  const handleCancel = async () => {
    if (!clerkId || !cancelTarget) return;
    try {
      setUpdatingId(cancelTarget.id);
      await cancelFollowUpMutation({ volunteerClerkId: clerkId, followUpId: cancelTarget.id });
      setCancelTarget(null);
    } catch (err) {
      window.alert(`Failed to remove follow-up: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="border border-border bg-surface overflow-hidden shadow-2xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-text-primary tracking-tight">
            SCHEDULED CALLBACKS & TOUCHPOINTS
          </h2>
          <span className="bg-accent-mint px-2 py-0.5 text-xs font-bold text-primary">
            {allActive.length} active
          </span>
        </div>
        <p className="text-xs text-text-muted">
          Prioritize overdue callbacks first to protect relationship commitments
        </p>
      </div>

      {/* Filter Tabs matching Admin visual language */}
      <nav className="flex items-center gap-6 border-b border-border-subtle px-5 overflow-x-auto" aria-label="Follow-Up Views">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`border-b-2 py-3 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "all"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <span>All Active</span>
          <span className={`px-1.5 py-0.2 text-[10px] font-bold tabular-nums ${activeTab === "all" ? "bg-accent-mint text-primary" : "bg-surface-subtle text-text-muted"}`}>
            {allActive.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("due_today")}
          className={`border-b-2 py-3 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "due_today"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <span>Due Today</span>
          <span className={`px-1.5 py-0.2 text-[10px] font-bold tabular-nums ${activeTab === "due_today" ? "bg-accent-mint text-primary" : "bg-surface-subtle text-text-muted"}`}>
            {dueToday.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("overdue")}
          className={`border-b-2 py-3 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "overdue"
              ? "border-error text-error"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <span>Overdue</span>
          <span className={`px-1.5 py-0.2 text-[10px] font-bold tabular-nums ${activeTab === "overdue" ? "bg-accent-coral text-error" : "bg-surface-subtle text-text-muted"}`}>
            {overdue.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`border-b-2 py-3 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "upcoming"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <span>Upcoming</span>
          <span className={`px-1.5 py-0.2 text-[10px] font-bold tabular-nums ${activeTab === "upcoming" ? "bg-accent-mint text-primary" : "bg-surface-subtle text-text-muted"}`}>
            {upcoming.length}
          </span>
        </button>
      </nav>

      {/* Main Table Content */}
      {followUps === undefined ? (
        <div className="py-12 text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="mt-3 text-xs text-text-secondary">Loading callback touchpoints...</p>
        </div>
      ) : displayedList.length === 0 ? (
        <div className="py-12">
          <EmptyState
            icon={Clock}
            title={activeTab === "overdue" ? "Zero overdue follow-ups! 👏" : activeTab === "due_today" ? "No callbacks scheduled for today" : "No callbacks scheduled"}
            description={
              activeTab === "overdue"
                ? "Every commitment has been met on time. Keep up the momentum!"
                : "When you select 'Call back' during an outreach call or set a follow-up date, it will queue here for rapid 1-click execution."
            }
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-table-header/70 text-[10px] font-bold text-text-muted uppercase tracking-[0.14em]">
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Notes / Commitment</th>
                <th className="py-3 px-4">Follow-Up Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {displayedList.map((item) => {
                const isOverdue = overdue.some((o) => o._id === item._id);
                const isToday = dueToday.some((d) => d._id === item._id);

                return (
                  <tr
                    key={item._id}
                    className={`hover:bg-table-row-hover transition-colors ${
                      isOverdue ? "border-l-2 border-l-error bg-accent-coral/10" : ""
                    }`}
                  >
                    {/* Company */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span className="font-bold text-text-primary text-sm">
                          {item.companyName}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <span>{item.companyIndustry}</span>
                          {item.companyNiche && (
                            <>
                              <span className="text-text-muted">•</span>
                              <span className="text-text-muted truncate max-w-[140px]">{item.companyNiche}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4">
                      {item.primaryContact ? (
                        <div className="space-y-0.5">
                          <p className="font-semibold text-text-primary">
                            {item.primaryContact.contactName}
                          </p>
                          <p className="text-[11px] text-text-secondary">
                            {item.primaryContact.designation}
                          </p>
                          <p className="font-mono text-[11px] text-text-muted">
                            {item.primaryContact.phone}
                          </p>
                        </div>
                      ) : (
                        <span className="text-text-muted italic text-[11px]">No contact attached</span>
                      )}
                    </td>

                    {/* Notes / Commitment */}
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-xs text-text-secondary line-clamp-2 italic">
                        &quot;{item.notes || "Follow up on initial discussion."}&quot;
                      </p>
                    </td>

                    {/* Follow-Up Date */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <p className="font-medium text-text-primary tabular-nums">
                          {new Date(item.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        {isOverdue ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-error uppercase tracking-wider bg-accent-coral px-1.5 py-0.2">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            Overdue
                          </span>
                        ) : isToday ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-yellow-text uppercase tracking-wider bg-accent-yellow px-1.5 py-0.2">
                            <Clock className="h-2.5 w-2.5" />
                            Due Today
                          </span>
                        ) : (
                          <span className="text-[10px] text-text-muted font-medium">
                            Upcoming
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <PriorityBadge priority={item.companyPriority} />
                    </td>

                    {/* Owner */}
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium text-text-secondary">
                        {profile?.name ? "You" : "Volunteer"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openReschedule(item._id, item.dueDate)}
                          disabled={updatingId === item._id}
                          className="h-7 px-2 border border-border bg-surface text-text-secondary hover:text-text-primary text-xs font-medium transition-colors cursor-pointer"
                        >
                          Reschedule
                        </button>

                        <button
                          type="button"
                          onClick={() => handleComplete(item._id)}
                          disabled={completingId === item._id}
                          className="h-7 px-2 border border-border bg-surface text-text-secondary hover:text-success hover:border-success/40 text-xs font-medium transition-colors cursor-pointer"
                          title="Mark Follow-up as Completed"
                        >
                          <Check className="h-3.5 w-3.5 inline mr-1 text-success" />
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
                          className="h-7 px-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-2xs"
                        >
                          <PhoneCall className="h-3 w-3 mr-1" />
                          Call
                        </Button>

                        <button
                          type="button"
                          onClick={() => openCancel(item._id, item.companyName)}
                          disabled={updatingId === item._id}
                          className="h-7 px-1.5 text-text-muted hover:text-error transition-colors cursor-pointer"
                          title="Remove follow-up"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Reschedule Dialog */}
      <Dialog
        isOpen={Boolean(rescheduleTarget)}
        onClose={() => setRescheduleTarget(null)}
        title="Reschedule Follow-Up"
        description="Choose a new date for this callback."
      >
        <form onSubmit={handleReschedule} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              New Callback Date
            </label>
            <Input
              type="date"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full text-xs"
              required
            />
          </div>
          {rescheduleError && (
            <p className="text-xs text-error">{rescheduleError}</p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRescheduleTarget(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={updatingId === rescheduleTarget}
              className="text-xs"
            >
              Save New Date
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        title="Remove Follow-Up"
        description={`Are you sure you want to remove the follow-up for ${cancelTarget?.companyName || "this company"}?`}
      >
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCancelTarget(null)}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleCancel}
            disabled={updatingId === cancelTarget?.id}
            className="text-xs"
          >
            Remove
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
