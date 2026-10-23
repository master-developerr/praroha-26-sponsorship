"use client";

import React, { useState, useEffect, useRef } from "react";
import { Id } from "@/convex/_generated/dataModel";
import {
  PhoneCall,
  X,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  ContactVerificationBadge,
  PhoneTypeBadge,
} from "@/components/ui/badge";
import { ConciseTalkingPoints } from "@/components/volunteer/ConciseTalkingPoints";
import { QuickCallOutcome, ContactVerificationLevel, PhoneType, PriorityLevel } from "@/types";

interface CallModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  lead: {
    _id: Id<"companies">;
    companyName: string;
    industry: string;
    niche: string;
    priority: PriorityLevel;
    location?: string;
    keralaPresence?: string;
    sponsorshipHistory?: string;
    whyGoodLead?: string;
    whyCompanyBenefits?: string;
    alternativeSupport?: string;
    primaryContact?: {
      _id?: Id<"contacts">;
      contactName: string;
      designation: string;
      phone: string;
      phoneType: PhoneType;
      contactVerification: ContactVerificationLevel;
      email?: string;
    } | null;
  } | null;
  onSelectOutcome: (
    outcome: QuickCallOutcome,
    durationSeconds: number,
    startedAt: number,
    endedAt: number
  ) => void;
}

function CallStopwatch({ startedAt }: { startedAt: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    const interval = setInterval(() => {
      setElapsed(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const formatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1 font-mono text-xs font-semibold text-text-primary shadow-xs">
      <Clock className="h-3.5 w-3.5 text-primary" />
      <span>{formatted}</span>
    </div>
  );
}

export function CallModeOverlay({
  isOpen,
  onClose,
  lead,
  onSelectOutcome,
}: CallModeOverlayProps) {
  const [startedAt] = useState(() => Date.now());

  if (!isOpen || !lead) return null;

  const handleOutcomeClick = (outcome: QuickCallOutcome) => {
    const endedAt = Date.now();
    const duration = Math.max(1, Math.floor((endedAt - startedAt) / 1000));
    onSelectOutcome(outcome, duration, startedAt, endedAt);
  };

  const contactPhone = lead.primaryContact?.phone || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[90vh] rounded-xl border border-border bg-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-border bg-surface-subtle px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white shadow-xs">
              <PhoneCall className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Active Call Mode
                </span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h2 className="text-base font-bold text-text-primary">
                {lead.companyName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Stopwatch Timer (Isolated Component to prevent parent re-renders) */}
            <CallStopwatch startedAt={startedAt} />

            <button
              onClick={onClose}
              aria-label="Close call overlay"
              className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-surface hover:text-text-primary transition-colors cursor-pointer border border-transparent hover:border-border"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Center Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Dialing Hero Card */}
          <div className="rounded-lg border border-border bg-surface-subtle p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-text-primary">
                  {lead.primaryContact?.contactName || "Main Switchboard / Office"}
                </span>
                {lead.primaryContact && (
                  <ContactVerificationBadge
                    level={lead.primaryContact.contactVerification}
                  />
                )}
              </div>
              <p className="text-xs text-text-secondary">
                {lead.primaryContact?.designation || "Corporate Contact Line"} •{" "}
                {lead.industry}
              </p>
              {lead.primaryContact && (
                <div className="pt-1">
                  <PhoneTypeBadge type={lead.primaryContact.phoneType} />
                </div>
              )}
            </div>

            {/* Large Clickable Phone Number */}
            <div className="text-left sm:text-right">
              {contactPhone ? (
                <a
                  href={`tel:${contactPhone}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white px-5 py-2.5 font-mono text-base font-bold shadow-md transition-all cursor-pointer"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>{contactPhone}</span>
                </a>
              ) : (
                <span className="text-xs text-text-muted italic">
                  No telephone number attached
                </span>
              )}
              <p className="text-[10px] text-text-muted mt-1">
                Click to dial immediately on handset / VoIP
              </p>
            </div>
          </div>

          {/* Sticky Concise Talking Points Reference Box */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Live Briefing & Counter-Battlecards
            </h3>
            <ConciseTalkingPoints
              companyName={lead.companyName}
              industry={lead.industry}
              niche={lead.niche}
              keralaPresence={lead.keralaPresence}
              sponsorshipHistory={lead.sponsorshipHistory}
              whyGoodLead={lead.whyGoodLead}
              whyCompanyBenefits={lead.whyCompanyBenefits}
              alternativeSupport={lead.alternativeSupport}
            />
          </div>
        </div>

        {/* 9 Quick Outcome Buttons Footer */}
        <div className="border-t border-border-subtle bg-surface-subtle p-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Log Outreach Call Outcome
            </span>
            <span className="text-[11px] text-text-muted">
              Click outcome to stop call timer and debrief
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* 1. Interested */}
            <button
              onClick={() => handleOutcomeClick("Interested")}
              className="flex min-h-[44px] items-center justify-center rounded-md border border-success/30 bg-accent-mint px-3 py-2 text-xs font-bold text-success hover:bg-accent-mint/70 active:scale-[0.98] transition-all duration-150 shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              Interested
            </button>

            {/* 2. Asked for proposal */}
            <button
              onClick={() => handleOutcomeClick("Asked for proposal")}
              className="flex min-h-[44px] items-center justify-center rounded-md border border-info/30 bg-accent-blue px-3 py-2 text-xs font-bold text-accent-blue-text hover:bg-accent-blue/70 active:scale-[0.98] transition-all duration-150 shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              Proposal Req.
            </button>

            {/* 3. Asked for budget */}
            <button
              onClick={() => handleOutcomeClick("Asked for budget")}
              className="flex min-h-[44px] items-center justify-center rounded-md border border-info/30 bg-accent-blue px-3 py-2 text-xs font-bold text-accent-blue-text hover:bg-accent-blue/70 active:scale-[0.98] transition-all duration-150 shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              Budget Req.
            </button>

            {/* 4. Meeting requested */}
            <button
              onClick={() => handleOutcomeClick("Meeting requested")}
              className="flex min-h-[44px] items-center justify-center rounded-md border border-primary/30 bg-accent-mint px-3 py-2 text-xs font-bold text-accent-mint-text hover:bg-accent-mint/70 active:scale-[0.98] transition-all duration-150 shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              Meeting Set
            </button>

            {/* 5. Non-cash opportunity */}
            <button
              onClick={() => handleOutcomeClick("Non-cash opportunity")}
              className="flex min-h-[44px] items-center justify-center rounded-md border border-primary/25 bg-accent-mint px-3 py-2 text-xs font-bold text-accent-mint-text hover:bg-accent-mint/70 active:scale-[0.98] transition-all duration-150 shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              Non-Cash / In-Kind
            </button>

            {/* 6. Call back */}
            <button
              onClick={() => handleOutcomeClick("Call back")}
              className="flex min-h-[44px] items-center justify-center rounded-md border border-warning/30 bg-accent-yellow px-3 py-2 text-xs font-bold text-accent-yellow-text hover:bg-accent-yellow/70 active:scale-[0.98] transition-all duration-150 shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              Call Back Later
            </button>

            {/* 7. Wrong person */}
            <button
              onClick={() => handleOutcomeClick("Wrong person")}
              className="flex min-h-[44px] items-center justify-center rounded-md border border-border-subtle bg-surface-subtle px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-surface hover:text-text-primary active:scale-[0.98] transition-all duration-150 shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              Wrong Contact
            </button>

            {/* 8. Rejected */}
            <button
              onClick={() => handleOutcomeClick("Rejected")}
              className="flex min-h-[44px] items-center justify-center rounded-md border border-error/30 bg-accent-coral px-3 py-2 text-xs font-bold text-accent-coral-text hover:bg-accent-coral/70 active:scale-[0.98] transition-all duration-150 shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              Rejected
            </button>

            {/* 9. Other */}
            <button
              onClick={() => handleOutcomeClick("Other")}
              className="flex min-h-[44px] items-center justify-center rounded-md border border-border-subtle bg-surface-subtle px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-surface hover:text-text-primary active:scale-[0.98] transition-all duration-150 shadow-xs cursor-pointer col-span-2 sm:col-span-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              Other Outcome
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
