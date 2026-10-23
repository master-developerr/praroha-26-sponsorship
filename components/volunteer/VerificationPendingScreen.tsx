"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  LogOut,
  ShieldCheck,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  RefreshCw,
  BookOpen,
  Gift,
  Download,
  Copy,
  Check,
  Megaphone,
} from "lucide-react";
import {
  eventConfig,
  sponsorshipPackages,
  officialContacts,
  quickPitchGuidelines,
} from "@/lib/eventConfig";

export function VerificationPendingScreen() {
  const { profile, signOut } = useAuthUser();
  const [activeTab, setActiveTab] = useState<"pitch" | "protocol" | "inkind">("pitch");
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-5xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-mint/70 text-primary">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-text-primary tracking-tight">PRAROHA'26</h1>
              <p className="text-[10px] text-text-muted">Volunteer Outreach Readiness & Verification</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="text-xs text-text-muted hover:text-rose-600"
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Sign out
          </Button>
        </div>

        {/* Dual-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Credentials & Status */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 space-y-3 shadow-xs">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                Status: Pending Verification
              </div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">
                Application Under Review
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Your volunteer application has been submitted to the PRAROHA'26 Sponsorship Committee. Access to your outreach desk will unlock automatically once verified.
              </p>
              <div className="flex items-center gap-2 rounded-lg bg-surface-subtle border border-border-subtle p-2 text-[11px] text-text-secondary">
                <RefreshCw className="h-3 w-3 animate-spin text-primary shrink-0" />
                <span>Live listener active — updates in real time.</span>
              </div>
            </div>

            {/* Submitted Profile Summary Card */}
            <Card className="border-border bg-surface shadow-xs">
              <CardContent className="p-4 space-y-3">
                <div className="border-b border-border-subtle pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Submitted Credentials
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center justify-between py-0.5">
                    <span className="flex items-center gap-2 text-text-secondary text-[11px]">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      Full Name
                    </span>
                    <span className="font-semibold text-text-primary">
                      {profile?.name || "Volunteer"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-0.5 border-t border-border-subtle">
                    <span className="flex items-center gap-2 text-text-secondary text-[11px]">
                      <Building2 className="h-3.5 w-3.5 text-text-muted" />
                      Department
                    </span>
                    <span className="font-medium text-text-primary">
                      {profile?.department || "Civil Engineering"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-0.5 border-t border-border-subtle">
                    <span className="flex items-center gap-2 text-text-secondary text-[11px]">
                      <GraduationCap className="h-3.5 w-3.5 text-text-muted" />
                      Semester
                    </span>
                    <span className="font-medium text-text-primary">
                      {profile?.semester || "Semester"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-0.5 border-t border-border-subtle">
                    <span className="flex items-center gap-2 text-text-secondary text-[11px]">
                      <Phone className="h-3.5 w-3.5 text-text-muted" />
                      Phone Number
                    </span>
                    <span className="font-medium text-text-primary tabular-nums">
                      {profile?.phone || "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-0.5 border-t border-border-subtle">
                    <span className="flex items-center gap-2 text-text-secondary text-[11px]">
                      <Mail className="h-3.5 w-3.5 text-text-muted" />
                      Email
                    </span>
                    <span className="font-medium text-text-primary truncate max-w-[170px]">
                      {profile?.email || "Email"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Committee Contacts */}
            <div className="rounded-xl border border-border bg-surface-subtle p-3 space-y-1.5 text-xs">
              <span className="font-bold text-text-primary text-[11px] uppercase tracking-wider block">
                Urgent Shift Clearance
              </span>
              <p className="text-[11px] text-text-secondary leading-snug">
                Contact the PRAROHA'26 Sponsorship Heads for immediate verification:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {officialContacts.sponsorshipHeads.map((head) => (
                  <a
                    key={head.name}
                    href={`tel:${head.phone}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border hover:border-primary/40 transition-colors"
                  >
                    <span className="font-semibold text-text-primary text-[11px]">{head.name}</span>
                    <span className="text-[11px] text-primary font-mono font-semibold flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {head.phone}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pre-Flight Briefing */}
          <div className="lg:col-span-7">
            <Card className="border-border bg-surface shadow-xs">
              <CardContent className="p-5 space-y-4">
                <div className="border-b border-border-subtle pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-text-primary tracking-tight">
                        Pre-Outreach Briefing
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Review festival deliverables and calling protocol while awaiting clearance.
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                      Fast-Start
                    </span>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-1.5 pt-3 overflow-x-auto scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setActiveTab("pitch")}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                        activeTab === "pitch"
                          ? "bg-primary text-white font-semibold"
                          : "bg-surface-subtle text-text-secondary hover:bg-surface hover:text-text-primary"
                      }`}
                    >
                      Pitch Essentials & Tiers
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("protocol")}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                        activeTab === "protocol"
                          ? "bg-primary text-white font-semibold"
                          : "bg-surface-subtle text-text-secondary hover:bg-surface hover:text-text-primary"
                      }`}
                    >
                      4-Step Calling Protocol
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("inkind")}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                        activeTab === "inkind"
                          ? "bg-primary text-white font-semibold"
                          : "bg-surface-subtle text-text-secondary hover:bg-surface hover:text-text-primary"
                      }`}
                    >
                      In-Kind Deals
                    </button>
                  </div>
                </div>

                {/* Tab 1: Pitch Essentials */}
                {activeTab === "pitch" && (
                  <div className="space-y-3 text-xs animate-in fade-in duration-200">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg border border-border bg-surface-subtle/50 p-2">
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">
                          Dates
                        </span>
                        <span className="text-xs font-bold text-text-primary mt-0.5 block">
                          {eventConfig.datesCompact}, 2026
                        </span>
                      </div>
                      <div className="rounded-lg border border-border bg-surface-subtle/50 p-2">
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">
                          Expected Reach
                        </span>
                        <span className="text-xs font-bold text-primary mt-0.5 block">
                          1,000+ Students
                        </span>
                      </div>
                      <div className="rounded-lg border border-border bg-surface-subtle/50 p-2">
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">
                          Venue
                        </span>
                        <span className="text-xs font-bold text-text-primary mt-0.5 block">
                          SOE CUSAT, Kochi
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                        Official Packages
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {sponsorshipPackages.slice(0, 4).map((tier) => (
                          <div
                            key={tier.tier}
                            className="rounded-lg border border-border bg-surface p-2.5 space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-text-primary text-xs">{tier.name}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary">
                                {tier.formattedAmount}
                              </span>
                            </div>
                            <p className="text-[10px] text-text-secondary line-clamp-1 leading-snug">
                              {tier.benefits[0]}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-surface-subtle p-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                        <Megaphone className="h-3 w-3 text-primary" />
                        <span>30-Second Hook:</span>
                      </div>
                      <p className="text-[11px] text-text-secondary italic bg-surface p-2 rounded border border-border leading-relaxed">
                        "{quickPitchGuidelines.conciseHook}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-subtle">
                      <a
                        href="/brochure/praroha-2026-sponsorship-brochure.pdf"
                        target="_blank"
                        download
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors shadow-2xs"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download Brochure PDF
                      </a>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyPitchLink}
                        className="text-xs border-border"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3 w-3 mr-1 text-emerald-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Brochure Link
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Tab 2: 4-Step Calling Protocol */}
                {activeTab === "protocol" && (
                  <div className="space-y-2.5 text-xs animate-in fade-in duration-200">
                    <div className="rounded-lg border border-border bg-surface p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-white font-bold text-[10px]">
                          1
                        </span>
                        <h4 className="font-bold text-text-primary text-xs">
                          Inspect Dossier & Contact Truth
                        </h4>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed pl-6">
                        Always check phone classification (<code className="text-primary font-mono text-[10px]">direct_official</code> vs <code className="text-primary font-mono text-[10px]">switchboard</code>) before dialing.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-surface p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-white font-bold text-[10px]">
                          2
                        </span>
                        <h4 className="font-bold text-text-primary text-xs">
                          Launch Minimal Call Mode
                        </h4>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed pl-6">
                        Minimal in-call view with live stopwatch and concise talking points.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-surface p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-white font-bold text-[10px]">
                          3
                        </span>
                        <h4 className="font-bold text-text-primary text-xs">
                          Log 1 of 9 Quick Outcomes
                        </h4>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed pl-6">
                        Tap outcome immediately: Interested, Proposal Requested, Callback, Rejected, etc.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-surface p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-white font-bold text-[10px]">
                          4
                        </span>
                        <h4 className="font-bold text-text-primary text-xs">
                          Record 20-Second Voice Debrief
                        </h4>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed pl-6">
                        Speak your summary; Whisper transcribes and AI extracts next steps and objections.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 3: In-Kind & Non-Cash Deals */}
                {activeTab === "inkind" && (
                  <div className="space-y-2.5 text-xs animate-in fade-in duration-200">
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                        <Gift className="h-3.5 w-3.5" />
                        <span>Non-Cash / In-Kind Deals</span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-snug">
                        PRAROHA'26 actively accepts 13 non-cash categories including beverages, cloud credits, printing, and equipment.
                      </p>
                    </div>

                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 text-[11px] text-amber-800 dark:text-amber-300">
                      <strong>Mandatory Rule:</strong> Always ask for the estimated monetary valuation (in INR) to ensure accurate pipeline reporting.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-2 text-[11px] text-text-muted">
          PRAROHA'26 • Division of Civil Engineering • SOE CUSAT
        </footer>
      </div>
    </div>
  );
}
