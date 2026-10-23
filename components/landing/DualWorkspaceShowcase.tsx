"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users2,
  Shield,
  PhoneCall,
  CheckCircle2,
  Building2,
  TrendingUp,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  Sliders,
  FileSpreadsheet,
} from "lucide-react";

export function DualWorkspaceShowcase() {
  const [activeRole, setActiveRole] = useState<"volunteer" | "admin">("volunteer");

  return (
    <section className="py-20 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border text-[11px] font-mono text-primary bg-surface mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            ROLE-AWARE OPERATIONAL COCKPIT
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-text-primary">
            Two specialized roles. One unified pipeline.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
            Student SDRs work in a distraction-free, single-page outreach workstation. Committee Admins exercise strict verification, lead allocation, and financial ratification.
          </p>

          {/* Role Switcher Pill */}
          <div className="mt-8 inline-flex p-1 rounded-sm border border-border bg-surface-subtle">
            <button
              onClick={() => setActiveRole("volunteer")}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-sm transition-all ${
                activeRole === "volunteer"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Users2 className="h-4 w-4" />
              <span>Student SDR Cockpit (/workspace)</span>
            </button>
            <button
              onClick={() => setActiveRole("admin")}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-sm transition-all ${
                activeRole === "admin"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Sponsorship Head Control (/admin)</span>
            </button>
          </div>
        </div>

        {/* Content Box */}
        {activeRole === "volunteer" ? (
          <div id="volunteer-cockpit" className="rounded-lg border border-border bg-surface shadow-xs overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface-subtle/50 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-primary">VOLUNTEER OUTREACH DESK</span>
                <span className="text-text-muted">· Single-Page Workstation</span>
              </div>
              <div className="flex items-center gap-4 text-text-muted text-[11px] font-mono">
                <span>Daily Quota: <strong>1 / 3 calls</strong></span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">1 Callback Today</span>
              </div>
            </div>

            {/* Simulated Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
              {/* Left Column: Queue & Follow-ups (4 cols) */}
              <div className="lg:col-span-4 p-5 space-y-4 bg-surface-subtle/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-text-muted font-bold">
                    Today&apos;s Outreach Queue
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                    3 Leads Due
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded border border-primary bg-primary/[0.04] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-text-primary">UltraTech Cement</span>
                      <span className="text-[10px] font-bold text-rose-600 font-mono">HIGH PRIORITY</span>
                    </div>
                    <p className="text-[11px] text-text-secondary">Civil Construction / Infrastructure</p>
                    <div className="pt-2 flex items-center justify-between text-[10px] text-text-muted font-mono">
                      <span>R. Madhavan (CSR Head)</span>
                      <span className="text-primary font-bold">Callback: 2:00 PM</span>
                    </div>
                  </div>

                  <div className="p-3 rounded border border-border bg-surface space-y-1 opacity-80">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-text-primary">Geojit Financial</span>
                      <span className="text-[10px] font-bold text-amber-600 font-mono">MEDIUM</span>
                    </div>
                    <p className="text-[11px] text-text-secondary">Banking & Investment</p>
                    <div className="pt-2 flex items-center justify-between text-[10px] text-text-muted font-mono">
                      <span>Babu Thomas (VP Marketing)</span>
                      <span>Review Record</span>
                    </div>
                  </div>

                  <div className="p-3 rounded border border-border bg-surface space-y-1 opacity-80">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-text-primary">Sobha Developers</span>
                      <span className="text-[10px] font-bold text-rose-600 font-mono">HIGH</span>
                    </div>
                    <p className="text-[11px] text-text-secondary">Real Estate & Concrete</p>
                    <div className="pt-2 flex items-center justify-between text-[10px] text-text-muted font-mono">
                      <span>Arun Menon (Branding)</span>
                      <span>Ready to dial</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: In-Call Preparation & Dossier (8 cols) */}
              <div className="lg:col-span-8 p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                  <div>
                    <span className="text-[10px] font-mono text-primary font-bold uppercase">
                      ACTIVE COMPANY DOSSIER
                    </span>
                    <h3 className="text-xl font-bold text-text-primary mt-0.5">UltraTech Cement Ltd</h3>
                    <p className="text-xs text-text-muted">Direct Official Mobile: +91 94471 20089 · Verified Decision Maker</p>
                  </div>

                  <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-bold shadow-2xs hover:bg-primary-hover self-start sm:self-center"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Enter Call Mode</span>
                  </Link>
                </div>

                {/* 3 Talking Points Strip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded border border-border bg-surface-subtle/30 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-primary font-bold">1. Opening Pitch</span>
                    <p className="text-[11px] text-text-secondary leading-snug">
                      Focus on 3,500+ civil engineering participants & national concrete design challenges.
                    </p>
                  </div>
                  <div className="p-3 rounded border border-border bg-surface-subtle/30 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-600 font-bold">2. Objection Prep</span>
                    <p className="text-[11px] text-text-secondary leading-snug">
                      If budget is locked for Q4, propose In-Kind Technical Workshop or Prize Sponsor track.
                    </p>
                  </div>
                  <div className="p-3 rounded border border-border bg-surface-subtle/30 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-emerald-600 font-bold">3. Next Action</span>
                    <p className="text-[11px] text-text-secondary leading-snug">
                      Request official email address to dispatch PRAROHA&apos;26 brochure + MoU draft immediately.
                    </p>
                  </div>
                </div>

                {/* 9 Quick Outcome Buttons Preview */}
                <div className="pt-2">
                  <p className="text-[10px] font-mono text-text-muted uppercase mb-2">9 Fast Outcome Buttons</p>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-text-secondary">
                    <span className="px-2.5 py-1 rounded border border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
                      ✓ Interested
                    </span>
                    <span className="px-2.5 py-1 rounded border border-primary/30 bg-primary/5 text-primary">
                      ✓ Asked for Proposal
                    </span>
                    <span className="px-2.5 py-1 rounded border border-border bg-surface">
                      Call Back
                    </span>
                    <span className="px-2.5 py-1 rounded border border-border bg-surface">
                      Meeting Requested
                    </span>
                    <span className="px-2.5 py-1 rounded border border-border bg-surface">
                      Non-Cash Opportunity
                    </span>
                    <span className="px-2.5 py-1 rounded border border-border bg-surface">
                      Wrong Person
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div id="admin-control" className="rounded-lg border border-border bg-surface shadow-xs overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface-subtle/50 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-primary">ADMIN CONTROL ROOM</span>
                <span className="text-text-muted">· Governance & Pipeline Integrity</span>
              </div>
              <div className="flex items-center gap-4 text-text-muted text-[11px] font-mono">
                <span>Verified SDRs: <strong>3 Active</strong></span>
                <span className="text-primary font-bold">Signing Authority: Head Only</span>
              </div>
            </div>

            {/* Admin Metric Cards Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border border-b border-border bg-surface-subtle/20">
              <div className="p-4">
                <p className="text-[10px] font-mono text-text-muted uppercase">Confirmed Value</p>
                <p className="text-xl font-bold text-text-primary mt-0.5">₹2,00,000</p>
                <p className="text-[10px] text-emerald-600 mt-0.5">Liquid cash + In-Kind</p>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-mono text-text-muted uppercase">Pipeline Potential</p>
                <p className="text-xl font-bold text-text-primary mt-0.5">₹10,25,000</p>
                <p className="text-[10px] text-text-secondary mt-0.5">52 corporate leads</p>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-mono text-text-muted uppercase">Pending Verification</p>
                <p className="text-xl font-bold text-amber-600 mt-0.5">0 Queued</p>
                <p className="text-[10px] text-text-secondary mt-0.5">All volunteers audited</p>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-mono text-text-muted uppercase">Forensic Audit Log</p>
                <p className="text-xl font-bold text-primary mt-0.5">100% Immutable</p>
                <p className="text-[10px] text-text-secondary mt-0.5">Zero silent mutations</p>
              </div>
            </div>

            {/* Admin Capabilities Summary */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-primary/10 text-primary">
                    <FileSpreadsheet className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-text-primary">29-Field CSV Lead Ingestion</h4>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Bulk import company records with automatic pre-flight duplicate checking against normalized names, domains, and phone numbers.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-primary/10 text-primary">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-text-primary">Lead Allocation Matrix</h4>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Assign leads to students or committee admins with real-time capacity monitoring and workload balancing.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-primary/10 text-primary">
                    <Award className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-text-primary">Exclusive Signing Authority</h4>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Only the Sponsorship Head can approve deal commitments, ratify MoUs, and lock financial values into festival revenue accounts.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
