"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, AlertCircle, Plus, Minus, CheckCircle2 } from "lucide-react";
import { useAuthUser } from "@/components/providers/AuthProvider";

interface AdjustPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    _id: Id<"users">;
    name: string;
    totalPoints: number;
    department?: string;
  } | null;
  onSuccess?: () => void;
}

export function AdjustPointsModal({
  isOpen,
  onClose,
  targetUser,
  onSuccess,
}: AdjustPointsModalProps) {
  const { user } = useAuthUser();
  const adjustPointsMutation = useMutation(api.gamification.adminAdjustPoints);

  const [pointsDelta, setPointsDelta] = useState<number>(25);
  const [isDeduction, setIsDeduction] = useState<boolean>(false);
  const [reasonCategory, setReasonCategory] = useState<string>("Field Corporate Visit");
  const [justificationNotes, setJustificationNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setErrorMessage("Authentication error. Please re-login.");
      return;
    }

    if (!justificationNotes.trim()) {
      setErrorMessage("Audit justification notes are required for points adjustments.");
      return;
    }

    const finalPoints = isDeduction ? -Math.abs(pointsDelta) : Math.abs(pointsDelta);

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      await adjustPointsMutation({
        adminClerkId: user.id,
        targetUserId: targetUser._id,
        points: finalPoints,
        reason: `${reasonCategory}: ${justificationNotes.trim()}`,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error("[AdjustPointsModal] Error:", err);
      setErrorMessage(err?.message || "Failed to adjust points.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Discretionary Points Adjustment"
      description={`Manually adjust gamification points for ${targetUser.name} (${targetUser.totalPoints} pts currently).`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-3 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Current Standing Card */}
        <div className="rounded-xl border border-border bg-surface-subtle p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-text-muted font-bold uppercase block">
              Volunteer Name
            </span>
            <span className="font-bold text-sm text-text-primary">
              {targetUser.name}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-text-muted font-bold uppercase block">
              Current Balance
            </span>
            <span className="font-extrabold text-sm text-teal-600 dark:text-teal-400">
              {targetUser.totalPoints} pts
            </span>
          </div>
        </div>

        {/* Award vs Deduct Toggle */}
        <div className="space-y-1.5">
          <label className="font-semibold text-text-primary block">
            Adjustment Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsDeduction(false)}
              className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                !isDeduction
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/50"
                  : "bg-surface border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              <Plus className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Award Bonus Points
            </button>
            <button
              type="button"
              onClick={() => setIsDeduction(true)}
              className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isDeduction
                  ? "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-900/50"
                  : "bg-surface border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              <Minus className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
              Deduct Points
            </button>
          </div>
        </div>

        {/* Point Presets */}
        <div className="space-y-1.5">
          <label className="font-semibold text-text-primary block">
            Points Amount
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {[10, 25, 50, 100, 200].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setPointsDelta(val)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  pointsDelta === val
                    ? isDeduction
                      ? "bg-rose-600 text-white border-rose-700 shadow-xs"
                      : "bg-teal-600 text-white border-teal-700 shadow-xs"
                    : "bg-surface border-border text-text-secondary hover:bg-surface-subtle"
                }`}
              >
                {isDeduction ? `-${val}` : `+${val}`}
              </button>
            ))}
          </div>
        </div>

        {/* Reason Category */}
        <div className="space-y-1.5">
          <label className="font-semibold text-text-primary block">
            Milestone Category
          </label>
          <select
            value={reasonCategory}
            onChange={(e) => setReasonCategory(e.target.value)}
            className="w-full h-8 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="Field Corporate Visit">Field Corporate Office Visit</option>
            <option value="Exceptional Pitch & Deck Delivery">Exceptional Pitch & Deck Delivery</option>
            <option value="Secured Keynote Speaker / Workshop">Secured Keynote Speaker / Workshop Partner</option>
            <option value="Offline Sponsor Lead Sourced">Offline Sponsor Lead Sourced & Verified</option>
            <option value="Administrative Calibration">Administrative Points Calibration</option>
            <option value="Disciplinary Penalty">Disciplinary Penalty (Unexcused Absence)</option>
          </select>
        </div>

        {/* Mandatory Audit Justification */}
        <div className="space-y-1.5">
          <label className="font-semibold text-text-primary block">
            Audit Justification Notes <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            required
            value={justificationNotes}
            onChange={(e) => setJustificationNotes(e.target.value)}
            placeholder="E.g., Traveled to Infopark Kochi to deliver physical pitch collateral to marketing director."
            className="w-full rounded-lg border border-border bg-surface p-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting || !justificationNotes.trim()}
          >
            {isSubmitting
              ? "Saving..."
              : isDeduction
              ? `Confirm -${pointsDelta} Points Deduction`
              : `Confirm +${pointsDelta} Points Award`}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
