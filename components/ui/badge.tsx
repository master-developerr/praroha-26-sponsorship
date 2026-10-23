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
    success: "bg-accent-mint text-success border-primary/20",
    warning: "bg-accent-yellow text-accent-yellow-text border-amber-500/25",
    danger: "bg-accent-coral text-accent-coral-text border-red-500/25",
    info: "bg-accent-blue text-accent-blue-text border-sky-500/25",
    mint: "bg-accent-mint text-accent-mint-text border-primary/20",
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
      bg: "bg-zinc-100 dark:bg-zinc-800/60",
      text: "text-zinc-700 dark:text-zinc-300",
      border: "border-zinc-200 dark:border-zinc-700",
    },
    ASSIGNED: {
      label: "Assigned",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-800 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800/50",
    },
    CONTACTED: {
      label: "Contacted",
      bg: "bg-cyan-50 dark:bg-cyan-950/40",
      text: "text-cyan-800 dark:text-cyan-300",
      border: "border-cyan-200 dark:border-cyan-800/50",
    },
    INTERESTED: {
      label: "Interested",
      bg: "bg-teal-50 dark:bg-teal-950/40",
      text: "text-teal-800 dark:text-teal-300",
      border: "border-teal-200 dark:border-teal-800/50",
    },
    FOLLOW_UP: {
      label: "Follow-up",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-800 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800/50",
    },
    PROPOSAL_REQUESTED: {
      label: "Proposal Req.",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      text: "text-indigo-800 dark:text-indigo-300",
      border: "border-indigo-200 dark:border-indigo-800/50",
    },
    PROPOSAL_SENT: {
      label: "Proposal Sent",
      bg: "bg-sky-50 dark:bg-sky-950/40",
      text: "text-sky-800 dark:text-sky-300",
      border: "border-sky-200 dark:border-sky-800/50",
    },
    NEGOTIATION: {
      label: "Negotiation",
      bg: "bg-purple-50 dark:bg-purple-950/40",
      text: "text-purple-800 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-800/50",
    },
    WON: {
      label: "Confirmed / WON",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-800 dark:text-emerald-300",
      border: "border-emerald-200 dark:border-emerald-800/50",
    },
    LOST: {
      label: "Lost",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      text: "text-rose-800 dark:text-rose-300",
      border: "border-rose-200 dark:border-rose-800/50",
    },
  };

  const current = map[status] || map.UNASSIGNED;
  return (
    <span
      className={cn(
        "inline-flex items-center border-l-2 pl-2 text-[11px] font-semibold tracking-normal",
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
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
          <CheckCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          Verified Decision-Maker
        </span>
      );
    case "VERIFIED_COMPANY_REPRESENTATIVE":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 dark:text-teal-300">
          <Check className="h-3 w-3 text-teal-600 dark:text-teal-400" />
          Company Representative
        </span>
      );
    case "OFFICIAL_COMPANY_CONTACT":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-700 dark:text-sky-300">
          <Building2 className="h-3 w-3 text-sky-600 dark:text-sky-400" />
          Official Desk Line
        </span>
      );
    case "UNVERIFIED":
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
          <AlertCircle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          Unverified Contact
        </span>
      );
  }
}

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  switch (priority) {
    case "High":
      return (
        <span className="inline-flex items-center border-l-2 border-rose-500 pl-2 text-[10px] font-bold text-rose-700 dark:text-rose-300">
          High
        </span>
      );
    case "Medium":
      return (
        <span className="inline-flex items-center border-l-2 border-amber-500 pl-2 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
          Medium
        </span>
      );
    case "Normal":
      return (
        <span className="inline-flex items-center border-l-2 border-blue-500 pl-2 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
          Normal
        </span>
      );
    case "Low":
    default:
      return (
        <span className="inline-flex items-center border-l-2 border-zinc-400 pl-2 text-[10px] font-medium text-zinc-700 dark:text-zinc-300">
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
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-text-muted">
      <Phone className="h-2.5 w-2.5 text-text-muted" />
      {labels[type] || type}
    </span>
  );
}
