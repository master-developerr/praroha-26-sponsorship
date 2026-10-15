"use client";

import React, { useState } from "react";
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
  Edit3,
  Trash2,
} from "lucide-react";

export function MasterLeadDirectoryView() {
  const { user } = useAuthUser();
  const deleteLeadMutation = useMutation(api.companies.deleteLead);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  // Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [selectedCompanyForDossier, setSelectedCompanyForDossier] = useState<any | null>(null);
  const [selectedCompanyForEdit, setSelectedCompanyForEdit] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Convex Queries
  const metrics = useQuery(api.companies.getCompanyMetrics, {}) || {
    total: 0,
    unassigned: 0,
    inPipeline: 0,
    won: 0,
  };

  const industries = useQuery(api.companies.getDistinctIndustries, {}) || [];

  const companies = useQuery(api.companies.getAllCompanies, {
    search: searchQuery || undefined,
    industry: selectedIndustry || undefined,
    status: selectedStatus || undefined,
    priority: selectedPriority || undefined,
  }) || [];

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

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Master Company Lead Directory
          </h1>
          <p className="mt-1 text-xs text-text-secondary">
            Ingest canonical CSV spreadsheets, resolve duplicates, and manage the PRAROHA'26 corporate pipeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
        </div>
      </div>

      {/* 2. Directory Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            Total Leads
          </span>
          <span className="text-2xl font-bold text-text-primary mt-1.5 block">
            {metrics.total}
          </span>
          <p className="text-[10px] text-text-secondary mt-0.5">
            Ingested corporate entities
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-amber-600" />
            Unassigned Pool
          </span>
          <span className="text-2xl font-bold text-amber-700 mt-1.5 block">
            {metrics.unassigned}
          </span>
          <p className="text-[10px] text-text-secondary mt-0.5">
            Awaiting volunteer allocation
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-sky-600" />
            In Outreach
          </span>
          <span className="text-2xl font-bold text-sky-700 mt-1.5 block">
            {metrics.inPipeline}
          </span>
          <p className="text-[10px] text-text-secondary mt-0.5">
            Assigned or under negotiation
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Confirmed Sponsors
          </span>
          <span className="text-2xl font-bold text-emerald-700 mt-1.5 block">
            {metrics.won}
          </span>
          <p className="text-[10px] text-text-secondary mt-0.5">
            Won / committed partnerships
          </p>
        </div>
      </div>

      {/* 3. Main Data Grid & Filter Toolbar */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border-subtle pb-4">
          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search companies, niches, contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded-lg border border-border bg-surface-subtle pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
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

            {(searchQuery ||
              selectedIndustry !== "all" ||
              selectedStatus !== "all" ||
              selectedPriority !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedIndustry("all");
                  setSelectedStatus("all");
                  setSelectedPriority("all");
                }}
                className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
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
                          <span className="font-semibold text-text-primary block">
                            {comp.assignedVolunteer.name}
                          </span>
                          <span className="text-[10px] text-text-muted block">
                            {comp.assignedVolunteer.department}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
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
                      <Button
                        variant="outline"
                        size="sm"
                        isLoading={deletingId === comp._id}
                        onClick={() => handleDeleteLead(comp._id, comp.companyName)}
                        className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
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
    </div>
  );
}
