"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrencyINR } from "@/lib/utils";
import {
  Coins,
  Gift,
  Building2,
  FileCheck2,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react";

interface EditCommitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  commitment: any | null;
}

const IN_KIND_CATEGORIES = [
  { value: "PRODUCT", label: "Product (Beverages, Snacks, Electronics)" },
  { value: "SERVICES", label: "Services (Logistics, Media, Production)" },
  { value: "TECHNICAL_SUPPORT", label: "Technical Support (Hardware, Sound)" },
  { value: "WORKSHOP", label: "Workshop / Masterclass Sponsor" },
  { value: "SPEAKER", label: "Keynote Speaker Session" },
  { value: "PRIZES", label: "Competition / Hackathon Prize Pool" },
  { value: "SOFTWARE", label: "Software / Cloud Tools / Dev Credits" },
  { value: "MERCHANDISE", label: "Merchandise (Kits, T-Shirts)" },
  { value: "VENUE", label: "Venue & Stage Setup" },
  { value: "PRINTING", label: "Printing & Flex Banners" },
  { value: "TRANSPORTATION", label: "Travel & Transportation Partner" },
  { value: "OTHER_IN_KIND", label: "Other In-Kind Partnership" },
];

const STANDARD_DELIVERABLES = [
  "Event named/presented as 'Civil Fest powered by [Sponsor]'",
  "Prominent logo placement on posters, banners and creatives",
  "Large flex branding at the venue",
  "Dedicated social media promotion and stories",
  "Sponsor mentions during major events and announcements",
  "Branding on stage backdrop and prize distribution",
  "Space for promotional materials/stall or standee",
  "Priority access to event attendees for lead generation & demos",
  "Complimentary booth staff passes & VIP access",
  "Post-event report with attendee engagement metrics & insights",
  "Option to host a keynote session, workshop, or activation",
  "Official website logo placement",
  "Digital sponsor badge for partner use",
  "Logo inclusion on the sponsor thank-you display",
];

const COMMITMENT_STATUSES = [
  { value: "PROSPECT", label: "Prospect (Early Discussion)" },
  { value: "NEGOTIATING", label: "Negotiating (Terms in Review)" },
  { value: "PROPOSED", label: "Proposed (Formal Proposal Sent)" },
  { value: "VERBAL_COMMITMENT", label: "Verbal Commitment" },
  { value: "CONFIRMED", label: "Confirmed (MoU Agreed)" },
  { value: "DELIVERABLES_PENDING", label: "Deliverables Pending" },
  { value: "COMPLETED", label: "Completed (Fulfilled)" },
  { value: "CANCELLED", label: "Cancelled / Lapsed" },
] as const;

export function EditCommitmentModal({
  isOpen,
  onClose,
  commitment,
}: EditCommitmentModalProps) {
  const { user } = useAuthUser();
  const updateCommitmentMutation = useMutation(api.commitments.updateCommitment);

  const [packageTier, setPackageTier] = useState<string>("Associate");
  const [status, setStatus] = useState<
    | "PROSPECT"
    | "NEGOTIATING"
    | "PROPOSED"
    | "VERBAL_COMMITMENT"
    | "CONFIRMED"
    | "DELIVERABLES_PENDING"
    | "COMPLETED"
    | "CANCELLED"
  >("CONFIRMED");
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [inKindCategory, setInKindCategory] = useState<string>("PRODUCT");
  const [inKindEstimatedValue, setInKindEstimatedValue] = useState<number>(0);
  const [inKindDescription, setInKindDescription] = useState<string>("");
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([]);
  const [customDeliverable, setCustomDeliverable] = useState<string>("");
  const [mouReference, setMouReference] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (commitment) {
      setPackageTier(commitment.packageTier || "Associate");
      setStatus(commitment.status || "CONFIRMED");
      setCashAmount(commitment.cashAmount || 0);
      setInKindEstimatedValue(commitment.inKindEstimatedValue || 0);
      setInKindCategory(commitment.inKindCategory || "PRODUCT");
      setInKindDescription(commitment.inKindDescription || "");
      setSelectedDeliverables(commitment.deliverablesCommitment || []);
      setMouReference(commitment.mouReference || "");
      setNotes(commitment.notes || "");
    }
  }, [commitment]);

  if (!isOpen || !commitment) return null;

  const totalValuation = Math.max(0, cashAmount) + Math.max(0, inKindEstimatedValue);

  const handleToggleDeliverable = (item: string) => {
    setSelectedDeliverables((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleAddCustomDeliverable = () => {
    if (customDeliverable.trim() && !selectedDeliverables.includes(customDeliverable.trim())) {
      setSelectedDeliverables((prev) => [...prev, customDeliverable.trim()]);
      setCustomDeliverable("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setErrorMsg("Administrator session required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      await updateCommitmentMutation({
        adminClerkId: user.id,
        commitmentId: commitment._id,
        packageTier,
        status,
        cashAmount: Number(cashAmount) || 0,
        inKindEstimatedValue: Number(inKindEstimatedValue) || 0,
        inKindCategory: inKindEstimatedValue > 0 ? inKindCategory : undefined,
        inKindDescription: inKindDescription.trim() || undefined,
        deliverablesCommitment: selectedDeliverables,
        mouReference: mouReference.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update sponsorship commitment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Commitment — ${commitment.companyName}`}
      description="Update contract status, valuation amounts, deliverables fulfillment, and MoU details."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
        {errorMsg && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-rose-700 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Package Tier & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Package Tier
            </label>
            <select
              value={packageTier}
              onChange={(e) => setPackageTier(e.target.value)}
              className="w-full h-8 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="Title">Title Sponsor (₹4 Lakhs)</option>
              <option value="Co-Sponsor">Co-Sponsor (₹2 Lakhs)</option>
              <option value="Associate">Associate Sponsor (₹1 Lakh)</option>
              <option value="Supporting">Supporting Sponsor (₹50K)</option>
              <option value="Community">Community Sponsor (₹25K)</option>
              <option value="Event Sponsor">Event Sponsor* (₹10K+)</option>
              <option value="Custom">Custom Commercial Partnership</option>
              <option value="In-Kind">Exclusive In-Kind Partner</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Commitment Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full h-8 rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-primary focus:border-primary focus:outline-none"
            >
              {COMMITMENT_STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Financial Inputs: Cash & In-Kind */}
        <div className="rounded-xl border border-border bg-surface-subtle p-3.5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-text-primary mb-1 flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-emerald-600" />
                Contracted Cash (₹ INR)
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                value={cashAmount}
                onChange={(e) => setCashAmount(Number(e.target.value) || 0)}
                className="w-full h-8 rounded-lg border border-border bg-surface px-2.5 text-xs font-mono font-bold text-text-primary focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1 flex items-center gap-1.5">
                <Gift className="h-3.5 w-3.5 text-teal-600" />
                In-Kind Valuation (₹ INR)
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                value={inKindEstimatedValue}
                onChange={(e) => setInKindEstimatedValue(Number(e.target.value) || 0)}
                className="w-full h-8 rounded-lg border border-border bg-surface px-2.5 text-xs font-mono font-bold text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {inKindEstimatedValue > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border-subtle">
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  In-Kind Category
                </label>
                <select
                  value={inKindCategory}
                  onChange={(e) => setInKindCategory(e.target.value)}
                  className="w-full h-8 rounded-lg border border-border bg-surface px-2 text-xs text-text-primary focus:border-primary focus:outline-none"
                >
                  {IN_KIND_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  In-Kind Item Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500 bottles of energy drinks"
                  value={inKindDescription}
                  onChange={(e) => setInKindDescription(e.target.value)}
                  className="w-full h-8 rounded-lg border border-border bg-surface px-2 text-xs text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs font-bold">
            <span className="text-text-muted">Total Partnership Commercial Value:</span>
            <span className="text-sm text-primary font-black">
              {formatCurrencyINR(totalValuation)}
            </span>
          </div>
        </div>

        {/* Deliverables Checklist */}
        <div className="space-y-2">
          <label className="block font-semibold text-text-primary">
            Promised Deliverables ({selectedDeliverables.length} selected)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 rounded-lg border border-border bg-surface-subtle">
            {STANDARD_DELIVERABLES.map((deliv) => {
              const isChecked = selectedDeliverables.includes(deliv);
              return (
                <label
                  key={deliv}
                  className="flex items-center gap-2 p-1 rounded hover:bg-surface transition-colors cursor-pointer text-[11px]"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleDeliverable(deliv)}
                    className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className={isChecked ? "text-text-primary font-medium" : "text-text-muted"}>
                    {deliv}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Add custom deliverable..."
              value={customDeliverable}
              onChange={(e) => setCustomDeliverable(e.target.value)}
              className="flex-1 h-7 rounded border border-border bg-surface px-2 text-xs text-text-primary focus:border-primary focus:outline-none"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCustomDeliverable}
              className="h-7 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
        </div>

        {/* MoU Reference & Admin Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-text-primary mb-1">
              MoU Reference / Agreement ID
            </label>
            <input
              type="text"
              placeholder="e.g. PRAROHA26-MOU-014"
              value={mouReference}
              onChange={(e) => setMouReference(e.target.value)}
              className="w-full h-8 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Administrative Notes
            </label>
            <input
              type="text"
              placeholder="Payment milestone, cheque details, or delivery date"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-8 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
