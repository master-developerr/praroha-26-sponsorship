"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ShieldCheck,
  Building2,
  PhoneCall,
  CalendarClock,
  Award,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Users,
} from "lucide-react";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { getRoleDefaultRoute } from "@/lib/authRedirect";

export function HeroSection() {
  const { isAuthenticated, role, authState } = useAuthUser();
  const [activeHeroTab, setActiveHeroTab] = useState<"lead" | "dossier" | "call">("lead");

  const destination = isAuthenticated
    ? authState === "PROFILE_MISSING"
      ? "/register/profile"
      : getRoleDefaultRoute(
          role,
          authState === "PENDING"
            ? "pending"
            : authState === "REJECTED"
            ? "rejected"
            : authState === "SUSPENDED"
            ? "suspended"
            : undefined
        )
    : "/sign-in";

  return (
    <section className="relative pt-32 pb-20 md:pt-36 md:pb-28 border-b border-border overflow-hidden bg-background">
      {/* Subtle Technical Architectural Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-subtle)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-subtle)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Eyebrow Tag */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center gap-2 mb-6"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm border border-primary/30 bg-primary/5 text-primary text-xs font-mono font-bold tracking-wider uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
            PRAROHA&apos;26 // OPERATIONAL COCKPIT
          </span>
          <span className="text-xs font-mono text-text-muted">
            Civil Engineering Division · SOE CUSAT
          </span>
        </motion.div>

        {/* Confident, Architectural Headline */}
        <div className="max-w-4xl space-y-5">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.04]"
          >
            Turning sponsor intelligence into coordinated action.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl"
          >
            An internal operational platform for the student sponsorship committee of PRAROHA&apos;26. Ingest corporate leads, assign verified SDRs, execute structured calls, and ratify commitments without spreadsheet friction.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 pt-3"
          >
            <Link
              href={destination}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover transition-all shadow-xs hover:shadow-sm"
            >
              <span>{isAuthenticated ? "Enter Workspace" : "Access Workspace"}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            {!isAuthenticated && (
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-sm border border-border bg-surface text-text-primary text-sm font-semibold hover:bg-surface-subtle transition-colors shadow-2xs"
              >
                <span>Join Sponsorship Committee</span>
              </Link>
            )}

            <a
              href="#relay"
              className="inline-flex items-center gap-1.5 px-3 py-3 text-xs font-mono text-text-muted hover:text-primary transition-colors ml-1"
            >
              <span>Watch Live Relay</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </div>

        {/* Live Product Hero Terminal Preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 rounded-lg border border-border bg-surface shadow-md overflow-hidden"
        >
          {/* Top Window Strip */}
          <div className="flex items-center justify-between px-4 py-3 bg-surface-subtle border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-border-strong/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-border-strong/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-border-strong/70" />
              </div>
              <span className="font-mono text-xs font-bold text-text-primary uppercase tracking-wider">
                PRAROHA&apos;26 // LIVE SPONSORSHIP DISPATCH
              </span>
            </div>

            {/* Interactive View Toggles */}
            <div className="flex items-center p-0.5 rounded border border-border bg-surface text-[11px] font-mono">
              <button
                onClick={() => setActiveHeroTab("lead")}
                className={`px-3 py-1 rounded transition-colors ${
                  activeHeroTab === "lead"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                1. Lead Queue
              </button>
              <button
                onClick={() => setActiveHeroTab("dossier")}
                className={`px-3 py-1 rounded transition-colors ${
                  activeHeroTab === "dossier"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                2. Contact Dossier
              </button>
              <button
                onClick={() => setActiveHeroTab("call")}
                className={`px-3 py-1 rounded transition-colors ${
                  activeHeroTab === "call"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                3. Call Mode
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6">
            {activeHeroTab === "lead" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
                  <span className="font-mono text-text-muted uppercase">Canonical Database · Active Outreach</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ 52 Leads · 10 Stages Connected
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-[10px] font-mono text-text-muted uppercase">
                        <th className="py-2 px-3">Company</th>
                        <th className="py-2 px-3">Decision Maker</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Assignee</th>
                        <th className="py-2 px-3 text-right">Potential</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-surface-subtle/50 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-text-primary block">UltraTech Cement Ltd</span>
                          <span className="text-[10px] text-text-muted font-mono">Infrastructure Partner</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-text-primary block">R. Madhavan</span>
                          <span className="text-[10px] text-emerald-600 font-mono">✓ Verified Decision Maker</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400">
                            FOLLOW_UP
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-text-secondary">Adil M (Head)</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-text-primary">₹2,50,000</td>
                      </tr>

                      <tr className="hover:bg-surface-subtle/50 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-text-primary block">Kerala Kaumudi Publications</span>
                          <span className="text-[10px] text-text-muted font-mono">Media & Broadcast</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-text-primary block">B. S. Rajesh</span>
                          <span className="text-[10px] text-emerald-600 font-mono">✓ Verified Official</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                            WON / COMMITTED
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-text-secondary">Ananya K (SDR)</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">₹2,00,000</td>
                      </tr>

                      <tr className="hover:bg-surface-subtle/50 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-text-primary block">Geojit Financial Services</span>
                          <span className="text-[10px] text-text-muted font-mono">Banking / CSR</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-text-primary block">Babu Thomas</span>
                          <span className="text-[10px] text-text-muted font-mono">Official Office Desk</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-700 dark:text-sky-400">
                            CONTACTED
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-text-secondary">Sr Creations (SDR)</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-text-primary">₹1,00,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeHeroTab === "dossier" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded border border-border bg-surface-subtle/30 space-y-2">
                  <span className="text-[10px] font-mono text-primary font-bold uppercase">
                    COMPANY INTELLIGENCE
                  </span>
                  <h4 className="text-base font-bold text-text-primary">UltraTech Cement Ltd</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Largest cement manufacturer in India. Deep South India regional presence with dedicated CSR programs for sustainable construction engineering students.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-text-muted flex items-center justify-between">
                    <span>Ask Tier: Title / Associate</span>
                    <span className="font-bold text-primary">Est. Ask: ₹2.0L–₹3.0L</span>
                  </div>
                </div>

                <div className="p-4 rounded border border-border bg-surface-subtle/30 space-y-2">
                  <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">
                    VERIFIED CONTACT
                  </span>
                  <h4 className="text-base font-bold text-text-primary">R. Madhavan</h4>
                  <p className="text-xs text-text-secondary">
                    Head of Corporate Social Responsibility & Technical Relations (South India Region)
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-text-muted flex items-center justify-between">
                    <span>Phone: +91 94471 20089</span>
                    <span className="text-emerald-600">✓ Direct Mobile</span>
                  </div>
                </div>
              </div>
            )}

            {activeHeroTab === "call" && (
              <div className="p-5 rounded border border-primary/30 bg-primary/[0.02] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-text-primary">In-Call Mode · Active Dial</span>
                  </div>
                  <span className="text-[11px] font-mono text-text-muted">Dialing: +91 94471 20089</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button className="py-2 px-3 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    ✓ Interested
                  </button>
                  <button className="py-2 px-3 rounded border border-primary/40 bg-primary/10 text-primary font-bold text-xs">
                    ✓ Asked for Proposal
                  </button>
                  <button className="py-2 px-3 rounded border border-border bg-surface text-text-secondary text-xs">
                    Call Back Later
                  </button>
                </div>

                <p className="text-[11px] text-text-muted font-mono">
                  1-Click log triggers automatic Whisper audio debriefing & locks callback schedule.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
