"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {
    isAuthenticated,
    role,
    isLoading,
  } = useAuthUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-sky-600 border-t-transparent" />
          <p className="text-xs font-medium text-text-secondary">
            Authenticating administrative privileges...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Security Gate: Non-admin users are strictly denied
  if (role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-error shadow-xs mb-4">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-text-primary">
          Access Denied
        </h1>
        <p className="mt-2 max-w-sm text-xs text-text-secondary leading-relaxed">
          Administrative leadership permissions are required to access this portal.
          Your current account role is <strong className="text-text-primary font-semibold">{role || "unassigned"}</strong>.
        </p>
        <div className="mt-6">
          <Link href="/workspace">
            <Button variant="primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Volunteer Workspace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex">
        <AdminSidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto min-w-0">
        <Navbar />
        <main className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-sky-600 border-t-transparent" />
        </div>
      }
    >
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
