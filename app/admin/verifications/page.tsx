import React, { Suspense } from "react";
import { AdminVerificationView } from "@/components/admin/AdminVerificationView";

export default function AdminVerificationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-sky-600 border-t-transparent" />
        </div>
      }
    >
      <AdminVerificationView />
    </Suspense>
  );
}
