"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LeadStatusBadge,
  PriorityBadge,
  ContactVerificationBadge,
} from "@/components/ui/badge";
import { formatCurrencyINR, formatDate } from "@/lib/utils";
import { LeadStage } from "@/types";
import { OpportunityApprovalModal } from "@/components/admin/OpportunityApprovalModal";
import { CompanyDossierDrawer } from "@/components/admin/CompanyDossierDrawer";
import { CreateCommitmentModal } from "@/components/forms/CreateCommitmentModal";
import { EditCommitmentModal } from "@/components/forms/EditCommitmentModal";
import {
  Coins,
  Trophy,
  Gift,
  Building2,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Kanban,
  Table as TableIcon,
  Phone,
  User,
  Plus,
  FileCheck,
  Clock,
  AlertCircle,
  FileText,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronDown,
} from "lucide-react";

const STAGE_ORDER: LeadStage[] = [
  "UNASSIGNED",
  "ASSIGNED",
  "CONTACTED",
  "INTERESTED",
  "FOLLOW_UP",
  "PROPOSAL_REQUESTED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
];

const NEXT_STAGE_MAP: Partial<Record<LeadStage, LeadStage>> = {
  UNASSIGNED: "ASSIGNED",
  ASSIGNED: "CONTACTED",
  CONTACTED: "INTERESTED",
  INTERESTED: "FOLLOW_UP",
  FOLLOW_UP: "PROPOSAL_REQUESTED",
  PROPOSAL_REQUESTED: "PROPOSAL_SENT",
  PROPOSAL_SENT: "NEGOTIATION",
};

const COMMITMENT_STATUS_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  PROSPECT: { label: "Prospect", bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
  NEGOTIATING: { label: "Negotiating", bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
  PROPOSED: { label: "Proposed", bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  VERBAL_COMMITMENT: { label: "Verbal Agreement", bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  CONFIRMED: { label: "Confirmed / Signed", bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  DELIVERABLES_PENDING: { label: "Deliverables Pending", bg: "bg-orange-50", text: "text-orange-800", border: "border-orange-200" },
  COMPLETED: { label: "Completed", bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-200" },
  CANCELLED: { label: "Cancelled", bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
};

export default function SponsorshipCommitmentsPage() {
  const { user } = useAuthUser();
  const [activeTab, setActiveTab] = useState<"contracts" | "pipeline">("contracts");
  
  // Pipeline tab state
  const [pipelineSearchQuery, setPipelineSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  // Commitments tab state
  const [commitmentSearch, setCommitmentSearch] = useState("");
  const [commitmentStatusFilter, setCommitmentStatusFilter] = useState("all");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCommitmentForEdit, setSelectedCommitmentForEdit] = useState<any | null>(null);
  const [approvalCompany, setApprovalCompany] = useState<any | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<Id<"companies"> | null>(null);

  // Queries
  const metrics = useQuery(api.pipeline.getPipelineMetrics, {});
  const commitments = useQuery(api.commitments.getAllCommitments, {
    status: commitmentStatusFilter,
    search: commitmentSearch,
  });
  const allCompanies = useQuery(api.companies.getAllCompanies, {});
  const pipelineData = useQuery(api.pipeline.getPipelineBoard, {
    search: pipelineSearchQuery,
    priorityFilter,
  });
  const selectedCompany = useQuery(
    api.companies.getCompanyDetails,
    selectedCompanyId ? { companyId: selectedCompanyId } : "skip"
  );

  // Mutations
  const updateStageMutation = useMutation(api.pipeline.updateLeadStage);
  const updateCommitmentStatusMutation = useMutation(api.commitments.updateCommitmentStatus);
  const deleteCommitmentMutation = useMutation(api.commitments.deleteCommitment);

  const handleQuickAdvance = async (companyId: Id<"companies">, currentStage: LeadStage) => {
    const nextStage = NEXT_STAGE_MAP[currentStage];
    if (!nextStage || !user?.id) return;

    try {
      await updateStageMutation({
        companyId,
        clerkId: user.id,
        targetStage: nextStage,
      });
    } catch (err: any) {
      alert(err.message || "Failed to advance stage.");
    }
  };

  const handleStatusChange = async (commitmentId: Id<"sponsorshipCommitments">, newStatus: any) => {
    if (!user?.id) return;
    try {
      await updateCommitmentStatusMutation({
        commitmentId,
        status: newStatus,
        adminClerkId: user.id,
      });
    } catch (err: any) {
      alert(err.message || "Failed to update commitment status.");
    }
  };

  const handleDeleteCommitment = async (commitmentId: Id<"sponsorshipCommitments">, companyName: string) => {
    if (!user?.id) return;
    if (!confirm(`Are you sure you want to delete the sponsorship commitment for ${companyName}?`)) {
      return;
    }
    try {
      await deleteCommitmentMutation({
        commitmentId,
        adminClerkId: user.id,
      });
    } catch (err: any) {
      alert(err.message || "Failed to delete commitment.");
    }
  };

  const safeMetrics = metrics || {
    totalLeads: 0,
    activeOpportunities: 0,
    pipelinePotentialValue: 0,
    confirmedCash: 0,
    confirmedInKind: 0,
    totalConfirmedRevenue: 0,
    wonCount: 0,
    negotiationCount: 0,
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
              P1 SPONSORSHIP OPERATIONS
            </span>
            <span className="text-xs text-text-muted">PRAROHA'26 SOE CUSAT</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            Sponsorship Commitments & Pipeline Management
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage legally ratified corporate commitments, monitor non-cash valuations, and oversee the 10-stage outreach pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Main Tab Switcher */}
          <div className="flex rounded-xl border border-border bg-surface p-1 shadow-2xs">
            <button
              onClick={() => setActiveTab("contracts")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "contracts"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <FileCheck className="h-3.5 w-3.5" />
              Commitments & Contracts
            </button>
            <button
              onClick={() => setActiveTab("pipeline")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "pipeline"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              10-Stage Pipeline
            </button>
          </div>

          {/* New Commitment Button */}
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
            className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            New Commitment
          </Button>
        </div>
      </div>

      {/* 2. High-Level Financial KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard
          title="Total Confirmed Revenue"
          value={formatCurrencyINR(safeMetrics.totalConfirmedRevenue)}
          change={`${safeMetrics.wonCount} Confirmed Sponsors`}
          icon={Trophy}
        />
        <StatCard
          title="Confirmed Cash"
          value={formatCurrencyINR(safeMetrics.confirmedCash)}
          change="Liquid sponsorship intake"
          icon={Coins}
        />
        <StatCard
          title="In-Kind Valuation"
          value={formatCurrencyINR(safeMetrics.confirmedInKind)}
          change="Non-cash operational savings"
          icon={Gift}
        />
        <StatCard
          title="In Negotiation"
          value={safeMetrics.negotiationCount}
          change="Pending ratification"
          icon={Building2}
        />
        <StatCard
          title="Pipeline Potential"
          value={formatCurrencyINR(safeMetrics.pipelinePotentialValue)}
          change={`${safeMetrics.activeOpportunities} Active Leads`}
          icon={TrendingUp}
        />
        <StatCard
          title="Total Sourced Leads"
          value={safeMetrics.totalLeads}
          change="Across 10 lifecycle stages"
          icon={CheckCircle2}
        />
      </div>

      {/* 3. TAB 1: COMMITMENTS & CONTRACTS TABLE */}
      {activeTab === "contracts" && (
        <div className="space-y-4">
          {/* Commitments Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                <Input
                  type="text"
                  placeholder="Search commitments by company, volunteer, MoU, or in-kind..."
                  value={commitmentSearch}
                  onChange={(e) => setCommitmentSearch(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <Filter className="h-3.5 w-3.5 text-text-muted" />
                <select
                  value={commitmentStatusFilter}
                  onChange={(e) => setCommitmentStatusFilter(e.target.value)}
                  className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-hidden"
                >
                  <option value="all">All Statuses</option>
                  <option value="PROSPECT">Prospect</option>
                  <option value="NEGOTIATING">Negotiating</option>
                  <option value="PROPOSED">Proposed</option>
                  <option value="VERBAL_COMMITMENT">Verbal Agreement</option>
                  <option value="CONFIRMED">Confirmed / Signed</option>
                  <option value="DELIVERABLES_PENDING">Deliverables Pending</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-text-muted font-medium">
              Showing <strong>{commitments?.length || 0}</strong> contract commitments
            </div>
          </div>

          {/* Commitments Table */}
          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface-subtle/70 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    <th className="p-3.5">Company & Contact</th>
                    <th className="p-3.5">Package & Status</th>
                    <th className="p-3.5">Commercial Valuation</th>
                    <th className="p-3.5">In-Kind & Deliverables</th>
                    <th className="p-3.5">MoU / Signed</th>
                    <th className="p-3.5">Assigned SDR</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {!commitments || commitments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center">
                        <div className="max-w-md mx-auto space-y-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 mx-auto">
                            <FileCheck className="h-6 w-6" />
                          </div>
                          <h4 className="text-sm font-bold text-text-primary">
                            No sponsorship commitments found
                          </h4>
                          <p className="text-xs text-text-muted leading-relaxed">
                            {commitmentSearch || commitmentStatusFilter !== "all"
                              ? "No commitments match your current filters. Try resetting search or status filters."
                              : "No corporate commitments recorded yet. Record commitments directly using '+ New Commitment' or authorize deals from the 10-Stage Pipeline Board when negotiations are completed."}
                          </p>
                          <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            size="sm"
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            Record First Commitment
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    commitments.map((c: any) => {
                      const statusStyle =
                        COMMITMENT_STATUS_STYLES[c.status] || COMMITMENT_STATUS_STYLES.CONFIRMED;
                      return (
                        <tr key={c._id} className="hover:bg-surface-subtle/50 transition-colors">
                          {/* Company & Contact */}
                          <td className="p-3.5">
                            <button
                              onClick={() => setSelectedCompanyId(c.companyId)}
                              className="font-bold text-text-primary hover:text-primary text-left block"
                            >
                              {c.companyName}
                            </button>
                            <span className="text-[11px] text-text-secondary">{c.industry}</span>
                            {c.contactName && (
                              <div className="text-[10px] text-text-muted mt-0.5">
                                {c.contactName} {c.contactPhone && `(${c.contactPhone})`}
                              </div>
                            )}
                          </td>

                          {/* Package & Status */}
                          <td className="p-3.5">
                            <span className="font-semibold text-text-primary block text-xs">
                              {c.packageTier}
                            </span>
                            <div className="mt-1 flex items-center gap-1.5">
                              <select
                                value={c.status}
                                onChange={(e) => handleStatusChange(c._id, e.target.value)}
                                className={`text-[10px] font-bold rounded-md px-2 py-0.5 border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} focus:outline-hidden cursor-pointer`}
                              >
                                <option value="PROSPECT">Prospect</option>
                                <option value="NEGOTIATING">Negotiating</option>
                                <option value="PROPOSED">Proposed</option>
                                <option value="VERBAL_COMMITMENT">Verbal Agreement</option>
                                <option value="CONFIRMED">Confirmed / Signed</option>
                                <option value="DELIVERABLES_PENDING">Deliverables Pending</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                            </div>
                          </td>

                          {/* Commercial Valuation */}
                          <td className="p-3.5">
                            <div className="font-extrabold text-primary text-sm">
                              {formatCurrencyINR(c.totalValuation)}
                            </div>
                            <div className="text-[10px] text-text-muted mt-0.5">
                              Cash: {formatCurrencyINR(c.cashAmount || 0)}
                              {c.inKindValuation ? ` | In-Kind: ${formatCurrencyINR(c.inKindValuation)}` : ""}
                            </div>
                          </td>

                          {/* In-Kind & Deliverables */}
                          <td className="p-3.5">
                            <div className="text-[11px] font-medium text-text-primary">
                              {c.inKindCategory ? c.inKindCategory.replace(/_/g, " ") : "Pure Cash Sponsor"}
                            </div>
                            <div className="text-[10px] text-text-muted mt-0.5">
                              {c.deliverables && c.deliverables.length > 0
                                ? `${c.deliverables.length} committed deliverables`
                                : "No deliverables specified"}
                            </div>
                          </td>

                          {/* MoU / Signed */}
                          <td className="p-3.5">
                            {c.mouReference ? (
                              <span className="font-mono text-[11px] font-bold text-text-primary block">
                                {c.mouReference}
                              </span>
                            ) : (
                              <span className="text-[11px] text-text-muted italic block">
                                Pending MoU
                              </span>
                            )}
                            <span className="text-[10px] text-text-muted">
                              {formatDate(c.signedAt)}
                            </span>
                          </td>

                          {/* Assigned SDR */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5 text-xs text-text-primary">
                              <User className="h-3.5 w-3.5 text-text-muted" />
                              <span>{c.volunteerName}</span>
                            </div>
                            {c.authorizerName && (
                              <span className="text-[10px] text-text-muted block mt-0.5">
                                Signed by: {c.authorizerName}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCompanyId(c.companyId)}
                              className="h-7 text-xs"
                            >
                              Dossier
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCommitmentForEdit(c)}
                              className="h-7 text-xs text-text-secondary hover:text-text-primary"
                            >
                              <Edit2 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCommitment(c._id, c.companyName)}
                              className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: 10-STAGE PIPELINE BOARD */}
      {activeTab === "pipeline" && (
        <div className="space-y-4">
          {/* Pipeline Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                <Input
                  type="text"
                  placeholder="Search companies, sectors, or niches in pipeline..."
                  value={pipelineSearchQuery}
                  onChange={(e) => setPipelineSearchQuery(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <Filter className="h-3.5 w-3.5 text-text-muted" />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-hidden"
                >
                  <option value="all">All Priorities</option>
                  <option value="High">P0 - Critical</option>
                  <option value="Medium">P1 - High</option>
                  <option value="Normal">P2 - Medium</option>
                  <option value="Low">P3 - Low</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-text-muted font-medium">
                Showing <strong>{pipelineData?.totalCount || 0}</strong> corporate leads
              </div>

              {/* View Switcher inside Pipeline */}
              <div className="flex rounded-lg border border-border bg-surface-subtle p-0.5">
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "kanban" ? "bg-surface shadow-2xs text-primary" : "text-text-muted"
                  }`}
                  title="Kanban Board View"
                >
                  <Kanban className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "table" ? "bg-surface shadow-2xs text-primary" : "text-text-muted"
                  }`}
                  title="Summary Table View"
                >
                  <TableIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Kanban Board View */}
          {viewMode === "kanban" ? (
            <div className="flex gap-3 overflow-x-auto pb-4 pt-1">
              {STAGE_ORDER.map((stage) => {
                const stageCompanies = pipelineData?.columns[stage] || [];
                const stageValuation = stageCompanies.reduce((acc, c) => {
                  if (c.commitment) return acc + c.commitment.totalValuation;
                  if (c.latestProposal) return acc + c.latestProposal.totalValuation;
                  return acc + (c.recommendedAskMax || c.recommendedAskMin || 0);
                }, 0);

                return (
                  <div
                    key={stage}
                    className={`flex-shrink-0 w-80 rounded-2xl border border-border bg-surface-subtle/40 p-3 flex flex-col max-h-[70vh] shadow-xs ${
                      stage === "WON"
                        ? "bg-emerald-50/30 border-emerald-200"
                        : stage === "NEGOTIATION"
                        ? "bg-purple-50/30 border-purple-200"
                        : ""
                    }`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border-subtle">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-text-primary">
                          {stage.replace("_", " ")}
                        </span>
                        <span className="rounded-full bg-surface border border-border px-1.5 py-0.2 text-[10px] font-extrabold text-text-secondary">
                          {stageCompanies.length}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-primary">
                        {formatCurrencyINR(stageValuation)}
                      </span>
                    </div>

                    {/* Column Cards Container */}
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                      {stageCompanies.length === 0 ? (
                        <div className="py-8 text-center text-[11px] text-text-muted">
                          No leads in this stage
                        </div>
                      ) : (
                        stageCompanies.map((c: any) => (
                          <div
                            key={c._id}
                            className="rounded-xl border border-border bg-surface p-3 text-xs space-y-2 shadow-2xs hover:border-primary/50 transition-all group"
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <div>
                                <button
                                  onClick={() => setSelectedCompanyId(c._id)}
                                  className="font-bold text-text-primary hover:text-primary transition-colors text-left line-clamp-1"
                                >
                                  {c.companyName}
                                </button>
                                <span className="text-[10px] text-text-secondary block">
                                  {c.industry}
                                </span>
                              </div>
                              <PriorityBadge priority={c.priority} />
                            </div>

                            {/* Financial Ask / Valuation Badge */}
                            <div className="rounded-lg bg-surface-subtle border border-border-subtle p-2 flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-text-muted uppercase">
                                {c.commitment
                                  ? "Ratified Value"
                                  : c.latestProposal
                                  ? `${c.latestProposal.packageTier} Tier`
                                  : "Target Ask"}
                              </span>
                              <span className="font-extrabold text-primary text-xs">
                                {formatCurrencyINR(
                                  c.commitment
                                    ? c.commitment.totalValuation
                                    : c.latestProposal
                                    ? c.latestProposal.totalValuation
                                    : c.recommendedAskMax || c.recommendedAskMin || 100000
                                )}
                              </span>
                            </div>

                            {/* Contact Person */}
                            {c.primaryContact && (
                              <div className="flex items-center justify-between text-[11px] text-text-secondary">
                                <span className="truncate max-w-[140px] font-medium">
                                  {c.primaryContact.contactName}
                                </span>
                                <ContactVerificationBadge level={c.primaryContact.contactVerification} />
                              </div>
                            )}

                            {/* Assigned Volunteer */}
                            {c.assignedVolunteer && (
                              <div className="flex items-center gap-1.5 text-[10px] text-text-muted border-t border-border-subtle pt-1.5">
                                <User className="h-3 w-3 text-primary" />
                                <span>SDR: <strong>{c.assignedVolunteer.name}</strong></span>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedCompanyId(c._id)}
                                className="h-6 px-2 text-[10px] text-text-secondary hover:text-primary"
                              >
                                Dossier
                              </Button>

                              {stage === "NEGOTIATION" ? (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => setApprovalCompany(c)}
                                  className="h-6 px-2 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                >
                                  <Award className="h-3 w-3 mr-1" />
                                  Authorize WON
                                </Button>
                              ) : NEXT_STAGE_MAP[stage] ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuickAdvance(c._id, stage)}
                                  className="h-6 px-2 text-[10px] text-primary border-primary/30 hover:bg-primary/5"
                                >
                                  Advance
                                  <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                              ) : (
                                <span className="text-[10px] font-bold text-emerald-700">
                                  {stage === "WON" ? "★ Confirmed" : "Closed"}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Summary Table View */
            <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-surface-subtle/70 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      <th className="p-3.5">Company & Industry</th>
                      <th className="p-3.5">Current Stage</th>
                      <th className="p-3.5">Priority</th>
                      <th className="p-3.5">Committed / Proposal Value</th>
                      <th className="p-3.5">Primary Contact</th>
                      <th className="p-3.5">Assigned Volunteer</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {STAGE_ORDER.flatMap((stage) => pipelineData?.columns[stage] || []).map(
                      (c: any) => (
                        <tr key={c._id} className="hover:bg-surface-subtle/50 transition-colors">
                          <td className="p-3.5">
                            <button
                              onClick={() => setSelectedCompanyId(c._id)}
                              className="font-bold text-text-primary hover:text-primary text-left block"
                            >
                              {c.companyName}
                            </button>
                            <span className="text-[11px] text-text-secondary">{c.industry}</span>
                          </td>
                          <td className="p-3.5">
                            <LeadStatusBadge status={c.leadStatus} />
                          </td>
                          <td className="p-3.5">
                            <PriorityBadge priority={c.priority} />
                          </td>
                          <td className="p-3.5 font-bold text-primary">
                            {formatCurrencyINR(
                              c.commitment
                                ? c.commitment.totalValuation
                                : c.latestProposal
                                ? c.latestProposal.totalValuation
                                : c.recommendedAskMax || c.recommendedAskMin || 100000
                            )}
                          </td>
                          <td className="p-3.5">
                            {c.primaryContact ? (
                              <div>
                                <span className="font-medium text-text-primary block">
                                  {c.primaryContact.contactName}
                                </span>
                                <span className="text-[10px] text-text-muted">
                                  {c.primaryContact.phone}
                                </span>
                              </div>
                            ) : (
                              <span className="text-text-muted">—</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            {c.assignedVolunteer ? (
                              <span className="font-medium text-text-primary">
                                {c.assignedVolunteer.name}
                              </span>
                            ) : (
                              <span className="text-text-muted italic">Unassigned</span>
                            )}
                          </td>
                          <td className="p-3.5 text-right space-x-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCompanyId(c._id)}
                              className="h-7 text-xs"
                            >
                              Dossier
                            </Button>
                            {c.leadStatus === "NEGOTIATION" ? (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setApprovalCompany(c)}
                                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 font-bold"
                              >
                                <Award className="h-3 w-3 mr-1" />
                                Sign WON
                              </Button>
                            ) : NEXT_STAGE_MAP[c.leadStatus as LeadStage] ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickAdvance(c._id, c.leadStatus)}
                                className="h-7 text-xs text-primary border-primary/30"
                              >
                                Advance
                              </Button>
                            ) : null}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Create Commitment Modal */}
      <CreateCommitmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* 6. Edit Commitment Modal */}
      <EditCommitmentModal
        isOpen={!!selectedCommitmentForEdit}
        onClose={() => setSelectedCommitmentForEdit(null)}
        commitment={selectedCommitmentForEdit}
      />

      {/* 7. Opportunity Approval Modal (Exclusive Admin Signing Authority) */}
      <OpportunityApprovalModal
        isOpen={!!approvalCompany}
        onClose={() => setApprovalCompany(null)}
        company={approvalCompany}
      />

      {/* 8. Company Dossier Drawer with Timeline & Proposals */}
      <CompanyDossierDrawer
        company={selectedCompany}
        isOpen={!!selectedCompanyId}
        onClose={() => setSelectedCompanyId(null)}
      />
    </div>
  );
}
