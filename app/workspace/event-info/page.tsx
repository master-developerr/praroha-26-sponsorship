"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  Target,
  Trophy,
  Gift,
  Download,
  Copy,
  Check,
  Building2,
  ExternalLink,
  Megaphone,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  Compass,
  Leaf,
  Layers,
  Wrench,
  Radio,
  FileText,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  eventConfig,
  mainEvents,
  panelDiscussions,
  workshops,
  preEvents,
  sponsorshipPackages,
  officialContacts,
} from "@/lib/eventConfig";

const packageBadgeClasses: Record<string, string> = {
  Title: "bg-primary text-primary-foreground",
  "Co-Sponsor": "bg-accent-blue text-accent-blue-text",
  Associate: "bg-accent-mint text-accent-mint-text",
  Supporting: "bg-accent-yellow text-accent-yellow-text",
  Community: "bg-accent-coral text-accent-coral-text",
  "Event Sponsor": "bg-surface-subtle text-text-secondary",
};

export default function EventInfoPage() {
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
    <div className="space-y-8 pb-12">
      {/* 1. EDITORIAL HEADER matching Admin Control Room */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              EVENT DOSSIER & DELIVERABLES
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-text-primary sm:text-4xl">
              PRAROHA&apos;26 Festival Intelligence
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
              Official festival brochure, sponsorship tier deliverables, audience demographics, and volunteer outreach pitch collateral.
            </p>
            <p className="mt-3 text-[11px] font-medium text-text-muted">
              {eventConfig.dates} · {eventConfig.organizer} · {eventConfig.institution}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/brochure/praroha-2026-sponsorship-brochure.pdf"
              target="_blank"
              download
              className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors shadow-2xs"
            >
              <Download className="h-4 w-4" />
              Official Brochure (PDF)
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPitchLink}
              className="text-xs border-border bg-surface text-text-secondary hover:text-text-primary"
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4 mr-1 text-success" />
                  Link Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1 text-text-muted" />
                  Copy Brochure Link
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* 2. ABOUT PRAROHA */}
      <section className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Overview & Vision</p>
          <h2 className="mt-1 text-base font-bold text-text-primary">
            About PRAROHA
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-border bg-surface p-6 space-y-4 shadow-2xs">
            <h3 className="text-base font-bold text-text-primary">
              {eventConfig.eventType}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {eventConfig.about.concept}
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              {eventConfig.about.purpose}
            </p>
            <div className="pt-3 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-text-primary block text-xs">Engineers</span>
                <span className="text-text-muted text-[11px]">Next-generation technical problem solvers</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-text-primary block text-xs">Innovators</span>
                <span className="text-text-muted text-[11px]">Pioneers in sustainable construction & design</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-text-primary block text-xs">Industry Leaders</span>
                <span className="text-text-muted text-[11px]">Corporate mentors & infrastructural directors</span>
              </div>
            </div>
          </div>

          {/* Audience Reach Card */}
          <div className="border border-primary/20 bg-surface p-6 flex flex-col justify-between space-y-4 shadow-2xs">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                Official Brochure Reach
              </span>
              <p className="text-3xl font-extrabold tracking-tight text-primary">
                1000+
              </p>
              <p className="text-xs font-semibold text-text-primary">
                Students from colleges across South India
              </p>
              <p className="text-xs text-text-secondary leading-relaxed pt-1">
                Engaging undergraduate and postgraduate engineers, research scholars, faculty members, and corporate delegates.
              </p>
            </div>
            <div className="pt-3 border-t border-border-subtle text-[11px] text-text-muted">
              Venue: {eventConfig.venue}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SPONSORSHIP CATEGORIES */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-border-subtle pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Investment Hierarchy</p>
            <h2 className="mt-1 text-base font-bold text-text-primary">
              Sponsorship Packages & Tiers
            </h2>
          </div>
          <div className="text-xs font-semibold text-primary">
            ₹4 LAKHS • ₹2 LAKHS • ₹1 LAKH • ₹50K • ₹25K • IN-KIND
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsorshipPackages.map((pkg) => (
            <div
              key={pkg.tier}
              className="border border-border bg-surface p-6 flex flex-col justify-between space-y-4 shadow-2xs hover:border-primary/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                      packageBadgeClasses[pkg.tier] || "bg-primary text-primary-foreground"
                    }`}
                  >
                    {pkg.name}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-text-primary tabular-nums">
                    {pkg.formattedAmount}
                  </h3>
                  {pkg.footnote && (
                    <p className="text-[10px] text-text-muted mt-1 italic">
                      {pkg.footnote}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-3 border-t border-border-subtle text-xs text-text-secondary">
                  {pkg.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/workspace"
                  className="inline-flex w-full items-center justify-center border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-primary hover:border-primary transition-colors shadow-2xs"
                >
                  Pitch from Workstation
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5 text-primary" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MAIN EVENTS & TRACKS */}
      <section className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Flagship Schedule</p>
          <h2 className="mt-1 text-base font-bold text-text-primary">
            Main Technical Events
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mainEvents.map((evt, idx) => (
            <div
              key={evt.id}
              className="border border-border bg-surface p-5 space-y-2 shadow-2xs hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-6 w-6 items-center justify-center bg-primary/10 text-xs font-bold text-primary">
                  0{idx + 1}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                  Technical Track
                </span>
              </div>
              <h3 className="font-bold text-text-primary text-sm leading-snug">
                {evt.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {evt.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CONTACT US */}
      <section className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Festival Committee</p>
          <h2 className="mt-1 text-base font-bold text-text-primary">
            Official Contacts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Convenors */}
          <div className="border border-border bg-surface p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-text-primary">
                Faculty & Student Convenors
              </h3>
            </div>
            <p className="text-xs text-text-muted">
              Division of Civil Engineering, SOE CUSAT
            </p>
            <div className="space-y-2 pt-1">
              {officialContacts.convenors.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between p-3 border border-border bg-surface-subtle/30"
                >
                  <span className="font-semibold text-text-primary text-xs">
                    {c.name}
                  </span>
                  <a
                    href={`tel:${c.phone}`}
                    className="inline-flex items-center gap-1.5 text-primary font-mono text-xs hover:underline font-semibold"
                  >
                    <Phone className="h-3 w-3" />
                    {c.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Sponsorship Heads */}
          <div className="border border-border bg-surface p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-text-primary">
                Sponsorship Committee Heads
              </h3>
            </div>
            <p className="text-xs text-text-muted">
              Corporate Relations & Partnership Team
            </p>
            <div className="space-y-2 pt-1">
              {officialContacts.sponsorshipHeads.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-3 border border-border bg-surface-subtle/30"
                >
                  <span className="font-semibold text-text-primary text-xs">
                    {s.name}
                  </span>
                  <a
                    href={`tel:${s.phone}`}
                    className="inline-flex items-center gap-1.5 text-primary font-mono text-xs hover:underline font-semibold"
                  >
                    <Phone className="h-3 w-3" />
                    {s.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
