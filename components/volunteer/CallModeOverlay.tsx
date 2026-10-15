"use client";

import React, { useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import {
  PhoneCall,
  X,
  Clock,
  Sparkles,
  Building2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ContactVerificationBadge,
  PhoneTypeBadge,
  PriorityBadge,
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

export function CallModeOverlay({
  isOpen,
  onClose,
  lead,
  onSelectOutcome,
}: CallModeOverlayProps) {
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [seconds, setSeconds] = useState(0);

  // Active call timer
  useEffect(() => {
    if (isOpen) {
      const now = Date.now();
      setStartedAt(now);
      setSeconds(0);

      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen || !lead) return null;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOutcomeClick = (outcome: QuickCallOutcome) => {
    const endedAt = Date.now();
    const duration = Math.max(1, seconds);
    onSelectOutcome(outcome, duration, startedAt, endedAt);
  };

  const contactPhone = lead.primaryContact?.phone || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[90vh] rounded-2xl border-2 border-primary bg-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-border-subtle bg-surface-subtle/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-xs animate-pulse">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
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
            {/* Stopwatch Timer */}
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-sm font-bold text-primary shadow-xs">
              <Clock className="h-4 w-4" />
              <span>{formatTimer(seconds)}</span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close call overlay"
              className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Center Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Dialing Hero Card */}
          <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-accent-mint/20 via-surface to-surface p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {/* 1. Interested */}
            <button
              onClick={() => handleOutcomeClick("Interested")}
              className="flex items-center justify-center rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            >
              Interested
            </button>

            {/* 2. Asked for proposal */}
            <button
              onClick={() => handleOutcomeClick("Asked for proposal")}
              className="flex items-center justify-center rounded-lg border border-sky-300 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-800 hover:bg-sky-100 transition-colors shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            >
              Proposal Req.
            </button>

            {/* 3. Asked for budget */}
            <button
              onClick={() => handleOutcomeClick("Asked for budget")}
              className="flex items-center justify-center rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-800 hover:bg-indigo-100 transition-colors shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            >
              Budget Req.
            </button>

            {/* 4. Meeting requested */}
            <button
              onClick={() => handleOutcomeClick("Meeting requested")}
              className="flex items-center justify-center rounded-lg border border-teal-300 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-800 hover:bg-teal-100 transition-colors shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            >
              Meeting Set
            </button>

            {/* 5. Non-cash opportunity */}
            <button
              onClick={() => handleOutcomeClick("Non-cash opportunity")}
              className="flex items-center justify-center rounded-lg border border-purple-300 bg-purple-50 px-3 py-2 text-xs font-bold text-purple-800 hover:bg-purple-100 transition-colors shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            >
              Non-Cash / In-Kind
            </button>

            {/* 6. Call back */}
            <button
              onClick={() => handleOutcomeClick("Call back")}
              className="flex items-center justify-center rounded-lg border border-yellow-300 bg-yellow-50 px-3 py-2 text-xs font-bold text-yellow-800 hover:bg-yellow-100 transition-colors shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            >
              Call Back Later
            </button>

            {/* 7. Wrong person */}
            <button
              onClick={() => handleOutcomeClick("Wrong person")}
              className="flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            >
              Wrong Contact
            </button>

            {/* 8. Rejected */}
            <button
              onClick={() => handleOutcomeClick("Rejected")}
              className="flex items-center justify-center rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-800 hover:bg-rose-100 transition-colors shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            >
              Rejected
            </button>

            {/* 9. Other */}
            <button
              onClick={() => handleOutcomeClick("Other")}
              className="flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors shadow-xs cursor-pointer col-span-2 sm:col-span-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            >
              Other Outcome
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
