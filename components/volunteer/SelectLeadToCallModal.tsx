"use client";

import React, { useState, useMemo } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, PhoneCall, Building2, User, AlertCircle, X, ShieldCheck } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import {
  LeadStatusBadge,
  PriorityBadge,
  ContactVerificationBadge,
  PhoneTypeBadge,
} from "@/components/ui/badge";
import { WorkspaceLeadInput } from "@/components/volunteer/WorkspaceContext";

interface SelectLeadToCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLead: (lead: WorkspaceLeadInput) => void;
}

export function SelectLeadToCallModal({
  isOpen,
  onClose,
  onSelectLead,
}: SelectLeadToCallModalProps) {
  const { user } = useAuthUser();
  const [search, setSearch] = useState("");

  const assignedLeads = useQuery(
    api.assignments.getMyAssignedLeads,
    user?.id ? { volunteerClerkId: user.id, tab: "all" } : "skip"
  );

  const filteredLeads = useMemo(() => {
    if (!assignedLeads) return [];
    if (!search.trim()) return assignedLeads;
    const q = search.toLowerCase().trim();
    return assignedLeads.filter(
      (l) =>
        l.companyName.toLowerCase().includes(q) ||
        l.industry.toLowerCase().includes(q) ||
        l.niche.toLowerCase().includes(q) ||
        (l.primaryContact &&
          (l.primaryContact.contactName.toLowerCase().includes(q) ||
            l.primaryContact.phone.includes(q) ||
            l.primaryContact.designation.toLowerCase().includes(q)))
    );
  }, [assignedLeads, search]);

  if (!isOpen) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title="Select Lead to Call"
      description="Choose one of your assigned corporate leads to initiate outreach"
    >
      <div className="space-y-4 pt-1">
        {/* Search Filter */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by company, contact name, or phone..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-8 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary transition-all"
            autoFocus
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Lead Selection List */}
        <div className="max-h-[55vh] overflow-y-auto space-y-2 pr-1">
          {assignedLeads === undefined ? (
            <div className="py-12 text-center text-xs text-text-muted">
              Loading your assigned leads...
            </div>
          ) : assignedLeads.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-2">
              <Building2 className="h-8 w-8 text-text-muted mx-auto opacity-50" />
              <h3 className="text-xs font-bold text-text-primary">No Assigned Leads</h3>
              <p className="text-[11px] text-text-secondary max-w-sm mx-auto">
                You do not have any company leads assigned to your account yet. Check the Lead Pool in the Admin Matrix or contact your Sponsorship Head.
              </p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-text-muted">
              No assigned leads match &quot;{search}&quot;.
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const hasPhone = Boolean(lead.primaryContact?.phone?.trim());

              return (
                <div
                  key={lead._id}
                  className={`rounded-xl border p-3.5 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                    hasPhone
                      ? "border-border bg-surface hover:border-primary/50 hover:bg-surface-subtle"
                      : "border-border/60 bg-surface-subtle/40 opacity-75"
                  }`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-text-primary truncate">
                        {lead.companyName}
                      </h4>
                      <LeadStatusBadge status={lead.leadStatus} />
                      <PriorityBadge priority={lead.priority} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                      <span>{lead.industry}</span>
                      <span className="text-text-muted">•</span>
                      <span>{lead.niche}</span>
                    </div>

                    {lead.primaryContact ? (
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <User className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-semibold text-text-primary">
                          {lead.primaryContact.contactName}
                        </span>
                        <span className="text-text-muted">({lead.primaryContact.designation})</span>
                        <span className="font-mono text-text-secondary">{lead.primaryContact.phone}</span>
                        <ContactVerificationBadge level={lead.primaryContact.contactVerification} />
                      </div>
                    ) : (
                      <p className="text-[11px] text-text-muted italic pt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-amber-500" />
                        No contact person recorded for this company
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    {hasPhone ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          onClose();
                          onSelectLead(lead);
                        }}
                        className="text-xs font-semibold bg-primary hover:bg-primary-hover text-white shadow-xs"
                      >
                        <PhoneCall className="h-3.5 w-3.5 mr-1.5" />
                        Select & Call
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled className="text-xs opacity-50 cursor-not-allowed">
                        No Phone Available
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border pt-3 text-[11px] text-text-muted">
          <span>
            {filteredLeads.filter((l) => Boolean(l.primaryContact?.phone?.trim())).length} call-ready leads
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
