import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "neutral" | "negative";
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  sparklineColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "positive",
  icon: Icon,
  iconBgColor = "bg-emerald-50",
  iconColor = "text-emerald-600",
  sparklineColor = "#10B981",
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-4.5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              iconBgColor,
              iconColor
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-text-primary">
                {value}
              </span>
              {change && (
                <span
                  className={cn(
                    "inline-flex items-center text-[11px] font-semibold px-1.5 py-0.5 rounded-full",
                    changeType === "positive" &&
                      "bg-emerald-50 text-emerald-700",
                    changeType === "neutral" &&
                      "bg-zinc-100 text-zinc-600",
                    changeType === "negative" &&
                      "bg-rose-50 text-rose-700"
                  )}
                >
                  {change}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-text-secondary mt-0.5">
              {title}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative sparkline indicator */}
      <div className="mt-2 flex justify-end">
        <svg
          className="h-4 w-18 opacity-40"
          viewBox="0 0 100 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 20C15 20 20 5 35 12C50 19 65 2 80 8C90 12 95 6 100 8"
            stroke={sparklineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
