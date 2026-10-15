"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthUser } from "@/components/providers/AuthProvider";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "volunteer";
}

/**
 * Authoritative Route Guard for PRAROHA'26.
 * Enforces live database verification status and role permissions,
 * eliminating client bypass via URL manipulation.
 */
export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isAuthenticated,
    hasProfile,
    role,
    verificationStatus,
    isLoading,
  } = useAuthUser();

  useEffect(() => {
    if (isLoading) return;

    // 1. Not Authenticated
    if (!isAuthenticated) {
      if (pathname !== "/sign-in" && pathname !== "/sign-up" && pathname !== "/") {
        router.push("/sign-in");
      }
      return;
    }

    // 2. Profile Incomplete
    if (!hasProfile) {
      if (pathname !== "/register/profile") {
        router.push("/register/profile");
      }
      return;
    }

    // 3. Verification State Enforcements
    if (verificationStatus === "pending") {
      if (pathname !== "/pending") {
        router.push("/pending");
      }
      return;
    }

    if (verificationStatus === "rejected") {
      if (pathname !== "/rejected") {
        router.push("/rejected");
      }
      return;
    }

    if (verificationStatus === "suspended") {
      if (pathname !== "/suspended") {
        router.push("/suspended");
      }
      return;
    }

    // 4. Approved Users Handling
    if (verificationStatus === "approved") {
      // If approved user is currently on an onboarding/holding route, redirect them forward
      if (
        pathname === "/pending" ||
        pathname === "/rejected" ||
        pathname === "/suspended" ||
        pathname === "/register/profile" ||
        pathname === "/"
      ) {
        if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/workspace");
        }
        return;
      }

      // 5. Admin Route Lockout for Volunteers
      if (requiredRole === "admin" && role !== "admin") {
        router.push("/workspace");
        return;
      }
    }
  }, [
    isAuthenticated,
    hasProfile,
    role,
    verificationStatus,
    isLoading,
    pathname,
    requiredRole,
    router,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-xs font-medium text-text-secondary">
            Verifying PRAROHA'26 credentials...
          </p>
        </div>
      </div>
    );
  }

  // Prevent flash of protected content while redirecting
  if (!isAuthenticated && pathname !== "/sign-in" && pathname !== "/sign-up" && pathname !== "/") {
    return null;
  }

  if (isAuthenticated) {
    if (!hasProfile && pathname !== "/register/profile") return null;
    if (verificationStatus === "pending" && pathname !== "/pending") return null;
    if (verificationStatus === "rejected" && pathname !== "/rejected") return null;
    if (verificationStatus === "suspended" && pathname !== "/suspended") return null;
    if (requiredRole === "admin" && role !== "admin") return null;
  }

  return <>{children}</>;
}
