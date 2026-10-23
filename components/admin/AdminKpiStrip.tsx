"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface AdminKpiItem {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  variant?: "primary" | "success" | "warning" | "error" | "info" | "neutral";
}

interface AdminKpiStripProps {
  items: AdminKpiItem[];
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const variantStyles: Record<
  NonNullable<AdminKpiItem["variant"]>,
  { border: string; icon: string; valueText?: string }
> = {
  primary: {
    border: "border-primary",
    icon: "text-primary",
  },
  success: {
    border: "border-success",
    icon: "text-success",
  },
  warning: {
    border: "border-warning",
    icon: "text-warning",
    valueText: "text-warning",
  },
  error: {
    border: "border-error",
    icon: "text-error",
    valueText: "text-error",
  },
  info: {
    border: "border-info",
    icon: "text-info",
  },
  neutral: {
    border: "border-border-strong",
    icon: "text-text-muted",
  },
};

export function AdminKpiStrip({
  items,
  columns = 4,
  className = "",
}: AdminKpiStripProps) {
  const colClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  }[columns];

  return (
    <div
      className={`grid gap-6 border-y border-border py-5 ${colClass} ${className}`}
    >
      {items.map((item, idx) => {
        const v = item.variant ?? "neutral";
        const styling = variantStyles[v];
        const Icon = item.icon;

        return (
          <div key={idx} className={`border-l-2 ${styling.border} pl-4`}>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
              {Icon && <Icon className={`h-3.5 w-3.5 ${styling.icon}`} />}
              <span>{item.label}</span>
            </div>
            <p
              className={`mt-2.5 text-2xl font-bold tabular-nums text-text-primary ${
                styling.valueText || ""
              }`}
            >
              {item.value}
            </p>
            {item.subtext && (
              <p className="mt-1 text-[11px] text-text-secondary truncate">
                {item.subtext}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
