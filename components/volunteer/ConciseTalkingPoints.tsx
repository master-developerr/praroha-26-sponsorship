"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  HelpCircle,
  ShieldAlert,
  Gift,
  ChevronDown,
  Sparkles,
  Target,
  CheckCircle2,
} from "lucide-react";

interface ConciseTalkingPointsProps {
  companyName: string;
  industry: string;
  niche: string;
  keralaPresence?: string;
  sponsorshipHistory?: string;
  whyGoodLead?: string;
  whyCompanyBenefits?: string;
  alternativeSupport?: string;
}

export function ConciseTalkingPoints({
  companyName,
  industry,
  niche,
  keralaPresence,
  sponsorshipHistory,
  whyGoodLead,
  whyCompanyBenefits,
  alternativeSupport,
}: ConciseTalkingPointsProps) {
  const [activeSection, setActiveSection] = useState<
    "hook" | "talkingPoints" | "questions" | "objections" | "inKind"
  >("talkingPoints");

  // Dynamic context tailored to company
  const hookText = `Hi, this is [Your Name] from the PRAROHA'26 Sponsorship Directorate at SOE CUSAT. I’m reaching out because ${
    companyName
  }'s leadership in ${niche || industry} directly aligns with Kerala's premier techno-managerial congregation of 15,000+ engineering and management youth.`;

  const talkingPoints = [
    `Brand Footfall & Campus Reach: PRAROHA'26 convenes students from 120+ top institutions across South India, offering ${companyName} direct engagement with future engineering talent.`,
    whyCompanyBenefits ||
      `${keralaPresence ? `Leverage your presence across Kerala (${keralaPresence})` : `Expand brand awareness in Kerala`} through tier-1 stage branding, technical stalls, and exclusive festival zones.`,
    whyGoodLead ||
      `Direct recruitment & technical mindshare: Position ${companyName} as the premier employer and partner of choice among premier CUSAT graduates.`,
  ];

  const discoveryQuestions = [
    `"What are ${companyName}'s key student outreach and brand priorities across Kerala for this academic year?"`,
    `"Are you currently prioritizing technical event sponsorships, hackathon prize partnerships, or graduate talent acquisition?"`,
    `"Who oversees corporate brand partnerships or CSR initiatives for collegiate events in your regional office?"`,
  ];

  const objections = [
    {
      objection: "We don't sponsor collegiate fests.",
      response:
        "We understand! PRAROHA isn't just an entertainment festival — it's an industry-academia bridge featuring accredited workshops, technical paper symposiums, and corporate recruitment pipelines.",
    },
    {
      objection: "Our sponsorship budget for this quarter is closed.",
      response:
        "Totally understandable. We also have non-cash partnership avenues such as workshop software licenses, technical mentor tracks, and merchandise tie-ups that require zero cash outlay.",
    },
    {
      objection: "Send your brochure by email and we will review.",
      response:
        "I'd love to! To ensure I dispatch the exact package matching your regional marketing priorities, could I confirm whether brand visibility or student recruitment matters most to you?",
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface shadow-xs overflow-hidden">
      {/* Header Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border-subtle bg-surface-subtle/50 p-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveSection("talkingPoints")}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-semibold transition-colors cursor-pointer ${
            activeSection === "talkingPoints"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          <Lightbulb className="h-3.5 w-3.5" />
          Talking Points
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("hook")}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer ${
            activeSection === "hook"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Opening Hook
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("questions")}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer ${
            activeSection === "questions"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          <HelpCircle className="h-3.5 w-3.5" />
          Discovery Questions
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("objections")}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer ${
            activeSection === "objections"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          Objections
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("inKind")}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer ${
            activeSection === "inKind"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          <Gift className="h-3.5 w-3.5" />
          In-Kind Ideas
        </button>
      </div>

      {/* Content Body */}
      <div className="p-4 text-xs text-text-secondary">
        {/* 1. Concise Talking Points */}
        {activeSection === "talkingPoints" && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-text-primary flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-primary" />
                Value Propositions for {companyName}
              </span>
              <span className="text-[10px] text-text-muted">
                Non-rigid bullet notes
              </span>
            </div>
            <ul className="space-y-2">
              {talkingPoints.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-surface-subtle/70 p-2.5 border border-border-subtle"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-mint text-[11px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-text-primary leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 2. Opening Hook */}
        {activeSection === "hook" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Natural 15-Second Opening Hook
              </span>
              <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Do not recite robotically
              </span>
            </div>
            <div className="rounded-lg bg-surface-subtle p-3.5 border border-border-subtle text-text-primary leading-relaxed font-sans italic">
              "{hookText}"
            </div>
          </div>
        )}

        {/* 3. Discovery Questions */}
        {activeSection === "questions" && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-text-primary flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                Key Probing Questions
              </span>
              <span className="text-[10px] text-text-muted">
                Identify decision-maker budget & goals
              </span>
            </div>
            <div className="space-y-2">
              {discoveryQuestions.map((q, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border-subtle bg-surface-subtle/70 p-2.5 text-text-primary"
                >
                  <span className="font-semibold text-primary mr-1">Q{i + 1}:</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Objections Battlecard */}
        {activeSection === "objections" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-text-primary flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                Collegiate Objection Battlecard
              </span>
              <span className="text-[10px] text-text-muted">
                Pivot negative responses
              </span>
            </div>
            <div className="space-y-2.5">
              {objections.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border-subtle bg-surface-subtle/50 p-3 space-y-1.5"
                >
                  <p className="font-semibold text-rose-700 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded">
                      Objection
                    </span>
                    "{item.objection}"
                  </p>
                  <p className="text-text-primary text-[11px] leading-relaxed pl-2 border-l-2 border-primary">
                    <strong className="text-primary font-semibold">Counter: </strong>
                    {item.response}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. In-Kind / Non-Cash Alternatives */}
        {activeSection === "inKind" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-text-primary flex items-center gap-1.5">
                <Gift className="h-3.5 w-3.5 text-purple-600" />
                Non-Cash / In-Kind Partnership Angles
              </span>
            </div>
            <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-3 text-purple-900 leading-relaxed">
              <p className="font-semibold mb-1">Viable Non-Cash Alternatives:</p>
              <p>
                {alternativeSupport ||
                  `Sponsorship of technical competition prizes, guest speaker travel logistics, branded volunteer kits, or beverage/snack refreshments in festival main zones.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
