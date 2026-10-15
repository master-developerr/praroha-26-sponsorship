"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { formatCurrencyINR } from "@/lib/utils";
import { SponsorshipCategory } from "@/types";
import {
  ShieldCheck,
  Award,
  Coins,
  Gift,
  FileCheck2,
  AlertCircle,
  Building2,
  CheckCircle2,
  CheckSquare,
  Square,
} from "lucide-react";

interface OpportunityApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: any | null;
  onSuccess?: () => void;
}

const STANDARD_DELIVERABLES = [
  "Main Stage Digital Backdrop Banner",
  "Central Promenade Exhibition Stall Space",
  "Keynote Session / Technical Workshop Slot",
  "Festival Website & Mobile App Branding",
  "Logo on 3,000+ Delegate Badges & Lanyards",
  "Logo on 300+ Volunteer Core T-Shirts",
  "Dedicated Social Media Spotlight Series",
  "Flyer / Brochure Insertion in Welcome Delegate Kits",
  "Exclusive Category Partner Naming Rights",
  "VIP Stage Banquet Passes & Dinner Invitation",
];

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

export function OpportunityApprovalModal({
  isOpen,
  onClose,
  company,
  onSuccess,
}: OpportunityApprovalModalProps) {
  const { user } = useAuthUser();
  const authorizeCommitmentMutation = useMutation(api.pipeline.authorizeCommitment);

  const [packageTier, setPackageTier] = useState<string>("Associate");
  const [cashAmount, setCashAmount] = useState<number>(150000);
  const [hasInKind, setHasInKind] = useState<boolean>(false);
  const [inKindCategory, setInKindCategory] = useState<SponsorshipCategory>("PRODUCT");
  const [inKindEstimatedValue, setInKindEstimatedValue] = useState<number>(0);
  const [inKindDescription, setInKindDescription] = useState<string>("");
  const [deliverables, setDeliverables] = useState<string[]>([
    "Central Promenade Exhibition Stall Space",
    "Festival Website & Mobile App Branding",
  ]);
  const [mouReference, setMouReference] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (company) {
      if (company.latestProposal) {
        setPackageTier(company.latestProposal.packageTier || "Associate");
        setCashAmount(company.latestProposal.cashAmount || 150000);
        if (company.latestProposal.inKindEstimatedValue) {
          setHasInKind(true);
          setInKindEstimatedValue(company.latestProposal.inKindEstimatedValue);
        }
      } else if (company.recommendedAskMax) {
        setCashAmount(company.recommendedAskMax);
        setPackageTier(company.recommendedSponsorshipType || "Associate");
      }
    }
  }, [company]);

  if (!company) return null;

  const toggleDeliverable = (item: string) => {
    setDeliverables((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const totalCommittedValue =
    Number(cashAmount || 0) + (hasInKind ? Number(inKindEstimatedValue || 0) : 0);

  const handleAuthorize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await authorizeCommitmentMutation({
        companyId: company._id,
        clerkId: user.id,
        proposalId: company.latestProposal?._id,
        packageTier,
        cashAmount: Number(cashAmount) || 0,
        inKindEstimatedValue: hasInKind ? Number(inKindEstimatedValue) || 0 : 0,
        inKindCategory: hasInKind ? inKindCategory : undefined,
        inKindDescription: hasInKind ? inKindDescription : undefined,
        deliverablesCommitment: deliverables,
        mouReference: mouReference.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to authorize commitment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={`Authorize Sponsorship Commitment — ${company.companyName}`}
      description="Exclusive Admin Signing Authority: Ratify corporate commitment and formally advance deal to WON status."
    >
      <form onSubmit={handleAuthorize} className="space-y-4 pt-2 max-h-[75vh] overflow-y-auto pr-1">
        {errorMsg && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Exclusive Authority Banner */}
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-3 text-xs text-emerald-950">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold block">
              Core Committee Administrative Signing Authority
            </span>
            <span className="text-[11px] text-emerald-800">
              This action creates an immutable binding sponsorship record and advances <strong>{company.companyName}</strong> to WON.
            </span>
          </div>
        </div>

        {/* Tier & Financial Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface-subtle border border-border rounded-xl p-3.5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-primary">
              Ratified Sponsorship Tier
            </label>
            <select
              value={packageTier}
              onChange={(e) => setPackageTier(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface p-2 text-xs font-semibold text-text-primary focus:border-primary focus:outline-hidden"
            >
              <option value="Title">Title Sponsor</option>
              <option value="Powered By">Powered By Sponsor</option>
              <option value="Associate">Associate / Category Partner</option>
              <option value="Custom">Custom Partnership</option>
              <option value="In-Kind">In-Kind / Non-Cash Partner</option>
            </select>

            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-semibold text-text-secondary flex items-center gap-1">
                <Coins className="h-3.5 w-3.5 text-emerald-600" />
                Confirmed Cash Amount (₹)
              </label>
              <Input
                type="number"
                min={0}
                step={5000}
                value={cashAmount}
                onChange={(e) => setCashAmount(Number(e.target.value))}
                className="text-sm font-bold"
                required
              />
            </div>
          </div>

          <div className="flex flex-col justify-between items-start sm:items-end border-t sm:border-t-0 sm:border-l border-border-subtle pt-2 sm:pt-0 sm:pl-4">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
              Total Corporate Commitment Value
            </span>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-700 block">
                {formatCurrencyINR(totalCommittedValue)}
              </span>
              <span className="text-[11px] text-text-secondary font-medium">
                Cash: {formatCurrencyINR(cashAmount || 0)}
                {hasInKind ? ` + In-Kind: ${formatCurrencyINR(inKindEstimatedValue || 0)}` : ""}
              </span>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5">
              FESTIVAL REVENUE RECOGNITION
            </span>
          </div>
        </div>

        {/* In-Kind Valuation Section */}
        <div className="rounded-xl border border-border bg-surface p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="hasInKindCommitment"
              className="text-xs font-bold text-text-primary flex items-center gap-2 cursor-pointer"
            >
              <input
                id="hasInKindCommitment"
                type="checkbox"
                checked={hasInKind}
                onChange={(e) => setHasInKind(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <Gift className="h-4 w-4 text-purple-600" />
              Includes In-Kind / Non-Cash Deliverables
            </label>
            {hasInKind && (
              <span className="text-[11px] text-purple-700 font-semibold">
                Valuation: {formatCurrencyINR(inKindEstimatedValue || 0)}
              </span>
            )}
          </div>

          {hasInKind && (
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
                    Agreed INR Fair-Market Valuation
                  </label>
                  <Input
                    type="number"
                    min={0}
                    step={5000}
                    value={inKindEstimatedValue}
                    onChange={(e) => setInKindEstimatedValue(Number(e.target.value))}
                    className="text-xs"
                    required={hasInKind}
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
                  placeholder="e.g. 5,000 units of mineral water bottles + logistics provided."
                  className="w-full rounded-lg border border-border bg-surface p-2 text-xs text-text-primary focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Deliverables Checklist */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-primary">
            Contractual Festival Deliverables ({deliverables.length} selected)
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
        </div>

        {/* MoU / Document Reference & Internal Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              MoU / Signed Agreement Reference
            </label>
            <Input
              type="text"
              value={mouReference}
              onChange={(e) => setMouReference(e.target.value)}
              placeholder="e.g. MOU-PRAROHA26-CUSAT-042 or Google Drive link"
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Executive Committee Notes
            </label>
            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Payment due in 2 tranches (50% advance, 50% post-event)"
              className="text-xs"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-subtle">
          <Button type="button" variant="outline" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
          >
            {isSubmitting ? (
              "Ratifying Deal..."
            ) : (
              <>
                <Award className="h-4 w-4 mr-1.5" />
                Authorize & Ratify Sponsorship
              </>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
