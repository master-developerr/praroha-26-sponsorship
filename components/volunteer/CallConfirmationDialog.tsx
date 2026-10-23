"use client";

import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneCall, AlertTriangle, ShieldCheck, Building2, User, Phone } from "lucide-react";
import { ContactVerificationBadge, PhoneTypeBadge } from "@/components/ui/badge";
import { ContactVerificationLevel, PhoneType } from "@/types";

export interface CallConfirmationData {
  companyName: string;
  industry?: string;
  contactName: string;
  designation: string;
  phone: string;
  phoneType: PhoneType;
  contactVerification: ContactVerificationLevel;
  email?: string;
  isAssignedToCurrentUser?: boolean;
  assignedVolunteerName?: string;
}

interface CallConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: CallConfirmationData | null;
}

export function CallConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  data,
}: CallConfirmationDialogProps) {
  if (!isOpen || !data) return null;

  const isUnverified = data.contactVerification === "UNVERIFIED";

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={`Call ${data.companyName}`}
      description="Verify corporate contact intelligence before initiating outreach"
    >
      <div className="space-y-4 pt-1">
        {/* Contact Intelligence Card */}
        <div className="rounded-xl border border-border bg-surface-subtle p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary shrink-0" />
                <h3 className="text-sm font-bold text-text-primary truncate">
                  {data.contactName || "Main Switchboard / Officer"}
                </h3>
              </div>
              <p className="text-xs text-text-secondary pl-6">
                {data.designation || "Corporate Contact Line"}
                {data.industry ? ` • ${data.industry}` : ""}
              </p>
            </div>
            <ContactVerificationBadge level={data.contactVerification} />
          </div>

          {/* Large Telephone Display */}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-text-muted shrink-0" />
              <span className="font-mono text-base font-bold tracking-wide text-text-primary">
                {data.phone}
              </span>
            </div>
            <PhoneTypeBadge type={data.phoneType} />
          </div>
        </div>

        {/* Ownership Status */}
        {data.assignedVolunteerName && (
          <div className="flex items-center justify-between text-[11px] text-text-secondary px-1">
            <span>Lead Ownership:</span>
            <span className="font-semibold text-text-primary">
              {data.isAssignedToCurrentUser
                ? "Assigned to You"
                : `Assigned to ${data.assignedVolunteerName}`}
            </span>
          </div>
        )}

        {/* Critical Unverified Warning */}
        {isUnverified && (
          <div className="rounded-lg border border-amber-500/25 bg-accent-yellow p-3 text-xs text-accent-yellow-text flex items-start gap-2.5 leading-relaxed">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <strong className="font-semibold block">Unverified Corporate Contact</strong>
              <span>
                This phone number is unverified and may connect to a front desk or general switchboard. Verify the person&apos;s identity and decision-making authority before presenting PRAROHA&apos;26 packages.
              </span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            className="text-xs font-semibold bg-primary hover:bg-primary-hover text-white shadow-xs"
          >
            <PhoneCall className="h-3.5 w-3.5 mr-1.5" />
            Start Call ({data.phone})
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
