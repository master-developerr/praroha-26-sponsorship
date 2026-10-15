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
import { CreateProposalModal } from "@/components/pipeline/CreateProposalModal";
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

export default function SponsorshipCommitmentsPage() {
  const { user } = useAuthUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  // Modals state
  const [approvalCompany, setApprovalCompany] = useState<any | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<Id<"companies"> | null>(null);
  const [proposalCompany, setProposalCompany] = useState<any | null>(null);

  const metrics = useQuery(api.pipeline.getPipelineMetrics, {});
  const pipelineData = useQuery(api.pipeline.getPipelineBoard, {
    search: searchQuery,
    priorityFilter,
  });

  const selectedCompany = useQuery(
    api.companies.getCompanyDetails,
    selectedCompanyId ? { companyId: selectedCompanyId } : "skip"
  );

  const updateStageMutation = useMutation(api.pipeline.updateLeadStage);

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
            Sponsorship Commitments & 10-Stage Pipeline
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Monitor real-time corporate sponsorship velocity, track in-kind valuations, and authorize binding commitments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <div className="flex rounded-xl border border-border bg-surface p-1 shadow-2xs">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === "kanban"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              10-Stage Board
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === "table"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              Summary Table
            </button>
          </div>
        </div>
      </div>

      {/* 2. High-Level Financial KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard
          title="Total Pipeline Potential"
          value={formatCurrencyINR(safeMetrics.pipelinePotentialValue)}
          change={`${safeMetrics.activeOpportunities} Active Opportunities`}
          icon={TrendingUp}
        />
        <StatCard
          title="Total Confirmed Revenue"
          value={formatCurrencyINR(safeMetrics.totalConfirmedRevenue)}
          change={`${safeMetrics.wonCount} Confirmed Sponsors`}
          icon={Trophy}
        />
        <StatCard
          title="Confirmed Cash"
          value={formatCurrencyINR(safeMetrics.confirmedCash)}
          change="Liquid sponsorship bank intake"
          icon={Coins}
        />
        <StatCard
          title="Confirmed In-Kind Valuation"
          value={formatCurrencyINR(safeMetrics.confirmedInKind)}
          change="Non-cash operational savings"
          icon={Gift}
        />
        <StatCard
          title="In Negotiation"
          value={safeMetrics.negotiationCount}
          change="Pending admin commitment"
          icon={Building2}
        />
        <StatCard
          title="Total Sourced Leads"
          value={safeMetrics.totalLeads}
          change="Across 10 lifecycle stages"
          icon={CheckCircle2}
        />
      </div>

      {/* 3. Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <Input
              type="text"
              placeholder="Search companies, sectors, or niches in pipeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

        <div className="text-xs text-text-muted font-medium">
          Showing <strong>{pipelineData?.totalCount || 0}</strong> corporate leads
        </div>
      </div>

      {/* 4. Kanban Pipeline Board View */}
      {viewMode === "kanban" ? (
        <div className="flex gap-3 overflow-x-auto pb-4 pt-1">
          {STAGE_ORDER.map((stage) => {
            const stageCompanies = pipelineData?.columns[stage] || [];
            const stageValuation = stageCompanies.reduce((acc, c) => {
              if (c.commitment) return acc + c.commitment.totalValuation;
              if (c.latestProposal) return acc + c.latestProposal.totalValuation;
              return acc + (c.recommendedAskMax || c.recommendedAskMin || 0);
            }, 0);

            const isNegotiationOrWon = stage === "NEGOTIATION" || stage === "WON";

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

      {/* 5. Opportunity Approval Modal (Exclusive Admin Signing Authority) */}
      <OpportunityApprovalModal
        isOpen={!!approvalCompany}
        onClose={() => setApprovalCompany(null)}
        company={approvalCompany}
      />

      {/* 6. Company Dossier Drawer with Timeline & Proposals */}
      <CompanyDossierDrawer
        company={selectedCompany}
        isOpen={!!selectedCompanyId}
        onClose={() => setSelectedCompanyId(null)}
      />
    </div>
  );
}
