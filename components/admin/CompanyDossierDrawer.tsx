"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  LeadStatusBadge,
  ContactVerificationBadge,
  PriorityBadge,
  PhoneTypeBadge,
} from "@/components/ui/badge";
import { formatCurrencyINR, formatDate } from "@/lib/utils";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Coins,
  Lightbulb,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Trophy,
  Gift,
  Clock,
  PhoneCall,
  PhoneOff,
  Plus,
  FileText,
  Sparkles,
  UserCheck,
  UserX,
  UserPlus,
  ArrowRightLeft,
  AlertTriangle,
  Lock,
  Tag,
  ChevronRight,
  X,
  Target,
  FileSpreadsheet,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { ConciseTalkingPoints } from "@/components/volunteer/ConciseTalkingPoints";
import { CompanyTimeline } from "@/components/pipeline/CompanyTimeline";
import { CreateProposalModal } from "@/components/pipeline/CreateProposalModal";
import { AssignLeadModal } from "@/components/admin/AssignLeadModal";
import { ReassignLeadModal } from "@/components/admin/ReassignLeadModal";
import { UnassignConfirmationModal } from "@/components/admin/UnassignConfirmationModal";
import {
  CompanyAIAnalysisCard,
  CallPreparationCard,
  AlternativeAskCard,
  LeadPriorityExplainer,
} from "@/components/ai";

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function CompanyDossierDrawer({
  company: propCompany,
  companyId,
  isOpen,
  onClose,
  onStartCall,
}: {
  company?: any | null;
  companyId?: Id<"companies"> | null;
  isOpen: boolean;
  onClose: () => void;
  onStartCall?: (lead: any) => void;
}) {
  const { user, profile, role } = useAuthUser();
  const isAdmin = role === "admin";

  const [activeTab, setActiveTab] = useState<
    "overview" | "prep" | "ai" | "proposals" | "timeline"
  >("overview");
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);

  const contentRef = React.useRef<HTMLDivElement>(null);

  const handleTabChange = (
    newTab: "overview" | "prep" | "ai" | "proposals" | "timeline"
  ) => {
    setActiveTab(newTab);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const targetId = propCompany?._id || companyId;
  const fetchedCompany = useQuery(
    api.companies.getCompanyDetails,
    targetId && !propCompany ? { companyId: targetId } : "skip"
  );
  const company = propCompany || fetchedCompany;

  // Fetch proposals for this company
  const proposals = useQuery(
    api.proposals.getProposalsByCompany,
    company ? { companyId: company._id } : "skip"
  );

  if (!company) return null;

  // Determine active assignment status and ownership
  const activeAssignment = company.activeAssignment;
  const isAssignedToCurrentUser = Boolean(
    (profile && activeAssignment && activeAssignment.volunteerId === profile._id) ||
    (user && activeAssignment?.assignedVolunteer?.clerkId === user.id)
  );
  const assignedVolunteerName =
    activeAssignment?.assignedVolunteer?.name || "Assigned Volunteer";
  const isUnassigned =
    !activeAssignment || company.leadStatus === "UNASSIGNED";

  // Corporate Contacts resolution
  const contacts: any[] = company.contacts || [];
  const primaryContact =
    contacts.find((c: any) => c.isPrimary) || contacts[0] || null;
  const hasPhone = Boolean(primaryContact?.phone && primaryContact.phone.trim());

  // Call permissions resolution
  const canVolunteerCall = isAssignedToCurrentUser || isAdmin;
  const isCallDisabled = isUnassigned || (!canVolunteerCall && !isAdmin) || !hasPhone;

  let callDisabledReason = "";
  if (isUnassigned) {
    callDisabledReason = "Unassigned Lead — Assign to yourself before starting a call.";
  } else if (!canVolunteerCall) {
    callDisabledReason = `Assigned to ${assignedVolunteerName} — Only assigned volunteer can call.`;
  } else if (!hasPhone) {
    callDisabledReason = "No Contact Phone Available — Add or verify phone number.";
  }

  const handleTriggerCall = (specificContact?: any) => {
    if (!onStartCall) return;
    const targetContact = specificContact || primaryContact;
    if (!targetContact || !targetContact.phone) return;

    // Create a normalized lead payload with target contact set as primaryContact
    const callPayload = {
      ...company,
      companyName: company.companyName,
      leadStatus: company.leadStatus,
      primaryContact: targetContact,
      contacts: company.contacts,
      activeAssignment: company.activeAssignment,
    };

    onClose();
    onStartCall(callPayload);
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="5xl"
        hideHeader={true}
        className="h-[94vh] max-h-[94vh] sm:h-[90vh] sm:max-h-[90vh] w-full max-w-4xl lg:max-w-5xl flex flex-col p-0 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
      >
        {/* ==================================================================== */}
        {/* STICKY DOSSIER HEADER (PART 2)                                       */}
        {/* ==================================================================== */}
        <div className="shrink-0 sticky top-0 z-20 border-b border-border bg-surface p-4 sm:px-6 sm:py-4">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1 space-y-1.5">
              {/* Dominant Company Name */}
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary truncate">
                  {company.companyName}
                </h2>
                {company.website && (
                  <a
                    href={
                      company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-text-muted hover:text-primary transition-colors p-1"
                    title={`Visit ${company.website}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* Sector / Category Subtitle */}
              <p className="text-xs font-medium text-text-secondary flex items-center gap-2 flex-wrap">
                <span>{company.industry}</span>
                <span className="text-border-subtle">•</span>
                <span>{company.niche}</span>
                {company.location && (
                  <>
                    <span className="text-border-subtle">•</span>
                    <span className="flex items-center gap-1 text-text-muted">
                      <MapPin className="h-3 w-3" />
                      {company.location}
                    </span>
                  </>
                )}
              </p>

              {/* Status, Assignment & Priority Indicators */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
                {/* Assignment Status */}
                {isAssignedToCurrentUser ? (
                  <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-50/70 dark:bg-emerald-950/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    <UserCheck className="h-3 w-3" />
                    Assigned to You
                  </span>
                ) : activeAssignment ? (
                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                    <Users className="h-3 w-3 text-text-muted" />
                    Assigned: {assignedVolunteerName}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-50/70 dark:bg-amber-950/30 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                    <UserX className="h-3 w-3" />
                    Unassigned
                  </span>
                )}

                {/* Admin Quick Assignment Controls */}
                {isAdmin && (
                  <span className="inline-flex items-center gap-1">
                    {!isUnassigned && activeAssignment ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsReassignModalOpen(true)}
                          className="h-5 text-[10px] px-2 py-0 text-text-primary hover:bg-surface-subtle flex items-center gap-1 border-dashed"
                          title="Reassign lead to another volunteer"
                        >
                          <ArrowRightLeft className="h-2.5 w-2.5 text-primary" />
                          Reassign
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsUnassignModalOpen(true)}
                          className="h-5 text-[10px] px-1.5 py-0 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-1 border-amber-300 dark:border-amber-800/60"
                          title="Unassign lead and return to pool"
                        >
                          <UserX className="h-2.5 w-2.5 text-amber-600" />
                          Unassign
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setIsAssignModalOpen(true)}
                        className="h-5 text-[10px] px-2 py-0 bg-primary text-white hover:bg-primary-hover flex items-center gap-1"
                        title="Assign lead to a volunteer"
                      >
                        <UserPlus className="h-2.5 w-2.5" />
                        Assign Lead
                      </Button>
                    )}
                  </span>
                )}

                <LeadStatusBadge status={company.leadStatus} />
                <PriorityBadge priority={company.priority} />

                {company.leadScore !== undefined && company.leadScore !== null && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-accent-mint px-2 py-0.5 text-[11px] font-mono font-bold text-accent-mint-text">
                    Score: {company.leadScore}
                  </span>
                )}

                <LeadPriorityExplainer company={company} />

                {/* Mobile Target Ask Badge */}
                {(company.recommendedAskMin || company.recommendedAskMax) && (
                  <span className="inline-flex sm:hidden items-center gap-1 rounded-md border border-primary/20 bg-surface-subtle px-2 py-0.5 text-[11px] font-mono font-bold text-primary">
                    Ask:{" "}
                    {company.recommendedAskMin
                      ? formatCurrencyINR(company.recommendedAskMin)
                      : "—"}
                    {" – "}
                    {company.recommendedAskMax
                      ? formatCurrencyINR(company.recommendedAskMax)
                      : "—"}
                  </span>
                )}
              </div>
            </div>

            {/* Target Ask (Desktop) & Close Button */}
            <div className="flex items-start gap-2.5 sm:gap-3 shrink-0">
              {(company.recommendedAskMin || company.recommendedAskMax) && (
                <div className="text-right hidden sm:block p-2 rounded-lg bg-surface-subtle border border-border-subtle">
                  <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider block">
                    Target Ask ({company.recommendedSponsorshipType || "CASH"})
                  </span>
                  <span className="text-sm font-bold font-mono text-primary">
                    {company.recommendedAskMin
                      ? formatCurrencyINR(company.recommendedAskMin)
                      : "—"}{" "}
                    –{" "}
                    {company.recommendedAskMax
                      ? formatCurrencyINR(company.recommendedAskMax)
                      : "—"}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-text-muted hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer border border-transparent hover:border-border"
                aria-label="Close dossier"
                title="Close dossier (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* STICKY DOSSIER NAVIGATION TABS                                       */}
        {/* ==================================================================== */}
        <div className="shrink-0 sticky top-0 z-10 flex border-b border-border bg-surface px-4 sm:px-6 text-xs font-medium overflow-x-auto no-scrollbar gap-1">
          <button
            type="button"
            onClick={() => handleTabChange("overview")}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            Overview & Intelligence
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("prep")}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "prep"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            Call Prep Battlecards
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("ai")}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "ai"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Strategic Dossier
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("proposals")}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "proposals"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Trophy className="h-3.5 w-3.5" />
            Proposals & In-Kind ({proposals?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("timeline")}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "timeline"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            Activity Timeline
          </button>
        </div>

        {/* ==================================================================== */}
        {/* SCROLLABLE DOSSIER CONTENT                                           */}
        {/* ==================================================================== */}
        <div
          ref={contentRef}
          tabIndex={0}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-6 pb-8 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 dossier-scroll"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border-strong) transparent",
          }}
        >
          {/* TAB 1: OVERVIEW & INTELLIGENCE */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* -------------------------------------------------------------- */}
              {/* 01 — COMPANY SNAPSHOT (PART 3)                                */}
              {/* -------------------------------------------------------------- */}
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-1.5">
                  <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    01 · Company Snapshot
                  </h3>
                  <span className="text-[10px] text-text-muted">
                    ID: {company._id}
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-surface p-4 shadow-2xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    <div>
                      <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider block mb-0.5">
                        Location / Headquarter
                      </span>
                      <span className="font-medium text-text-primary flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-text-muted shrink-0" />
                        {company.location || "Not specified"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider block mb-0.5">
                        Industry & Sector
                      </span>
                      <span className="font-medium text-text-primary">
                        {company.industry} — {company.niche}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider block mb-0.5">
                        Company Scale
                      </span>
                      <span className="font-medium text-text-primary flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-text-muted shrink-0" />
                        {company.companySize
                          ? `${company.companySize} employees`
                          : "Scale unknown"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider block mb-0.5">
                        Annual Revenue
                      </span>
                      <span className="font-medium text-text-primary flex items-center gap-1.5">
                        <Coins className="h-3.5 w-3.5 text-text-muted shrink-0" />
                        {company.annualRevenue || "Revenue not disclosed"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider block mb-0.5">
                        Website & Digital
                      </span>
                      {company.website ? (
                        <a
                          href={
                            company.website.startsWith("http")
                              ? company.website
                              : `https://${company.website}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline font-medium flex items-center gap-1 truncate"
                        >
                          <Globe className="h-3.5 w-3.5 text-text-muted shrink-0" />
                          <span className="truncate">{company.website}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-text-muted">No website recorded</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider block mb-0.5">
                        Lead Source & Origin
                      </span>
                      <span className="font-medium text-text-primary flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-text-muted shrink-0" />
                        {company.source || "Manual Ingestion"}
                      </span>
                    </div>
                  </div>

                  {company.keralaPresence && (
                    <div className="mt-3.5 pt-3 border-t border-border-subtle text-xs">
                      <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider block mb-1">
                        Regional Kerala Presence & Footprint
                      </span>
                      <p className="text-text-secondary leading-relaxed bg-surface-subtle/50 p-2.5 rounded-lg border border-border-subtle">
                        {company.keralaPresence}
                      </p>
                    </div>
                  )}

                  {company.sponsorshipHistory && (
                    <div className="mt-3 pt-3 border-t border-border-subtle text-xs">
                      <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider block mb-1">
                        Past Sponsorship History & Evidence
                      </span>
                      <p className="text-text-secondary leading-relaxed">
                        {company.sponsorshipHistory}
                        {company.sponsorshipEvidence && (
                          <span className="block mt-0.5 text-text-muted italic">
                            Evidence: {company.sponsorshipEvidence}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* -------------------------------------------------------------- */}
              {/* 02 — SPONSORSHIP FIT (PART 3)                                  */}
              {/* -------------------------------------------------------------- */}
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-1.5">
                  <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-primary" />
                    02 · Sponsorship Fit & Positioning
                  </h3>
                  <span className="text-[10px] text-text-muted font-mono">
                    Tier Target: {company.recommendedSponsorshipType || "CASH"}
                  </span>
                </div>

                {/* Target Ask and Clean Fit Score Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-surface p-3.5 space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted block">
                      Target Sponsorship Ask ({company.recommendedSponsorshipType || "CASH"})
                    </span>
                    <div className="text-base font-bold font-mono text-primary">
                      {company.recommendedAskMin
                        ? formatCurrencyINR(company.recommendedAskMin)
                        : "—"}{" "}
                      –{" "}
                      {company.recommendedAskMax
                        ? formatCurrencyINR(company.recommendedAskMax)
                        : "—"}
                    </div>
                    {company.alternativeSupport && (
                      <div className="text-[11px] text-text-secondary pt-1 border-t border-border-subtle">
                        <strong className="text-text-primary">Alternative: </strong>
                        {company.alternativeSupport}
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-border bg-surface p-3.5 space-y-1.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted block">
                        Algorithm Fit Score
                      </span>
                      <span className="text-xs font-mono font-bold text-text-primary">
                        {company.leadScore ?? "—"}/100
                      </span>
                    </div>

                    {/* Clean visual fit score gauge */}
                    <div className="space-y-1">
                      <div className="h-2 w-full rounded-full bg-surface-subtle border border-border overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{
                            width: `${Math.min(100, Math.max(0, company.leadScore || 50))}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-text-muted block">
                        Calculated from sector alignment, campus footprint & collegiate spend history
                      </span>
                    </div>
                  </div>
                </div>

                {/* Why Lead Matters & Potential Sponsor Value */}
                {(company.whyGoodLead || company.whyCompanyBenefits) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {company.whyGoodLead && (
                      <div className="rounded-xl border-l-2 border-l-emerald-600 border border-border bg-emerald-50/20 dark:bg-emerald-950/10 p-3.5 space-y-1.5">
                        <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          Why This Lead Matters
                        </span>
                        <p className="text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">
                          {company.whyGoodLead}
                        </p>
                      </div>
                    )}

                    {company.whyCompanyBenefits && (
                      <div className="rounded-xl border-l-2 border-l-sky-600 border border-border bg-sky-50/20 dark:bg-sky-950/10 p-3.5 space-y-1.5">
                        <span className="font-bold text-sky-950 dark:text-sky-200 flex items-center gap-1.5">
                          <Lightbulb className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                          Potential Sponsor Value & ROI
                        </span>
                        <p className="text-sky-900/90 dark:text-sky-200/90 leading-relaxed">
                          {company.whyCompanyBenefits}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* -------------------------------------------------------------- */}
              {/* 03 — AI SPONSORSHIP INTELLIGENCE (PART 3)                      */}
              {/* -------------------------------------------------------------- */}
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-1.5">
                  <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                    03 · AI Sponsorship Intelligence
                  </h3>
                  <span className="text-[10px] text-text-muted">
                    Operational Intelligence Layer
                  </span>
                </div>

                <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-text-primary block">
                        Why this company fits PRAROHA'26
                      </span>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {company.whyGoodLead ||
                          `Strong operational alignment with Civil Engineering and tech-managerial initiatives at SOE CUSAT. Contextual pitch ready for corporate brand teams.`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTabChange("ai")}
                      className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer shrink-0"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      View AI Dossier
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </section>

              {/* -------------------------------------------------------------- */}
              {/* 04 — CONTACTS (PART 3)                                         */}
              {/* -------------------------------------------------------------- */}
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-1.5">
                  <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    04 · Corporate Decision Makers & Contacts ({contacts.length})
                  </h3>
                  <span className="text-[10px] text-text-muted">
                    Zero Blind Calling Policy
                  </span>
                </div>

                {contacts.length > 0 ? (
                  <div className="space-y-2.5">
                    {contacts.map((ct: any) => {
                      const isContactUnverified =
                        ct.contactVerification === "UNVERIFIED";

                      return (
                        <div
                          key={ct._id}
                          className="rounded-xl border border-border bg-surface p-4 text-xs space-y-3 shadow-2xs"
                        >
                          {/* Name, Designation & Primary Pill */}
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-text-primary text-sm">
                                  {ct.contactName}
                                </span>
                                {ct.isPrimary && (
                                  <span className="rounded-full bg-primary/10 text-primary border border-primary/20 px-2 py-0.2 text-[10px] font-bold">
                                    Primary Contact
                                  </span>
                                )}
                              </div>
                              <span className="text-text-secondary block font-medium">
                                {ct.designation || "Representative"}
                                {company.location ? ` • ${company.location}` : ""}
                              </span>
                            </div>

                            {/* Contact Verification Badge */}
                            <div>
                              <ContactVerificationBadge
                                level={ct.contactVerification}
                              />
                            </div>
                          </div>

                          {/* Verification Warning Banner if Unverified */}
                          {isContactUnverified && (
                            <div className="rounded-lg border border-amber-500/20 bg-amber-50/60 dark:bg-amber-950/20 px-2.5 py-1.5 text-[11px] flex items-center gap-2 text-amber-800 dark:text-amber-300">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                              <span>
                                <strong>Unverified contact:</strong> Origin is unconfirmed. Verify authorization before promising packages. (Source:{" "}
                                {ct.contactSource || "Unknown source"})
                              </span>
                            </div>
                          )}

                          {/* Phone, Email & Action Trigger */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-subtle">
                            <div className="flex flex-wrap items-center gap-4 text-text-secondary">
                              <div className="flex items-center gap-1.5 font-mono">
                                <Phone className="h-3.5 w-3.5 text-text-muted" />
                                <span className="font-semibold text-text-primary text-xs">
                                  {ct.phone || "No phone recorded"}
                                </span>
                                <PhoneTypeBadge
                                  type={ct.phoneType || "unknown"}
                                />
                              </div>

                              {ct.email && (
                                <div className="flex items-center gap-1.5">
                                  <Mail className="h-3.5 w-3.5 text-text-muted" />
                                  <a
                                    href={`mailto:${ct.email}`}
                                    className="hover:text-primary transition-colors truncate max-w-[180px]"
                                  >
                                    {ct.email}
                                  </a>
                                </div>
                              )}

                              {ct.linkedin && (
                                <a
                                  href={ct.linkedin}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sky-700 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                                >
                                  <LinkedInIcon className="h-3.5 w-3.5" />
                                  Profile
                                </a>
                              )}
                            </div>

                            {/* Per-Contact Call Button */}
                            {onStartCall && ct.phone && (
                              <Button
                                size="sm"
                                variant={canVolunteerCall ? "primary" : "outline"}
                                disabled={!canVolunteerCall}
                                onClick={() => handleTriggerCall(ct)}
                                className="text-xs h-7 px-2.5"
                                title={
                                  canVolunteerCall
                                    ? `Call ${ct.contactName} (${ct.phone})`
                                    : callDisabledReason
                                }
                              >
                                <PhoneCall className="h-3 w-3 mr-1" />
                                Call Contact
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-6 text-center space-y-2 bg-surface-subtle/30">
                    <PhoneOff className="h-6 w-6 text-text-muted mx-auto opacity-50" />
                    <p className="text-xs font-semibold text-text-primary">
                      No Contacts Available
                    </p>
                    <p className="text-[11px] text-text-muted max-w-sm mx-auto">
                      This company does not have an assigned contact number yet. Add or verify a contact before starting outreach.
                    </p>
                  </div>
                )}
              </section>

              {/* -------------------------------------------------------------- */}
              {/* 05 — OUTREACH NOTES (PART 3)                                   */}
              {/* -------------------------------------------------------------- */}
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-1.5">
                  <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-amber-600" />
                    05 · Internal Outreach Notes
                  </h3>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                    Strictly Confidential • PRAROHA'26 Committee Only
                  </span>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/20 p-4 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    <Lock className="h-3 w-3 text-amber-600" />
                    Internal Outreach Notes (Not shared with corporate sponsor)
                  </div>
                  {company.notes ? (
                    <p className="text-text-primary leading-relaxed whitespace-pre-wrap">
                      {company.notes}
                    </p>
                  ) : (
                    <p className="text-text-muted italic">
                      No internal notes recorded for this lead yet. Update notes during post-call debriefs.
                    </p>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: CALL PREP BATTLECARDS */}
          {activeTab === "prep" && (
            <div className="space-y-4">
              <CallPreparationCard company={company} />
              <ConciseTalkingPoints
                companyName={company.companyName}
                industry={company.industry}
                niche={company.niche}
                keralaPresence={company.keralaPresence}
                sponsorshipHistory={company.sponsorshipHistory}
                whyGoodLead={company.whyGoodLead}
                whyCompanyBenefits={company.whyCompanyBenefits}
                alternativeSupport={company.alternativeSupport}
              />
            </div>
          )}

          {/* TAB 3: AI STRATEGIC INTELLIGENCE */}
          {activeTab === "ai" && (
            <div className="space-y-4">
              <CompanyAIAnalysisCard company={company} />
              <AlternativeAskCard
                company={company}
                onSelectAlternative={() => setIsProposalModalOpen(true)}
              />
            </div>
          )}

          {/* TAB 4: PROPOSALS & IN-KIND */}
          {activeTab === "proposals" && (
            <div className="space-y-4">
              <AlternativeAskCard
                company={company}
                onSelectAlternative={() => setIsProposalModalOpen(true)}
              />

              <div className="flex items-center justify-between pb-2 border-b border-border-subtle pt-2">
                <div>
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Dispatched Proposals & Formal Commitments
                  </h4>
                  <p className="text-[11px] text-text-secondary">
                    Review dispatched proposals, in-kind valuations, and deliverable commitments.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsProposalModalOpen(true)}
                  className="text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Draft Proposal
                </Button>
              </div>

              {proposals === undefined ? (
                <div className="py-8 text-center text-xs text-text-muted">
                  Loading proposals...
                </div>
              ) : proposals.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center space-y-2">
                  <Trophy className="h-8 w-8 text-text-muted mx-auto opacity-50" />
                  <p className="text-xs font-bold text-text-primary">
                    No Proposals Dispatched Yet
                  </p>
                  <p className="text-[11px] text-text-secondary max-w-sm mx-auto">
                    Create a customized sponsorship proposal with cash amount, non-cash in-kind categories, and festival deliverables.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsProposalModalOpen(true)}
                    className="text-xs mt-2"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Create First Proposal
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {proposals.map((p) => (
                    <div
                      key={p._id}
                      className="rounded-xl border border-border bg-surface p-4 text-xs space-y-3 shadow-2xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-text-primary text-sm">
                            {p.packageTier} Tier
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                              p.status === "sent"
                                ? "bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800/50"
                                : p.status === "accepted"
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/50"
                                : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800/50"
                            }`}
                          >
                            {p.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-primary block">
                            {formatCurrencyINR(p.totalValuation)}
                          </span>
                          <span className="text-[10px] text-text-muted">
                            Cash: {formatCurrencyINR(p.cashAmount)}
                            {p.inKindEstimatedValue
                              ? ` + In-Kind: ${formatCurrencyINR(p.inKindEstimatedValue)}`
                              : ""}
                          </span>
                        </div>
                      </div>

                      {p.inKindCategory && p.inKindEstimatedValue && (
                        <div className="rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50 p-2 text-[11px] text-purple-950 dark:text-purple-200 flex items-center justify-between">
                          <span className="flex items-center gap-1 font-semibold">
                            <Gift className="h-3.5 w-3.5 text-purple-700 dark:text-purple-400" />
                            Non-Cash: {p.inKindCategory} (
                            {formatCurrencyINR(p.inKindEstimatedValue)})
                          </span>
                          {p.inKindDescription && (
                            <span className="text-purple-900 dark:text-purple-300 truncate max-w-xs">
                              {p.inKindDescription}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                          Committed Deliverables ({p.deliverables.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {p.deliverables.map((d, i) => (
                            <span
                              key={i}
                              className="rounded-md bg-surface-subtle border border-border px-2 py-0.5 text-[10px] text-text-secondary"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-text-muted pt-2 border-t border-border-subtle">
                        <span>
                          Created by <strong>{p.volunteerName}</strong>
                        </span>
                        <span>{formatDate(p.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: RELATIONSHIP TIMELINE */}
          {activeTab === "timeline" && (
            <div className="space-y-3">
              <CompanyTimeline companyId={company._id} />
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* STICKY FOOTER ACTIONS (PART 4 & 7)                                   */}
        {/* ==================================================================== */}
        <div className="shrink-0 sticky bottom-0 z-20 border-t border-border bg-surface p-3.5 sm:px-6 sm:py-3.5 flex flex-wrap items-center justify-between gap-2.5 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Start Call Button with Strict Assignment Safety */}
            {onStartCall && (
              <div className="relative group">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isCallDisabled}
                  onClick={() => handleTriggerCall()}
                  className={`text-xs ${
                    isCallDisabled
                      ? "opacity-60 cursor-not-allowed bg-muted text-muted-foreground"
                      : ""
                  }`}
                >
                  {isUnassigned ? (
                    <>
                      <Lock className="h-3.5 w-3.5 mr-1.5" />
                      Unassigned Lead
                    </>
                  ) : !canVolunteerCall ? (
                    <>
                      <UserX className="h-3.5 w-3.5 mr-1.5" />
                      Assigned to Another
                    </>
                  ) : !hasPhone ? (
                    <>
                      <PhoneOff className="h-3.5 w-3.5 mr-1.5" />
                      No Contact Phone
                    </>
                  ) : (
                    <>
                      <PhoneCall className="h-3.5 w-3.5 mr-1.5" />
                      Start Call ({primaryContact.contactName})
                    </>
                  )}
                </Button>

                {/* Explanatory Tooltip when Disabled */}
                {isCallDisabled && (
                  <div className="absolute bottom-full left-0 mb-1.5 hidden group-hover:block z-50 w-64 rounded-md border border-border bg-popover p-2 text-[11px] text-popover-foreground shadow-md animate-in fade-in-50">
                    <p className="font-semibold">{callDisabledReason}</p>
                  </div>
                )}
              </div>
            )}

            {/* Secondary: Draft Proposal */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProposalModalOpen(true)}
              className="text-xs"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
              Draft Proposal
            </Button>
          </div>

          {/* Tertiary: Close Dossier */}
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs text-text-secondary"
          >
            Close Dossier
          </Button>
        </div>
      </Dialog>

      {/* Embedded Create Proposal Modal */}
      {isProposalModalOpen && (
        <CreateProposalModal
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          companyId={company._id}
          companyName={company.companyName}
          defaultTier={
            company.recommendedSponsorshipType === "Title"
              ? "Title"
              : "Associate"
          }
        />
      )}

      {/* Embedded Admin Assignment Modals */}
      {isAssignModalOpen && (
        <AssignLeadModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          companyId={company._id}
          companyName={company.companyName}
          defaultPriority={company.priority}
          onSuccess={() => {
            setIsAssignModalOpen(false);
          }}
        />
      )}

      {isReassignModalOpen && (
        <ReassignLeadModal
          isOpen={isReassignModalOpen}
          onClose={() => setIsReassignModalOpen(false)}
          companyId={company._id}
          companyName={company.companyName}
          currentVolunteerName={assignedVolunteerName}
          currentVolunteerId={activeAssignment?.volunteerId}
          leadStatus={company.leadStatus}
          onSuccess={() => {
            setIsReassignModalOpen(false);
          }}
        />
      )}

      {isUnassignModalOpen && (
        <UnassignConfirmationModal
          isOpen={isUnassignModalOpen}
          onClose={() => setIsUnassignModalOpen(false)}
          companyId={company._id}
          companyName={company.companyName}
          currentVolunteerName={assignedVolunteerName}
          onSuccess={() => {
            setIsUnassignModalOpen(false);
          }}
        />
      )}
    </>
  );
}
