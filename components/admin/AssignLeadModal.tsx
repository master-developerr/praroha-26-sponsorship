"use client";

import React, { useState, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCheck, Search, AlertCircle } from "lucide-react";
import { PriorityLevel } from "@/types";

interface AssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: Id<"companies"> | null;
  companyName: string;
  defaultPriority?: PriorityLevel;
  onSuccess?: () => void;
}

export function AssignLeadModal({
  isOpen,
  onClose,
  companyId,
  companyName,
  defaultPriority = "Normal",
  onSuccess,
}: AssignLeadModalProps) {
  const { user } = useAuthUser();
  const assignSingleMutation = useMutation(api.assignments.assignLeadSingle);

  const roster = useQuery(api.assignments.getVolunteerRosterWithWorkload, {}) || [];

  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>(defaultPriority);
  const [instructions, setInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const candidateVolunteers = useMemo(() => {
    return (roster as any[]).filter((v: any) => {
      if (
        searchTerm &&
        !v.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(v.department && v.department.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        return false;
      }
      return true;
    });
  }, [roster, searchTerm]);

  const selectedVolunteer = useMemo(() => {
    return (roster as any[]).find((v: any) => v._id === selectedVolunteerId);
  }, [roster, selectedVolunteerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !selectedVolunteerId || !user?.id) {
      setErrorMessage("Please select a target volunteer.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      await assignSingleMutation({
        adminClerkId: user.id,
        companyId,
        volunteerId: selectedVolunteerId as Id<"users">,
        priority,
        instructions: instructions.trim() || undefined,
      });

      setSelectedVolunteerId("");
      setInstructions("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to assign lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Corporate Lead"
      description={`Assign ${companyName} to an approved student SDR or Admin.`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-3 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Selected target preview */}
        <div className="rounded-xl border border-border bg-surface-subtle/60 p-3 text-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-text-muted uppercase font-semibold tracking-wider block">
              Target Lead
            </span>
            <span className="font-bold text-text-primary text-sm">{companyName}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-text-muted uppercase font-semibold tracking-wider block">
              Selected Assignee
            </span>
            <span className="font-bold text-primary text-sm">
              {selectedVolunteer ? selectedVolunteer.name : "None selected"}
            </span>
          </div>
        </div>

        {/* Searchable Roster */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-text-primary">
              Select Assignee ({candidateVolunteers.length} available) <span className="text-rose-500">*</span>
            </label>
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates..."
                className="w-full pl-8 pr-2.5 py-1 text-xs rounded-md border border-border bg-surface text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="border border-border rounded-xl bg-surface divide-y divide-border-subtle max-h-48 overflow-y-auto">
            {candidateVolunteers.length === 0 ? (
              <div className="p-4 text-center text-xs text-text-muted">
                No eligible candidates match your search.
              </div>
            ) : (
              candidateVolunteers.map((v: any) => {
                const isSelected = selectedVolunteerId === v._id;
                const isAdmin = v.role === "admin";

                return (
                  <div
                    key={v._id}
                    onClick={() => setSelectedVolunteerId(v._id)}
                    className={`p-2.5 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-accent-mint/30 font-semibold"
                        : "hover:bg-surface-subtle"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => setSelectedVolunteerId(v._id)}
                        className="text-primary focus:ring-primary"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-text-primary">{v.name}</span>
                          {isAdmin && (
                            <span className="rounded bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 text-[9px] font-bold px-1.5 py-0.2 uppercase">
                              Admin
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-text-muted">
                          {v.department || "Civil Engineering"} {v.semester ? `• ${v.semester}` : ""}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <span className="text-[11px] text-text-secondary font-mono">
                        {v.activeLeadsCount} active
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          v.capacityStatus === "Near Capacity"
                            ? "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300"
                            : v.capacityStatus === "Moderate"
                            ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                            : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                        }`}
                      >
                        {v.capacityStatus}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Priority & Instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-text-primary">Assignment Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Normal">Normal Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-primary">Instructions (Optional)</label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="E.g., Focus on Title sponsorship or tech workshops"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
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
            type="submit"
            size="sm"
            disabled={isSubmitting || !selectedVolunteerId}
            className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1.5">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Assigning...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5" />
                <span>Confirm Assignment</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
