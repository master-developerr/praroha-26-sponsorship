"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserX, AlertTriangle, AlertCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/components/providers/AuthProvider";

interface UnassignConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: Id<"companies"> | null;
  companyName: string;
  currentVolunteerName?: string;
  onSuccess?: () => void;
}

export function UnassignConfirmationModal({
  isOpen,
  onClose,
  companyId,
  companyName,
  currentVolunteerName,
  onSuccess,
}: UnassignConfirmationModalProps) {
  const { user } = useAuthUser();
  const unassignLeadMutation = useMutation(api.assignments.unassignLead);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!companyId || !user?.id) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await unassignLeadMutation({
        adminClerkId: user.id,
        companyId,
        reason: "Unassigned via administrative action",
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to unassign lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Unassign this lead?"
      description="Remove ownership and return lead to the Unassigned Pool."
    >
      <div className="space-y-4 pt-1">
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-3 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}
        {/* Warning callout */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 p-3.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-text-primary">
              This lead will be removed from {currentVolunteerName || "the assigned volunteer"} and returned to the unassigned pool.
            </p>
            <p className="text-text-muted leading-relaxed">
              No lead data or activity history will be deleted. Contacts, call logs, debriefs, notes, and proposals will remain completely intact.
            </p>
          </div>
        </div>

        {/* Lead summary */}
        <div className="rounded-xl border border-border bg-surface-subtle p-3 text-xs space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Target Company:</span>
            <span className="font-bold text-text-primary">{companyName}</span>
          </div>
          {currentVolunteerName && (
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Current Assignee:</span>
              <span className="font-semibold text-text-secondary">{currentVolunteerName}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Post-Action Status:</span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-400">UNASSIGNED POOL</span>
          </div>
        </div>

        {/* Modal actions */}
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
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Unassigning...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <UserX className="h-3.5 w-3.5" />
                <span>Unassign Lead</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
