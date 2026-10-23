"use client";

import React, { createContext, useContext, useState } from "react";
import dynamic from "next/dynamic";
import { Id } from "@/convex/_generated/dataModel";
import { CompanyContact, ContactVerificationLevel, LeadStage, PhoneType, PriorityLevel, QuickCallOutcome } from "@/types";

// Dynamically code-split heavy overlays so initial /workspace load is instant
const CompanyDossierDrawer = dynamic(
  () => import("@/components/admin/CompanyDossierDrawer").then((mod) => mod.CompanyDossierDrawer),
  { ssr: false }
);

const CallModeOverlay = dynamic(
  () => import("@/components/volunteer/CallModeOverlay").then((mod) => mod.CallModeOverlay),
  { ssr: false }
);

const CallConfirmationDialog = dynamic(
  () => import("@/components/volunteer/CallConfirmationDialog").then((mod) => mod.CallConfirmationDialog),
  { ssr: false }
);

const SelectLeadToCallModal = dynamic(
  () => import("@/components/volunteer/SelectLeadToCallModal").then((mod) => mod.SelectLeadToCallModal),
  { ssr: false }
);

const CallReportModal = dynamic(
  () => import("@/components/volunteer/CallReportModal").then((mod) => mod.CallReportModal),
  { ssr: false }
);

const EventInfoModal = dynamic(
  () => import("@/components/volunteer/EventInfoModal").then((mod) => mod.EventInfoModal),
  { ssr: false }
);

const LeaderboardPodium = dynamic(
  () => import("@/components/volunteer/LeaderboardPodium").then((mod) => mod.LeaderboardPodium),
  { ssr: false }
);

interface WorkspaceContextType {
  openCompanyDossier: (companyId: Id<"companies">) => void;
  closeCompanyDossier: () => void;
  startCallMode: (lead: WorkspaceLeadInput) => void;
  openGlobalLogCall: () => void;
  openDebriefModal: (lead: WorkspaceLeadInput, callData?: CallData) => void;
  openEventInfo: () => void;
  openLeaderboard: () => void;
}

export interface WorkspaceLeadInput {
  _id?: Id<"companies">;
  companyId?: Id<"companies">;
  companyName?: string;
  industry?: string;
  niche?: string;
  priority?: PriorityLevel;
  leadStatus?: LeadStage;
  location?: string;
  keralaPresence?: string;
  sponsorshipHistory?: string;
  whyGoodLead?: string;
  whyCompanyBenefits?: string;
  alternativeSupport?: string;
  phone?: string;
  phoneType?: PhoneType;
  contactName?: string;
  contactDesignation?: string;
  designation?: string;
  contactVerification?: ContactVerificationLevel;
  email?: string;
  primaryContact?: Partial<CompanyContact> | null;
  contacts?: CompanyContact[];
  isAssignedToCurrentUser?: boolean;
  assignedVolunteerName?: string;
}

export interface WorkspaceLead {
  _id: Id<"companies">;
  companyName: string;
  industry: string;
  niche: string;
  priority: PriorityLevel;
  leadStatus: LeadStage;
  location?: string;
  keralaPresence?: string;
  sponsorshipHistory?: string;
  whyGoodLead?: string;
  whyCompanyBenefits?: string;
  alternativeSupport?: string;
  primaryContact: {
    contactName: string;
    designation: string;
    phone: string;
    phoneType: PhoneType;
    contactVerification: ContactVerificationLevel;
    email?: string;
  } | null;
  isAssignedToCurrentUser?: boolean;
  assignedVolunteerName?: string;
}

interface CallData {
  outcome: QuickCallOutcome;
  durationSeconds: number;
  startedAt: number;
  endedAt: number;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<Id<"companies"> | null>(null);
  const [isEventInfoOpen, setIsEventInfoOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Call Confirmation State (Pre-Call Verification Gate)
  const [isCallConfirmationOpen, setIsCallConfirmationOpen] = useState(false);
  const [pendingCallLead, setPendingCallLead] = useState<WorkspaceLead | null>(null);

  // Global "Select Lead to Call" Modal
  const [isSelectLeadModalOpen, setIsSelectLeadModalOpen] = useState(false);

  // Active Call Mode & Debrief state
  const [callLead, setCallLead] = useState<WorkspaceLead | null>(null);
  const [isCallModeOpen, setIsCallModeOpen] = useState(false);
  const [isDebriefModalOpen, setIsDebriefModalOpen] = useState(false);
  const [debriefCallData, setDebriefCallData] = useState<{
    outcome: QuickCallOutcome;
    durationSeconds: number;
    startedAt: number;
    endedAt: number;
  }>({
    outcome: "Interested",
    durationSeconds: 0,
    startedAt: 0,
    endedAt: 0,
  });

  const openCompanyDossier = (companyId: Id<"companies">) => {
    setSelectedCompanyId(companyId);
  };

  const closeCompanyDossier = () => {
    setSelectedCompanyId(null);
  };

  const normalizeLead = (lead: WorkspaceLeadInput | null): WorkspaceLead | null => {
    if (!lead) return null;
    const companyId = lead._id || lead.companyId;
    if (!companyId) return null;
    const contact =
      lead.primaryContact ||
      (lead.contacts && (lead.contacts.find((item) => item.isPrimary) || lead.contacts[0]));

    const phone = (contact?.phone || lead.phone || "").trim();

    return {
      _id: companyId,
      companyName: lead.companyName || "",
      industry: lead.industry || "",
      niche: lead.niche || "",
      priority: lead.priority || "Normal",
      leadStatus: lead.leadStatus || "CONTACTED",
      location: lead.location,
      keralaPresence: lead.keralaPresence,
      sponsorshipHistory: lead.sponsorshipHistory,
      whyGoodLead: lead.whyGoodLead,
      whyCompanyBenefits: lead.whyCompanyBenefits,
      alternativeSupport: lead.alternativeSupport,
      primaryContact: contact
        ? {
            contactName: contact.contactName || "",
            designation: contact.designation || "",
            phone,
            phoneType: contact.phoneType || "unknown",
            contactVerification: contact.contactVerification || "UNVERIFIED",
            email: contact.email,
          }
        : lead.contactName || phone
          ? {
              contactName: lead.contactName || "Main Switchboard / Officer",
              designation: lead.contactDesignation || lead.designation || "Corporate Contact",
              phone,
              phoneType: lead.phoneType || "unknown",
              contactVerification: lead.contactVerification || "UNVERIFIED",
              email: lead.email || undefined,
            }
          : null,
      isAssignedToCurrentUser: lead.isAssignedToCurrentUser,
      assignedVolunteerName: lead.assignedVolunteerName,
    };
  };

  /**
   * Pre-Call Validation & Gate:
   * NEVER opens CallMode directly. Instead validates contact and presents CallConfirmationDialog.
   */
  const startCallMode = (leadInput: WorkspaceLeadInput) => {
    const normalized = normalizeLead(leadInput);
    if (!normalized) {
      alert("Call Error: Invalid lead data. Please select an assigned lead.");
      return;
    }

    const phone = normalized.primaryContact?.phone?.trim();
    if (!phone) {
      alert(
        `No contact available: "${normalized.companyName}" does not have a valid phone number recorded. Please add or verify a contact in the dossier first.`
      );
      return;
    }

    // Set pending confirmation state
    setPendingCallLead(normalized);
    setIsCallConfirmationOpen(true);
  };

  /**
   * Confirmed Call Action from CallConfirmationDialog:
   * Transfers verified lead into active CallModeOverlay.
   */
  const handleConfirmCall = () => {
    if (!pendingCallLead) return;
    setCallLead(pendingCallLead);
    setIsCallConfirmationOpen(false);
    setIsCallModeOpen(true);
  };

  /**
   * Context-Aware Global "Log a Call" Action from Top Navbar:
   * Never dials random or stale numbers. Opens controlled selection interface if no lead is active.
   */
  const openGlobalLogCall = () => {
    // If a dossier is currently open, we cannot assume the user wants to call without confirming.
    // Instead, open the controlled lead selector to let them pick or verify.
    setIsSelectLeadModalOpen(true);
  };

  const openDebriefModal = (lead: WorkspaceLeadInput, callData?: CallData) => {
    setCallLead(normalizeLead(lead));
    if (callData) {
      setDebriefCallData(callData);
    }
    setIsDebriefModalOpen(true);
  };

  const handleCallModeOutcomeSelected = (
    outcome: QuickCallOutcome,
    durationSeconds: number,
    startedAt: number,
    endedAt: number
  ) => {
    setIsCallModeOpen(false);
    setDebriefCallData({
      outcome,
      durationSeconds,
      startedAt,
      endedAt,
    });
    setIsDebriefModalOpen(true);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        openCompanyDossier,
        closeCompanyDossier,
        startCallMode,
        openGlobalLogCall,
        openDebriefModal,
        openEventInfo: () => setIsEventInfoOpen(true),
        openLeaderboard: () => setIsLeaderboardOpen(true),
      }}
    >
      {children}

      {/* Slide-over Company & Contact Dossier Drawer: Loaded on demand */}
      {selectedCompanyId && (
        <CompanyDossierDrawer
          companyId={selectedCompanyId}
          isOpen={Boolean(selectedCompanyId)}
          onClose={closeCompanyDossier}
          onStartCall={startCallMode}
        />
      )}

      {/* Context-Aware Global "Select Lead to Call" Interface: Loaded on demand */}
      {isSelectLeadModalOpen && (
        <SelectLeadToCallModal
          isOpen={isSelectLeadModalOpen}
          onClose={() => setIsSelectLeadModalOpen(false)}
          onSelectLead={(lead) => startCallMode(lead)}
        />
      )}

      {/* Lightweight Pre-Call Confirmation Modal: Validates WHO, Company, and Phone before dialing */}
      {isCallConfirmationOpen && pendingCallLead && pendingCallLead.primaryContact && (
        <CallConfirmationDialog
          isOpen={isCallConfirmationOpen}
          onClose={() => {
            setIsCallConfirmationOpen(false);
            setPendingCallLead(null);
          }}
          onConfirm={handleConfirmCall}
          data={{
            companyName: pendingCallLead.companyName,
            industry: pendingCallLead.industry,
            contactName: pendingCallLead.primaryContact.contactName,
            designation: pendingCallLead.primaryContact.designation,
            phone: pendingCallLead.primaryContact.phone,
            phoneType: pendingCallLead.primaryContact.phoneType,
            contactVerification: pendingCallLead.primaryContact.contactVerification,
            isAssignedToCurrentUser: pendingCallLead.isAssignedToCurrentUser,
            assignedVolunteerName: pendingCallLead.assignedVolunteerName,
          }}
        />
      )}

      {/* Live Minimal In-Call Stopwatch & Quick Outcome Overlay: Loaded on demand */}
      {callLead && isCallModeOpen && (
        <CallModeOverlay
          isOpen={isCallModeOpen}
          lead={callLead}
          onSelectOutcome={handleCallModeOutcomeSelected}
          onClose={() => setIsCallModeOpen(false)}
        />
      )}

      {/* Qualitative Call Debrief Modal with Voice Recording & Transcription: Loaded on demand */}
      {callLead && isDebriefModalOpen && (
        <CallReportModal
          isOpen={isDebriefModalOpen}
          onClose={() => {
            setIsDebriefModalOpen(false);
            setCallLead(null);
          }}
          lead={callLead}
          initialOutcome={debriefCallData.outcome}
          durationSeconds={debriefCallData.durationSeconds}
          startedAt={debriefCallData.startedAt}
          endedAt={debriefCallData.endedAt}
        />
      )}

      {/* PRAROHA'26 Deliverables & Demographic Deck: Loaded on demand */}
      {isEventInfoOpen && (
        <EventInfoModal
          isOpen={isEventInfoOpen}
          onClose={() => setIsEventInfoOpen(false)}
        />
      )}

      {/* Live Gamification Leaderboard Podium Drawer: Loaded on demand */}
      {isLeaderboardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-surface border border-border rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <LeaderboardPodium onClose={() => setIsLeaderboardOpen(false)} />
          </div>
        </div>
      )}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
