"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthUser, devLog } from "@/components/providers/AuthProvider";
import { AuthErrorFallback } from "@/components/ui/error-boundary";
import { buildSignInUrl } from "@/lib/authRedirect";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "volunteer";
}

/**
 * Authoritative Route Guard for PRAROHA'26.
 * Enforces live database verification status and role permissions,
 * eliminating client bypass via URL manipulation or infinite wait states.
 */
export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    authState,
    authError,
    retryAuth,
    signOut,
    role,
  } = useAuthUser();
  useEffect(() => {
    devLog("AUTH", `RouteGuard on "${pathname}": Current authState = ${authState}`);
    const requestedPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    switch (authState) {
      case "UNAUTHENTICATED":
        if (pathname !== "/sign-in" && pathname !== "/sign-up" && pathname !== "/") {
          router.replace(buildSignInUrl(requestedPath));
        }
        break;

      case "PROFILE_MISSING":
        if (pathname !== "/register/profile") {
          router.replace("/register/profile");
        }
        break;

      case "PENDING":
        if (pathname !== "/pending") {
          router.replace("/pending");
        }
        break;

      case "REJECTED":
        if (pathname !== "/rejected") {
          router.replace("/rejected");
        }
        break;

      case "SUSPENDED":
        if (pathname !== "/suspended") {
          router.replace("/suspended");
        }
        break;

      case "APPROVED_VOLUNTEER":
        // If volunteer is currently on a holding page, forward to workspace
        if (
          pathname === "/pending" ||
          pathname === "/rejected" ||
          pathname === "/suspended" ||
          pathname === "/register/profile" ||
          pathname === "/"
        ) {
          router.replace("/workspace");
          return;
        }

        // Lock out non-admins from admin routes
        if (requiredRole === "admin") {
          router.replace("/workspace");
        }
        break;

      case "ADMIN":
        // If admin is on a holding page, forward to admin portal
        if (
          pathname === "/pending" ||
          pathname === "/rejected" ||
          pathname === "/suspended" ||
          pathname === "/register/profile" ||
          pathname === "/"
        ) {
          router.replace("/admin");
        }
        break;

      case "AUTH_LOADING":
      case "PROFILE_LOADING":
      case "ERROR":
      default:
        break;
    }
  }, [authState, pathname, requiredRole, router, searchParams]);

  // If in an explicit error state, render recovery UI
  if (authState === "ERROR") {
    return (
      <AuthErrorFallback
        error={authError}
        onRetry={retryAuth}
        onSignOut={signOut}
        title="Unable to verify credentials"
        description="A connection error occurred while loading your profile from the PRAROHA&apos;26 database."
      />
    );
  }

  // Standard loading indicator while resolving auth
  if (authState === "AUTH_LOADING" || authState === "PROFILE_LOADING") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-xs font-medium text-text-secondary">
            Verifying PRAROHA&apos;26 credentials...
          </p>
        </div>
      </div>
    );
  }

  // Prevent flash of protected content while redirecting
  if (authState === "UNAUTHENTICATED" && pathname !== "/sign-in" && pathname !== "/sign-up" && pathname !== "/") {
    return null;
  }
  if (authState === "PROFILE_MISSING" && pathname !== "/register/profile") return null;
  if (authState === "PENDING" && pathname !== "/pending") return null;
  if (authState === "REJECTED" && pathname !== "/rejected") return null;
  if (authState === "SUSPENDED" && pathname !== "/suspended") return null;
  if (requiredRole === "admin" && role !== "admin") return null;

  return <>{children}</>;
}
