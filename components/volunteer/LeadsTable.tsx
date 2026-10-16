"use client";

import React, { useState } from "react";
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
  CalendarClock,
  X,
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
  onOpenNotionDoc?: (companyId: Id<"companies">) => void;
  onScheduleMeeting?: (lead: AssignedLeadItem) => void;
  isLoading?: boolean;
}

export function LeadsTable({
  leads,
  activeTab,
  onTabChange,
  onSelectLead,
  onStartCall,
  onOpenNotionDoc,
  onScheduleMeeting,
  isLoading = false,
}: LeadsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [isCompactDensity, setIsCompactDensity] = useState(false);

  // Available unique industries from leads
  const availableIndustries = Array.from(
    new Set(leads.map((l) => l.industry).filter(Boolean))
  ).sort();

  // Client-side multi-attribute search and filtering
  const filteredLeads = leads.filter((lead) => {
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
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const matchCompany =
        lead.companyName.toLowerCase().includes(q) ||
        lead.industry.toLowerCase().includes(q) ||
        lead.niche.toLowerCase().includes(q) ||
        (lead.location && lead.location.toLowerCase().includes(q));

      const matchContact =
        lead.primaryContact &&
        (lead.primaryContact.contactName.toLowerCase().includes(q) ||
          lead.primaryContact.phone.includes(q) ||
          lead.primaryContact.designation.toLowerCase().includes(q));

      return matchCompany || matchContact;
    }

    return true;
  });

  // Calculate tab counts
  const countAll = leads.length;
  const countToContact = leads.filter((l) => l.leadStatus === "ASSIGNED").length;
  const countInProgress = leads.filter((l) =>
    ["CONTACTED", "FOLLOW_UP", "PROPOSAL_REQUESTED", "PROPOSAL_SENT", "NEGOTIATION"].includes(
      l.leadStatus
    )
  ).length;
  const countFollowUp = leads.filter((l) => l.leadStatus === "FOLLOW_UP").length;
  const countInterested = leads.filter((l) =>
    ["INTERESTED", "PROPOSAL_REQUESTED", "PROPOSAL_SENT", "NEGOTIATION", "WON"].includes(
      l.leadStatus
    )
  ).length;

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
      {/* Table Header: Title & Counts */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-text-primary">
            My Assigned Outreach Queue
          </h2>
          <span className="rounded-full bg-accent-mint/30 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
            {leads.length} active
          </span>
        </div>
        <p className="text-xs text-text-muted">
          Click any row to open the complete corporate dossier and pitch preparation
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 text-xs border-b border-border-subtle">
        <button
          onClick={() => onTabChange("all")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
            activeTab === "all"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
          }`}
        >
          All Assigned
          <span
            className={`rounded px-1.5 py-0.2 text-[10px] font-semibold tabular-nums ${
              activeTab === "all" ? "bg-white/20 text-white" : "bg-black/5 dark:bg-white/10 text-text-muted"
            }`}
          >
            {countAll}
          </span>
        </button>

        <button
          onClick={() => onTabChange("to_contact")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer ${
            activeTab === "to_contact"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
          }`}
        >
          To Contact
          <span
            className={`rounded px-1.5 py-0.2 text-[10px] font-semibold tabular-nums ${
              activeTab === "to_contact"
                ? "bg-white/20 text-white"
                : "bg-surface-subtle text-text-muted"
            }`}
          >
            {countToContact}
          </span>
        </button>

        <button
          onClick={() => onTabChange("in_progress")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer ${
            activeTab === "in_progress"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
          }`}
        >
          In Progress
          <span
            className={`rounded px-1.5 py-0.2 text-[10px] font-semibold tabular-nums ${
              activeTab === "in_progress"
                ? "bg-white/20 text-white"
                : "bg-surface-subtle text-text-muted"
            }`}
          >
            {countInProgress}
          </span>
        </button>

        <button
          onClick={() => onTabChange("follow_up")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer ${
            activeTab === "follow_up"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
          }`}
        >
          Follow-up
          <span
            className={`rounded px-1.5 py-0.2 text-[10px] font-semibold tabular-nums ${
              activeTab === "follow_up"
                ? "bg-white/20 text-white"
                : "bg-surface-subtle text-text-muted"
            }`}
          >
            {countFollowUp}
          </span>
        </button>

        <button
          onClick={() => onTabChange("interested")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer ${
            activeTab === "interested"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
          }`}
        >
          Interested
          <span
            className={`rounded px-1.5 py-0.2 text-[10px] font-semibold tabular-nums ${
              activeTab === "interested"
                ? "bg-white/20 text-white"
                : "bg-surface-subtle text-text-muted"
            }`}
          >
            {countInterested}
          </span>
        </button>
      </div>

      {/* Search and Secondary Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-border-subtle">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search company, contact, or niche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-full rounded-lg border border-border bg-surface-subtle/50 pl-8 pr-8 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
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
              className="h-8 rounded-lg border border-border bg-surface px-2 text-xs text-text-primary focus:border-primary focus:outline-none"
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
              className="h-8 rounded-lg border border-border bg-surface px-2 text-xs text-text-primary focus:border-primary focus:outline-none max-w-[140px] truncate"
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
            className="h-8 rounded-lg border border-border bg-surface px-2 text-xs text-text-primary focus:border-primary focus:outline-none"
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
            className={`h-8 px-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
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
      ) : filteredLeads.length === 0 ? (
        <div className="py-10">
          <EmptyState
            icon={Building2}
            title={
              leads.length === 0
                ? "No leads assigned yet"
                : searchQuery.trim().length > 0
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
              leads.length === 0
                ? "Your allocated sponsorship leads will automatically populate here once assigned by the Sponsorship Head."
                : searchQuery.trim().length > 0
                ? `No assigned leads match "${searchQuery}". Clear your search query to see all accounts.`
                : activeTab === "to_contact"
                ? "You've contacted every fresh account in your initial queue. Head to 'Follow-ups' for scheduled callbacks or review active deals."
                : activeTab === "follow_up"
                ? "Your follow-up pipeline is currently clear. Focus on high-priority accounts or review proposal statuses."
                : activeTab === "interested"
                ? "Direct conversations turn corporate interest into signed festival partnerships. Keep dialing!"
                : "Try clearing your sector or priority filter dropdowns."
            }
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-3">Company & Sector</th>
                <th className="py-3 px-3">Decision Maker / Contact</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Stage Status</th>
                <th className="py-3 px-3">Timeline</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead._id}
                  onClick={() => onSelectLead(lead._id)}
                  className="group hover:bg-surface-subtle/70 transition-colors cursor-pointer"
                >
                  {/* Company & Sector */}
                  <td className={isCompactDensity ? "py-1.5 px-3" : "py-3 px-3"}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-primary group-hover:text-primary transition-colors">
                          {lead.companyName}
                        </span>
                        {lead.leadScore !== undefined && (
                          <span className="rounded bg-accent-mint/30 px-1.5 py-0.2 text-[10px] font-bold text-primary tabular-nums">
                            {lead.leadScore} pts
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                        <span className="rounded bg-surface-subtle px-1.5 py-0.5 border border-border-subtle font-medium">
                          {lead.industry}
                        </span>
                        <span className="text-text-muted">•</span>
                        <span className="text-text-muted truncate max-w-[160px]">
                          {lead.niche}
                        </span>
                      </div>
                      {lead.location && !isCompactDensity && (
                        <div className="flex items-center gap-1 text-[10px] text-text-muted">
                          <MapPin className="h-2.5 w-2.5" />
                          <span>{lead.location}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Decision Maker / Contact */}
                  <td className={isCompactDensity ? "py-1.5 px-3" : "py-3 px-3"}>
                    {lead.primaryContact ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-text-primary">
                            {lead.primaryContact.contactName}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary truncate max-w-[180px]">
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
                  <td className={isCompactDensity ? "py-1.5 px-3" : "py-3 px-3"}>
                    <PriorityBadge priority={lead.priority} />
                  </td>

                  {/* Status */}
                  <td className={isCompactDensity ? "py-1.5 px-3" : "py-3 px-3"}>
                    <LeadStatusBadge status={lead.leadStatus} />
                  </td>

                  {/* Timeline */}
                  <td className={isCompactDensity ? "py-1.5 px-3" : "py-3 px-3"}>
                    <div className="space-y-0.5 text-[11px] text-text-muted">
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
                        <p className="text-[10px] text-primary tabular-nums">
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
                  <td className={`${isCompactDensity ? "py-1.5 px-3" : "py-3 px-3"} text-right`}>
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {onOpenNotionDoc && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenNotionDoc(lead._id)}
                          title="Open Notion Research Canvas"
                          className="h-7 px-2 text-xs text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-amber-500/25"
                        >
                          <FileText className="h-3 w-3 mr-1 text-amber-600 dark:text-amber-400" />
                          Notion
                        </Button>
                      )}

                      {onScheduleMeeting && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onScheduleMeeting(lead)}
                          title="Cal.com Team Meeting Dispatch"
                          className="h-7 px-2 text-xs text-teal-800 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 border-teal-500/25"
                        >
                          <CalendarClock className="h-3 w-3 mr-1 text-teal-600 dark:text-teal-400" />
                          Meet
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectLead(lead._id)}
                        className="h-7 px-2.5 text-xs text-text-secondary hover:text-text-primary border-border"
                      >
                        <Building2 className="h-3 w-3 mr-1 text-primary" />
                        Dossier
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => {
                          if (onStartCall) onStartCall(lead);
                        }}
                        className="h-7 px-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-xs"
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
