"use client";

import React from "react";
import { eventConfig } from "@/lib/eventConfig";

interface AdminPageHeaderProps {
  category: string;
  title: string;
  description: string;
  meta?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function AdminPageHeader({
  category,
  title,
  description,
  meta,
  actions,
  children,
}: AdminPageHeaderProps) {
  const metadataText =
    meta ??
    `${eventConfig.datesCompact} · ${eventConfig.organizer} · ${eventConfig.institution}`;

  return (
    <header className="border-b border-border pb-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {category}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-text-primary sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            {description}
          </p>
          <p className="mt-3 text-[11px] font-medium text-text-muted">
            {metadataText}
          </p>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {children && <div className="mt-5">{children}</div>}
    </header>
  );
}
