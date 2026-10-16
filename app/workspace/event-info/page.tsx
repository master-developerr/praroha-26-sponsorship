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
  quickPitchGuidelines,
} from "@/lib/eventConfig";

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
    <div className="space-y-12 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
      {/* 1. HERO HEADER: Authoritative Event Identity */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-[#FBFDFB] to-emerald-50/40 p-8 sm:p-12 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Calendar className="h-3.5 w-3.5" />
            <span>{eventConfig.dates}</span>
            <span className="text-primary/40">•</span>
            <span>{eventConfig.venue}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
            {eventConfig.name}
          </h1>

          <p className="text-xl sm:text-2xl font-serif italic text-primary font-medium tracking-tight">
            "{eventConfig.tagline}"
          </p>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed pt-1">
            {eventConfig.organizer} • {eventConfig.institution}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <a
              href="/brochure/praroha-2026-sponsorship-brochure.pdf"
              target="_blank"
              download
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-xs"
            >
              <Download className="h-4 w-4" />
              Download Official Brochure (PDF)
            </a>

            <Button
              variant="outline"
              size="md"
              onClick={handleCopyPitchLink}
              className="rounded-xl border-border bg-surface text-xs sm:text-sm font-medium"
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4 mr-1.5 text-emerald-600" />
                  Copied Brochure Link
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1.5 text-text-muted" />
                  Copy Shareable Link
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Subtle Decorative Architectural Accent */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 h-48 w-48 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
      </section>

      {/* 2. ABOUT PRAROHA */}
      <section className="space-y-4">
        <div className="border-b border-border-subtle pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Overview & Vision
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-1">
            About PRAROHA
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-lg font-bold text-text-primary">
              {eventConfig.eventType}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {eventConfig.about.concept}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {eventConfig.about.purpose}
            </p>
            <div className="pt-2 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-text-primary block text-sm">Engineers</span>
                <span className="text-text-muted">Next-generation technical problem solvers</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-text-primary block text-sm">Innovators</span>
                <span className="text-text-muted">Pioneers in sustainable construction & design</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-text-primary block text-sm">Industry Leaders</span>
                <span className="text-text-muted">Corporate mentors & infrastructural directors</span>
              </div>
            </div>
          </div>

          {/* Audience Metric Card */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Official Brochure Reach
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
                1000+
              </p>
              <p className="text-xs font-semibold text-text-primary">
                Students from colleges across Kerala
              </p>
              <p className="text-xs text-text-secondary leading-relaxed pt-1">
                Engaging undergraduate and postgraduate engineers, research scholars, faculty members, and corporate delegates.
              </p>
            </div>
            <div className="pt-4 border-t border-primary/10 text-[11px] text-text-muted">
              Location: SOE CUSAT, Kochi
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN EVENTS */}
      <section className="space-y-4">
        <div className="border-b border-border-subtle pb-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Flagship Schedule
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-1">
              Main Events
            </h2>
          </div>
          <span className="text-xs font-medium text-text-muted">
            7 Official Tracks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mainEvents.map((evt, idx) => (
            <div
              key={evt.id}
              className="rounded-2xl border border-border bg-surface p-5 space-y-2.5 shadow-xs hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  0{idx + 1}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Main Track
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

      {/* 4. PANEL DISCUSSIONS */}
      <section className="space-y-4">
        <div className="border-b border-border-subtle pb-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Thought Leadership
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-1">
              Panel Discussions
            </h2>
          </div>
          <span className="text-xs font-medium text-text-muted">
            With Industry Experts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {panelDiscussions.map((pd, idx) => (
            <div
              key={pd.id}
              className="rounded-2xl border border-border bg-surface p-6 space-y-2 shadow-xs hover:border-primary/40 transition-colors flex items-start gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-mint/60 text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Session 0{idx + 1}
                </span>
                <h3 className="font-bold text-text-primary text-base leading-snug">
                  {pd.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {pd.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WORKSHOPS */}
      <section className="space-y-4">
        <div className="border-b border-border-subtle pb-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Hands-On Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-1">
              Workshops
            </h2>
          </div>
          <span className="text-xs font-medium text-text-muted">
            6 Specialized Masterclasses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workshops.map((ws, idx) => (
            <div
              key={ws.id}
              className="rounded-2xl border border-border bg-surface p-5 space-y-2 shadow-xs hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Workshop 0{idx + 1}
                </span>
              </div>
              <h3 className="font-bold text-text-primary text-sm leading-snug">
                {ws.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {ws.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PRE-EVENTS */}
      <section className="space-y-4">
        <div className="border-b border-border-subtle pb-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Campus Engagement
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-1">
              Pre-Events
            </h2>
          </div>
          <span className="text-xs font-medium text-text-muted">
            8 Campus Contests
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {preEvents.map((pe, idx) => (
            <div
              key={pe.id}
              className="rounded-xl border border-border bg-surface p-4 space-y-1 shadow-xs"
            >
              <span className="text-[10px] font-bold text-primary">
                0{idx + 1}
              </span>
              <h3 className="font-bold text-text-primary text-xs leading-snug">
                {pe.title}
              </h3>
              <p className="text-[11px] text-text-secondary leading-snug">
                {pe.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. WHY SPONSOR PRAROHA? & SPONSOR BENEFITS */}
      <section className="space-y-6">
        <div className="border-b border-border-subtle pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Partnership Value
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-1">
            Why Sponsor PRAROHA?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core Capabilities */}
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Sponsor Opportunities On Campus
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Sponsors can directly activate on the SOE CUSAT campus to connect with the student and engineering community:
            </p>
            <div className="space-y-2.5 pt-1">
              {eventConfig.valueProposition.coreOpportunities.map((opp, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="leading-snug">{opp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Visibility Benefits */}
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Official Brand Visibility Benefits
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Extensive multi-channel corporate exposure throughout the festival lifecycle:
            </p>
            <div className="space-y-2.5 pt-1">
              {eventConfig.brandVisibilityBenefits.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. SPONSORSHIP CATEGORIES — AUTHORITATIVE PACKAGES */}
      <section className="space-y-6">
        <div className="border-b border-border-subtle pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Investment Tiers
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-1">
              Sponsorship Categories
            </h2>
          </div>
          <div className="text-xs font-medium text-text-secondary">
            Primary Hierarchy: <strong className="text-primary font-bold">₹4 LAKHS • ₹2 LAKHS • ₹1 LAKH • ₹50K • ₹25K • ₹10K+</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsorshipPackages.map((pkg) => (
            <div
              key={pkg.tier}
              className={`rounded-2xl border p-6 flex flex-col justify-between space-y-4 shadow-xs transition-all ${
                pkg.color?.border || "border-border"
              } ${pkg.color?.bg || "bg-surface"}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      pkg.color?.badge || "bg-primary text-white"
                    }`}
                  >
                    {pkg.name}
                  </span>
                </div>

                <div>
                  <h3 className="text-3xl font-extrabold tracking-tight text-text-primary">
                    {pkg.formattedAmount}
                  </h3>
                  {pkg.footnote && (
                    <p className="text-[11px] text-text-muted mt-1 italic">
                      {pkg.footnote}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-3 border-t border-border-subtle text-xs text-text-secondary">
                  {pkg.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/workspace"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-surface border border-border px-4 py-2 text-xs font-semibold text-text-primary hover:border-primary/50 transition-colors shadow-2xs"
                >
                  Pitch in Volunteer Cockpit
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5 text-primary" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. SUSTAINABILITY */}
      <section className="space-y-4">
        <div className="rounded-3xl border border-emerald-300 bg-gradient-to-br from-emerald-50/80 via-surface to-emerald-50/30 p-8 sm:p-10 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Leaf className="h-6 w-6 text-emerald-700" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
              {eventConfig.sustainability.motto}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-950">
            Green Protocol & Sustainability Commitment
          </h2>

          <p className="text-sm text-emerald-900 leading-relaxed max-w-3xl">
            {eventConfig.sustainability.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {eventConfig.sustainability.principles.map((pr, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs text-emerald-900 bg-white/70 p-3 rounded-xl border border-emerald-200"
              >
                <Check className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                <span className="leading-snug font-medium">{pr}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CONTACT US (Official Brochure Contacts) */}
      <section className="space-y-6">
        <div className="border-b border-border-subtle pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Official Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-1">
            Contact Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Convenors */}
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-text-primary">
                Convenors
              </h3>
            </div>
            <p className="text-xs text-text-muted">
              Division of Civil Engineering, SOE CUSAT
            </p>
            <div className="space-y-3 pt-1">
              {officialContacts.convenors.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-border-subtle"
                >
                  <span className="font-semibold text-text-primary text-sm">
                    {c.name}
                  </span>
                  <a
                    href={`tel:${c.phone}`}
                    className="inline-flex items-center gap-1.5 text-primary font-mono text-sm hover:underline font-semibold"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {c.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Sponsorship Heads */}
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-text-primary">
                Sponsorship Heads
              </h3>
            </div>
            <p className="text-xs text-text-muted">
              PRAROHA'26 Sponsorship & Corporate Relations Committee
            </p>
            <div className="space-y-3 pt-1">
              {officialContacts.sponsorshipHeads.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-border-subtle"
                >
                  <span className="font-semibold text-text-primary text-sm">
                    {s.name}
                  </span>
                  <a
                    href={`tel:${s.phone}`}
                    className="inline-flex items-center gap-1.5 text-primary font-mono text-sm hover:underline font-semibold"
                  >
                    <Phone className="h-3.5 w-3.5" />
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
