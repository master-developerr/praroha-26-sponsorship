"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  ShieldCheck,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  LogOut,
  RefreshCw,
  BookOpen,
  PhoneCall,
  Gift,
  Download,
  Copy,
  Check,
  Calendar,
  MapPin,
  Users,
  Target,
  Megaphone,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import {
  eventConfig,
  sponsorshipPackages,
  officialContacts,
  quickPitchGuidelines,
} from "@/lib/eventConfig";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function PendingVerificationPage() {
  const router = useRouter();
  const { profile, authState, signOut } = useAuthUser();
  const [activeTab, setActiveTab] = useState<"pitch" | "protocol" | "inkind">("pitch");
  const [isCopied, setIsCopied] = useState(false);

  // Automatic real-time transition when Admin approves the volunteer in Convex
  useEffect(() => {
    switch (authState) {
      case "APPROVED_VOLUNTEER":
        router.replace("/workspace");
        break;
      case "ADMIN":
        router.replace("/admin");
        break;
      case "REJECTED":
        router.replace("/rejected");
        break;
      case "SUSPENDED":
        router.replace("/suspended");
        break;
      case "PROFILE_MISSING":
        router.replace("/register/profile");
        break;
      case "UNAUTHENTICATED":
        router.replace("/sign-in");
        break;
      default:
        break;
    }
  }, [authState, router]);

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
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-mint/70 text-primary">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.5 6 4 10 4 15a8 8 0 0 0 16 0c0-5-2.5-9-8-13z" />
              <path d="M12 2c2.5 4 4 8 4 12a4 4 0 0 1-8 0c0-4 1.5-8 4-12z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-text-primary tracking-tight">PRAROHA'26</span>
            <p className="text-[10px] text-text-muted">Outreach Readiness & Verification Station</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle className="h-8 w-8 rounded-sm" />
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-rose-600 transition-colors cursor-pointer px-2 py-1"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main Dual-Column Onboarding Layout */}
      <main className="max-w-6xl w-full mx-auto my-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Verification Holding Status & Credentials */}
          <div className="lg:col-span-5 space-y-4">
            {/* Visual Hero Status Card */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-xs p-5 sm:p-6 space-y-4">
              <div className="relative h-24 w-full rounded-xl overflow-hidden bg-accent-mint/20 mb-2">
                <Image
                  src="/images/praroha26-sponsorship-hero.png"
                  alt="PRAROHA'26 Outreach"
                  fill
                  className="object-cover object-center opacity-90"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                Status: Committee Verification Pending
              </div>

              <h1 className="text-xl font-bold tracking-tight text-text-primary">
                Application Under Review
              </h1>

              <p className="text-xs text-text-secondary leading-relaxed">
                Your profile has been submitted to the PRAROHA'26 Sponsorship Committee. Access to your calling workstation will unlock automatically the second an admin verifies your profile.
              </p>

              <div className="flex items-center gap-2 rounded-lg bg-surface-subtle border border-border-subtle p-2.5 text-[11px] text-text-secondary">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
                <span>Live listener active — no need to refresh this page.</span>
              </div>
            </div>

            {/* Submitted Profile Summary Card */}
            <Card className="border-border bg-surface shadow-xs">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Your Volunteer Credentials
                  </span>
                  <span className="text-[10px] text-primary font-medium">Pending Review</span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center justify-between py-0.5">
                    <span className="flex items-center gap-2 text-text-secondary text-[11px]">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      Full Name
                    </span>
                    <span className="font-semibold text-text-primary">
                      {profile?.name || "Student Volunteer"}
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
                      {profile?.semester || "S6"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-0.5 border-t border-border-subtle">
                    <span className="flex items-center gap-2 text-text-secondary text-[11px]">
                      <Phone className="h-3.5 w-3.5 text-text-muted" />
                      Mobile Number
                    </span>
                    <span className="font-medium text-text-primary tabular-nums">
                      {profile?.phone || "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-0.5 border-t border-border-subtle">
                    <span className="flex items-center gap-2 text-text-secondary text-[11px]">
                      <Mail className="h-3.5 w-3.5 text-text-muted" />
                      Institutional Email
                    </span>
                    <span className="font-medium text-text-primary truncate max-w-[180px]">
                      {profile?.email || "volunteer@cusat.ac.in"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Committee Contacts for Urgent Clearance */}
            <div className="rounded-xl border border-border bg-surface-subtle p-3.5 space-y-2 text-xs">
              <span className="font-bold text-text-primary text-[11px] uppercase tracking-wider block">
                Need urgent calling shift clearance?
              </span>
              <p className="text-[11px] text-text-secondary leading-snug">
                Contact the PRAROHA'26 Sponsorship Heads directly for immediate approval:
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

          {/* Right Column: Pre-Flight Onboarding Briefing Station */}
          <div className="lg:col-span-7">
            <Card className="border-border bg-surface shadow-xs">
              <CardContent className="p-5 sm:p-6 space-y-4">
                {/* Header & Section Title */}
                <div className="border-b border-border-subtle pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-text-primary tracking-tight">
                        Pre-Outreach Briefing Station
                      </h2>
                      <p className="text-xs text-text-secondary">
                        Master the PRAROHA'26 pitch and calling protocol while awaiting approval.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                      <BookOpen className="h-3 w-3" />
                      Fast-Start
                    </span>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="flex items-center gap-1.5 pt-3 overflow-x-auto scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setActiveTab("pitch")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
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
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
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
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                        activeTab === "inkind"
                          ? "bg-primary text-white font-semibold"
                          : "bg-surface-subtle text-text-secondary hover:bg-surface hover:text-text-primary"
                      }`}
                    >
                      In-Kind & Non-Cash Deals
                    </button>
                  </div>
                </div>

                {/* Tab 1: Pitch Essentials */}
                {activeTab === "pitch" && (
                  <div className="space-y-4 text-xs animate-in fade-in duration-200">
                    {/* Quick Metric Bar */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl border border-border bg-surface-subtle/50 p-2.5">
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">
                          Dates
                        </span>
                        <span className="text-xs font-bold text-text-primary mt-0.5 block">
                          {eventConfig.datesCompact}, 2026
                        </span>
                      </div>
                      <div className="rounded-xl border border-border bg-surface-subtle/50 p-2.5">
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">
                          Expected Reach
                        </span>
                        <span className="text-xs font-bold text-primary mt-0.5 block">
                          1,000+ Students
                        </span>
                      </div>
                      <div className="rounded-xl border border-border bg-surface-subtle/50 p-2.5">
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">
                          Venue
                        </span>
                        <span className="text-xs font-bold text-text-primary mt-0.5 block">
                          SOE CUSAT, Kochi
                        </span>
                      </div>
                    </div>

                    {/* Official Tiers Hierarchy */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                        Official Sponsorship Packages
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {sponsorshipPackages.slice(0, 4).map((tier) => (
                          <div
                            key={tier.tier}
                            className={`rounded-xl border p-3 space-y-1.5 ${
                              tier.color?.border || "border-border"
                            } ${tier.color?.bg || "bg-surface"}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-text-primary text-xs">{tier.name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {tier.formattedAmount}
                              </span>
                            </div>
                            <p className="text-[10px] text-text-secondary line-clamp-2 leading-snug">
                              {tier.benefits[0]}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 30-Second Elevator Pitch Box */}
                    <div className="rounded-xl border border-border bg-surface-subtle p-3.5 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                        <Megaphone className="h-3.5 w-3.5 text-primary" />
                        <span>Authoritative 30-Second Hook:</span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed italic bg-surface p-2.5 rounded-lg border border-border">
                        "{quickPitchGuidelines.conciseHook}"
                      </p>
                    </div>

                    {/* Collateral Download & Link */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border-subtle">
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
                            Copied Brochure Link
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
                  <div className="space-y-3 text-xs animate-in fade-in duration-200">
                    <div className="rounded-xl border border-border bg-surface p-3.5 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white font-bold text-[10px]">
                          1
                        </span>
                        <h4 className="font-bold text-text-primary text-xs">
                          Inspect Dossier & Contact Truth
                        </h4>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed pl-7">
                        Review the company dossier and check whether the phone is a direct mobile (<code className="text-primary font-mono text-[10px]">direct_official</code>) or front desk (<code className="text-primary font-mono text-[10px]">switchboard</code>). Never assume generic numbers are decision-makers.
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-surface p-3.5 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white font-bold text-[10px]">
                          2
                        </span>
                        <h4 className="font-bold text-text-primary text-xs">
                          Launch Minimal Call Mode
                        </h4>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed pl-7">
                        Tap "Call" to enter zero-distraction Call Mode. Keep the in-call stopwatch running and reference concise talking points during the conversation.
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-surface p-3.5 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white font-bold text-[10px]">
                          3
                        </span>
                        <h4 className="font-bold text-text-primary text-xs">
                          Log 1 of 9 Quick Outcomes
                        </h4>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed pl-7">
                        When the call ends, tap one quick outcome button: <span className="font-semibold text-text-primary">Interested</span>, <span className="font-semibold text-text-primary">Asked for proposal</span>, <span className="font-semibold text-text-primary">Call back</span>, <span className="font-semibold text-text-primary">Non-cash opportunity</span>, or <span className="font-semibold text-text-primary">Wrong person</span>.
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-surface p-3.5 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white font-bold text-[10px]">
                          4
                        </span>
                        <h4 className="font-bold text-text-primary text-xs">
                          Record 20-Second Voice Debrief
                        </h4>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed pl-7">
                        Hold the microphone and summarize what was discussed. Whisper transcribes and AI extracts key objections and follow-up dates. Review the fields and save!
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 3: In-Kind & Non-Cash Deals */}
                {activeTab === "inkind" && (
                  <div className="space-y-3 text-xs animate-in fade-in duration-200">
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-1.5">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs">
                        <Gift className="h-4 w-4" />
                        <span>Non-Cash / In-Kind Partnerships</span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        If a company cannot contribute cash, pivot immediately to in-kind sponsorship! PRAROHA'26 actively accepts 13 non-cash categories.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-lg border border-border bg-surface p-2.5">
                        <strong className="text-text-primary block">Beverages & Food:</strong>
                        <span className="text-text-secondary">Energy drinks, juices, snacks for 1,000+ delegates.</span>
                      </div>
                      <div className="rounded-lg border border-border bg-surface p-2.5">
                        <strong className="text-text-primary block">Prizes & Tech Tools:</strong>
                        <span className="text-text-secondary">Cloud credits, dev tools, gadgets for competition winners.</span>
                      </div>
                      <div className="rounded-lg border border-border bg-surface p-2.5">
                        <strong className="text-text-primary block">Printing & Kits:</strong>
                        <span className="text-text-secondary">Delegate ID tags, certificates, banners, kit bags.</span>
                      </div>
                      <div className="rounded-lg border border-border bg-surface p-2.5">
                        <strong className="text-text-primary block">Workshop Support:</strong>
                        <span className="text-text-secondary">Technical equipment, specialized software licenses.</span>
                      </div>
                    </div>

                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 text-[11px] text-amber-800 dark:text-amber-300">
                      <strong>Mandatory Rule:</strong> Always request an estimated monetary valuation (in INR) for any in-kind product or service to credit the deal in the pipeline metrics!
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center pt-4 border-t border-border-subtle text-[11px] text-text-muted">
        PRAROHA'26 • Division of Civil Engineering • School of Engineering, CUSAT
      </footer>
    </div>
  );
}
