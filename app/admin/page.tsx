import React, { Suspense } from "react";
import { ExecutiveDashboardView } from "@/components/admin/ExecutiveDashboardView";

function DashboardLoadingSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 bg-border/40 rounded w-1/4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-28 bg-border/20 rounded-xl"></div>
        <div className="h-28 bg-border/20 rounded-xl"></div>
        <div className="h-28 bg-border/20 rounded-xl"></div>
        <div className="h-28 bg-border/20 rounded-xl"></div>
      </div>
      <div className="h-64 bg-border/20 rounded-xl"></div>
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
