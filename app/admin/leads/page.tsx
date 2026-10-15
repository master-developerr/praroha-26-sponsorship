import React, { Suspense } from "react";
import { MasterLeadDirectoryView } from "@/components/admin/MasterLeadDirectoryView";

export default function AdminLeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <MasterLeadDirectoryView />
    </Suspense>
  );
}
