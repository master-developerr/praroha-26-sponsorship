"use client";

import React, { createContext, useContext, useState } from "react";
import dynamic from "next/dynamic";
import { Id } from "@/convex/_generated/dataModel";
import { CompanyContact, ContactVerificationLevel, LeadStage, PhoneType, PriorityLevel, QuickCallOutcome } from "@/types";
import { Dialog } from "@/components/ui/dialog";

// Dynamically code-split heavy overlays so initial /workspace load is instant
const CompanyDossierDrawer = dynamic(
  () => import("@/components/admin/CompanyDossierDrawer").then((mod) => mod.CompanyDossierDrawer),
  { ssr: false }
);

const CallModeOverlay = dynamic(
  () => import("@/components/volunteer/CallModeOverlay").then((mod) => mod.CallModeOverlay),
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
}

interface WorkspaceLead {
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

  // Call Mode & Debrief state
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
    const contact = lead.primaryContact || (lead.contacts && (lead.contacts.find((item) => item.isPrimary) || lead.contacts[0]));
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
            phone: contact.phone || "",
            phoneType: contact.phoneType || "unknown",
            contactVerification: contact.contactVerification || "UNVERIFIED",
            email: contact.email,
          }
        : lead.contactName
          ? {
              contactName: lead.contactName,
              designation: lead.contactDesignation || lead.designation || "",
              phone: lead.phone || "",
              phoneType: lead.phoneType || "unknown",
              contactVerification: lead.contactVerification || "UNVERIFIED",
              email: lead.email || undefined,
            }
          : null,
    };
  };

  const startCallMode = (lead: WorkspaceLeadInput) => {
    setCallLead(normalizeLead(lead));
    setIsCallModeOpen(true);
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
          lead={callLead}
          initialOutcome={debriefCallData.outcome}
          durationSeconds={debriefCallData.durationSeconds}
          startedAt={debriefCallData.startedAt}
          endedAt={debriefCallData.endedAt}
          onClose={() => {
            setIsDebriefModalOpen(false);
            setCallLead(null);
          }}
          onSuccess={() => {
            setIsDebriefModalOpen(false);
            setCallLead(null);
          }}
        />
      )}

      {/* PRAROHA'26 Event Info & Pitch Deliverables Modal: Loaded on demand */}
      {isEventInfoOpen && (
        <EventInfoModal
          isOpen={isEventInfoOpen}
          onClose={() => setIsEventInfoOpen(false)}
        />
      )}

      {/* Real-Time Honors Leaderboard Podium Modal: Loaded on demand */}
      {isLeaderboardOpen && (
        <Dialog
          isOpen={isLeaderboardOpen}
          onClose={() => setIsLeaderboardOpen(false)}
          title="Outreach Leaderboard & Points"
          maxWidth="lg"
        >
          <div className="p-4 max-h-[80vh] overflow-y-auto">
            <LeaderboardPodium />
          </div>
        </Dialog>
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
