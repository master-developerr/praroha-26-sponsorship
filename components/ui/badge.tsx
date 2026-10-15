import * as React from "react";
import { cn } from "@/lib/utils";
import {
  LeadStage,
  ContactVerificationLevel,
  PriorityLevel,
  PhoneType,
} from "@/types";
import {
  CheckCheck,
  Check,
  Building2,
  AlertCircle,
  Phone,
  HelpCircle,
} from "lucide-react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "mint";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-surface-subtle text-text-secondary border-border",
    secondary: "bg-surface text-text-primary border-border",
    outline: "border-border text-text-secondary bg-transparent",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
    mint: "bg-accent-mint text-accent-mint-text border-[#BEE3D3]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function VerificationBadge({
  status,
}: {
  status: "pending" | "approved" | "rejected" | "suspended";
}) {
  switch (status) {
    case "approved":
      return <Badge variant="success">Approved</Badge>;
    case "pending":
      return <Badge variant="warning">Pending Verification</Badge>;
    case "rejected":
      return <Badge variant="danger">Rejected</Badge>;
    case "suspended":
      return <Badge variant="danger">Suspended</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
}

export function RoleBadge({ role }: { role: "admin" | "volunteer" }) {
  if (role === "admin") {
    return <Badge variant="info">Admin</Badge>;
  }
  return <Badge variant="mint">Volunteer</Badge>;
}

export function LeadStatusBadge({ status }: { status: LeadStage }) {
  const map: Record<
    LeadStage,
    { label: string; bg: string; text: string; border: string }
  > = {
    UNASSIGNED: {
      label: "Unassigned",
      bg: "bg-zinc-100",
      text: "text-zinc-600",
      border: "border-zinc-200",
    },
    ASSIGNED: {
      label: "Assigned",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    CONTACTED: {
      label: "Contacted",
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      border: "border-cyan-200",
    },
    INTERESTED: {
      label: "Interested",
      bg: "bg-teal-50",
      text: "text-teal-700",
      border: "border-teal-200",
    },
    FOLLOW_UP: {
      label: "Follow-up",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    PROPOSAL_REQUESTED: {
      label: "Proposal Req.",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
    },
    PROPOSAL_SENT: {
      label: "Proposal Sent",
      bg: "bg-sky-50",
      text: "text-sky-700",
      border: "border-sky-200",
    },
    NEGOTIATION: {
      label: "Negotiation",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    WON: {
      label: "Confirmed / WON",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    LOST: {
      label: "Lost",
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
    },
  };

  const current = map[status] || map.UNASSIGNED;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        current.bg,
        current.text,
        current.border
      )}
    >
      {current.label}
    </span>
  );
}

export function ContactVerificationBadge({
  level,
}: {
  level: ContactVerificationLevel;
}) {
  switch (level) {
    case "VERIFIED_DECISION_MAKER":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
          <CheckCheck className="h-3 w-3 text-emerald-600" />
          Verified Decision-Maker
        </span>
      );
    case "VERIFIED_COMPANY_REPRESENTATIVE":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-800">
          <Check className="h-3 w-3 text-teal-600" />
          Company Representative
        </span>
      );
    case "OFFICIAL_COMPANY_CONTACT":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-800">
          <Building2 className="h-3 w-3 text-sky-600" />
          Official Desk Line
        </span>
      );
    case "UNVERIFIED":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
          <AlertCircle className="h-3 w-3 text-amber-600" />
          Unverified Contact
        </span>
      );
  }
}

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  switch (priority) {
    case "High":
      return (
        <span className="inline-flex items-center rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
          High
        </span>
      );
    case "Medium":
      return (
        <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
          Medium
        </span>
      );
    case "Normal":
      return (
        <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
          Normal
        </span>
      );
    case "Low":
    default:
      return (
        <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
          Low
        </span>
      );
  }
}

export function PhoneTypeBadge({ type }: { type: PhoneType }) {
  const labels: Record<PhoneType, string> = {
    direct_official: "Direct Mobile",
    office: "Office Desk",
    regional_office: "Regional HQ",
    department: "Department Line",
    switchboard: "Switchboard",
    unknown: "Unknown Origin",
  };

  return (
    <span className="inline-flex items-center gap-1 rounded border border-border bg-surface-subtle px-1.5 py-0.2 text-[10px] font-mono text-text-muted">
      <Phone className="h-2.5 w-2.5 text-text-muted" />
      {labels[type] || type}
    </span>
  );
}
