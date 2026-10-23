"use client";

import React from "react";
import {
  Database,
  PhoneCall,
  ShieldCheck,
  CalendarCheck,
  Mic,
  Coins,
  FileCheck2,
  Lock,
} from "lucide-react";

const workflowItems = [
  {
    number: "01",
    tag: "CANONICAL INGESTION",
    title: "29-Field Lead Ingestion Engine",
    description:
      "Every company record parses company size, Kerala presence, sponsorship history, decision-maker status, and ask brackets. Automatic duplicate detection across domains and normalized phone numbers.",
    icon: Database,
  },
  {
    number: "02",
    tag: "VERIFICATION STANDARD",
    title: "Zero-Assumption Contact Verification",
    description:
      "A phone number is never assumed to be a decision maker. Strict classification into Direct Mobile, Regional Desk, or Reception Switchboard protects outreach velocity.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    tag: "VOLUNTEER VELOCITY",
    title: "Zero Tab-Hopping Outreach Cockpit",
    description:
      "Student SDRs work exclusively on a single screen (/workspace). Lead queues, company dossiers, concise talking points, and call mode remain permanently in context.",
    icon: PhoneCall,
  },
  {
    number: "04",
    tag: "FORENSIC DEBRIEF",
    title: "Voice Debrief & Whisper Extraction",
    description:
      "Volunteers record a 30-second conversational voice summary after every call. Server-side Whisper transcribes and extracts objections, decision maker status, and callbacks.",
    icon: Mic,
  },
  {
    number: "05",
    tag: "COMMERCIAL RATIFICATION",
    title: "Dual Cash + Non-Cash Valuation",
    description:
      "Full monetary valuation tracking across 13 in-kind categories (technical workshops, software licenses, media streaming, logistics) alongside liquid cash pledges.",
    icon: Coins,
  },
  {
    number: "06",
    tag: "EXECUTIVE GOVERNANCE",
    title: "Exclusive Administrative Signing Authority",
    description:
      "No student volunteer can commit PRAROHA'26 deliverables. Sponsorship Heads exercise verified signing clearance, ratify MoUs, and audit forensic mutation trails.",
    icon: Lock,
  },
];

export function LifecycleWorkflowGrid() {
  return (
    <section className="py-20 border-b border-border bg-surface-subtle/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border text-[11px] font-mono text-primary bg-surface mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            OPERATIONS FIRST, AI SECOND
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-text-primary">
            Engineered for student velocity. Audited for executive certainty.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
            Spreadsheets get forgotten, WhatsApp messages lose context, and corporate commitments slip through cracks. This platform replaces chaos with an enterprise pipeline.
          </p>
        </div>

        {/* 6-Grid Technical Feature Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="rounded-lg border border-border bg-surface p-6 flex flex-col justify-between hover:border-border-strong transition-all duration-200 shadow-2xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                      {item.tag}
                    </span>
                    <span className="font-mono text-xs font-bold text-text-muted">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-border flex items-center justify-between text-[11px] font-mono text-text-muted">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>Praroha Verified</span>
                  </div>
                  <span>100% Operational</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
