import React, { Suspense } from "react";
import { ExecutiveDashboardView } from "@/components/admin/ExecutiveDashboardView";

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="border-b border-border pb-6">
        <div className="h-3 w-32 bg-surface-subtle"></div>
        <div className="mt-4 h-9 w-80 max-w-full bg-surface-subtle"></div>
        <div className="mt-3 h-4 w-[28rem] max-w-full bg-surface-subtle"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        <div className="h-28 border-l-2 border-border bg-surface-subtle/60"></div>
        <div className="h-28 border-l-2 border-border bg-surface-subtle/60"></div>
        <div className="h-28 border-l-2 border-border bg-surface-subtle/60"></div>
        <div className="h-28 border-l-2 border-border bg-surface-subtle/60"></div>
      </div>
      <div className="h-72 border border-border bg-surface-subtle/50"></div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<DashboardLoadingSkeleton />}>
      <ExecutiveDashboardView />
    </Suspense>
  );
}
