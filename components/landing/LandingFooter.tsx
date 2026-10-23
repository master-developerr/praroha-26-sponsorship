"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { eventConfig, officialContacts } from "@/lib/eventConfig";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface text-text-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border">
          {/* Brand & Academic Affiliation (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground font-black text-sm">
                P
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight uppercase">
                  PRAROHA&apos;26
                </span>
                <span className="text-[10px] font-mono text-text-muted">
                  Sponsorship Operations & Volunteer Execution
                </span>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
              An internal operational platform engineered for the student sponsorship committee of PRAROHA&apos;26 — hosted by the Division of Civil Engineering, School of Engineering, Cochin University of Science and Technology (CUSAT).
            </p>

            <div className="pt-2 text-[11px] font-mono text-text-muted space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>SOE Campus, South Kalamassery, Kochi, Kerala 682022</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>praroha2026@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Nav Links (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
              Workspaces
            </p>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/workspace" className="hover:text-text-primary transition-colors flex items-center gap-1">
                  <span>Volunteer SDR</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-text-primary transition-colors flex items-center gap-1">
                  <span>Admin Control</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-text-primary transition-colors">
                  Sign In Gateway
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-text-primary transition-colors">
                  Join Committee
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Specifications (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
              Governance
            </p>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <a href="#relay" className="hover:text-text-primary transition-colors">
                  Lead Relay Engine
                </a>
              </li>
              <li>
                <a href="#volunteer-cockpit" className="hover:text-text-primary transition-colors">
                  Contact Standard
                </a>
              </li>
              <li>
                <a href="#event-dossier" className="hover:text-text-primary transition-colors">
                  Sponsorship Tiers
                </a>
              </li>
              <li>
                <a
                  href="/brochure/praroha-2026-sponsorship-brochure.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-text-primary transition-colors flex items-center gap-1"
                >
                  <span>Brochure PDF</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Security & System Status (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
              Operational Status
            </p>
            <div className="p-3 rounded border border-border bg-surface-subtle/50 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Subsystems Operational</span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                Convex real-time database, Clerk authenticated identity, and Whisper transcription engine active.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-text-muted font-mono">
          <p>
            © 2026 PRAROHA. Division of Civil Engineering, School of Engineering, CUSAT.
          </p>
          <div className="flex items-center gap-4">
            <span>DEC 04–05, 2026</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Official Outreach Platform
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
