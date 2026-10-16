"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserCheck, AlertCircle } from "lucide-react";

interface ReassignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: Id<"companies"> | null;
  companyName: string;
  currentVolunteerName?: string;
  volunteers: Array<{
    _id: Id<"users">;
    name: string;
    role?: string;
    department?: string;
    semester?: string;
    activeLeadsCount: number;
    capacityStatus: string;
  }>;
  onSuccess?: () => void;
}

export function ReassignLeadModal({
  isOpen,
  onClose,
  companyId,
  companyName,
  currentVolunteerName,
  volunteers,
  onSuccess,
}: ReassignLeadModalProps) {
  const { user } = useAuthUser();
  const reassignLeadMutation = useMutation(api.assignments.reassignLead);

  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !selectedVolunteerId || !reason.trim() || !user?.id) {
      setErrorMessage("Please select a new volunteer and provide a valid reason.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      await reassignLeadMutation({
        adminClerkId: user.id,
        companyId,
        newVolunteerId: selectedVolunteerId as Id<"users">,
        reassignReason: reason.trim(),
      });

      setReason("");
      setSelectedVolunteerId("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to reassign lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Reassign Corporate Lead"
      description={`Transfer outreach ownership of ${companyName} to another approved student SDR.`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Current Ownership Callout */}
        <div className="rounded-lg border border-border-subtle bg-surface-subtle p-3 text-xs flex items-center justify-between">
          <span className="text-text-muted">Current Assignee:</span>
          <span className="font-semibold text-text-primary">
            {currentVolunteerName || "Unassigned"}
          </span>
        </div>

        {/* Target New Assignee Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary">
            New Assignee (Approved SDR or Admin) <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedVolunteerId}
            onChange={(e) => setSelectedVolunteerId(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="">Select an active assignee (SDR or Admin)...</option>
            {volunteers.map((v) => {
              const isAdmin = v.role === "admin";
              const title = isAdmin
                ? `${v.name} [Admin • ${v.department || "Core Committee"}]`
                : `${v.name} (${v.department} • ${v.semester})`;
              return (
                <option key={v._id} value={v._id}>
                  {title} — {v.activeLeadsCount} active leads [{v.capacityStatus}]
                </option>
              );
            })}
          </select>
        </div>

        {/* Reassignment Audit Reason */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary">
            Reassignment Audit Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="E.g., Workload balancing, departmental alignment with company alumni, or SDR absence."
            required
            className="w-full rounded-lg border border-border bg-surface p-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
          <p className="text-[10px] text-text-muted">
            This reason will be immutably recorded in the administrative audit trail.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !selectedVolunteerId || !reason.trim()}
            className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1.5">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Reassigning...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5" />
                <span>Confirm Reassignment</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
