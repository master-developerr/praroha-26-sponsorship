"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Award,
  CheckCircle2,
  Sliders,
  Sparkles,
  RotateCcw,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useAuthUser } from "@/components/providers/AuthProvider";

interface PointConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PointConfigDrawer({ isOpen, onClose }: PointConfigDrawerProps) {
  const { user } = useAuthUser();
  const configs = useQuery(api.gamification.getPointConfigurations);
  const updateConfigMutation = useMutation(
    api.gamification.updatePointConfiguration
  );

  const [editingPoints, setEditingPoints] = useState<Record<string, number>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePointChange = (eventType: string, val: number) => {
    setEditingPoints((prev) => ({
      ...prev,
      [eventType]: val,
    }));
  };

  const handleSave = async (
    eventType: string,
    label: string,
    description: string,
    currentPoints: number
  ) => {
    if (!user?.id) {
      setErrorMessage("Unauthorized. Please log in as an administrator.");
      return;
    }

    const newPoints = editingPoints[eventType] ?? currentPoints;
    if (newPoints < 0) {
      setErrorMessage("Points must be a non-negative number.");
      return;
    }

    try {
      setSavingKey(eventType);
      setErrorMessage(null);
      setSuccessMessage(null);

      await updateConfigMutation({
        adminClerkId: user.id,
        eventType,
        points: newPoints,
        label,
        description,
      });

      setSuccessMessage(`Successfully updated points weight for "${label}" to ${newPoints} pts.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update point rule.");
    } finally {
      setSavingKey(null);
    }
  };

  const handleResetDefault = (eventType: string, defaultPoints: number) => {
    handlePointChange(eventType, defaultPoints);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="Point Engine Rules & Weights"
      description="Configure the exact points awarded to SDR volunteers for completed outreach actions. Changes immediately affect all future events."
    >
      <div className="space-y-4 pt-2">
        {/* Banner */}
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-900 flex items-start gap-2.5">
          <Award className="h-4 w-4 text-sky-700 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">Real-Time Central Point Engine</p>
            <p className="text-[11px] text-sky-800 mt-0.5 leading-relaxed">
              Points are evaluated server-side with strict idempotency keys. Any changes to weights are logged in the immutable audit trail and take effect instantaneously.
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* Configurations List */}
        {!configs ? (
          <div className="py-12 text-center text-xs text-text-muted">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-2" />
            Loading point configuration rules...
          </div>
        ) : (
          <div className="space-y-3">
            {configs.map((config) => {
              const currentVal =
                editingPoints[config.eventType] !== undefined
                  ? editingPoints[config.eventType]
                  : config.points;
              const isModified = currentVal !== config.points;
              const isSaving = savingKey === config.eventType;

              return (
                <div
                  key={config.eventType}
                  className="rounded-xl border border-border bg-surface p-3.5 text-xs shadow-2xs hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-primary text-sm">
                          {config.label}
                        </span>
                        <code className="rounded bg-surface-subtle px-1.5 py-0.5 text-[10px] text-text-muted border border-border-subtle font-mono">
                          {config.eventType}
                        </code>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        {config.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Input
                          type="number"
                          min={0}
                          max={1000}
                          value={currentVal}
                          onChange={(e) =>
                            handlePointChange(
                              config.eventType,
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="h-8 w-20 text-center font-extrabold text-sm"
                        />
                        <span className="text-xs font-semibold text-text-muted">
                          pts
                        </span>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={isSaving}
                        disabled={!isModified && currentVal === config.points}
                        onClick={() =>
                          handleSave(
                            config.eventType,
                            config.label,
                            config.description,
                            config.points
                          )
                        }
                        className="h-8 px-3 text-xs font-bold"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-3 border-t border-border flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8">
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
