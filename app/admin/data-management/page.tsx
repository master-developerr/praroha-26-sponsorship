import React, { Suspense } from "react";
import { DataManagementView } from "@/components/admin/DataManagementView";

export const metadata = {
  title: "Data Management & Danger Zone | PRAROHA'26 Admin",
  description: "Authorized data archival, certified CSV backups, and destructive system resets.",
};

export default function AdminDataManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-sky-600 border-t-transparent" />
        </div>
      }
    >
      <DataManagementView />
    </Suspense>
  );
}
