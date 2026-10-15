"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthUser, devLog } from "@/components/providers/AuthProvider";
import { AuthErrorFallback } from "@/components/ui/error-boundary";

function CentralDispatcherContent() {
  const router = useRouter();
  const { authState, authError, retryAuth, signOut } = useAuthUser();
  const [dispatcherElapsed, setDispatcherElapsed] = useState(false);

  // Safety timer: If after 6 seconds on dispatcher the page hasn't navigated, offer manual actions
  useEffect(() => {
    const timer = setTimeout(() => {
      setDispatcherElapsed(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    devLog("WORKSPACE", `CentralDispatcher: Evaluating state: ${authState}`);

    switch (authState) {
      case "UNAUTHENTICATED":
        router.push("/sign-in");
        break;
      case "PROFILE_MISSING":
        router.push("/register/profile");
        break;
      case "PENDING":
        router.push("/pending");
        break;
      case "REJECTED":
        router.push("/rejected");
        break;
      case "SUSPENDED":
        router.push("/suspended");
        break;
      case "ADMIN":
        router.push("/admin");
        break;
      case "APPROVED_VOLUNTEER":
        router.push("/workspace");
        break;
      case "AUTH_LOADING":
      case "PROFILE_LOADING":
      case "ERROR":
      default:
        // Handled in render UI below
        break;
    }
  }, [authState, router]);

  // If in an explicit error state, render recovery UI
  if (authState === "ERROR") {
    return (
      <AuthErrorFallback
        error={authError}
        onRetry={retryAuth}
        onSignOut={signOut}
        title="Unable to load PRAROHA'26 workspace"
        description="We couldn't connect to the PRAROHA'26 server to load your workspace credentials. Please retry or sign in again."
      />
    );
  }

  // If dispatcher has taken >6 seconds and hasn't navigated, render a friendly safety card
  if (dispatcherElapsed && (authState === "AUTH_LOADING" || authState === "PROFILE_LOADING")) {
    return (
      <AuthErrorFallback
        error="The connection to PRAROHA'26 services is taking longer than usual."
        onRetry={retryAuth}
        onSignOut={signOut}
        title="Directing to your workspace..."
        description="We are still waiting for your credentials to verify. You can retry the connection or sign out."
      />
    );
  }

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
