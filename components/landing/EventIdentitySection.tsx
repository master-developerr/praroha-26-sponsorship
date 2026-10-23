"use client";

import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  GraduationCap,
  Download,
  Check,
  Copy,
  ExternalLink,
  Users,
  Award,
  Sparkles,
} from "lucide-react";
import { eventConfig, sponsorshipPackages } from "@/lib/eventConfig";

export function EventIdentitySection() {
  const [copiedBrochure, setCopiedBrochure] = useState(false);

  const handleCopyBrochureLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        window.location.origin + "/brochure/praroha-2026-sponsorship-brochure.pdf"
      );
      setCopiedBrochure(true);
      setTimeout(() => setCopiedBrochure(false), 2000);
    }
  };

  return (
    <section id="event-dossier" className="py-20 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Event Context & Credentials (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border text-[11px] font-mono text-primary bg-surface">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              THE SYMPOSIUM BEHIND THE SYSTEM
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-text-primary leading-tight">
              South India&apos;s Flagship Civil-Tech Symposium.
            </h2>

            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Organized annually by the <strong>{eventConfig.organizer}</strong> at the{" "}
              <strong>{eventConfig.campus}</strong>, PRAROHA&apos;26 convenes over 3,500+ undergraduate, postgraduate, and faculty delegates across national civil engineering, infrastructure technology, and construction domains.
            </p>

            {/* Academic Credential Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded border border-border bg-surface flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-text-primary">Festival Dates</p>
                  <p className="text-[11px] text-text-secondary">{eventConfig.datesCompact} · Annual Edition</p>
                </div>
              </div>

              <div className="p-3.5 rounded border border-border bg-surface flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-text-primary">Host Campus</p>
                  <p className="text-[11px] text-text-secondary">SOE CUSAT, South Kalamassery, Kochi</p>
                </div>
              </div>

              <div className="p-3.5 rounded border border-border bg-surface flex items-start gap-3">
                <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-text-primary">Expected Reach</p>
                  <p className="text-[11px] text-text-secondary">3,500+ Engineering Delegates</p>
                </div>
              </div>

              <div className="p-3.5 rounded border border-border bg-surface flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-text-primary">Academic Division</p>
                  <p className="text-[11px] text-text-secondary">Civil Engineering Association</p>
                </div>
              </div>
            </div>

            {/* Collateral Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="/brochure/praroha-2026-sponsorship-brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors shadow-2xs"
              >
                <Download className="h-4 w-4" />
                <span>Download Official Deck (PDF)</span>
              </a>

              <button
                onClick={handleCopyBrochureLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border border-border bg-surface text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                {copiedBrochure ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Pitch Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Sponsorship Packages & Deliverables Table (6 cols) */}
          <div className="lg:col-span-6 rounded-lg border border-border bg-surface shadow-xs p-6 space-y-5">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Official Corporate Sponsorship Tiers
                </h3>
                <p className="text-[11px] text-text-muted">
                  Ratified deliverables and branding allocations for PRAROHA&apos;26
                </p>
              </div>
              <span className="font-mono text-[10px] text-primary px-2 py-0.5 rounded bg-primary/10 font-bold">
                CUSAT APPROVED
              </span>
            </div>

            <div className="space-y-3">
              {sponsorshipPackages.slice(0, 4).map((pkg) => (
                <div
                  key={pkg.tier}
                  className="p-3.5 rounded border border-border/80 bg-surface-subtle/30 hover:border-primary/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-text-primary">{pkg.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {pkg.displayBadge}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-snug line-clamp-1">
                      {pkg.benefits.slice(0, 2).join(" · ")}
                    </p>
                  </div>

                  <span className="font-mono font-bold text-xs text-primary self-start sm:self-center shrink-0">
                    {pkg.formattedAmount}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-text-muted flex items-center justify-between border-t border-border">
              <span>Includes 13 non-cash in-kind partnerships</span>
              <span className="font-mono text-primary font-medium">85%+ Deliverable Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
