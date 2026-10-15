import React, { Suspense } from "react";
import { LeadAssignmentMatrixView } from "@/components/admin/LeadAssignmentMatrixView";

export default function AdminAssignmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <LeadAssignmentMatrixView />
    </Suspense>
  );
}
