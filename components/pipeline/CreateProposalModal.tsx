"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { SponsorshipTier, SponsorshipCategory } from "@/types";
import { formatCurrencyINR } from "@/lib/utils";
import {
  Trophy,
  Gift,
  Coins,
  CheckSquare,
  Square,
  FileCheck2,
  Send,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: Id<"companies">;
  companyName: string;
  defaultTier?: SponsorshipTier;
  onSuccess?: () => void;
}

const STANDARD_DELIVERABLES = [
  "Main Stage Digital Backdrop Banner",
  "Central Promenade Exhibition Stall Space",
  "Keynote Session / Technical Workshop Slot",
  "Festival Website & Mobile App Branding",
  "Logo on 3,000+ Delegate Badges & Lanyards",
  "Logo on 300+ Volunteer Core T-Shirts",
  "Dedicated Social Media Series (100K+ Impressions)",
  "Flyer / Brochure Insertion in Welcome Delegate Kits",
  "Exclusive Category Partner Naming Rights",
  "VIP Stage Banquet Passes & Dinner Invitation",
];

const TIER_DEFAULTS: Record<
  SponsorshipTier,
  { cash: number; inKindVal: number; deliverables: string[] }
> = {
  Title: {
    cash: 500000,
    inKindVal: 0,
    deliverables: [
      "Main Stage Digital Backdrop Banner",
      "Central Promenade Exhibition Stall Space",
      "Keynote Session / Technical Workshop Slot",
      "Festival Website & Mobile App Branding",
      "Logo on 3,000+ Delegate Badges & Lanyards",
      "Logo on 300+ Volunteer Core T-Shirts",
      "Dedicated Social Media Series (100K+ Impressions)",
      "VIP Stage Banquet Passes & Dinner Invitation",
    ],
  },
  "Powered By": {
    cash: 300000,
    inKindVal: 0,
    deliverables: [
      "Main Stage Digital Backdrop Banner",
      "Central Promenade Exhibition Stall Space",
      "Keynote Session / Technical Workshop Slot",
      "Festival Website & Mobile App Branding",
      "Flyer / Brochure Insertion in Welcome Delegate Kits",
    ],
  },
  Associate: {
    cash: 150000,
    inKindVal: 0,
    deliverables: [
      "Central Promenade Exhibition Stall Space",
      "Festival Website & Mobile App Branding",
      "Exclusive Category Partner Naming Rights",
    ],
  },
  Custom: {
    cash: 100000,
    inKindVal: 0,
    deliverables: ["Central Promenade Exhibition Stall Space", "Festival Website & Mobile App Branding"],
  },
  "In-Kind": {
    cash: 0,
    inKindVal: 100000,
    deliverables: ["Festival Website & Mobile App Branding", "Central Promenade Exhibition Stall Space"],
  },
};

const IN_KIND_CATEGORIES: { value: SponsorshipCategory; label: string }[] = [
  { value: "PRODUCT", label: "Product / Beverages / Snacks" },
  { value: "SERVICES", label: "Services (Media, Streaming, Photography)" },
  { value: "TECHNICAL_SUPPORT", label: "Technical Support (AV, Lights, Sound)" },
  { value: "WORKSHOP", label: "Technical Workshop Sponsorship" },
  { value: "SPEAKER", label: "Keynote Speaker Travel & Honorarium" },
  { value: "PRIZES", label: "Competition / Hackathon Prize Pool" },
  { value: "SOFTWARE", label: "Software / Cloud Compute Credits" },
  { value: "MERCHANDISE", label: "Merchandise (T-Shirts, Bags, Kits)" },
  { value: "VENUE", label: "Venue & Stage Setup Materials" },
  { value: "PRINTING", label: "Flex Printing, Badges & Posters" },
  { value: "TRANSPORTATION", label: "Transportation / Travel Shuttle" },
  { value: "OTHER_IN_KIND", label: "Other Non-Cash Support" },
];

export function CreateProposalModal({
  isOpen,
  onClose,
  companyId,
  companyName,
  defaultTier = "Associate",
  onSuccess,
}: CreateProposalModalProps) {
  const { user } = useAuthUser();
  const createProposalMutation = useMutation(api.proposals.createProposal);

  const [packageTier, setPackageTier] = useState<SponsorshipTier>(defaultTier);
  const [cashAmount, setCashAmount] = useState<number>(
    TIER_DEFAULTS[defaultTier].cash
  );
  const [includeInKind, setIncludeInKind] = useState<boolean>(defaultTier === "In-Kind");
  const [inKindCategory, setInKindCategory] = useState<SponsorshipCategory>("PRODUCT");
  const [inKindEstimatedValue, setInKindEstimatedValue] = useState<number>(
    defaultTier === "In-Kind" ? 100000 : 0
  );
  const [inKindDescription, setInKindDescription] = useState<string>("");
  const [deliverables, setDeliverables] = useState<string[]>(
    TIER_DEFAULTS[defaultTier].deliverables
  );
  const [customDeliverables, setCustomDeliverables] = useState<string>("");
  const [proposalStatus, setProposalStatus] = useState<"draft" | "sent">("sent");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleTierChange = (tier: SponsorshipTier) => {
    setPackageTier(tier);
    const defaults = TIER_DEFAULTS[tier];
    setCashAmount(defaults.cash);
    setDeliverables(defaults.deliverables);
    if (tier === "In-Kind") {
      setIncludeInKind(true);
      setInKindEstimatedValue(100000);
    }
  };

  const toggleDeliverable = (item: string) => {
    setDeliverables((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const totalCommercialValuation =
    cashAmount + (includeInKind ? inKindEstimatedValue || 0 : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await createProposalMutation({
        companyId,
        clerkId: user.id,
        packageTier,
        cashAmount: Number(cashAmount) || 0,
        inKindCategory: includeInKind ? inKindCategory : undefined,
        inKindDescription: includeInKind ? inKindDescription : undefined,
        inKindEstimatedValue: includeInKind ? Number(inKindEstimatedValue) || 0 : 0,
        deliverables,
        customDeliverables: customDeliverables.trim() || undefined,
        status: proposalStatus,
        notes: notes.trim() || undefined,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={`Create Sponsorship Proposal — ${companyName}`}
      description="Select package tier, specify cash and in-kind valuations, and customize festival deliverables."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 max-h-[75vh] overflow-y-auto pr-1">
        {errorMsg && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Package Tier Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            Sponsorship Tier
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(["Title", "Powered By", "Associate", "Custom", "In-Kind"] as SponsorshipTier[]).map(
              (t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTierChange(t)}
                  className={`rounded-xl border p-2 text-center text-xs font-medium transition-all ${
                    packageTier === t
                      ? "border-primary bg-primary/10 text-primary font-bold ring-2 ring-primary/20 shadow-xs"
                      : "border-border bg-surface text-text-secondary hover:border-text-muted"
                  }`}
                >
                  {t}
                </button>
              )
            )}
          </div>
        </div>

        {/* 2. Cash Ask & Valuation Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface-subtle border border-border rounded-xl p-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-emerald-600" />
              Cash Sponsorship Amount (₹)
            </label>
            <Input
              type="number"
              min={0}
              step={5000}
              value={cashAmount}
              onChange={(e) => setCashAmount(Number(e.target.value))}
              placeholder="e.g. 150000"
              className="text-sm font-semibold"
              required
            />
          </div>

          <div className="flex flex-col justify-center items-start sm:items-end border-t sm:border-t-0 sm:border-l border-border-subtle pt-2 sm:pt-0 sm:pl-4">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
              Total Deal Valuation (Cash + In-Kind)
            </span>
            <span className="text-lg font-extrabold text-primary">
              {formatCurrencyINR(totalCommercialValuation)}
            </span>
            <span className="text-[10px] text-text-secondary">
              Includes {deliverables.length} promised deliverables
            </span>
          </div>
        </div>

        {/* 3. Non-Cash / In-Kind Section */}
        <div className="rounded-xl border border-border bg-surface p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="includeInKind"
              className="text-xs font-bold text-text-primary flex items-center gap-2 cursor-pointer"
            >
              <input
                id="includeInKind"
                type="checkbox"
                checked={includeInKind}
                onChange={(e) => setIncludeInKind(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <Gift className="h-4 w-4 text-purple-600" />
              Include Non-Cash / In-Kind Component
            </label>
            {includeInKind && (
              <span className="rounded-full bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 text-[10px] font-bold">
                13 Categories
              </span>
            )}
          </div>

          {includeInKind && (
            <div className="space-y-3 pt-2 border-t border-border-subtle">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-text-secondary">
                    In-Kind Category
                  </label>
                  <select
                    value={inKindCategory}
                    onChange={(e) => setInKindCategory(e.target.value as SponsorshipCategory)}
                    className="w-full rounded-lg border border-border bg-surface p-2 text-xs text-text-primary focus:border-primary focus:outline-hidden"
                  >
                    {IN_KIND_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-text-secondary">
                    Estimated Fair-Market Valuation (₹)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    step={5000}
                    value={inKindEstimatedValue}
                    onChange={(e) => setInKindEstimatedValue(Number(e.target.value))}
                    placeholder="e.g. 75000"
                    className="text-xs"
                    required={includeInKind}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-secondary">
                  Goods / Services Description
                </label>
                <textarea
                  rows={2}
                  value={inKindDescription}
                  onChange={(e) => setInKindDescription(e.target.value)}
                  placeholder="e.g. 5,000 bottles of 500ml mineral water with cold-chain delivery on Days 1-3."
                  className="w-full rounded-lg border border-border bg-surface p-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. Deliverables Checklist */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-primary flex items-center justify-between">
            <span>Festival Deliverables & Commitments ({deliverables.length} selected)</span>
            <span className="text-[10px] text-text-muted">Click to toggle deliverables</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto border border-border rounded-xl p-2.5 bg-surface">
            {STANDARD_DELIVERABLES.map((del) => {
              const isSelected = deliverables.includes(del);
              return (
                <button
                  key={del}
                  type="button"
                  onClick={() => toggleDeliverable(del)}
                  className={`flex items-start gap-2 p-1.5 rounded-lg text-left text-xs transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-text-secondary hover:bg-surface-subtle"
                  }`}
                >
                  {isSelected ? (
                    <CheckSquare className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  ) : (
                    <Square className="h-3.5 w-3.5 text-text-muted shrink-0 mt-0.5" />
                  )}
                  <span className="line-clamp-1">{del}</span>
                </button>
              );
            })}
          </div>

          <Input
            type="text"
            value={customDeliverables}
            onChange={(e) => setCustomDeliverables(e.target.value)}
            placeholder="Add custom promised items (e.g. 10 VIP dinner invites, stage MC mention)"
            className="text-xs"
          />
        </div>

        {/* 5. Dispatch Status & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Proposal Dispatch State
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProposalStatus("sent")}
                className={`rounded-xl border p-2 text-center text-xs font-medium ${
                  proposalStatus === "sent"
                    ? "border-sky-500 bg-sky-50 text-sky-800 font-bold"
                    : "border-border text-text-secondary"
                }`}
              >
                Mark as Sent
              </button>
              <button
                type="button"
                onClick={() => setProposalStatus("draft")}
                className={`rounded-xl border p-2 text-center text-xs font-medium ${
                  proposalStatus === "draft"
                    ? "border-amber-500 bg-amber-50 text-amber-800 font-bold"
                    : "border-border text-text-secondary"
                }`}
              >
                Save as Draft
              </button>
            </div>
            <p className="text-[10px] text-text-muted mt-1">
              {proposalStatus === "sent"
                ? "Advances lead lifecycle stage to PROPOSAL_SENT."
                : "Keeps proposal in draft status."}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Internal Proposal Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Emailed customized deck to Regional Marketing VP."
              className="w-full rounded-lg border border-border bg-surface p-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-hidden"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-subtle">
          <Button type="button" variant="outline" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
            {isSubmitting ? (
              "Saving Proposal..."
            ) : proposalStatus === "sent" ? (
              <>
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Dispatch & Advance Stage
              </>
            ) : (
              <>
                <FileCheck2 className="h-3.5 w-3.5 mr-1.5" />
                Save Draft Proposal
              </>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
