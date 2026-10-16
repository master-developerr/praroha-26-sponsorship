"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Download,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";

interface DestructiveConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  operationKey: "DELETE_LEADS" | "DELETE_STUDENTS" | "DELETE_OUTREACH" | "RESET_EVENT" | "FACTORY_RESET";
  description: string;
  requiredPhrase: string;
  isExtremeDanger?: boolean;
  impactSummary: Record<string, number>;
  onExportData?: () => Promise<void>;
  exportLabel?: string;
  onConfirm: () => Promise<void>;
}

export function DestructiveConfirmationModal({
  isOpen,
  onClose,
  title,
  operationKey,
  description,
  requiredPhrase,
  isExtremeDanger = false,
  impactSummary,
  onExportData,
  exportLabel = "Export Backup CSV",
  onConfirm,
}: DestructiveConfirmationModalProps) {
  const [typedPhrase, setTypedPhrase] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasExported, setHasExported] = useState(false);
  const [step, setStep] = useState<1 | 2>(isExtremeDanger ? 1 : 2);

  useEffect(() => {
    if (isOpen) {
      setTypedPhrase("");
      setErrorMsg(null);
      setHasExported(false);
      setStep(isExtremeDanger ? 1 : 2);
    }
  }, [isOpen, isExtremeDanger]);

  const isPhraseExact = typedPhrase.trim() === requiredPhrase.trim();

  const handleExport = async () => {
    if (!onExportData) return;
    setIsExporting(true);
    try {
      await onExportData();
      setHasExported(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to generate data export backup.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExecute = async () => {
    if (!isPhraseExact) {
      setErrorMsg(`Confirmation text does not match "${requiredPhrase}".`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Destructive operation failed on the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={isSubmitting ? () => {} : onClose}>
      <div className="p-6 space-y-5 max-w-lg mx-auto">
        {/* Header Alert Banner */}
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              isExtremeDanger
                ? "bg-rose-100 text-rose-800 border-2 border-rose-300"
                : "bg-amber-100 text-amber-800 border border-amber-300"
            }`}
          >
            {isExtremeDanger ? (
              <ShieldAlert className="h-6 w-6 text-rose-700 animate-pulse" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-700" />
            )}
          </div>
          <div>
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase ${
                isExtremeDanger
                  ? "bg-rose-600 text-white"
                  : "bg-amber-700 text-white"
              }`}
            >
              {isExtremeDanger ? "CRITICAL FACTORY RESET" : "PERMANENT DATA ACTION"}
            </span>
            <h3 className="text-lg font-bold text-text-primary mt-1">{title}</h3>
            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Step 1 of Factory Reset: Preliminary Warning */}
        {isExtremeDanger && step === 1 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs text-rose-900 space-y-2">
              <p className="font-bold">Extreme Caution: Stage 1 of 2</p>
              <p className="text-[11px] leading-relaxed text-rose-800">
                You are about to initiate an irreversible factory reset. This will wipe ALL volunteer records, corporate leads, call history, proposals, point transactions, and notifications. Only your current authenticated admin user will be kept.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                Abort & Return
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep(2)}
                className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold gap-1.5"
              >
                Proceed to Typed Confirmation
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Impact Breakdown & Typed Confirmation */}
        {(!isExtremeDanger || step === 2) && (
          <div className="space-y-4">
            {/* Impact Record Counts Breakdown */}
            <div className="rounded-xl border border-border bg-surface-subtle p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-text-primary border-b border-border-subtle pb-2">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-text-muted" />
                  Calculated Database Impact
                </span>
                <span className="text-rose-700 font-extrabold">
                  {Object.values(impactSummary).reduce((a, b) => a + b, 0)} Total Records
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                {Object.entries(impactSummary).map(([key, count]) => (
                  <div key={key} className="flex items-center justify-between py-0.5 text-text-secondary">
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <strong className="text-text-primary font-mono">{count}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Backup Export Option */}
            {onExportData && (
              <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-3.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-sky-950">Export Backup Recommended</p>
                  <p className="text-[11px] text-sky-800">
                    Download an RFC-4180 CSV archive of affected records prior to execution.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="shrink-0 text-xs bg-surface border-sky-300 text-sky-900 hover:bg-sky-100"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  {isExporting ? "Exporting..." : hasExported ? "Re-download" : exportLabel}
                </Button>
              </div>
            )}

            {/* Mandatory Typed Confirmation Gate */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-primary block">
                To confirm, type <span className="font-mono text-rose-700 font-extrabold select-all">{requiredPhrase}</span> below:
              </label>
              <Input
                type="text"
                value={typedPhrase}
                onChange={(e) => {
                  setTypedPhrase(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder={requiredPhrase}
                autoFocus
                className="font-mono text-xs border-border-subtle focus:border-rose-500"
                disabled={isSubmitting}
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border-subtle">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleExecute}
                disabled={!isPhraseExact || isSubmitting}
                className="text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer gap-1.5 shadow-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {isSubmitting ? "Executing Server-Side..." : "Delete Permanently"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
