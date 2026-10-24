"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  LeadStatusBadge,
  ContactVerificationBadge,
  PriorityBadge,
  PhoneTypeBadge,
} from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LeadImportModal } from "@/components/admin/LeadImportModal";
import { ManualLeadCreateModal } from "@/components/forms/ManualLeadCreateModal";
import { EditLeadModal } from "@/components/forms/EditLeadModal";
import { CompanyDossierDrawer } from "@/components/admin/CompanyDossierDrawer";
import { generateCsvTemplate } from "@/lib/csvParser";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminKpiStrip } from "@/components/admin/AdminKpiStrip";
import Link from "next/link";
import {
  Building2,
  Upload,
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  Phone,
  Layers,
  CheckCircle2,
  Briefcase,
  Users,
  Users2,
  UserPlus,
  UserX,
  ArrowRightLeft,
  Edit3,
  Trash2,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import { AssignLeadModal } from "@/components/admin/AssignLeadModal";
import { ReassignLeadModal } from "@/components/admin/ReassignLeadModal";
import { UnassignConfirmationModal } from "@/components/admin/UnassignConfirmationModal";
import { Id } from "@/convex/_generated/dataModel";

export function MasterLeadDirectoryView() {
  const { user } = useAuthUser();
  const deleteLeadMutation = useMutation(api.companies.deleteLead);
  const archiveLeadMutation = useMutation(api.companies.archiveCompany);
  const restoreLeadMutation = useMutation(api.companies.restoreCompany);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedOwnership, setSelectedOwnership] = useState<"all" | "assigned" | "unassigned">("all");
  const [selectedVolunteerFilter, setSelectedVolunteerFilter] = useState<string>("all");
  const [showArchived, setShowArchived] = useState(false);

  // Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [selectedCompanyForDossier, setSelectedCompanyForDossier] = useState<any | null>(null);
  const [selectedCompanyForEdit, setSelectedCompanyForEdit] = useState<any | null>(null);
  const [assigningLead, setAssigningLead] = useState<any | null>(null);
  const [reassigningLead, setReassigningLead] = useState<any | null>(null);
  const [unassigningLead, setUnassigningLead] = useState<any | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "info"; text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [archivingId, setArchivingId] = useState<string | null>(null);

  // Convex Queries
  const metrics = useQuery(api.companies.getCompanyMetrics, {}) || {
    total: 0,
    unassigned: 0,
    assigned: 0,
    inPipeline: 0,
    won: 0,
  };

  const industries = useQuery(api.companies.getDistinctIndustries, {}) || [];
  const volunteers = useQuery(api.assignments.getVolunteerRosterWithWorkload, {}) || [];

  const rawCompanies = useQuery(api.companies.getAllCompanies, {
    search: searchQuery || undefined,
    industry: selectedIndustry || undefined,
    status: selectedStatus || undefined,
    priority: selectedPriority || undefined,
    includeArchived: showArchived,
  }) || [];

  const companies = useMemo(() => {
    return rawCompanies.filter((comp: any) => {
      // 1. Ownership Filter
      if (selectedOwnership === "assigned") {
        if (!comp.assignedVolunteer || comp.leadStatus === "UNASSIGNED") return false;
      } else if (selectedOwnership === "unassigned") {
        if (comp.assignedVolunteer && comp.leadStatus !== "UNASSIGNED") return false;
      }

      // 2. Volunteer Filter
      if (selectedVolunteerFilter !== "all") {
        if (comp.assignedVolunteer?._id !== selectedVolunteerFilter) return false;
      }

      return true;
    });
  }, [rawCompanies, selectedOwnership, selectedVolunteerFilter]);

  const handleDownloadTemplate = () => {
    const csv = generateCsvTemplate();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "praroha26_canonical_lead_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteLead = async (companyId: any, companyName: string) => {
    if (!user?.id) return;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${companyName}" and its contacts? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(companyId);
      await deleteLeadMutation({
        adminClerkId: user.id,
        companyId,
      });
      if (selectedCompanyForDossier && selectedCompanyForDossier._id === companyId) {
        setSelectedCompanyForDossier(null);
      }
    } catch (err: any) {
      alert(`Failed to delete lead: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleArchiveLead = async (companyId: any, companyName: string) => {
    if (!user?.id) return;
    if (
      !window.confirm(
        `Archive "${companyName}"? This will safely remove it from active volunteer outreach while preserving historical records.`
      )
    ) {
      return;
    }

    try {
      setArchivingId(companyId);
      await archiveLeadMutation({
        adminClerkId: user.id,
        companyId,
      });
      if (selectedCompanyForDossier && selectedCompanyForDossier._id === companyId) {
        setSelectedCompanyForDossier(null);
      }
    } catch (err: any) {
      alert(`Failed to archive lead: ${err.message}`);
    } finally {
      setArchivingId(null);
    }
  };

  const handleRestoreLead = async (companyId: any, companyName: string) => {
    if (!user?.id) return;
    try {
      setArchivingId(companyId);
      await restoreLeadMutation({
        adminClerkId: user.id,
        companyId,
      });
    } catch (err: any) {
      alert(`Failed to restore lead: ${err.message}`);
    } finally {
      setArchivingId(null);
    }
  };

  const handleExportFilteredCsv = () => {
    if (!companies || companies.length === 0) {
      alert("No leads found for current filters to export.");
      return;
    }

    const headers = [
      "Company Name",
      "Industry",
      "Niche",
      "Priority",
      "Status",
      "Primary Contact",
      "Designation",
      "Phone",
      "Email",
      "Assigned Volunteer",
      "Location",
      "Website",
    ];

    const rows = companies.map((c: any) => [
      `"${c.companyName.replace(/"/g, '""')}"`,
      `"${(c.industry || "").replace(/"/g, '""')}"`,
      `"${(c.niche || "").replace(/"/g, '""')}"`,
      `"${c.priority}"`,
      `"${c.leadStatus}"`,
      `"${(c.primaryContact?.contactName || "").replace(/"/g, '""')}"`,
      `"${(c.primaryContact?.designation || "").replace(/"/g, '""')}"`,
      `"${c.primaryContact?.phone || ""}"`,
      `"${c.primaryContact?.email || ""}"`,
      `"${c.assignedVolunteer?.name || "Unassigned"}"`,
      `"${(c.location || "").replace(/"/g, '""')}"`,
      `"${c.website || ""}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `praroha26_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const kpiItems = [
    {
      label: "Total Leads",
      value: metrics.total,
      subtext: "Ingested corporate entities",
      icon: Building2,
      variant: "primary" as const,
    },
    {
      label: "Unassigned Pool",
      value: metrics.unassigned,
      subtext: "Awaiting volunteer allocation",
      icon: Layers,
      variant: (metrics.unassigned > 0 ? "warning" : "neutral") as "warning" | "neutral",
    },
    {
      label: "In Outreach",
      value: metrics.inPipeline,
      subtext: "Assigned or under negotiation",
      icon: Briefcase,
      variant: "info" as const,
    },
    {
      label: "Confirmed Sponsors",
      value: metrics.won,
      subtext: "Won / committed partnerships",
      icon: CheckCircle2,
      variant: "success" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header Bar */}
      <AdminPageHeader
        category="MASTER LEAD DIRECTORY"
        title="Corporate sponsorship records and outreach intelligence."
        description="Ingest canonical CSV spreadsheets, resolve duplicates, and manage the PRAROHA'26 corporate pipeline."
        actions={
          <>
            <Link href="/admin/assignments">
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-primary border-primary/30 bg-accent-mint/10 hover:bg-accent-mint/20"
              >
                <Users2 className="h-3.5 w-3.5 mr-1.5 text-primary" />
                Allocation Matrix
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportFilteredCsv}
              className="text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Export ({companies.length})
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1.5 text-text-muted" />
              CSV Template
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddLeadModalOpen(true)}
              className="text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Add Single Lead
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsImportModalOpen(true)}
              className="text-xs"
            >
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Import Leads (CSV)
            </Button>
          </>
        }
      />

      {/* 2. Directory KPI Strip */}
      <AdminKpiStrip items={kpiItems} columns={4} />

      {/* 3. Main Data Grid & Filter Toolbar */}
      <div className="border border-border bg-surface overflow-hidden">
        {/* Ownership Segmented Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border-subtle p-3 bg-surface-subtle/40">
          <div className="flex items-center rounded-lg border border-border bg-surface p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setSelectedOwnership("all")}
              className={`rounded-md px-3 py-1.5 transition-colors cursor-pointer ${
                selectedOwnership === "all"
                  ? "bg-primary text-white shadow-sm font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              All Leads ({metrics.total})
            </button>
            <button
              type="button"
              onClick={() => setSelectedOwnership("assigned")}
              className={`rounded-md px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedOwnership === "assigned"
                  ? "bg-primary text-white shadow-sm font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Assigned ({metrics.assigned ?? (metrics.total - metrics.unassigned)})
            </button>
            <button
              type="button"
              onClick={() => setSelectedOwnership("unassigned")}
              className={`rounded-md px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedOwnership === "unassigned"
                  ? "bg-amber-600 text-white shadow-sm font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <UserX className="h-3.5 w-3.5" />
              Unassigned Pool ({metrics.unassigned})
            </button>
          </div>

          <div className="text-xs text-text-muted flex items-center gap-2">
            <span>Showing <strong className="text-text-primary font-semibold">{companies.length}</strong> matching companies</span>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {feedbackMessage && (
          <div className="flex items-center justify-between gap-2 border-b border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/40 px-4 py-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-medium">{feedbackMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100 font-bold px-1.5 py-0.5 rounded text-sm"
            >
              ×
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border-subtle p-4 bg-surface-subtle/20">
          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search companies, niches, contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full border border-border bg-background pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Volunteer Filter */}
            <select
              value={selectedVolunteerFilter}
              onChange={(e) => setSelectedVolunteerFilter(e.target.value)}
              className="h-8 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-text-primary focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="all">Assigned to: All Volunteers</option>
              {volunteers.map((vol: any) => (
                <option key={vol._id} value={vol._id}>
                  Assigned to: {vol.name} ({vol.activeLeadsCount ?? 0} leads)
                </option>
              ))}
            </select>

            {/* Sector / Industry */}
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="h-8 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-text-primary focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="all">All Sectors ({industries.length})</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>

            {/* Lifecycle Status (Strict 10 Stages) */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-8 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-text-primary focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="all">All Stages</option>
              <option value="UNASSIGNED">Unassigned</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="CONTACTED">Contacted</option>
              <option value="INTERESTED">Interested</option>
              <option value="FOLLOW_UP">Follow-up</option>
              <option value="PROPOSAL_REQUESTED">Proposal Requested</option>
              <option value="PROPOSAL_SENT">Proposal Sent</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="WON">Won / Confirmed</option>
              <option value="LOST">Lost</option>
            </select>

            {/* Priority */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="h-8 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-text-primary focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>

            <button
              onClick={() => setShowArchived((prev) => !prev)}
              className={`h-8 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showArchived
                  ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                  : "bg-surface border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              <Archive className="h-3.5 w-3.5" />
              <span>{showArchived ? "Archived View (Active)" : "Show Archived"}</span>
            </button>

            {(searchQuery ||
              selectedOwnership !== "all" ||
              selectedVolunteerFilter !== "all" ||
              selectedIndustry !== "all" ||
              selectedStatus !== "all" ||
              selectedPriority !== "all" ||
              showArchived) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedOwnership("all");
                  setSelectedVolunteerFilter("all");
                  setSelectedIndustry("all");
                  setSelectedStatus("all");
                  setSelectedPriority("all");
                  setShowArchived(false);
                }}
                className="h-8 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Table */}
        {companies.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={Building2}
              title="No company leads found"
              description="Upload your corporate outreach spreadsheet or add single companies to populate the master directory."
              action={
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Import Leads (CSV)
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs text-text-secondary">
              <thead className="border-b border-border-subtle bg-surface-subtle/50 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="px-4 py-3">Company Entity</th>
                  <th className="px-4 py-3">Sector</th>
                  <th className="px-4 py-3">Primary Contact</th>
                  <th className="px-4 py-3">Phone & Classification</th>
                  <th className="px-4 py-3">Contact Quality</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Assigned SDR</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {companies.map((comp: any) => (
                  <tr
                    key={comp._id}
                    className="hover:bg-surface-subtle/50 transition-colors"
                  >
                    {/* Company */}
                    <td className="px-4 py-3 font-semibold text-text-primary">
                      <div>
                        <p className="text-text-primary font-bold">{comp.companyName}</p>
                        <p className="text-[10px] text-text-muted font-normal">
                          {comp.niche}
                        </p>
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="px-4 py-3 text-text-secondary">
                      {comp.industry}
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3 text-text-primary font-medium">
                      {comp.primaryContact ? (
                        <div>
                          <p>{comp.primaryContact.contactName}</p>
                          <p className="text-[10px] text-text-muted font-normal">
                            {comp.primaryContact.designation}
                          </p>
                        </div>
                      ) : (
                        <span className="text-text-muted italic">No contact</span>
                      )}
                    </td>

                    {/* Phone + Classification */}
                    <td className="px-4 py-3">
                      {comp.primaryContact ? (
                        <div className="space-y-1">
                          <span className="font-mono text-xs font-semibold text-text-primary block">
                            {comp.primaryContact.phone}
                          </span>
                          <PhoneTypeBadge
                            type={comp.primaryContact.phoneType || "unknown"}
                          />
                        </div>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>

                    {/* Contact Quality */}
                    <td className="px-4 py-3">
                      {comp.primaryContact ? (
                        <ContactVerificationBadge
                          level={comp.primaryContact.contactVerification}
                        />
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>

                    {/* Stage */}
                    <td className="px-4 py-3">
                      <LeadStatusBadge status={comp.leadStatus} />
                    </td>

                    {/* Assigned SDR */}
                    <td className="px-4 py-3">
                      {comp.assignedVolunteer ? (
                        <div className="space-y-0.5">
                          <span className="font-semibold text-text-primary flex items-center gap-1">
                            <Users className="h-3 w-3 text-primary" />
                            {comp.assignedVolunteer.name}
                          </span>
                          <span className="text-[10px] text-text-muted block">
                            {comp.assignedVolunteer.department || "Volunteer SDR"}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded border border-amber-500/20 bg-amber-50/70 dark:bg-amber-950/30 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-300">
                          <UserX className="h-2.5 w-2.5" />
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3">
                      <PriorityBadge priority={comp.priority} />
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                      {/* Primary Lead Ownership Actions: Assign, Reassign, Unassign */}
                      {(!comp.assignedVolunteer || comp.leadStatus === "UNASSIGNED") ? (
                        <Button
                          size="sm"
                          onClick={() => setAssigningLead(comp)}
                          className="h-7 px-2 text-xs bg-primary text-white hover:bg-primary-hover font-semibold"
                          title="Assign lead to volunteer"
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Assign
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReassigningLead(comp)}
                            className="h-7 px-2 text-xs border-dashed text-text-primary hover:bg-surface-subtle"
                            title="Reassign to another volunteer"
                          >
                            <ArrowRightLeft className="h-3 w-3 mr-1 text-primary" />
                            Reassign
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUnassigningLead(comp)}
                            className="h-7 px-2 text-xs text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                            title="Unassign lead and release to pool"
                          >
                            <UserX className="h-3 w-3 mr-1 text-amber-600" />
                            Unassign
                          </Button>
                        </>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCompanyForDossier(comp)}
                        className="h-7 px-2 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Dossier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCompanyForEdit(comp)}
                        className="h-7 px-2 text-xs text-primary hover:bg-accent-mint/20 border-primary/20"
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      {comp.isArchived ? (
                        <Button
                          variant="outline"
                          size="sm"
                          isLoading={archivingId === comp._id}
                          onClick={() => handleRestoreLead(comp._id, comp.companyName)}
                          className="h-7 px-2 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 border-amber-200 dark:border-amber-800/50"
                        >
                          <ArchiveRestore className="h-3 w-3 mr-1" />
                          Restore
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          isLoading={archivingId === comp._id}
                          onClick={() => handleArchiveLead(comp._id, comp.companyName)}
                          className="h-7 px-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border-amber-200 dark:border-amber-800/50"
                        >
                          <Archive className="h-3 w-3 mr-1" />
                          Archive
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        isLoading={deletingId === comp._id}
                        onClick={() => handleDeleteLead(comp._id, comp.companyName)}
                        className="h-7 px-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900/60"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CSV Import Modal */}
      <LeadImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* Single Lead Create Modal */}
      <ManualLeadCreateModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
      />

      {/* Edit Lead Modal */}
      <EditLeadModal
        isOpen={!!selectedCompanyForEdit}
        lead={selectedCompanyForEdit}
        onClose={() => setSelectedCompanyForEdit(null)}
      />

      {/* Company Dossier Slide-Over Modal */}
      <CompanyDossierDrawer
        company={selectedCompanyForDossier}
        isOpen={!!selectedCompanyForDossier}
        onClose={() => setSelectedCompanyForDossier(null)}
      />

      {/* Assignment Workflow Modals */}
      {assigningLead && (
        <AssignLeadModal
          isOpen={!!assigningLead}
          onClose={() => setAssigningLead(null)}
          companyId={assigningLead._id}
          companyName={assigningLead.companyName}
          defaultPriority={assigningLead.priority}
          onSuccess={() => {
            const leadName = assigningLead.companyName;
            setAssigningLead(null);
            setFeedbackMessage({
              type: "success",
              text: `Successfully assigned "${leadName}" to volunteer.`,
            });
            setTimeout(() => setFeedbackMessage(null), 5000);
          }}
        />
      )}

      {reassigningLead && (
        <ReassignLeadModal
          isOpen={!!reassigningLead}
          onClose={() => setReassigningLead(null)}
          companyId={reassigningLead._id}
          companyName={reassigningLead.companyName}
          currentVolunteerName={reassigningLead.assignedVolunteer?.name}
          currentVolunteerId={reassigningLead.assignedVolunteer?._id}
          leadStatus={reassigningLead.leadStatus}
          onSuccess={() => {
            const leadName = reassigningLead.companyName;
            setReassigningLead(null);
            setFeedbackMessage({
              type: "success",
              text: `Successfully reassigned "${leadName}". Previous owner logged in timeline.`,
            });
            setTimeout(() => setFeedbackMessage(null), 5000);
          }}
        />
      )}

      {unassigningLead && (
        <UnassignConfirmationModal
          isOpen={!!unassigningLead}
          onClose={() => setUnassigningLead(null)}
          companyId={unassigningLead._id}
          companyName={unassigningLead.companyName}
          currentVolunteerName={unassigningLead.assignedVolunteer?.name}
          onSuccess={() => {
            const leadName = unassigningLead.companyName;
            setUnassigningLead(null);
            setFeedbackMessage({
              type: "success",
              text: `Successfully unassigned "${leadName}" and returned to unassigned pool. All lead data and notes preserved.`,
            });
            setTimeout(() => setFeedbackMessage(null), 5000);
          }}
        />
      )}
    </div>
  );
}
