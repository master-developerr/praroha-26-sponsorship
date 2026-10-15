"use client";

import React, { createContext, useContext, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { QuickCallOutcome } from "@/types";
import { Dialog } from "@/components/ui/dialog";
import { CallModeOverlay } from "@/components/volunteer/CallModeOverlay";
import { CallReportModal } from "@/components/volunteer/CallReportModal";
import { CompanyDossierDrawer } from "@/components/admin/CompanyDossierDrawer";
import { EventInfoModal } from "@/components/volunteer/EventInfoModal";
import { LeaderboardPodium } from "@/components/volunteer/LeaderboardPodium";

interface WorkspaceContextType {
  openCompanyDossier: (companyId: Id<"companies">) => void;
  closeCompanyDossier: () => void;
  startCallMode: (lead: any) => void;
  openDebriefModal: (lead: any, callData?: any) => void;
  openEventInfo: () => void;
  openLeaderboard: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<Id<"companies"> | null>(null);
  const [isEventInfoOpen, setIsEventInfoOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Call Mode & Debrief state
  const [callLead, setCallLead] = useState<any | null>(null);
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
    startedAt: Date.now(),
    endedAt: Date.now(),
  });

  const openCompanyDossier = (companyId: Id<"companies">) => {
    setSelectedCompanyId(companyId);
  };

  const closeCompanyDossier = () => {
    setSelectedCompanyId(null);
  };

  const normalizeLead = (lead: any) => {
    if (!lead) return null;
    return {
      ...lead,
      _id: lead._id || lead.companyId,
      companyName: lead.companyName || "",
      industry: lead.industry || "",
      niche: lead.niche || "",
      priority: lead.priority || "Normal",
      leadStatus: lead.leadStatus || "CONTACTED",
      primaryContact:
        lead.primaryContact ||
        (lead.contacts
          ? lead.contacts.find((c: any) => c.isPrimary) || lead.contacts[0]
          : null) ||
        (lead.contactName
          ? {
              contactName: lead.contactName,
              designation: lead.contactDesignation || lead.designation || "",
              phone: lead.phone || "",
              phoneType: lead.phoneType || "unknown",
              contactVerification: lead.contactVerification || "UNVERIFIED",
              email: lead.email || undefined,
            }
          : null),
    };
  };

  const startCallMode = (lead: any) => {
    setCallLead(normalizeLead(lead));
    setIsCallModeOpen(true);
  };

  const openDebriefModal = (lead: any, callData?: any) => {
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

      {/* Slide-over Company & Contact Dossier Drawer */}
      <CompanyDossierDrawer
        companyId={selectedCompanyId}
        isOpen={Boolean(selectedCompanyId)}
        onClose={closeCompanyDossier}
        onStartCall={startCallMode}
      />

      {/* Live Minimal In-Call Stopwatch & Quick Outcome Overlay */}
      {callLead && (
        <CallModeOverlay
          isOpen={isCallModeOpen}
          lead={callLead}
          onSelectOutcome={handleCallModeOutcomeSelected}
          onClose={() => setIsCallModeOpen(false)}
        />
      )}

      {/* Qualitative Call Debrief Modal with Voice Recording & Transcription */}
      {callLead && (
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

      {/* PRAROHA'26 Event Info & Pitch Deliverables Modal */}
      <EventInfoModal
        isOpen={isEventInfoOpen}
        onClose={() => setIsEventInfoOpen(false)}
      />

      {/* Real-Time Honors Leaderboard Podium Modal */}
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
