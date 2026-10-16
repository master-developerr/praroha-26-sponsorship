"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Building2,
  Users,
  Trophy,
  Gift,
  FileText,
  Download,
  Copy,
  Check,
  Calendar,
  MapPin,
  ExternalLink,
  Target,
  Megaphone,
  Briefcase,
  Phone,
  Leaf,
  Layers,
  Wrench,
  Radio,
  BookOpen,
} from "lucide-react";
import {
  eventConfig,
  mainEvents,
  panelDiscussions,
  workshops,
  preEvents,
  sponsorshipPackages,
  officialContacts,
  quickPitchGuidelines,
} from "@/lib/eventConfig";

interface EventInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EventInfoModal({ isOpen, onClose }: EventInfoModalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "events" | "workshops" | "tiers" | "sustainability" | "contacts" | "brochure"
  >("tiers");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyPitchLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        window.location.origin + "/brochure/praroha-2026-sponsorship-brochure.pdf"
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
    >
      <div className="space-y-4 max-h-[85vh] overflow-y-auto pr-1">
        {/* Header Banner */}
        <div className="border-b border-border-subtle pb-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  <Calendar className="h-3 w-3" />
                  {eventConfig.datesCompact}
                </span>
                <span className="text-[11px] text-text-muted">•</span>
                <span className="text-[11px] font-medium text-text-secondary">
                  {eventConfig.venue}
                </span>
              </div>
              <h3 className="text-xl font-bold text-text-primary tracking-tight mt-1">
                {eventConfig.name}
              </h3>
              <p className="text-xs text-text-secondary italic">
                "{eventConfig.tagline}"
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">
                {eventConfig.organizer} • {eventConfig.institution}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-lg bg-surface-subtle border border-border px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                {eventConfig.eventType}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 text-xs scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("tiers")}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer shrink-0 ${
                activeTab === "tiers"
                  ? "bg-primary text-white font-semibold"
                  : "bg-surface-subtle text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
            >
              Sponsorship Packages
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer shrink-0 ${
                activeTab === "overview"
                  ? "bg-primary text-white font-semibold"
                  : "bg-surface-subtle text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
            >
              Why Sponsor & Value
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("events")}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer shrink-0 ${
                activeTab === "events"
                  ? "bg-primary text-white font-semibold"
                  : "bg-surface-subtle text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
            >
              Main & Pre-Events
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("workshops")}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer shrink-0 ${
                activeTab === "workshops"
                  ? "bg-primary text-white font-semibold"
                  : "bg-surface-subtle text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
            >
              Workshops & Panels
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sustainability")}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer shrink-0 ${
                activeTab === "sustainability"
                  ? "bg-primary text-white font-semibold"
                  : "bg-surface-subtle text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
            >
              Sustainability
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("contacts")}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer shrink-0 ${
                activeTab === "contacts"
                  ? "bg-primary text-white font-semibold"
                  : "bg-surface-subtle text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
            >
              Official Contacts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("brochure")}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer shrink-0 ${
                activeTab === "brochure"
                  ? "bg-primary text-white font-semibold"
                  : "bg-surface-subtle text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
            >
              Pitch Deck & SDR Pitch
            </button>
          </div>
        </div>

        {/* Tab 1: Sponsorship Packages (Authoritative Hierarchy) */}
        {activeTab === "tiers" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-text-secondary bg-surface-subtle p-2.5 rounded-lg border border-border">
              <span>
                Official PRAROHA'26 Sponsorship Hierarchy Sourced from Brochure:
              </span>
              <span className="font-semibold text-primary">
                ₹4 LAKHS • ₹2 LAKHS • ₹1 LAKH • ₹50K • ₹25K • ₹10K+
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sponsorshipPackages.map((tier) => (
                <div
                  key={tier.tier}
                  className={`rounded-xl border p-4 space-y-3 shadow-xs ${
                    tier.color?.border || "border-border"
                  } ${tier.color?.bg || "bg-surface"}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4
                        className={`text-sm font-bold tracking-tight ${
                          tier.color?.text || "text-text-primary"
                        }`}
                      >
                        {tier.name}
                      </h4>
                      <p className="text-xl font-extrabold tracking-tight text-text-primary mt-0.5">
                        {tier.formattedAmount}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        tier.color?.badge || "bg-primary text-white"
                      }`}
                    >
                      {tier.badge}
                    </span>
                  </div>

                  {tier.footnote && (
                    <p className="text-[10px] text-text-muted italic">
                      {tier.footnote}
                    </p>
                  )}

                  <div className="space-y-1.5 text-xs text-text-secondary pt-1 border-t border-border-subtle">
                    {tier.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="leading-snug text-[11px]">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Why Sponsor & Value Proposition */}
        {activeTab === "overview" && (
          <div className="space-y-4 text-xs">
            {/* Core Audience Claim */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Official Brochure Audience Metric
              </span>
              <h4 className="text-base font-bold text-text-primary">
                "{eventConfig.attendanceClaim}"
              </h4>
              <p className="text-text-secondary leading-relaxed text-[11px]">
                {eventConfig.valueProposition.audienceReach}
              </p>
            </div>

            {/* What Sponsors Can Do */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Target className="h-4 w-4 text-primary" />
                Sponsorship Value Proposition
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-text-secondary">
                {eventConfig.valueProposition.coreOpportunities.map((opp, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-surface-subtle p-2 rounded-lg">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="text-[11px] leading-snug">{opp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Visibility Benefits */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Megaphone className="h-4 w-4 text-primary" />
                Official Brand Visibility Benefits
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-text-secondary">
                {eventConfig.brandVisibilityBenefits.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px]">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Stakeholders */}
            <div className="rounded-xl border border-border bg-surface p-3.5 text-[11px] text-text-secondary">
              <span className="font-semibold text-text-primary block mb-1">
                Audience Composition:
              </span>
              <span>
                Students, faculty members, researchers, and industry professionals from institutions across Kerala.
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: Main Events & Pre-Events */}
        {activeTab === "events" && (
          <div className="space-y-4 text-xs">
            {/* Main Events */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-primary" />
                  Official Main Events (7 Flagship Tracks)
                </h4>
                <span className="text-[10px] text-text-muted">Direct from brochure</span>
              </div>

              <div className="space-y-2">
                {mainEvents.map((evt, idx) => (
                  <div
                    key={evt.id}
                    className="flex items-start gap-3 rounded-lg border border-border-subtle bg-surface-subtle/50 p-2.5"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {idx + 1}
                    </span>
                    <div>
                      <h5 className="font-bold text-text-primary text-xs">
                        {evt.title}
                      </h5>
                      <p className="text-[11px] text-text-secondary leading-snug mt-0.5">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-Events */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="h-4 w-4 text-primary" />
                Official Pre-Events (8 Contests & Campus Hype)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {preEvents.map((pe, idx) => (
                  <div
                    key={pe.id}
                    className="rounded-lg border border-border-subtle bg-surface-subtle/50 p-2.5 space-y-0.5"
                  >
                    <span className="font-bold text-text-primary text-[11px] block">
                      {idx + 1}. {pe.title}
                    </span>
                    <p className="text-[10px] text-text-secondary leading-snug">
                      {pe.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Workshops & Panel Discussions */}
        {activeTab === "workshops" && (
          <div className="space-y-4 text-xs">
            {/* Workshops */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="h-4 w-4 text-primary" />
                Official Workshops (6 Intensive Technical Tracks)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {workshops.map((ws, idx) => (
                  <div
                    key={ws.id}
                    className="rounded-lg border border-border-subtle bg-surface-subtle/50 p-3 space-y-1"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                        {idx + 1}
                      </span>
                      <h5 className="font-bold text-text-primary text-xs leading-snug">
                        {ws.title}
                      </h5>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-snug pl-5.5">
                      {ws.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel Discussions */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-primary" />
                Official Panel Discussions (4 Industry Dialogues)
              </h4>
              <div className="space-y-2">
                {panelDiscussions.map((pd, idx) => (
                  <div
                    key={pd.id}
                    className="flex items-start gap-2.5 rounded-lg border border-border-subtle bg-surface-subtle/50 p-2.5"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {idx + 1}
                    </span>
                    <div>
                      <h5 className="font-bold text-text-primary text-xs">
                        {pd.title}
                      </h5>
                      <p className="text-[11px] text-text-secondary leading-snug mt-0.5">
                        {pd.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Sustainability */}
        {activeTab === "sustainability" && (
          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-5 space-y-3 text-emerald-950">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-emerald-700" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
                  {eventConfig.sustainability.motto}
                </span>
              </div>
              <h4 className="text-base font-bold tracking-tight text-emerald-950">
                Green Protocol & Sustainable Engineering Commitment
              </h4>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {eventConfig.sustainability.description}
              </p>
              <div className="space-y-2 pt-2 border-t border-emerald-200">
                {eventConfig.sustainability.principles.map((pr, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{pr}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Official Contacts */}
        {activeTab === "contacts" && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Convenors */}
              <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary" />
                  Convenors
                </h4>
                <div className="space-y-2">
                  {officialContacts.convenors.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle border border-border-subtle"
                    >
                      <span className="font-semibold text-text-primary text-xs">
                        {c.name}
                      </span>
                      <a
                        href={`tel:${c.phone}`}
                        className="inline-flex items-center gap-1 text-primary font-mono text-xs hover:underline font-semibold"
                      >
                        <Phone className="h-3 w-3" />
                        {c.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sponsorship Heads */}
              <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Sponsorship Heads
                </h4>
                <div className="space-y-2">
                  {officialContacts.sponsorshipHeads.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle border border-border-subtle"
                    >
                      <span className="font-semibold text-text-primary text-xs">
                        {s.name}
                      </span>
                      <a
                        href={`tel:${s.phone}`}
                        className="inline-flex items-center gap-1 text-primary font-mono text-xs hover:underline font-semibold"
                      >
                        <Phone className="h-3 w-3" />
                        {s.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Brochure & SDR Pitch */}
        {activeTab === "brochure" && (
          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-text-primary text-sm">
                    PRAROHA'26 Official Sponsorship Brochure (PDF)
                  </h4>
                  <p className="text-text-secondary text-[11px] mt-0.5">
                    Official festival brochure with event structure, technical workshops, panel discussions, and sponsorship packages.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyPitchLink}
                  className="text-xs border-border"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      Copied Link
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href="/brochure/praroha-2026-sponsorship-brochure.pdf"
                  target="_blank"
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition-colors shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Pitch Deck (PDF)
                </a>
                <span className="text-[11px] text-text-muted">
                  Official Brochure • SOE CUSAT
                </span>
              </div>
            </div>

            {/* Quick Phone Pitch Box */}
            <div className="rounded-xl border border-border bg-surface-subtle p-3.5 space-y-2">
              <span className="font-semibold text-text-primary text-xs flex items-center gap-1.5">
                <Megaphone className="h-3.5 w-3.5 text-primary" />
                Authoritative Call Pitch for Student SDRs:
              </span>
              <p className="text-text-secondary leading-relaxed italic bg-surface p-3 rounded-lg border border-border text-[11px]">
                "{quickPitchGuidelines.conciseHook}"
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-text-secondary pt-1">
                <div>
                  <strong className="text-text-primary">WHO:</strong> {quickPitchGuidelines.who}
                </div>
                <div>
                  <strong className="text-text-primary">WHAT:</strong> {quickPitchGuidelines.what}
                </div>
                <div>
                  <strong className="text-text-primary">WHEN:</strong> {quickPitchGuidelines.when}
                </div>
                <div>
                  <strong className="text-text-primary">WHERE:</strong> {quickPitchGuidelines.where}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-border-subtle text-[11px] text-text-muted">
          <span>{eventConfig.name} • {eventConfig.organizer} • {eventConfig.datesCompact}</span>
          <Button variant="outline" onClick={onClose} size="sm">
            Close Panel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
