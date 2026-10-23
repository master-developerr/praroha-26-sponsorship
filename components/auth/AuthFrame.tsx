"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Building2,
  Users2,
  Coins,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { eventConfig } from "@/lib/eventConfig";

interface AuthFrameProps {
  children: ReactNode;
  mode: "sign-in" | "sign-up";
}

export function AuthFrame({ children, mode }: AuthFrameProps) {
  const isSignIn = mode === "sign-in";

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full border-b border-border bg-surface/80 backdrop-blur-xs py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Return to PRAROHA&apos;26 Portal</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-border text-[10px] font-mono text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              SOE CUSAT · DEC 04–05
            </span>
            <ThemeToggle className="h-8 w-8 rounded-sm" />
          </div>
        </div>
      </header>

      {/* Main 2-Column Split Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: Technical Context & System Telemetry (6 cols) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 pr-4">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border border-primary/30 bg-primary/5 text-primary text-xs font-mono font-bold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                OFFICIAL COMMITTEE ACCESS
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary leading-tight">
                {isSignIn
                  ? "Access your assigned leads and outreach workstation."
                  : "Join the PRAROHA'26 student sponsorship committee."}
              </h1>

              <p className="text-sm text-text-secondary leading-relaxed">
                {isSignIn
                  ? "Sign in with your verified institutional or committee credentials to review your daily call queue, access company dossiers, and schedule callbacks."
                  : "Create your student account to apply for the sponsorship committee. Accounts are verified by the Sponsorship Head before lead dispatch to maintain outreach quality."}
              </p>
            </div>

            {/* Live Operational Metric Strip */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-lg border border-border bg-surface shadow-2xs">
              <div className="space-y-0.5">
                <p className="text-[10px] font-mono uppercase text-text-muted">Target Reach</p>
                <p className="text-lg font-bold text-text-primary">3,500+</p>
                <p className="text-[10px] text-text-muted">CUSAT Delegates</p>
              </div>
              <div className="space-y-0.5 border-x border-border px-3">
                <p className="text-[10px] font-mono uppercase text-text-muted">Active Pipeline</p>
                <p className="text-lg font-bold text-primary">₹10.25L</p>
                <p className="text-[10px] text-text-muted">Target Sponsorship</p>
              </div>
              <div className="space-y-0.5 pl-1">
                <p className="text-[10px] font-mono uppercase text-text-muted">SDR Clearance</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Strict</p>
                <p className="text-[10px] text-text-muted">Admin Ratified</p>
              </div>
            </div>

            {/* Trust & Governance Guarantees */}
            <div className="space-y-2 pt-2 border-t border-border text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>Zero-Trust Architecture: Role clearance validated by Convex</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Single-page /workspace ensures zero tab-hopping during calls</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Clerk Authentication Component (6 cols) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-xs">
              <div className="mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary text-primary-foreground font-bold text-xs">
                    P
                  </div>
                  <span className="font-mono text-xs font-bold text-text-primary uppercase tracking-wider">
                    PRAROHA&apos;26 OPERATIONS
                  </span>
                </div>
                <h2 className="text-xl font-bold text-text-primary">
                  {isSignIn ? "Sign In to Workspace" : "Create Volunteer Account"}
                </h2>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {isSignIn
                    ? "Enter your credentials to enter your role-specific dashboard."
                    : "Student registration requires subsequent department profile review."}
                </p>
              </div>

              {/* The Real Clerk Container */}
              <div className="w-full">{children}</div>

              {/* Footer Switcher */}
              <div className="mt-6 pt-4 border-t border-border text-center text-xs text-text-muted">
                {isSignIn ? (
                  <p>
                    New to the outreach team?{" "}
                    <Link href="/sign-up" className="font-semibold text-primary hover:underline">
                      Apply for volunteer clearance
                    </Link>
                  </p>
                ) : (
                  <p>
                    Already have a verified account?{" "}
                    <Link href="/sign-in" className="font-semibold text-primary hover:underline">
                      Sign in directly
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="w-full border-t border-border py-4 px-4 sm:px-8 text-center text-[11px] font-mono text-text-muted">
        PRAROHA&apos;26 · Division of Civil Engineering · School of Engineering, CUSAT
      </footer>
    </div>
  );
}
