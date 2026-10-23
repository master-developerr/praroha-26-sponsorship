"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/components/providers/AuthProvider";
import {
  Users2,
  Building2,
  CheckCircle2,
  Search,
  Filter,
  UserCheck,
  Flame,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  PriorityBadge,
  LeadStatusBadge,
  ContactVerificationBadge,
  PhoneTypeBadge,
} from "@/components/ui/badge";
import { CompanyDossierDrawer } from "@/components/admin/CompanyDossierDrawer";
import { ReassignLeadModal } from "@/components/admin/ReassignLeadModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminKpiStrip } from "@/components/admin/AdminKpiStrip";
import { PriorityLevel } from "@/types";

export function LeadAssignmentMatrixView() {
  const { user } = useAuthUser();

  // Filters state
  const [leadSearch, setLeadSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [volunteerSearch, setVolunteerSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Selection state
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<Id<"companies">>>(
    new Set()
  );
  const [targetVolunteerId, setTargetVolunteerId] = useState<Id<"users"> | null>(
    null
  );

  // Modal / Drawer state
  const [dossierCompanyId, setDossierCompanyId] = useState<Id<"companies"> | null>(
    null
  );
  const [isAssigning, setIsAssigning] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Live Convex Subscriptions
  const unassignedPool = useQuery(api.assignments.getUnassignedPool, {
    search: leadSearch,
    priority: priorityFilter,
  });

  const volunteerRoster = useQuery(
    api.assignments.getVolunteerRosterWithWorkload,
    {
      search: volunteerSearch,
      department: departmentFilter,
    }
  );

  const metrics = useQuery(api.companies.getCompanyMetrics);

  const dossierCompany = useQuery(
    api.companies.getCompanyDetails,
    dossierCompanyId ? { companyId: dossierCompanyId } : "skip"
  );

  const assignBatchMutation = useMutation(api.assignments.assignLeadsBatch);

  // Selected target volunteer object
  const targetVolunteer = useMemo(() => {
    if (!targetVolunteerId || !volunteerRoster) return null;
    return (volunteerRoster as any[]).find((v: any) => v._id === targetVolunteerId) || null;
  }, [targetVolunteerId, volunteerRoster]);

  // Lead selection toggles
  const handleToggleLead = (id: Id<"companies">) => {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectCount = (count: number) => {
    if (!unassignedPool) return;
    const items = (unassignedPool as any[]).slice(0, count);
    setSelectedLeadIds(new Set(items.map((c: any) => c._id)));
  };

  const handleSelectAllLeads = () => {
    if (!unassignedPool) return;
    if (selectedLeadIds.size === unassignedPool.length) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set((unassignedPool as any[]).map((c: any) => c._id)));
    }
  };

  const handleExecuteBatchAssignment = async () => {
    if (!user?.id || !targetVolunteerId || selectedLeadIds.size === 0) return;

    try {
      setIsAssigning(true);
      setFeedbackMessage(null);

      const res = await assignBatchMutation({
        adminClerkId: user.id,
        companyIds: Array.from(selectedLeadIds),
        volunteerId: targetVolunteerId,
      });

      setFeedbackMessage(
        `Successfully allocated ${res.assignedCount} leads to ${res.volunteerName}!`
      );
      setSelectedLeadIds(new Set());

      setTimeout(() => {
        setFeedbackMessage(null);
      }, 5000);
    } catch (err: any) {
      alert(`Assignment failed: ${err.message}`);
    } finally {
      setIsAssigning(false);
    }
  };

  const kpiItems = [
    {
      label: "Unassigned Pool",
      value: metrics?.unassigned ?? 0,
      subtext: "Awaiting distribution",
      icon: Building2,
      variant: (metrics?.unassigned ?? 0) > 0 ? ("warning" as const) : ("neutral" as const),
    },
    {
      label: "Assigned Leads",
      value: (metrics?.total ?? 0) - (metrics?.unassigned ?? 0),
      subtext: "Currently in SDR queues",
      icon: CheckCircle2,
      variant: "primary" as const,
    },
    {
      label: "Active Assignees",
      value: volunteerRoster?.length ?? 0,
      subtext: "Approved volunteers & Admins",
      icon: Users2,
      variant: "info" as const,
    },
    {
      label: "In Pipeline",
      value: metrics?.inPipeline ?? 0,
      subtext: "Active corporate touchpoints",
      icon: Flame,
      variant: "success" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Editorial Header */}
      <AdminPageHeader
        category="LEAD ALLOCATION"
        title="Distribute sponsorship opportunities across the active outreach team."
        description="Balance corporate pipeline distribution between student SDRs and Sponsorship Committee Admins with real-time capacity monitoring."
      />

      {/* Aggregate KPI Strip */}
      <AdminKpiStrip items={kpiItems} columns={4} />

      {/* Success Notification Alert */}
      {feedbackMessage && (
        <div className="flex items-center gap-2 border border-emerald-500/30 bg-accent-mint p-4 text-xs text-success shadow-xs animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
          <span className="font-semibold">{feedbackMessage}</span>
        </div>
      )}

      {/* 2. Main Two-Column Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Unassigned Leads Pool (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-border bg-surface p-5 space-y-4">
            {/* Header & Select All */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-text-muted" />
                <h2 className="text-sm font-bold text-text-primary">
                  Unassigned Leads Pool
                </h2>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-700 border border-zinc-200">
                  {unassignedPool?.length ?? 0}
                </span>
              </div>

              {unassignedPool && unassignedPool.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-text-muted font-medium">Quick Select:</span>
                  {[5, 10, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSelectCount(num)}
                      className="px-2 py-0.5 rounded bg-surface-subtle border border-border text-text-secondary hover:text-primary hover:border-primary text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleSelectAllLeads}
                    className="px-2 py-0.5 rounded bg-accent-mint/30 border border-primary/20 text-primary text-[11px] font-semibold transition-colors cursor-pointer ml-1"
                  >
                    {selectedLeadIds.size === unassignedPool.length ? "Clear" : "All"}
                  </button>
                </div>
              )}
            </div>

            {/* Search and Priority Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Filter by company, niche, or location..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="h-8 w-full rounded-lg border border-border bg-surface-subtle/50 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span>Priority:</span>
                <select
                  value={priorityFilter}
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
            </div>

            {/* Leads List */}
            {unassignedPool === undefined ? (
              <div className="py-12 text-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                <p className="text-xs text-text-muted mt-2">Loading unassigned pool...</p>
              </div>
            ) : unassignedPool.length === 0 ? (
              <div className="py-8">
                <EmptyState
                  icon={Building2}
                  title="Unassigned Pool Empty"
                  description="All ingested corporate leads have been allocated to student SDRs. Import a new CSV batch to allocate more."
                />
              </div>
            ) : (
              <div className="divide-y divide-border-subtle max-h-[600px] overflow-y-auto pr-1">
                {(unassignedPool as any[]).map((lead: any) => {
                  const isChecked = selectedLeadIds.has(lead._id);
                  return (
                    <div
                      key={lead._id}
                      onClick={() => handleToggleLead(lead._id)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl transition-colors cursor-pointer ${
                        isChecked
                          ? "bg-accent-mint/15 border border-primary/30"
                          : "hover:bg-surface-subtle border border-transparent"
                      }`}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                      />

                      {/* Lead Details */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-text-primary">
                              {lead.companyName}
                            </span>
                            <PriorityBadge priority={lead.priority} />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDossierCompanyId(lead._id);
                            }}
                            className="text-[11px] font-medium text-text-muted hover:text-primary transition-colors underline"
                          >
                            Dossier
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-text-secondary flex-wrap">
                          <span className="rounded bg-surface-subtle px-1.5 py-0.2 border border-border-subtle font-medium">
                            {lead.industry}
                          </span>
                          <span>•</span>
                          <span className="text-text-muted">{lead.niche}</span>
                          {lead.location && (
                            <>
                              <span>•</span>
                              <span className="inline-flex items-center gap-0.5 text-text-muted">
                                <MapPin className="h-2.5 w-2.5" />
                                {lead.location}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Primary Contact Attribution */}
                        {lead.primaryContact ? (
                          <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px]">
                            <span className="font-medium text-text-primary">
                              {lead.primaryContact.contactName} ({lead.primaryContact.designation})
                            </span>
                            <ContactVerificationBadge
                              level={lead.primaryContact.contactVerification}
                            />
                            <PhoneTypeBadge type={lead.primaryContact.phoneType} />
                          </div>
                        ) : (
                          <p className="text-[10px] text-text-muted italic pt-0.5">
                            No attached contact person
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Approved Assignees Roster & Workload (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-border bg-surface p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-text-primary">
                  Target Assignee Roster
                </h2>
                <span className="rounded-full bg-accent-mint/30 px-2 py-0.5 text-xs font-bold text-primary border border-primary/20">
                  {volunteerRoster?.length ?? 0}
                </span>
              </div>
              <span className="text-[11px] text-text-muted">
                Sorted by available capacity
              </span>
            </div>

            {/* Volunteer Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
              <input
                type="text"
                placeholder="Search assignee by name, role or department..."
                value={volunteerSearch}
                onChange={(e) => setVolunteerSearch(e.target.value)}
                className="h-8 w-full rounded-lg border border-border bg-surface-subtle/50 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>

            {/* SDR & Admin Cards List */}
            {volunteerRoster === undefined ? (
              <div className="py-8 text-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
              </div>
            ) : volunteerRoster.length === 0 ? (
              <div className="py-6">
                <EmptyState
                  icon={Users2}
                  title="No active assignees available."
                  description="Approved student SDRs and active Admins will appear here. Check the Volunteer Verification queue or add users."
                />
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {(volunteerRoster as any[]).map((v: any) => {
                  const isSelected = targetVolunteerId === v._id;
                  const isAdmin = v.role === "admin";

                  // Capacity badge styling
                  let capacityBadge = (
                    <span className="rounded-md border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                      {v.activeLeadsCount === 0 ? "Available" : "Optimal"} ({v.activeLeadsCount} active)
                    </span>
                  );
                  if (v.capacityStatus === "Moderate") {
                    capacityBadge = (
                      <span className="rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-300">
                        Active ({v.activeLeadsCount} active)
                      </span>
                    );
                  } else if (v.capacityStatus === "Near Capacity") {
                    capacityBadge = (
                      <span className="rounded-md border border-rose-200 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800 px-2 py-0.5 text-[10px] font-semibold text-rose-800 dark:text-rose-300">
                        Heavy ({v.activeLeadsCount} active)
                      </span>
                    );
                  }

                  return (
                    <div
                      key={v._id}
                      onClick={() => setTargetVolunteerId(v._id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-accent-mint/15 shadow-xs ring-1 ring-primary/30"
                          : "border-border-subtle bg-surface-subtle/50 hover:bg-surface-subtle"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-text-primary">
                              {v.name}
                            </span>
                            {isAdmin && (
                              <span className="rounded-md border border-sky-300 bg-sky-50 dark:bg-sky-950/50 dark:border-sky-700 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider text-sky-800 dark:text-sky-300">
                                Admin
                              </span>
                            )}
                            {isSelected && (
                              <span className="rounded-full bg-primary text-white p-0.5">
                                <CheckCircle2 className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-text-secondary">
                            {isAdmin
                              ? `Admin • ${v.department || "Sponsorship Committee Head"}`
                              : `Volunteer • ${v.department || "Civil Engineering"} • ${v.semester || "SDR"}`}
                          </p>
                          {v.phone && (
                            <p className="text-[10px] text-text-muted font-mono">
                              📞 {v.phone}
                            </p>
                          )}
                        </div>
                        {capacityBadge}
                      </div>

                      {/* Workload Progress Bar */}
                      <div className="mt-2.5 space-y-1">
                        <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              v.activeLeadsCount >= 15
                                ? "bg-rose-500"
                                : v.activeLeadsCount >= 5
                                ? "bg-amber-500"
                                : "bg-primary"
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((v.activeLeadsCount / 20) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Sticky Floating Bulk Assignment Action Bar */}
      {selectedLeadIds.size > 0 && (
        <div className="sticky bottom-4 z-40 rounded-2xl border border-primary/30 bg-surface/95 backdrop-blur-md p-4 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
              <Users2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary">
                {selectedLeadIds.size} company leads selected
              </p>
              <p className="text-[11px] text-text-secondary">
                {targetVolunteer ? (
                  <>
                    Assigning to:{" "}
                    <strong className="text-primary font-bold">
                      {targetVolunteer.name}
                    </strong>{" "}
                    ({targetVolunteer.role === "admin" ? "Admin" : targetVolunteer.department} • {targetVolunteer.activeLeadsCount} current leads)
                  </>
                ) : (
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">
                    ← Select a target SDR or Admin from the roster on the right
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedLeadIds(new Set())}
              disabled={isAssigning}
              className="text-xs"
            >
              Clear
            </Button>

            <Button
              size="sm"
              onClick={handleExecuteBatchAssignment}
              disabled={isAssigning || !targetVolunteerId}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-4"
            >
              {isAssigning ? (
                <div className="flex items-center gap-1.5">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Allocating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4" />
                  <span>
                    Allocate {selectedLeadIds.size} Leads
                    {targetVolunteer ? ` to ${targetVolunteer.name.split(" ")[0]}` : ""}
                  </span>
                </div>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* 4. Slide-Over Company Dossier Drawer */}
      <CompanyDossierDrawer
        company={dossierCompany}
        isOpen={!!dossierCompanyId}
        onClose={() => setDossierCompanyId(null)}
      />
    </div>
  );
}
