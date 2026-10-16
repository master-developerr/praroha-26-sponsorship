"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import {
  Clock,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Phone,
  Video,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  X,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CalTeamEvent {
  id: string;
  title: string;
  durationMinutes: number;
  schedulingType: "Round robin" | "Collective" | "Exclusive" | "Logistics team" | "Instant dispatch";
  description: string;
  members: { name: string; role: string; avatarBg: string }[];
  location: "Google Meet" | "Phone Call" | "Campus Boardroom";
}

const DEFAULT_CAL_EVENTS: CalTeamEvent[] = [
  {
    id: "evt-intro",
    title: "15m Corporate Discovery Call",
    durationMinutes: 15,
    schedulingType: "Round robin",
    description: "Fast introductory briefing on PRAROHA'26 festival reach (3,000+ engineers) and sponsor requirements.",
    members: [
      { name: "Rahul S.", role: "SDR Lead", avatarBg: "bg-teal-600" },
      { name: "Ananya M.", role: "Corporate Outreach", avatarBg: "bg-emerald-600" },
      { name: "Kiran P.", role: "Volunteer", avatarBg: "bg-sky-600" },
    ],
    location: "Phone Call",
  },
  {
    id: "evt-proposal",
    title: "30m Proposal & Deliverable Customization",
    durationMinutes: 30,
    schedulingType: "Collective",
    description: "Detailed walkthrough of stall spaces, hackathon challenge naming, and mainstage branding deliverables.",
    members: [
      { name: "Rahul S.", role: "SDR Lead", avatarBg: "bg-teal-600" },
      { name: "Farhan A.", role: "Deliverables Head", avatarBg: "bg-indigo-600" },
    ],
    location: "Google Meet",
  },
  {
    id: "evt-mou",
    title: "45m Executive MoU & Signing Authority",
    durationMinutes: 45,
    schedulingType: "Exclusive",
    description: "Core committee legal review, MoU confirmation, and formal commitment ratification by Sponsorship Head.",
    members: [
      { name: "Adil M.", role: "Sponsorship Head", avatarBg: "bg-amber-600" },
    ],
    location: "Google Meet",
  },
  {
    id: "evt-inkind",
    title: "20m In-Kind & Non-Cash Partnership Alignment",
    durationMinutes: 20,
    schedulingType: "Logistics team",
    description: "Technical logistics alignment for cloud credits, beverage distribution, volunteer kit apparel, or prize gadgets.",
    members: [
      { name: "Sneha V.", role: "In-Kind Coordinator", avatarBg: "bg-purple-600" },
      { name: "Kiran P.", role: "Logistics", avatarBg: "bg-sky-600" },
    ],
    location: "Phone Call",
  },
  {
    id: "evt-callback",
    title: "15m Scheduled Callback & Pipeline Follow-up",
    durationMinutes: 15,
    schedulingType: "Instant dispatch",
    description: "Scheduled check-in with verified company decision-maker following formal proposal dispatch.",
    members: [
      { name: "Ananya M.", role: "Corporate Outreach", avatarBg: "bg-emerald-600" },
      { name: "Rahul S.", role: "SDR Lead", avatarBg: "bg-teal-600" },
    ],
    location: "Phone Call",
  },
];

interface CalTeamSchedulerProps {
  initialLead?: any;
  onBookingComplete?: (details: any) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export function CalTeamScheduler({
  initialLead,
  onBookingComplete,
  onClose,
  isModal = false,
}: CalTeamSchedulerProps) {
  const { user } = useAuthUser();
  const clerkId = user?.id || "";

  // Step state: "list" -> "booking" -> "form" -> "confirmed"
  const [step, setStep] = useState<"list" | "booking" | "form" | "confirmed">("list");
  const [selectedEvent, setSelectedEvent] = useState<CalTeamEvent>(DEFAULT_CAL_EVENTS[0]);

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9, 1)); // October 2026
  const [selectedDate, setSelectedDate] = useState<number>(18); // Default Oct 18
  const [selectedTime, setSelectedTime] = useState<string>("10:30 AM");
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");
  const [selectedDuration, setSelectedDuration] = useState<number>(15);

  // Form State
  const [companyName, setCompanyName] = useState<string>(initialLead?.companyName || "");
  const [contactName, setContactName] = useState<string>(
    initialLead?.primaryContact?.contactName || initialLead?.contactName || ""
  );
  const [contactPhone, setContactPhone] = useState<string>(
    initialLead?.primaryContact?.phone || initialLead?.phone || ""
  );
  const [contactEmail, setContactEmail] = useState<string>(
    initialLead?.primaryContact?.email || initialLead?.email || ""
  );
  const [meetingAgenda, setMeetingAgenda] = useState<string>(
    `Discussion regarding PRAROHA'26 sponsorship tier partnership and festival deliverables.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  // Convex schedule follow-up mutation
  const scheduleFollowUpMutation = useMutation(api.followUps.scheduleFollowUp);
  const assignedLeads = useQuery(
    api.assignments.getMyAssignedLeads,
    clerkId ? { volunteerClerkId: clerkId, tab: "all" } : "skip"
  );

  const availableSlots = [
    "09:30 AM",
    "10:30 AM",
    "11:45 AM",
    "02:00 PM",
    "03:15 PM",
    "04:30 PM",
    "05:15 PM",
  ];

  const formatSlotTime = (time12: string) => {
    if (timeFormat === "12h") return time12;
    // Simple 24h converter for preview
    const [time, modifier] = time12.split(" ");
    let [hours, minutes] = time.split(":");
    let h = parseInt(hours, 10);
    if (modifier === "PM" && h < 12) h += 12;
    if (modifier === "AM" && h === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${minutes}`;
  };

  const handleSelectEvent = (evt: CalTeamEvent) => {
    setSelectedEvent(evt);
    setSelectedDuration(evt.durationMinutes);
    setStep("booking");
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim()) return;

    setIsSubmitting(true);
    try {
      // Find matching company from assigned leads if available
      const matchingLead = (assignedLeads || []).find(
        (l) => l.companyName.toLowerCase() === companyName.trim().toLowerCase()
      );
      const companyId = matchingLead?._id || initialLead?._id;

      if (clerkId && companyId) {
        // Construct scheduled date timestamp
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const scheduledDueDate = new Date(year, month, selectedDate, 10, 30).getTime();

        const res = await scheduleFollowUpMutation({
          volunteerClerkId: clerkId,
          companyId,
          dueDate: scheduledDueDate,
          priority: "High",
          notes: `[Cal.com Meeting: ${selectedEvent.title}] Contact: ${contactName} (${contactPhone}). Agenda: ${meetingAgenda}`,
        });

        if (res?.followUpId) {
          setBookingSuccessId(res.followUpId);
        }
      }

      setStep("confirmed");
      if (onBookingComplete) {
        onBookingComplete({
          event: selectedEvent,
          date: `Oct ${selectedDate}, 2026`,
          time: selectedTime,
          companyName,
          contactName,
          contactPhone,
          contactEmail,
        });
      }
    } catch (err) {
      console.error("Booking error:", err);
      // Fallback to confirmed UI
      setStep("confirmed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Days in October 2026: 31 days. Oct 1, 2026 was a Thursday (index 4)
  const daysInMonth = 31;
  const startDayOfWeek = 4; // Thursday

  return (
    <div className={`w-full max-w-4xl mx-auto ${isModal ? "" : "py-6 px-4"}`}>
      {/* ================= STEP 1: CAL.COM TEAM EVENT DIRECTORY ================= */}
      {step === "list" && (
        <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-border-subtle bg-surface-subtle/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-primary border border-teal-200 dark:border-teal-800/40 text-xl font-black shadow-xs">
                P26
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                    Team
                  </h2>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40 text-[10px] font-bold px-2 py-0.2">
                    ACTIVE SESSIONS
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                  The team coordinating corporate outreach and brand partnerships for PRAROHA'26.
                </p>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="self-start sm:self-center p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Bordered Card List of Event Types */}
          <div className="divide-y divide-border-subtle">
            {DEFAULT_CAL_EVENTS.map((evt) => (
              <div
                key={evt.id}
                onClick={() => handleSelectEvent(evt)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 hover:bg-surface-subtle/60 transition-colors cursor-pointer"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {evt.title}
                    </h3>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                    {evt.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                  {/* Duration chip */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary bg-surface-subtle px-2 py-1 rounded-md border border-border-subtle">
                    <Clock className="h-3 w-3 text-text-muted" />
                    {evt.durationMinutes}m
                  </span>

                  {/* Scheduling type chip */}
                  <span className="text-[11px] font-semibold text-text-secondary bg-surface-subtle px-2 py-1 rounded-md border border-border-subtle capitalize">
                    {evt.schedulingType}
                  </span>

                  {/* Member Avatar Stack */}
                  <div className="flex items-center -space-x-2 overflow-hidden pl-1">
                    {evt.members.map((m, idx) => (
                      <div
                        key={idx}
                        title={`${m.name} (${m.role})`}
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white border-2 border-surface shadow-2xs ${m.avatarBg}`}
                      >
                        {m.name[0]}
                      </div>
                    ))}
                  </div>

                  <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all ml-1" />
                </div>
              </div>
            ))}
          </div>

          {/* OR Divider & Individual Team Members */}
          <div className="p-4 sm:p-6 bg-surface-subtle/30 border-t border-border-subtle">
            <div className="relative flex items-center justify-center mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-subtle"></div>
              </div>
              <div className="relative bg-surface px-3 text-[11px] font-bold uppercase tracking-wider text-text-muted rounded-full border border-border-subtle">
                OR
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs font-semibold text-text-primary">
                Book a specific committee lead directly
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">
                Escalate corporate sponsor decisions directly to the Civil Engineering core committee at CUSAT.
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {[
                  { name: "Adil M. (Sponsorship Head)", action: "Book Head" },
                  { name: "Rahul S. (Outreach SDR)", action: "Book SDR" },
                  { name: "Sneha V. (In-Kind Lead)", action: "Book In-Kind" },
                ].map((ind, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectEvent(DEFAULT_CAL_EVENTS[i === 0 ? 2 : 0])}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-medium text-text-secondary hover:text-text-primary hover:border-primary/40 transition-colors cursor-pointer shadow-2xs"
                  >
                    <User className="h-3 w-3 text-text-muted" />
                    <span>{ind.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 2: CAL.COM 3-COLUMN BOOKING WORKSPACE ================= */}
      {step === "booking" && (
        <div className="rounded-2xl border border-border bg-surface shadow-xl overflow-hidden animate-in fade-in">
          {/* Top Return Strip */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-surface-subtle/40 text-xs">
            <button
              onClick={() => setStep("list")}
              className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary font-medium cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to all event types</span>
            </button>
            <span className="text-[11px] text-text-muted font-mono">Cal.com Booking Surface</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border-subtle">
            {/* PANE 1: Event Details & Metadata (4 cols) */}
            <div className="lg:col-span-4 p-6 sm:p-7 space-y-4 flex flex-col justify-between bg-surface">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/60 text-primary text-xs font-black">
                    P26
                  </div>
                  <span className="text-xs font-bold text-text-secondary">PRAROHA'26 Committee</span>
                </div>

                <div>
                  <h2 className="text-xl font-bold tracking-tight text-text-primary">
                    {selectedEvent.title}
                  </h2>
                  <div className="mt-2 flex items-center gap-2 text-xs font-medium text-text-secondary">
                    <Clock className="h-3.5 w-3.5 text-text-muted" />
                    <span>{selectedDuration} mins</span>
                    <span>•</span>
                    {selectedEvent.location === "Google Meet" ? (
                      <span className="flex items-center gap-1">
                        <Video className="h-3.5 w-3.5 text-text-muted" /> Google Meet
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-text-muted" /> Official Call
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed pt-1">
                  {selectedEvent.description}
                </p>

                {/* Team member avatars */}
                <div className="pt-2 border-t border-border-subtle space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                    Assigned Committee Members
                  </span>
                  <div className="space-y-1.5">
                    {selectedEvent.members.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${m.avatarBg}`}
                        >
                          {m.name[0]}
                        </div>
                        <span className="font-semibold text-text-primary">{m.name}</span>
                        <span className="text-[11px] text-text-muted">({m.role})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Event date badge */}
              <div className="pt-4 border-t border-border-subtle text-[11px] text-text-muted">
                <span>Festival Dates: Dec 04–05, 2026 • SOE CUSAT</span>
              </div>
            </div>

            {/* PANE 2: Cal.com Month Calendar Grid (5 cols) */}
            <div className="lg:col-span-5 p-5 sm:p-6 space-y-4 bg-surface">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-text-primary">October 2026</span>
                <div className="flex items-center gap-1">
                  <button
                    disabled
                    aria-label="Previous month"
                    className="p-1 rounded-md text-text-muted/40 cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Next month"
                    className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-text-muted uppercase">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* 59x59px Cal.com Day Tiles */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {/* Empty offset days for Thursday start */}
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10 sm:h-12 w-full" />
                ))}

                {/* Days of Month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isPast = dayNum < 16;
                  const isToday = dayNum === 16;
                  const isSelected = selectedDate === dayNum;

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      disabled={isPast}
                      onClick={() => setSelectedDate(dayNum)}
                      className={`relative h-10 sm:h-12 w-full rounded-lg font-medium transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? "bg-[#292929] dark:bg-primary text-white font-bold shadow-xs"
                          : isPast
                          ? "text-text-muted/40 cursor-not-allowed font-light"
                          : "bg-zinc-100/70 dark:bg-surface-subtle hover:bg-zinc-200/80 dark:hover:bg-surface-subtle/80 text-text-primary font-medium"
                      }`}
                    >
                      <span>{dayNum}</span>
                      {isToday && (
                        <span
                          className={`absolute bottom-1 h-1 w-1 rounded-full ${
                            isSelected ? "bg-white" : "bg-primary"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Timezone line */}
              <div className="pt-2 text-[11px] text-text-muted flex items-center justify-between">
                <span>Timezone: Asia/Kolkata (IST, GMT+5:30)</span>
                <span className="font-semibold text-text-secondary">Selected: Oct {selectedDate}</span>
              </div>
            </div>

            {/* PANE 3: Scrolling Time Slots (3 cols) */}
            <div className="lg:col-span-3 p-5 sm:p-6 space-y-3 flex flex-col justify-between bg-surface-subtle/20">
              <div className="space-y-3">
                {/* Format toggles */}
                <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
                  <span className="text-xs font-bold text-text-primary">Available Slots</span>
                  <div className="inline-flex rounded-md border border-border p-0.5 bg-surface text-[10px]">
                    <button
                      onClick={() => setTimeFormat("12h")}
                      className={`px-1.5 py-0.5 rounded ${
                        timeFormat === "12h" ? "bg-zinc-200 dark:bg-zinc-700 font-bold" : "text-text-muted"
                      }`}
                    >
                      12h
                    </button>
                    <button
                      onClick={() => setTimeFormat("24h")}
                      className={`px-1.5 py-0.5 rounded ${
                        timeFormat === "24h" ? "bg-zinc-200 dark:bg-zinc-700 font-bold" : "text-text-muted"
                      }`}
                    >
                      24h
                    </button>
                  </div>
                </div>

                {/* 36px Slot Buttons */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {availableSlots.map((slot) => {
                    const isPicked = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`w-full h-9 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                          isPicked
                            ? "border-primary bg-primary text-white shadow-xs"
                            : "border-border bg-surface text-text-primary hover:border-text-secondary hover:bg-surface-subtle"
                        }`}
                      >
                        {formatSlotTime(slot)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advance to Form Button */}
              <div className="pt-3 border-t border-border-subtle">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setStep("form")}
                  className="w-full text-xs font-bold bg-[#292929] dark:bg-primary hover:bg-black text-white h-9"
                >
                  Next: Enter Details
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 3: CAL.COM BOOKING FORM ================= */}
      {step === "form" && (
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xl max-w-xl mx-auto animate-in fade-in space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Confirm Corporate Pitch Session</h2>
              <p className="text-xs text-text-muted">
                {selectedEvent.title} • Oct {selectedDate}, 2026 at {selectedTime}
              </p>
            </div>
            <button
              onClick={() => setStep("booking")}
              className="text-xs text-text-muted hover:text-text-primary font-medium cursor-pointer"
            >
              Change Date
            </button>
          </div>

          <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-text-primary flex items-center justify-between">
                <span>Corporate Sponsor Company *</span>
                {assignedLeads && (
                  <span className="text-[10px] text-text-muted">
                    {assignedLeads.length} assigned leads
                  </span>
                )}
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Vertex Nova Technologies"
                required
                className="w-full h-8 rounded-lg border border-border bg-surface px-3 text-xs text-text-primary focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-text-primary">
                  Decision Maker / Contact Name *
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Ramesh Menon"
                  required
                  className="w-full h-8 rounded-lg border border-border bg-surface px-3 text-xs text-text-primary focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text-primary">Phone Number *</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 98470 12345"
                  required
                  className="w-full h-8 rounded-lg border border-border bg-surface px-3 text-xs text-text-primary focus:outline-hidden focus:ring-1 focus:ring-primary font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-primary">Email Address</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. sponsorships@vertexnova.com"
                className="w-full h-8 rounded-lg border border-border bg-surface px-3 text-xs text-text-primary focus:outline-hidden focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-primary">Meeting Agenda & Deliverable Notes</label>
              <textarea
                rows={3}
                value={meetingAgenda}
                onChange={(e) => setMeetingAgenda(e.target.value)}
                placeholder="Key talking points, package tier interest (Title, Associate), in-kind requests..."
                className="w-full rounded-lg border border-border bg-surface p-2.5 text-xs text-text-primary focus:outline-hidden focus:ring-1 focus:ring-primary leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep("booking")}
                disabled={isSubmitting}
                className="text-xs"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                className="bg-[#292929] dark:bg-primary hover:bg-black text-white font-bold text-xs h-9 px-4"
              >
                {isSubmitting ? "Confirming..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ================= STEP 4: CAL.COM CONFIRMATION SUCCESS ================= */}
      {step === "confirmed" && (
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10 shadow-xl max-w-lg mx-auto text-center space-y-5 animate-in zoom-in-95">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/50 shadow-xs">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Pitch Session Confirmed!
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              A calendar callback invitation has been queued for{" "}
              <strong className="text-text-primary">{companyName}</strong>.
            </p>
          </div>

          {/* Cal.com Summary Card */}
          <div className="rounded-xl border border-border bg-surface-subtle/50 p-4 text-xs text-left space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Event:</span>
              <span className="font-bold text-text-primary">{selectedEvent.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Date & Time:</span>
              <span className="font-semibold text-text-primary">
                Oct {selectedDate}, 2026 at {selectedTime} (IST)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Participant:</span>
              <span className="font-semibold text-text-primary">
                {contactName} {contactPhone ? `(${contactPhone})` : ""}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Location:</span>
              <span className="font-semibold text-primary">{selectedEvent.location}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStep("list");
                if (onClose) onClose();
              }}
              className="w-full sm:w-auto text-xs"
            >
              Done & Return
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setStep("list");
              }}
              className="w-full sm:w-auto text-xs font-bold"
            >
              Book Another Meeting
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
