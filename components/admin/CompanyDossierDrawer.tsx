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
  History,
  Lightbulb,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Trophy,
  Gift,
  Clock,
  PhoneCall,
  Plus,
  Send,
  FileText,
  Sparkles,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConciseTalkingPoints } from "@/components/volunteer/ConciseTalkingPoints";
import { CompanyTimeline } from "@/components/pipeline/CompanyTimeline";
import { CreateProposalModal } from "@/components/pipeline/CreateProposalModal";
import {
  CompanyAIAnalysisCard,
  CallPreparationCard,
  AlternativeAskCard,
  LeadPriorityExplainer,
} from "@/components/ai";

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
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
  const [activeTab, setActiveTab] = useState<"overview" | "ai" | "prep" | "proposals" | "timeline">(
    "overview"
  );
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

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

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="xl"
        title={company.companyName}
        description={`${company.industry} • ${company.niche}`}
      >
        <div className="space-y-4 pt-1 max-h-[78vh] overflow-y-auto pr-1">
          {/* Header Badges & Target Ask */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <LeadStatusBadge status={company.leadStatus} />
              <PriorityBadge priority={company.priority} />
              {company.leadScore && (
                <span className="rounded-md border border-primary/20 bg-accent-mint px-2 py-0.5 text-[11px] font-bold text-accent-mint-text">
                  Score: {company.leadScore}
                </span>
              )}
              <LeadPriorityExplainer company={company} />
            </div>

            {(company.recommendedAskMin || company.recommendedAskMax) && (
              <div className="text-right">
                <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider block">
                  Target Ask ({company.recommendedSponsorshipType || "CASH"})
                </span>
                <span className="text-sm font-bold text-primary">
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
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border text-xs font-medium overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Overview & Contacts
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors ${
                activeTab === "ai"
                  ? "border-teal-600 text-teal-600 dark:text-teal-400 font-bold"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              AI Strategic Intelligence
            </button>
            <button
              onClick={() => setActiveTab("prep")}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors ${
                activeTab === "prep"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              Call Prep Battlecards
            </button>
            <button
              onClick={() => setActiveTab("proposals")}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors ${
                activeTab === "proposals"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              <Trophy className="h-3.5 w-3.5" />
              Proposals & In-Kind ({proposals?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors ${
                activeTab === "timeline"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Activity Timeline
            </button>
          </div>

          {/* TAB 1: OVERVIEW & CONTACTS */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Corporate Profile Card */}
              <div className="rounded-xl border border-border bg-surface-subtle/50 p-4 space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-primary" />
                  Corporate Profile & Footprint
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {company.location && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <MapPin className="h-3.5 w-3.5 text-text-muted shrink-0" />
                      <span>{company.location}</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Globe className="h-3.5 w-3.5 text-text-muted shrink-0" />
                      <a
                        href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 truncate"
                      >
                        {company.website}
                        <ExternalLink className="h-3 w-3 inline" />
                      </a>
                    </div>
                  )}
                  {company.companySize && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Users className="h-3.5 w-3.5 text-text-muted shrink-0" />
                      <span>Size: {company.companySize} employees</span>
                    </div>
                  )}
                  {company.annualRevenue && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Coins className="h-3.5 w-3.5 text-text-muted shrink-0" />
                      <span>Annual Revenue: {company.annualRevenue}</span>
                    </div>
                  )}
                </div>

                {company.keralaPresence && (
                  <div className="pt-2 border-t border-border-subtle text-xs text-text-secondary">
                    <strong className="text-text-primary font-semibold block mb-0.5">
                      Kerala Footprint:
                    </strong>
                    {company.keralaPresence}
                  </div>
                )}
              </div>

              {/* AI Strategic Intelligence Quick Trigger */}
              <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-text-primary block">
                      AI Sponsorship Intelligence & Fit Analysis
                    </span>
                    <span className="text-[11px] text-text-muted">
                      Synthesize civil engineering synergy, regional Kerala presence, and ask range.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("ai")}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Sparkles className="h-3 w-3" />
                  View AI Dossier
                </button>
              </div>

              {/* Strategic Angle & Sponsorship Pitch Points */}
              {(company.whyGoodLead || company.whyCompanyBenefits) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {company.whyGoodLead && (
                    <div className="rounded-xl border border-border bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 space-y-1">
                      <span className="font-semibold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        Why This Lead Matters
                      </span>
                      <p className="text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed">
                        {company.whyGoodLead}
                      </p>
                    </div>
                  )}

                  {company.whyCompanyBenefits && (
                    <div className="rounded-xl border border-border bg-sky-50/40 dark:bg-sky-950/20 p-3.5 space-y-1">
                      <span className="font-semibold text-sky-950 dark:text-sky-200 flex items-center gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                        Value for the Sponsor
                      </span>
                      <p className="text-sky-900/80 dark:text-sky-200/80 leading-relaxed">
                        {company.whyCompanyBenefits}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Key Decision Makers & Contacts */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Key Corporate Contacts
                </h4>

                {company.contacts && company.contacts.length > 0 ? (
                  <div className="space-y-2">
                    {company.contacts.map((ct: any) => (
                      <div
                        key={ct._id}
                        className="rounded-xl border border-border bg-surface p-3 text-xs space-y-2 shadow-2xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-text-primary">
                              {ct.contactName}
                            </span>
                            <span className="text-text-muted">•</span>
                            <span className="text-text-secondary">{ct.designation}</span>
                            {ct.isPrimary && (
                              <span className="rounded-full bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.2 text-[10px] font-bold">
                                Primary
                              </span>
                            )}
                          </div>
                          <ContactVerificationBadge level={ct.contactVerification} />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-text-secondary pt-1 border-t border-border-subtle">
                          <div className="flex items-center gap-1.5 font-mono">
                            <Phone className="h-3.5 w-3.5 text-text-muted" />
                            <a href={`tel:${ct.phone}`} className="hover:text-primary">
                              {ct.phone}
                            </a>
                            <PhoneTypeBadge type={ct.phoneType || "unknown"} />
                          </div>

                          {ct.email && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-text-muted" />
                              <a href={`mailto:${ct.email}`} className="hover:text-primary">
                                {ct.email}
                              </a>
                            </div>
                          )}

                          {ct.linkedin && (
                            <a
                              href={ct.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sky-700 hover:underline inline-flex items-center gap-1"
                            >
                              <LinkedInIcon className="h-3.5 w-3.5" />
                              Profile
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-text-muted">
                    No individual contacts added for this company.
                  </div>
                )}
              </div>

              {company.notes && (
                <div className="rounded-xl border border-border bg-amber-50/40 dark:bg-amber-950/20 p-3.5 text-xs">
                  <span className="font-semibold text-amber-900 dark:text-amber-200 block mb-1">
                    Internal Outreach Notes:
                  </span>
                  <p className="text-amber-800 dark:text-amber-200/80 leading-relaxed">{company.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: AI STRATEGIC INTELLIGENCE */}
          {activeTab === "ai" && (
            <div className="space-y-4">
              <CompanyAIAnalysisCard company={company} />
              <AlternativeAskCard
                company={company}
                onSelectAlternative={() => {
                  setIsProposalModalOpen(true);
                }}
              />
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

          {/* TAB 3: PROPOSALS & IN-KIND */}
          {activeTab === "proposals" && (
            <div className="space-y-4">
              <AlternativeAskCard
                company={company}
                onSelectAlternative={() => {
                  setIsProposalModalOpen(true);
                }}
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
                            Non-Cash: {p.inKindCategory} ({formatCurrencyINR(p.inKindEstimatedValue)})
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

          {/* TAB 4: RELATIONSHIP TIMELINE */}
          {activeTab === "timeline" && (
            <div className="space-y-3">
              <CompanyTimeline companyId={company._id} />
            </div>
          )}

          {/* Sticky Drawer Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProposalModalOpen(true)}
                className="text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Draft Proposal
              </Button>
              {onStartCall && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onStartCall(company);
                  }}
                  className="text-xs"
                >
                  <PhoneCall className="h-3.5 w-3.5 mr-1.5" />
                  Start Call
                </Button>
              )}
            </div>

            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Close Dossier
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Embedded Create Proposal Modal */}
      {isProposalModalOpen && (
        <CreateProposalModal
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          companyId={company._id}
          companyName={company.companyName}
          defaultTier={company.recommendedSponsorshipType === "Title" ? "Title" : "Associate"}
        />
      )}
    </>
  );
}
