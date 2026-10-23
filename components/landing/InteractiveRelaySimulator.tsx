"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  PhoneCall,
  UserCheck,
  CalendarClock,
  Award,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Phone,
  ShieldCheck,
  Clock,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export interface RelayStep {
  id: string;
  stepNumber: string;
  stageName: string;
  title: string;
  eyebrow: string;
  description: string;
  statusBadge: {
    label: string;
    variant: "info" | "warning" | "primary" | "success";
  };
  leadData: {
    companyName: string;
    industry: string;
    niche: string;
    priority: "HIGH" | "MEDIUM";
    contactName: string;
    contactRole: string;
    phone: string;
    phoneType: string;
    verificationStatus: string;
    assignedTo: string;
    assignedRole: string;
    activeCallNote?: string;
    followUpDue?: string;
    commitmentTier?: string;
    commitmentValue?: string;
  };
  metrics: {
    pipelinePotential: string;
    leadsInQueue: number;
    completedCalls: number;
  };
}

const relaySteps: RelayStep[] = [
  {
    id: "signal",
    stepNumber: "01",
    stageName: "SIGNAL & INGESTION",
    title: "Raw corporate intelligence ingested into canonical record",
    eyebrow: "STEP 01 // 29-FIELD PARSER",
    description:
      "A raw lead arrives from corporate research. The system normalizes company domain, phone prefix, industry classification, and eliminates duplicates automatically.",
    statusBadge: { label: "UNASSIGNED POOL", variant: "warning" },
    leadData: {
      companyName: "Kerala Kaumudi Publications",
      industry: "Media & Broadcasting",
      niche: "Statewide Print & Digital Reach",
      priority: "HIGH",
      contactName: "B. S. Rajesh",
      contactRole: "Assistant General Manager (Kochi)",
      phone: "+91 98477 20053",
      phoneType: "Direct Mobile Line",
      verificationStatus: "OFFICIAL_COMPANY_CONTACT",
      assignedTo: "Unassigned Pool",
      assignedRole: "Awaiting Committee Allocation",
    },
    metrics: {
      pipelinePotential: "₹0",
      leadsInQueue: 52,
      completedCalls: 0,
    },
  },
  {
    id: "allocated",
    stepNumber: "02",
    stageName: "LEAD ALLOCATION",
    title: "Assigned to verified student SDR with capacity balancing",
    eyebrow: "STEP 02 // WORKLOAD MATRIX",
    description:
      "Admin reviews volunteer capacity in the Allocation Matrix. Lead is dispatched directly to an approved student SDR with complete company dossier access.",
    statusBadge: { label: "ASSIGNED TO SDR", variant: "info" },
    leadData: {
      companyName: "Kerala Kaumudi Publications",
      industry: "Media & Broadcasting",
      niche: "Statewide Print & Digital Reach",
      priority: "HIGH",
      contactName: "B. S. Rajesh",
      contactRole: "Assistant General Manager (Kochi)",
      phone: "+91 98477 20053",
      phoneType: "Direct Mobile Line",
      verificationStatus: "VERIFIED_COMPANY_REPRESENTATIVE",
      assignedTo: "Ananya Krishna",
      assignedRole: "Student SDR · S6 Civil Engg",
    },
    metrics: {
      pipelinePotential: "₹1,50,000",
      leadsInQueue: 51,
      completedCalls: 0,
    },
  },
  {
    id: "call_mode",
    stepNumber: "03",
    stageName: "CALL MODE & EXECUTION",
    title: "Volunteer dials decision-maker with contextual talking points",
    eyebrow: "STEP 03 // DISTRACTION-FREE OVERLAY",
    description:
      "Student SDR enters Call Mode on /workspace. Screen displays 3 concise talking points, objection guidance, non-cash alternatives, and 9 quick outcome buttons.",
    statusBadge: { label: "IN CALL MODE", variant: "primary" },
    leadData: {
      companyName: "Kerala Kaumudi Publications",
      industry: "Media & Broadcasting",
      niche: "Statewide Print & Digital Reach",
      priority: "HIGH",
      contactName: "B. S. Rajesh",
      contactRole: "Assistant General Manager (Kochi)",
      phone: "+91 98477 20053",
      phoneType: "Direct Mobile Line",
      verificationStatus: "VERIFIED_DECISION_MAKER",
      assignedTo: "Ananya Krishna",
      assignedRole: "Student SDR · S6 Civil Engg",
      activeCallNote:
        "Spoke with AGM. Discussed exclusive Print & Media Partner for PRAROHA'26. Client requested formal proposal deck with youth readership reach at CUSAT.",
    },
    metrics: {
      pipelinePotential: "₹1,50,000",
      leadsInQueue: 50,
      completedCalls: 1,
    },
  },
  {
    id: "follow_up",
    stepNumber: "04",
    stageName: "VOICE DEBRIEF & CALLBACK",
    title: "AI transcribes volunteer debrief & locks follow-up alarm",
    eyebrow: "STEP 04 // OPERATIONAL ACCOUNTABILITY",
    description:
      "Volunteer records a 30-second audio debrief. Whisper transcribes the outcome, extracts objection tags, and schedules a high-priority follow-up date for proposal review.",
    statusBadge: { label: "PROPOSAL REQUESTED", variant: "warning" },
    leadData: {
      companyName: "Kerala Kaumudi Publications",
      industry: "Media & Broadcasting",
      niche: "Statewide Print & Digital Reach",
      priority: "HIGH",
      contactName: "B. S. Rajesh",
      contactRole: "Assistant General Manager (Kochi)",
      phone: "+91 98477 20053",
      phoneType: "Direct Mobile Line",
      verificationStatus: "VERIFIED_DECISION_MAKER",
      assignedTo: "Ananya Krishna",
      assignedRole: "Student SDR · S6 Civil Engg",
      activeCallNote: "Audio debrief transcribed: Proposal deck sent via email. Review meeting scheduled.",
      followUpDue: "Tomorrow, 11:30 AM (Confirmed Callback)",
    },
    metrics: {
      pipelinePotential: "₹2,00,000",
      leadsInQueue: 49,
      completedCalls: 1,
    },
  },
  {
    id: "commitment",
    stepNumber: "05",
    stageName: "RATIFIED COMMITMENT",
    title: "Admin commits formal MoU and locks sponsorship tier",
    eyebrow: "STEP 05 // SPONSORSHIP WON",
    description:
      "Sponsorship Head exercises exclusive signing authority to ratify ₹1.5L Media Partnership + ₹50,000 Print Advertising non-cash sponsorship into the ledger.",
    statusBadge: { label: "CONFIRMED SPONSOR", variant: "success" },
    leadData: {
      companyName: "Kerala Kaumudi Publications",
      industry: "Media & Broadcasting",
      niche: "Statewide Print & Digital Reach",
      priority: "HIGH",
      contactName: "B. S. Rajesh",
      contactRole: "Assistant General Manager (Kochi)",
      phone: "+91 98477 20053",
      phoneType: "Direct Mobile Line",
      verificationStatus: "VERIFIED_DECISION_MAKER",
      assignedTo: "Ananya Krishna",
      assignedRole: "Sponsorship Closed by Adil M (Head)",
      activeCallNote: "MoU signed. Full coverage committed across South Kerala editions.",
      commitmentTier: "Official Media Partner",
      commitmentValue: "₹2,00,000 (Cash + In-Kind)",
    },
    metrics: {
      pipelinePotential: "₹2,00,000 WON",
      leadsInQueue: 48,
      completedCalls: 2,
    },
  },
];

export function InteractiveRelaySimulator() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % relaySteps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStep = relaySteps[currentStepIndex];

  return (
    <section id="relay" className="py-20 border-b border-border bg-surface-subtle/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary uppercase tracking-wider mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              Interactive Lead Lifecycle
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-primary">
              Watch a sponsor move from signal to commitment.
            </h2>
            <p className="mt-2 text-sm text-text-secondary max-w-2xl">
              In PRAROHA&apos;26, corporate outreach is an unbroken relay. Every mutation leaves forensic evidence, locks accountability, and moves the deal forward.
            </p>
          </div>

          {/* Simulator Playback Controls */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border bg-surface text-xs font-medium text-text-primary hover:bg-surface-subtle transition-colors shadow-2xs"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5 text-warning" /> : <Play className="h-3.5 w-3.5 text-primary" />}
              <span>{isPlaying ? "Pause Relay" : "Auto-Play Relay"}</span>
            </button>
            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsPlaying(false);
              }}
              className="p-1.5 rounded-sm border border-border bg-surface text-text-muted hover:text-text-primary transition-colors"
              title="Reset to Step 1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-6 pb-8">
          {relaySteps.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;

            return (
              <button
                key={step.id}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`text-left p-3 rounded-sm border transition-all text-xs relative ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-2xs"
                    : isCompleted
                    ? "border-border bg-surface hover:border-border-strong"
                    : "border-border/60 bg-surface/50 text-text-muted hover:border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-mono text-[10px] font-bold ${isActive ? "text-primary" : "text-text-muted"}`}>
                    {step.stepNumber}
                  </span>
                  {isCompleted && <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                </div>
                <div className={`font-semibold text-[11px] truncate ${isActive ? "text-text-primary" : "text-text-secondary"}`}>
                  {step.stageName}
                </div>
              </button>
            );
          })}
        </div>

        {/* The Live Interactive Cockpit Terminal */}
        <div className="rounded-lg border border-border bg-surface shadow-xs overflow-hidden">
          {/* Terminal Top Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface-subtle border-b border-border text-[11px] font-mono text-text-muted">
            <div className="flex items-center gap-2">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-border-strong/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-border-strong/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-border-strong/60" />
              </span>
              <span className="text-text-primary font-medium ml-2">PRAROHA&apos;26 // RELAY WORKSPACE</span>
              <span className="text-text-muted">· lead_id: 8b73a_kaumudi</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Convex Realtime Engine
              </span>
            </div>
          </div>

          {/* Dynamic Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
            {/* Left: Step Narrative & Operations Logic (4 cols) */}
            <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between bg-surface-subtle/20">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary">
                  {currentStep.eyebrow}
                </div>

                <h3 className="text-lg font-bold text-text-primary tracking-tight leading-snug">
                  {currentStep.title}
                </h3>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {currentStep.description}
                </p>

                {/* Live System Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
                  <div className="p-2.5 rounded border border-border/80 bg-surface">
                    <p className="text-[10px] font-mono text-text-muted uppercase">Stage Status</p>
                    <p className="text-xs font-bold text-primary mt-0.5 truncate">{currentStep.statusBadge.label}</p>
                  </div>
                  <div className="p-2.5 rounded border border-border/80 bg-surface">
                    <p className="text-[10px] font-mono text-text-muted uppercase">Deal Potential</p>
                    <p className="text-xs font-bold text-text-primary mt-0.5">{currentStep.metrics.pipelinePotential}</p>
                  </div>
                  <div className="p-2.5 rounded border border-border/80 bg-surface">
                    <p className="text-[10px] font-mono text-text-muted uppercase">Outreach Calls</p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {currentStep.metrics.completedCalls} Logged
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between text-xs text-text-muted">
                <span className="font-mono text-[11px]">
                  Step {currentStepIndex + 1} of {relaySteps.length}
                </span>
                <button
                  onClick={() => {
                    setCurrentStepIndex((prev) => (prev + 1) % relaySteps.length);
                    setIsPlaying(false);
                  }}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <span>Advance State</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Realistic Workspace Lead Dossier UI (7 cols) */}
            <div className="lg:col-span-7 p-6 bg-surface flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-5"
                >
                  {/* Lead Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-text-primary">
                          {currentStep.leadData.companyName}
                        </h4>
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                          {currentStep.leadData.priority} PRIORITY
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        {currentStep.leadData.industry} · {currentStep.leadData.niche}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-sm text-[11px] font-bold self-start sm:self-center border ${
                        currentStep.statusBadge.variant === "success"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                          : currentStep.statusBadge.variant === "primary"
                          ? "bg-primary/10 text-primary border-primary/30"
                          : currentStep.statusBadge.variant === "info"
                          ? "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {currentStep.statusBadge.label}
                    </span>
                  </div>

                  {/* Contact Intelligence & Ownership */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded border border-border bg-surface-subtle/30 space-y-1">
                      <p className="text-[10px] font-mono uppercase text-text-muted">Verified Decision Maker</p>
                      <p className="text-xs font-bold text-text-primary">{currentStep.leadData.contactName}</p>
                      <p className="text-[11px] text-text-secondary">{currentStep.leadData.contactRole}</p>
                      <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-text-muted">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-primary" />
                          {currentStep.leadData.phone}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">
                          ✓ {currentStep.leadData.phoneType}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded border border-border bg-surface-subtle/30 space-y-1">
                      <p className="text-[10px] font-mono uppercase text-text-muted">Assigned Ownership</p>
                      <p className="text-xs font-bold text-text-primary">{currentStep.leadData.assignedTo}</p>
                      <p className="text-[11px] text-text-secondary">{currentStep.leadData.assignedRole}</p>
                      <div className="pt-2 flex items-center gap-1.5 text-[10px] text-text-muted font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Clearance: Active SDR Committee
                      </div>
                    </div>
                  </div>

                  {/* Contextual Operation Module */}
                  {currentStep.leadData.activeCallNote && (
                    <div className="p-3.5 rounded border border-primary/20 bg-primary/[0.03] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-primary flex items-center gap-1.5">
                          <PhoneCall className="h-3.5 w-3.5" />
                          Call Outcome & Discussion Note
                        </span>
                        <span className="text-[10px] font-mono text-text-muted">Recorded: 11:24 AM</span>
                      </div>
                      <p className="text-xs text-text-primary leading-relaxed pt-1">
                        &quot;{currentStep.leadData.activeCallNote}&quot;
                      </p>
                    </div>
                  )}

                  {currentStep.leadData.followUpDue && (
                    <div className="p-3 rounded border border-amber-500/30 bg-amber-500/[0.04] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span className="font-semibold text-amber-900 dark:text-amber-300">Next Action Due:</span>
                        <span className="text-text-primary">{currentStep.leadData.followUpDue}</span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-600 font-bold uppercase">Locked</span>
                    </div>
                  )}

                  {currentStep.leadData.commitmentValue && (
                    <div className="p-3.5 rounded border border-emerald-500/30 bg-emerald-500/[0.04] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                          <Award className="h-3.5 w-3.5" />
                          Corporate Commitment Ratified
                        </span>
                        <p className="text-sm font-bold text-text-primary mt-0.5">
                          {currentStep.leadData.commitmentTier}
                        </p>
                      </div>
                      <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
                        {currentStep.leadData.commitmentValue}
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
