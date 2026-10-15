"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/components/providers/AuthProvider";

function CentralDispatcherContent() {
  const router = useRouter();
  const {
    isAuthenticated,
    hasProfile,
    role,
    verificationStatus,
    isLoading,
  } = useAuthUser();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    if (!hasProfile) {
      router.push("/register/profile");
      return;
    }

    if (verificationStatus === "pending") {
      router.push("/pending");
      return;
    }

    if (verificationStatus === "rejected") {
      router.push("/rejected");
      return;
    }

    if (verificationStatus === "suspended") {
      router.push("/suspended");
      return;
    }

    if (verificationStatus === "approved") {
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/workspace");
      }
    }
  }, [isAuthenticated, hasProfile, role, verificationStatus, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        <p className="text-xs font-medium text-text-secondary">
          Directing to your PRAROHA'26 workspace...
        </p>
      </div>
    </div>
  );
}

export default function CentralDispatcher() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <CentralDispatcherContent />
    </Suspense>
  );
}
