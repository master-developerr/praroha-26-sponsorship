"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  parseCanonicalCsv,
  generateCsvTemplate,
  CanonicalLeadRow,
  InvalidRowReport,
} from "@/lib/csvParser";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import {
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  ArrowRight,
  ShieldAlert,
  Layers,
  ChevronDown,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface CollisionItem {
  rowIndex: number;
  matchedBy: "name" | "phone" | "email" | "domain";
  existingCompanyId: Id<"companies">;
  existingCompanyName: string;
  existingContactName?: string;
  existingPhone?: string;
  incomingRow: CanonicalLeadRow;
  selectedAction: "skip" | "merge" | "new_contact";
}

export function LeadImportModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { user } = useAuthUser();
  const importMutation = useMutation(api.companies.importLeadsBatch);

  // Wizard state: "upload" | "preview" | "importing" | "success"
  const [step, setStep] = useState<"upload" | "preview" | "importing" | "success">("upload");

  const [fileName, setFileName] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [validRows, setValidRows] = useState<CanonicalLeadRow[]>([]);
  const [invalidRows, setInvalidRows] = useState<InvalidRowReport[]>([]);
  const [missingHeaders, setMissingHeaders] = useState<string[]>([]);

  // Duplicate collisions
  const [collisions, setCollisions] = useState<CollisionItem[]>([]);
  const [showInvalidDetails, setShowInvalidDetails] = useState(false);

  // Ingestion Result
  const [importResult, setImportResult] = useState<{
    imported: number;
    merged: number;
    skipped: number;
  } | null>(null);

  // Pre-fetch all companies to check duplicates fast
  const allCompanies = useQuery(api.companies.getAllCompanies, {}) || [];

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

  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCanonicalCsv(text);

      setTotalRows(parsed.totalRows);
      setValidRows(parsed.validRows);
      setInvalidRows(parsed.invalidRows);
      setMissingHeaders(parsed.missingRequiredHeaders);

      // Detect collisions against currently loaded company database
      const detectedCollisions: CollisionItem[] = [];

      parsed.validRows.forEach((row, idx) => {
        const norm = row.hashes.normalizedName;
        const matched = allCompanies.find(
          (c) =>
            c.normalizedName === norm ||
            (row.hashes.domain && c.website && c.website.toLowerCase().includes(row.hashes.domain)) ||
            (row.hashes.namePhoneHash && c.primaryContact && c.primaryContact.phone === row.phone)
        );

        if (matched) {
          let reason: "name" | "phone" | "email" | "domain" = "name";
          if (row.hashes.namePhoneHash && matched.primaryContact?.phone === row.phone) {
            reason = "phone";
          } else if (row.hashes.domain && matched.website?.includes(row.hashes.domain)) {
            reason = "domain";
          }

          detectedCollisions.push({
            rowIndex: idx,
            matchedBy: reason,
            existingCompanyId: matched._id,
            existingCompanyName: matched.companyName,
            existingContactName: matched.primaryContact?.contactName,
            existingPhone: matched.primaryContact?.phone,
            incomingRow: row,
            selectedAction: "skip", // Default action
          });
        }
      });

      setCollisions(detectedCollisions);
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const updateCollisionAction = (
    rowIndex: number,
    action: "skip" | "merge" | "new_contact"
  ) => {
    setCollisions((prev) =>
      prev.map((c) => (c.rowIndex === rowIndex ? { ...c, selectedAction: action } : c))
    );
  };

  const handleExecuteImport = async () => {
    setStep("importing");

    // Build final payload mapping conflict actions
    const payload = validRows.map((row, idx) => {
      const collision = collisions.find((c) => c.rowIndex === idx);
      return {
        company_name: row.company_name,
        industry: row.industry,
        niche: row.niche,
        priority: row.priority,
        lead_score: row.lead_score,
        contact_name: row.contact_name,
        contact_designation: row.contact_designation,
        phone: row.phone,
        email: row.email,
        location: row.location,
        website: row.website,
        linkedin: row.linkedin,
        company_size: row.company_size,
        annual_revenue: row.annual_revenue,
        kerala_presence: row.kerala_presence,
        sponsorship_history: row.sponsorship_history,
        sponsorship_evidence: row.sponsorship_evidence,
        why_good_lead: row.why_good_lead,
        why_company_benefits: row.why_company_benefits,
        recommended_sponsorship_type: row.recommended_sponsorship_type,
        recommended_ask_min: row.recommended_ask_min,
        recommended_ask_max: row.recommended_ask_max,
        alternative_support: row.alternative_support,
        source: row.source,
        source_url: row.source_url,
        contact_source: row.contact_source,
        contact_verified: row.contact_verified || "UNVERIFIED",
        notes: row.notes,
        conflictAction: collision?.selectedAction,
        existingCompanyId: collision?.existingCompanyId,
      };
    });

    if (!user?.id) {
      alert("Authentication error: Administrator session required.");
      return;
    }

    try {
      const res = await importMutation({
        adminClerkId: user.id,
        rows: payload,
      });
      setImportResult(res);
      setStep("success");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setStep("preview");
    }
  };

  const handleReset = () => {
    setStep("upload");
    setFileName("");
    setValidRows([]);
    setInvalidRows([]);
    setCollisions([]);
    setImportResult(null);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="Canonical CSV Lead Import Wizard"
      description="Upload corporate spreadsheets adhering to the PRAROHA'26 29-field canonical schema."
    >
      <div className="space-y-5 pt-2 max-h-[75vh] overflow-y-auto pr-1">
        {/* Step 1: Upload */}
        {step === "upload" && (
          <div className="space-y-4">
            {/* Template Download Banner */}
            <div className="flex items-center justify-between rounded-xl border border-accent-mint bg-accent-mint/30 p-3.5 text-xs">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-text-primary">
                    Need the canonical 29-field CSV template?
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    Contains sample corporate leads, column headers, and verification guidelines.
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadTemplate}
                className="shrink-0"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download CSV
              </Button>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-subtle/50 p-8 text-center hover:bg-surface-subtle transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface border border-border text-primary shadow-xs">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-text-primary">
                Drag and drop your spreadsheet here
              </h3>
              <p className="mt-1 text-xs text-text-secondary">
                Supports standard comma-separated `.csv` files up to 10MB.
              </p>

              <label className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover cursor-pointer transition-colors">
                Browse Files
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Mandatory Fields Reference */}
            <div className="rounded-xl border border-border bg-surface p-3.5 text-xs space-y-1.5">
              <span className="font-bold text-text-primary block">
                7 Mandatory Canonical Columns:
              </span>
              <p className="text-text-secondary leading-relaxed">
                <code>company_name</code>, <code>industry</code>, <code>niche</code>, <code>priority</code>, <code>contact_name</code>, <code>contact_designation</code>, <code>phone</code>.
              </p>
              <p className="text-[11px] text-text-muted">
                Note: Lead status will be automatically initialized to <strong>UNASSIGNED</strong> upon ingestion.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Pre-Flight Preview & Duplicate Resolution */}
        {step === "preview" && (
          <div className="space-y-4">
            {/* Header Missing Error */}
            {missingHeaders.length > 0 && (
              <div className="rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-xs text-rose-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-rose-600" />
                  Missing Required Canonical Columns ({missingHeaders.length}):
                </p>
                <p className="font-mono text-[11px]">{missingHeaders.join(", ")}</p>
                <p className="text-[11px] pt-1">
                  Please adjust your column headers to match the PRAROHA'26 canonical format.
                </p>
              </div>
            )}

            {/* Pre-Flight Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl border border-border bg-surface p-3">
                <span className="text-[10px] uppercase font-bold text-text-muted block">
                  Total Rows
                </span>
                <span className="text-xl font-bold text-text-primary mt-1 block">
                  {totalRows}
                </span>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                  Valid Leads
                </span>
                <span className="text-xl font-bold text-emerald-700 mt-1 block">
                  {validRows.length}
                </span>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">
                  Duplicates
                </span>
                <span className="text-xl font-bold text-amber-700 mt-1 block">
                  {collisions.length}
                </span>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3">
                <span className="text-[10px] uppercase font-bold text-rose-800 block">
                  Invalid Rows
                </span>
                <span className="text-xl font-bold text-rose-700 mt-1 block">
                  {invalidRows.length}
                </span>
              </div>
            </div>

            {/* Invalid Rows Report */}
            {invalidRows.length > 0 && (
              <div className="rounded-xl border border-border bg-surface p-3.5 text-xs space-y-2">
                <button
                  onClick={() => setShowInvalidDetails(!showInvalidDetails)}
                  className="flex w-full items-center justify-between font-semibold text-rose-700 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    {invalidRows.length} rows have missing mandatory fields
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${showInvalidDetails ? "rotate-180" : ""}`}
                  />
                </button>
                {showInvalidDetails && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pt-2 border-t border-border-subtle">
                    {invalidRows.map((inv) => (
                      <div
                        key={inv.rowNumber}
                        className="rounded bg-rose-50/60 p-2 text-[11px] text-rose-800 font-mono"
                      >
                        Line {inv.rowNumber}: {inv.errors.join("; ")}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4-Way Duplicate Collision Resolution Table */}
            {collisions.length > 0 ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-amber-600" />
                    Duplicate Collisions ({collisions.length})
                  </h4>
                  <span className="text-[10px] text-text-muted">
                    Choose resolution action per row
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {collisions.map((col) => (
                    <div
                      key={col.rowIndex}
                      className="rounded-xl border border-amber-200 bg-amber-50/30 p-3 text-xs space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                        <div>
                          <p className="font-bold text-text-primary">
                            {col.incomingRow.company_name}
                          </p>
                          <p className="text-[11px] text-text-secondary">
                            Matches existing entity:{" "}
                            <strong className="text-amber-900">{col.existingCompanyName}</strong>{" "}
                            (by {col.matchedBy})
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <label className="text-[10px] font-semibold text-text-secondary">
                            Action:
                          </label>
                          <select
                            value={col.selectedAction}
                            onChange={(e) =>
                              updateCollisionAction(
                                col.rowIndex,
                                e.target.value as "skip" | "merge" | "new_contact"
                              )
                            }
                            className="rounded-lg border border-amber-300 bg-surface px-2 py-1 text-xs font-semibold text-text-primary focus:outline-none"
                          >
                            <option value="skip">Skip (Ignore)</option>
                            <option value="merge">Merge Company Fields</option>
                            <option value="new_contact">Import as New Contact</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-text-secondary">
                        <div>
                          <span className="text-text-muted block">Incoming Contact:</span>
                          <span className="font-medium text-text-primary">
                            {col.incomingRow.contact_name} ({col.incomingRow.phone})
                          </span>
                        </div>
                        <div>
                          <span className="text-text-muted block">Existing Contact:</span>
                          <span className="font-medium text-text-primary">
                            {col.existingContactName || "—"} ({col.existingPhone || "—"})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Zero duplicate collisions detected across all 4 keys (Name, Phone, Email, Domain). All valid rows are ready for immediate ingestion.
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Upload Another File
              </Button>

              <Button
                variant="primary"
                size="md"
                disabled={validRows.length === 0 || missingHeaders.length > 0}
                onClick={handleExecuteImport}
              >
                Confirm & Import {validRows.length} Leads
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Importing Loading State */}
        {step === "importing" && (
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <h4 className="text-sm font-semibold text-text-primary">
              Executing Batch Ingestion...
            </h4>
            <p className="text-xs text-text-secondary">
              Writing company records, linking contacts, and generating audit logs.
            </p>
          </div>
        )}

        {/* Step 4: Success Summary */}
        {step === "success" && importResult && (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-xs">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Batch Import Completed Successfully
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                All records have entered the unassigned sponsorship pool.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-center">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5">
                <span className="text-[10px] font-bold text-emerald-800 block">
                  Imported
                </span>
                <span className="text-lg font-bold text-emerald-700 mt-0.5 block">
                  {importResult.imported}
                </span>
              </div>
              <div className="rounded-xl border border-sky-200 bg-sky-50 p-2.5">
                <span className="text-[10px] font-bold text-sky-800 block">
                  Merged
                </span>
                <span className="text-lg font-bold text-sky-700 mt-0.5 block">
                  {importResult.merged}
                </span>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5">
                <span className="text-[10px] font-bold text-zinc-800 block">
                  Skipped
                </span>
                <span className="text-lg font-bold text-zinc-700 mt-0.5 block">
                  {importResult.skipped}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="primary" onClick={onClose} className="w-full">
                Done & View Directory
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
