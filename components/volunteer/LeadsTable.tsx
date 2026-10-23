"use client";

import React, { useState, useMemo } from "react";
import { Id } from "@/convex/_generated/dataModel";
import {
  Building2,
  Phone,
  Search,
  Filter,
  FileText,
  PhoneCall,
  ChevronRight,
  ExternalLink,
  MapPin,
  Calendar,
  X,
  Sparkles,
  BookOpen,
  Trophy,
  Download,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  LeadStatusBadge,
  PriorityBadge,
  ContactVerificationBadge,
  PhoneTypeBadge,
} from "@/components/ui/badge";
import { LeadStage, PriorityLevel, PhoneType, ContactVerificationLevel } from "@/types";

export interface AssignedLeadItem {
  _id: Id<"companies">;
  companyName: string;
  industry: string;
  niche: string;
  priority: PriorityLevel;
  leadStatus: LeadStage;
  location?: string;
  leadScore?: number;
  assignedAt?: number;
  lastContactedAt?: number;
  primaryContact?: {
    _id: Id<"contacts">;
    contactName: string;
    designation: string;
    phone: string;
    phoneType: PhoneType;
    contactVerification: ContactVerificationLevel;
    email?: string;
  } | null;
  totalContacts?: number;
}

interface LeadsTableProps {
  leads: AssignedLeadItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSelectLead: (companyId: Id<"companies">) => void;
  onStartCall?: (lead: AssignedLeadItem) => void;
  onOpenEventDeck?: () => void;
  onOpenLeaderboard?: () => void;
  volunteerName?: string;
  isLoading?: boolean;
}

export function LeadsTable({
  leads,
  activeTab,
  onTabChange,
  onSelectLead,
  onStartCall,
  onOpenEventDeck,
  onOpenLeaderboard,
  volunteerName,
  isLoading = false,
}: LeadsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [isCompactDensity, setIsCompactDensity] = useState(false);

  // Memoized unique industries from leads
  const availableIndustries = useMemo(() => {
    return Array.from(new Set(leads.map((l) => l.industry).filter(Boolean))).sort();
  }, [leads]);

  // Memoized client-side multi-attribute search and filtering
  const filteredLeads = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    return leads.filter((lead) => {
      // Priority filter
      if (priorityFilter !== "all" && lead.priority !== priorityFilter) {
        return false;
      }

      // Industry / Sector filter
      if (industryFilter !== "all" && lead.industry !== industryFilter) {
        return false;
      }

      // Contact Verification level filter
      if (
        verificationFilter !== "all" &&
        lead.primaryContact?.contactVerification !== verificationFilter
      ) {
        return false;
      }

      // Search query
      if (trimmedQuery.length > 0) {
        const matchCompany =
          lead.companyName.toLowerCase().includes(trimmedQuery) ||
          lead.industry.toLowerCase().includes(trimmedQuery) ||
          lead.niche.toLowerCase().includes(trimmedQuery) ||
          (lead.location && lead.location.toLowerCase().includes(trimmedQuery));

        const matchContact =
          lead.primaryContact &&
          (lead.primaryContact.contactName.toLowerCase().includes(trimmedQuery) ||
            lead.primaryContact.phone.includes(trimmedQuery) ||
            lead.primaryContact.designation.toLowerCase().includes(trimmedQuery));

        return matchCompany || matchContact;
      }

      return true;
    });
  }, [leads, priorityFilter, industryFilter, verificationFilter, searchQuery]);

  // Single-pass memoized tab counts
  const tabCounts = useMemo(() => {
    let toContact = 0;
    let inProgress = 0;
    let followUp = 0;
    let interested = 0;

    for (const l of leads) {
      if (l.leadStatus === "ASSIGNED") {
        toContact++;
      }
      if (["CONTACTED", "FOLLOW_UP", "PROPOSAL_REQUESTED", "PROPOSAL_SENT", "NEGOTIATION"].includes(l.leadStatus)) {
        inProgress++;
      }
      if (l.leadStatus === "FOLLOW_UP") {
        followUp++;
      }
      if (["INTERESTED", "PROPOSAL_REQUESTED", "PROPOSAL_SENT", "NEGOTIATION", "WON"].includes(l.leadStatus)) {
        interested++;
      }
    }

    return {
      all: leads.length,
      toContact,
      inProgress,
      followUp,
      interested,
    };
  }, [leads]);

  return (
    <div className="border border-border bg-surface overflow-hidden shadow-2xs">
      {/* Table Header: Title & Counts */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-text-primary tracking-tight">
            MY ASSIGNED OUTREACH QUEUE
          </h2>
          <span className="bg-accent-mint px-2 py-0.5 text-xs font-bold text-primary">
            {leads.length} active
          </span>
        </div>
        <p className="text-xs text-text-muted">
          Click any row to open the complete corporate dossier and pitch preparation
        </p>
      </div>

      {/* Filter Tabs matching Admin editorial style */}
      <nav className="flex items-center gap-6 border-b border-border-subtle px-5 overflow-x-auto" aria-label="Lead Queue Filters">
        <button
          type="button"
          onClick={() => onTabChange("all")}
          className={`border-b-2 py-3 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "all"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <span>All Assigned</span>
          <span
            className={`px-1.5 py-0.2 text-[10px] font-bold tabular-nums ${
              activeTab === "all"
                ? "bg-accent-mint text-primary"
                : "bg-surface-subtle text-text-muted"
            }`}
          >
            {tabCounts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("to_contact")}
          className={`border-b-2 py-3 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "to_contact"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <span>To Contact</span>
          <span
            className={`px-1.5 py-0.2 text-[10px] font-bold tabular-nums ${
              activeTab === "to_contact"
                ? "bg-accent-mint text-primary"
                : "bg-surface-subtle text-text-muted"
            }`}
          >
            {tabCounts.toContact}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("in_progress")}
          className={`border-b-2 py-3 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "in_progress"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <span>In Progress</span>
          <span
            className={`px-1.5 py-0.2 text-[10px] font-bold tabular-nums ${
              activeTab === "in_progress"
                ? "bg-accent-mint text-primary"
                : "bg-surface-subtle text-text-muted"
            }`}
          >
            {tabCounts.inProgress}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("follow_up")}
          className={`border-b-2 py-3 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "follow_up"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <span>Follow-up</span>
          <span
            className={`px-1.5 py-0.2 text-[10px] font-bold tabular-nums ${
              activeTab === "follow_up"
                ? "bg-accent-mint text-primary"
                : "bg-surface-subtle text-text-muted"
            }`}
          >
            {tabCounts.followUp}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("interested")}
          className={`border-b-2 py-3 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "interested"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <span>Interested</span>
          <span
            className={`px-1.5 py-0.2 text-[10px] font-bold tabular-nums ${
              activeTab === "interested"
                ? "bg-accent-mint text-primary"
                : "bg-surface-subtle text-text-muted"
            }`}
          >
            {tabCounts.interested}
          </span>
        </button>
      </nav>

      {/* Search and Secondary Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border-subtle bg-surface-subtle/20">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search company, contact, or niche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-full border border-border bg-background pl-8 pr-8 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Filter className="h-3.5 w-3.5 text-text-muted" />
            <select
              value={priorityFilter}
              aria-label="Filter leads by priority"
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-8 border border-border bg-surface px-2 text-xs text-text-primary focus:border-primary focus:outline-hidden"
            >
              <option value="all">All Priorities</option>
              <option value="High">High (P0)</option>
              <option value="Medium">Medium (P1)</option>
              <option value="Normal">Normal (P2)</option>
              <option value="Low">Low (P3)</option>
            </select>
          </div>

          {/* Industry Filter */}
          {availableIndustries.length > 0 && (
            <select
              value={industryFilter}
              aria-label="Filter leads by industry sector"
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="h-8 border border-border bg-surface px-2 text-xs text-text-primary focus:border-primary focus:outline-hidden max-w-[140px] truncate"
            >
              <option value="all">All Sectors</option>
              {availableIndustries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          )}

          {/* Contact Verification Filter */}
          <select
            value={verificationFilter}
            aria-label="Filter leads by contact verification"
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="h-8 border border-border bg-surface px-2 text-xs text-text-primary focus:border-primary focus:outline-hidden"
          >
            <option value="all">All Contacts</option>
            <option value="VERIFIED_DECISION_MAKER">Decision Makers</option>
            <option value="VERIFIED_COMPANY_REPRESENTATIVE">Company Reps</option>
            <option value="OFFICIAL_COMPANY_CONTACT">Official Line</option>
            <option value="UNVERIFIED">Unverified</option>
          </select>

          {/* Density Toggle */}
          <button
            onClick={() => setIsCompactDensity((prev) => !prev)}
            title="Toggle Row Density"
            className={`h-8 px-2.5 border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              isCompactDensity
                ? "bg-surface-subtle border-primary/40 text-primary font-semibold"
                : "border-border bg-surface text-text-secondary hover:text-text-primary"
            }`}
          >
            <span>{isCompactDensity ? "Compact" : "Comfortable"}</span>
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-text-secondary">Loading assigned leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="py-10 px-4 sm:px-6">
          <div className="mx-auto max-w-2xl border border-border bg-surface-subtle/40 p-6 sm:p-8 text-center space-y-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                Welcome to your Outreach Desk{volunteerName ? `, ${volunteerName}` : ""}!
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-lg mx-auto">
                Your volunteer credentials are verified. The Sponsorship Head is currently assigning your batch of corporate leads. Get ready by studying festival deliverables and pitch strategy below.
              </p>
            </div>

            {/* 3 Fast-Start Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="border border-border bg-surface p-4 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center bg-primary text-[10px] font-bold text-white">
                    1
                  </span>
                  <span className="text-xs font-bold text-text-primary">
                    Study Packages
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Review the 5 sponsorship tiers (Title ₹4L, Powered By ₹2L, Associate ₹1L, Event Partner ₹50K, In-Kind).
                </p>
              </div>

              <div className="border border-border bg-surface p-4 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center bg-primary text-[10px] font-bold text-white">
                    2
                  </span>
                  <span className="text-xs font-bold text-text-primary">
                    Master Call Mode
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Every lead includes verified contact tiers, concise talking points, and 9 quick outcome buttons.
                </p>
              </div>

              <div className="border border-border bg-surface p-4 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center bg-primary text-[10px] font-bold text-white">
                    3
                  </span>
                  <span className="text-xs font-bold text-text-primary">
                    Earn SDR Points
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Every completed call, audio debrief, and pipeline stage advancement earns points on the team leaderboard.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {onOpenEventDeck && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={onOpenEventDeck}
                  className="text-xs font-semibold"
                >
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  Explore Event Deck & Packages
                </Button>
              )}
              {onOpenLeaderboard && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={onOpenLeaderboard}
                  className="text-xs font-semibold border-border text-text-secondary hover:text-text-primary"
                >
                  <Trophy className="h-4 w-4 mr-1.5 text-amber-500" />
                  View Team Leaderboard
                </Button>
              )}
              <a
                href="/brochure/praroha-2026-sponsorship-brochure.pdf"
                target="_blank"
                download
                className="inline-flex items-center gap-1.5 border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors shadow-2xs"
              >
                <Download className="h-3.5 w-3.5 text-primary" />
                Brochure PDF
              </a>
            </div>
          </div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="py-10">
          <EmptyState
            icon={Building2}
            title={
              searchQuery.trim().length > 0
                ? "No matching accounts found"
                : activeTab === "to_contact"
                  ? "All assigned accounts dialed! 👏"
                  : activeTab === "follow_up"
                    ? "No callbacks due right now"
                    : activeTab === "interested"
                      ? "No active interested deals yet"
                      : "No leads match current filters"
            }
            description={
              searchQuery.trim().length > 0
                ? `No assigned leads match "${searchQuery}". Reset filters to see all accounts.`
                : activeTab === "to_contact"
                  ? "You've contacted every fresh account in your initial queue. Head to 'Follow-ups' for scheduled callbacks or review active deals."
                  : activeTab === "follow_up"
                    ? "Your follow-up pipeline is currently clear. Focus on high-priority accounts or review proposal statuses."
                    : activeTab === "interested"
                      ? "Direct conversations turn corporate interest into signed festival partnerships. Keep dialing!"
                      : "Try resetting your sector, priority, or search filters."
            }
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setPriorityFilter("all");
                  setIndustryFilter("all");
                  setVerificationFilter("all");
                  onTabChange("all");
                }}
                className="text-xs border-border text-text-secondary hover:text-text-primary"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Reset All Filters
              </Button>
            }
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-table-header/70 text-[10px] font-bold text-text-muted uppercase tracking-[0.14em]">
                <th className="py-3 px-4">Company & Sector</th>
                <th className="py-3 px-4">Decision Maker / Contact</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Stage Status</th>
                <th className="py-3 px-4">Timeline</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead._id}
                  onClick={() => onSelectLead(lead._id)}
                  className="group hover:bg-table-row-hover transition-colors cursor-pointer"
                >
                  {/* Company & Sector */}
                  <td className={isCompactDensity ? "py-2 px-4" : "py-3 px-4"}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-primary group-hover:text-primary transition-colors text-sm">
                          {lead.companyName}
                        </span>
                        {lead.leadScore !== undefined && (
                          <span className="bg-accent-mint px-1.5 py-0.2 text-[10px] font-bold text-primary tabular-nums">
                            {lead.leadScore} pts
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <span className="font-medium text-text-primary">
                          {lead.industry}
                        </span>
                        <span className="text-text-muted">•</span>
                        <span className="text-text-muted truncate max-w-[180px]">
                          {lead.niche}
                        </span>
                      </div>
                      {lead.location && !isCompactDensity && (
                        <div className="flex items-center gap-1 text-[11px] text-text-muted">
                          <MapPin className="h-3 w-3" />
                          <span>{lead.location}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Decision Maker / Contact */}
                  <td className={isCompactDensity ? "py-2 px-4" : "py-3 px-4"}>
                    {lead.primaryContact ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-text-primary">
                            {lead.primaryContact.contactName}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary truncate max-w-[200px]">
                          {lead.primaryContact.designation}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          <ContactVerificationBadge
                            level={lead.primaryContact.contactVerification}
                          />
                          <PhoneTypeBadge type={lead.primaryContact.phoneType} />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-text-muted italic">
                        No contact attached
                      </span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className={isCompactDensity ? "py-2 px-4" : "py-3 px-4"}>
                    <PriorityBadge priority={lead.priority} />
                  </td>

                  {/* Status */}
                  <td className={isCompactDensity ? "py-2 px-4" : "py-3 px-4"}>
                    <LeadStatusBadge status={lead.leadStatus} />
                  </td>

                  {/* Timeline */}
                  <td className={isCompactDensity ? "py-2 px-4" : "py-3 px-4"}>
                    <div className="space-y-0.5 text-xs text-text-muted">
                      {lead.assignedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-text-muted" />
                          <span className="tabular-nums">
                            Assigned{" "}
                            {new Date(lead.assignedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                      {lead.lastContactedAt && !isCompactDensity && (
                        <p className="text-[11px] text-primary tabular-nums font-medium">
                          Called{" "}
                          {new Date(lead.lastContactedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className={`${isCompactDensity ? "py-2 px-4" : "py-3 px-4"} text-right`}>
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectLead(lead._id)}
                        className="h-7 px-2.5 text-xs text-text-secondary hover:text-text-primary border-border"
                      >
                        <FileText className="h-3 w-3 mr-1 text-primary" />
                        Dossier
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => {
                          if (onStartCall) onStartCall(lead);
                        }}
                        className="h-7 px-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-2xs"
                      >
                        <PhoneCall className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
