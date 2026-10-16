"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  X,
  Lightbulb,
  FileText,
  Search,
  Share2,
  Check,
  Plus,
  Table as TableIcon,
  PhoneCall,
  ExternalLink,
  Building2,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  Circle,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotionCompanyDossierModalProps {
  companyId: Id<"companies"> | null;
  isOpen: boolean;
  onClose: () => void;
  onStartCall?: (lead: any) => void;
  onOpenScheduler?: (lead: any) => void;
}

interface DeliverableRow {
  id: string;
  name: string;
  category: "Title" | "Co-Sponsor" | "Associate" | "Stall" | "Workshop" | "In-Kind";
  valueINR: number;
  stage: "Done" | "In progress" | "Not started";
  notes: string;
}

export function NotionCompanyDossierModal({
  companyId,
  isOpen,
  onClose,
  onStartCall,
  onOpenScheduler,
}: NotionCompanyDossierModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<"doc" | "board">("doc");

  // Editable database rows state initialized with realistic festival sponsorship deliverables
  const [deliverables, setDeliverables] = useState<DeliverableRow[]>([
    {
      id: "del-1",
      name: "Mainstage LED Backdrop Logo & Banner Placement",
      category: "Title",
      valueINR: 200000,
      stage: "In progress",
      notes: "Central stage visual loop across 2 festival days",
    },
    {
      id: "del-2",
      name: "Technical Hackathon Challenge Partner",
      category: "Associate",
      valueINR: 100000,
      stage: "Done",
      notes: "Problem statement provided to 400+ participants",
    },
    {
      id: "del-3",
      name: "10x10 Campus Career Stall in Central Arena",
      category: "Stall",
      valueINR: 35000,
      stage: "Not started",
      notes: "Direct student recruitment & merchandise distribution",
    },
    {
      id: "del-4",
      name: "Official Volunteer Kit Branding (300 T-Shirts)",
      category: "In-Kind",
      valueINR: 50000,
      stage: "In progress",
      notes: "High visibility committee apparel",
    },
  ]);

  const [newRowName, setNewRowName] = useState("");
  const [isAddingRow, setIsAddingRow] = useState(false);

  // Fetch full company data from Convex
  const companyData = useQuery(
    api.companies.getCompanyDetails,
    companyId ? { companyId } : "skip"
  );

  if (!isOpen || !companyId) return null;

  const company = companyData;
  const contacts = companyData?.contacts || [];
  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0] || null;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const cycleStage = (id: string) => {
    setDeliverables((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const nextStage: Record<DeliverableRow["stage"], DeliverableRow["stage"]> = {
          "Not started": "In progress",
          "In progress": "Done",
          Done: "Not started",
        };
        return { ...row, stage: nextStage[row.stage] };
      })
    );
  };

  const handleAddDeliverable = () => {
    if (!newRowName.trim()) return;
    const newRow: DeliverableRow = {
      id: `del-${Date.now()}`,
      name: newRowName.trim(),
      category: "Associate",
      valueINR: 50000,
      stage: "In progress",
      notes: "Added from live research workspace",
    };
    setDeliverables((prev) => [...prev, newRow]);
    setNewRowName("");
    setIsAddingRow(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[900px] flex flex-col rounded-2xl border border-border bg-surface text-text-primary shadow-2xl overflow-hidden font-sans">
        {/* 1. NOTION TOP BAR: Breadcrumbs & Actions */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle bg-surface-subtle/50 text-xs text-text-muted select-none">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-medium text-text-secondary hover:text-text-primary cursor-pointer transition-colors">
              PRAROHA'26
            </span>
            <span>/</span>
            <span className="font-medium text-text-secondary hover:text-text-primary cursor-pointer transition-colors">
              Corporate Intelligence
            </span>
            <span>/</span>
            <span className="font-semibold text-text-primary truncate">
              {company?.companyName || "Lead Research"}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-text-secondary hover:bg-surface hover:text-text-primary transition-colors cursor-pointer border border-transparent hover:border-border-subtle"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedLink ? "Link Copied" : "Share"}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close document"
              className="p-1 rounded-md text-text-muted hover:bg-surface hover:text-text-primary transition-colors cursor-pointer ml-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 2. NOTION SCROLLABLE PAGE CANVAS */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-12 md:px-16 py-8 space-y-7">
          {/* Cover & Icon Line */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-2xl font-black border border-amber-500/20 shadow-xs">
              📄
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-subtle border border-border text-text-secondary">
                  {company?.industry || "Corporate Sponsor"}
                </span>
                <span className="text-[11px] font-semibold text-text-muted">
                  Private Research Document
                </span>
              </div>
            </div>
          </div>

          {/* Page Title (Notion 36px font) */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              {company?.companyName || "ScreenRove Research"}
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Synthesized sponsorship intelligence, Kerala demographic alignment, and festival deliverable commitments for PRAROHA'26 (Dec 04–05, 2026 at SOE CUSAT).
            </p>
          </div>

          {/* Quick Action Ribbon */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 pb-3 border-b border-border-subtle">
            {onStartCall && primaryContact && (
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  onStartCall({
                    ...company,
                    primaryContact,
                  })
                }
                className="gap-1.5 bg-primary hover:bg-primary-hover text-white font-semibold text-xs shadow-xs"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                Launch Call Mode ({primaryContact.phone})
              </Button>
            )}

            {onOpenScheduler && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onOpenScheduler({
                    ...company,
                    primaryContact,
                  })
                }
                className="gap-1.5 text-xs text-text-secondary hover:text-text-primary"
              >
                <Calendar className="h-3.5 w-3.5 text-text-muted" />
                Schedule Pitch Meeting
              </Button>
            )}

            {company?.website && (
              <a
                href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-xs text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-text-muted" />
                Corporate Portal
              </a>
            )}
          </div>

          {/* 3. SECTION HEADING: Research Overview (Notion 20px) */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2">
              <span>Research overview & strategic signals</span>
            </h2>

            {/* Bullets Block (Notion 15-16px / 1.5) */}
            <ul className="space-y-2.5 text-sm sm:text-base text-text-secondary leading-relaxed pl-5 list-disc marker:text-text-muted">
              <li>
                <strong className="text-text-primary">Kerala Footprint: </strong>
                {company?.keralaPresence ||
                  "Active engineering offices, branch presence, or significant regional consumer base in Kochi, Trivandrum, or Calicut."}
              </li>
              <li>
                <strong className="text-text-primary">Collegiate Sponsorship Track Record: </strong>
                {company?.sponsorshipHistory ||
                  "Documented corporate partner for technical symposia, campus hackathons, or university career placements across South India."}
              </li>
              <li>
                <strong className="text-text-primary">Campus Recruiting & CSR Alignment: </strong>
                {company?.whyGoodLead ||
                  "High demographic affinity with 3,000+ participating engineering undergraduates, developers, and tech leads."}
              </li>
            </ul>
          </div>

          {/* 4. NOTION CALLOUT BLOCK: Lightbulb hook */}
          <div className="rounded-xl border border-amber-300/60 dark:border-amber-800/50 bg-[#f8f0d0] dark:bg-amber-950/25 p-4 sm:p-5 flex items-start gap-3.5 text-amber-950 dark:text-amber-100 shadow-2xs">
            <div className="text-2xl shrink-0 mt-0.5 select-none" role="img" aria-label="Lightbulb">
              💡
            </div>
            <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
              <span className="font-bold block uppercase tracking-wider text-[11px] text-amber-800 dark:text-amber-300">
                Strategic Hook — Why Sponsor Benefits
              </span>
              <p>
                {company?.whyCompanyBenefits ||
                  `Direct brand immersion across PRAROHA'26 mainstage events, campus banners, technical workshops, and direct interaction with Cochin University's top engineering talent.`}
              </p>
              {company?.alternativeSupport && (
                <p className="pt-1.5 text-[11px] text-amber-900/80 dark:text-amber-200/80 italic border-t border-amber-300/40 dark:border-amber-800/40 mt-2">
                  Non-Cash Angle: {company.alternativeSupport}
                </p>
              )}
            </div>
          </div>

          {/* 5. NOTION IN-PAGE DATABASE: Launch / Deliverables Tracker */}
          <div className="space-y-3 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-text-primary flex items-center gap-1.5">
                  <TableIcon className="h-4 w-4 text-primary" />
                  Deliverables & Commitments Tracker
                </span>
                <span className="text-[11px] text-text-muted px-2 py-0.5 rounded bg-surface-subtle border border-border-subtle">
                  {deliverables.length} items
                </span>
              </div>

              {/* View toggle & Notion New Button */}
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg border border-border p-0.5 bg-surface-subtle text-xs">
                  <button
                    onClick={() => setActiveTab("doc")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      activeTab === "doc"
                        ? "bg-surface text-text-primary shadow-2xs font-semibold"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setActiveTab("board")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      activeTab === "board"
                        ? "bg-surface text-text-primary shadow-2xs font-semibold"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    Board
                  </button>
                </div>

                {/* Notion-style Blue New Button */}
                <button
                  onClick={() => setIsAddingRow(true)}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#2080e0] hover:bg-[#1a6ec2] text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New</span>
                </button>
              </div>
            </div>

            {/* In-Page Quick Add Input */}
            {isAddingRow && (
              <div className="flex items-center gap-2 p-3 rounded-xl border border-primary/40 bg-surface-subtle/50 animate-in fade-in">
                <input
                  type="text"
                  value={newRowName}
                  onChange={(e) => setNewRowName(e.target.value)}
                  placeholder="Enter deliverable commitment (e.g. Workshop Audio Rig, 500 Gift Hampers)..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddDeliverable();
                    if (e.key === "Escape") setIsAddingRow(false);
                  }}
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
                <Button size="sm" onClick={handleAddDeliverable} className="bg-[#2080e0] hover:bg-[#1a6ec2] text-white text-xs">
                  Add
                </Button>
                <button
                  onClick={() => setIsAddingRow(false)}
                  className="text-xs text-text-muted hover:text-text-primary px-2 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* TAB VIEW 1: NOTION DATABASE TABLE */}
            {activeTab === "doc" ? (
              <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-surface-subtle/60 text-text-muted font-medium">
                      <th className="py-2.5 px-3.5 w-[42%]">Deliverable Item</th>
                      <th className="py-2.5 px-3">Tier Category</th>
                      <th className="py-2.5 px-3">Valuation (INR)</th>
                      <th className="py-2.5 px-3.5 text-right">Stage (Click to cycle)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {deliverables.map((item) => (
                      <tr key={item.id} className="hover:bg-surface-subtle/40 transition-colors group">
                        <td className="py-2.5 px-3.5 font-medium text-text-primary flex items-center gap-2">
                          <span className="text-text-muted select-none">⠿</span>
                          <span className="truncate">{item.name}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="rounded px-2 py-0.5 text-[11px] font-semibold bg-surface-subtle border border-border text-text-secondary">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium text-text-primary tabular-nums">
                          ₹{item.valueINR.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => cycleStage(item.id)}
                            title="Click to advance stage"
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                              item.stage === "Done"
                                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40"
                                : item.stage === "In progress"
                                ? "bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800/40"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.stage === "Done"
                                  ? "bg-emerald-600"
                                  : item.stage === "In progress"
                                  ? "bg-sky-600 animate-pulse"
                                  : "bg-zinc-400"
                              }`}
                            />
                            {item.stage}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* TAB VIEW 2: KANBAN BOARD BY STAGE */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {(["Not started", "In progress", "Done"] as const).map((colStage) => {
                  const itemsInCol = deliverables.filter((d) => d.stage === colStage);
                  return (
                    <div key={colStage} className="rounded-xl border border-border bg-surface-subtle/50 p-3 space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-border-subtle">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                          {colStage}
                        </span>
                        <span className="text-[10px] text-text-muted px-1.5 py-0.2 rounded bg-surface border border-border-subtle font-mono">
                          {itemsInCol.length}
                        </span>
                      </div>
                      <div className="space-y-2 min-h-[100px]">
                        {itemsInCol.map((d) => (
                          <div
                            key={d.id}
                            onClick={() => cycleStage(d.id)}
                            className="p-2.5 rounded-lg border border-border bg-surface hover:border-primary/40 shadow-2xs text-xs space-y-1.5 cursor-pointer transition-all"
                          >
                            <p className="font-semibold text-text-primary leading-tight">{d.name}</p>
                            <div className="flex items-center justify-between text-[10px] text-text-muted">
                              <span className="font-mono">₹{d.valueINR.toLocaleString("en-IN")}</span>
                              <span className="px-1.5 py-0.2 rounded bg-surface-subtle border border-border">
                                {d.category}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 6. BOTTOM STATUS BAR */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border-subtle bg-surface-subtle/40 text-xs text-text-muted select-none">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>PRAROHA'26 Live Dossier Engine</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Dec 04–05, 2026 • SOE CUSAT</span>
            <Button variant="outline" size="sm" onClick={onClose} className="h-7 text-xs">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
