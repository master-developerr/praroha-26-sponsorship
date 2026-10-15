"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ShieldCheck, Mail, Phone, GraduationCap, Building2, LogOut, RefreshCw } from "lucide-react";

export default function PendingVerificationPage() {
  const router = useRouter();
  const { profile, verificationStatus, role, isLoading, isAuthenticated, signOut } = useAuthUser();

  // Automatic real-time transition when Admin approves the volunteer in Convex
  useEffect(() => {
    if (!isLoading && isAuthenticated && verificationStatus === "approved") {
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/workspace");
      }
    } else if (!isLoading && isAuthenticated && verificationStatus === "rejected") {
      router.push("/rejected");
    } else if (!isLoading && isAuthenticated && verificationStatus === "suspended") {
      router.push("/suspended");
    }
  }, [isLoading, isAuthenticated, verificationStatus, role, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-mint/70 text-primary">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.5 6 4 10 4 15a8 8 0 0 0 16 0c0-5-2.5-9-8-13z" />
              <path d="M12 2c2.5 4 4 8 4 12a4 4 0 0 1-8 0c0-4 1.5-8 4-12z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-text-primary tracking-tight">PRAROHA'26</span>
        </div>

        <button
          onClick={() => signOut()}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-rose-600 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign out</span>
        </button>
      </header>

      {/* Main Holding Card */}
      <main className="max-w-xl w-full mx-auto my-auto py-8">
        <div className="space-y-6">
          {/* Visual Banner Accent */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-xs text-center p-6 sm:p-8 space-y-4">
            <div className="relative h-28 w-full rounded-xl overflow-hidden bg-accent-mint/20 mb-2">
              <Image
                src="/images/praroha-outreach-banner.png"
                alt="PRAROHA'26 Outreach"
                fill
                className="object-cover object-center opacity-85"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
            </div>

            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              Status: Verification Pending
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Application Under Review
            </h1>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
              Your profile has been submitted to the PRAROHA'26 Sponsorship Committee. Access to your outreach workspace will be granted immediately upon approval.
            </p>
          </div>

          {/* Submitted Profile Summary Card */}
          <Card className="border-border bg-surface shadow-xs">
            <CardContent className="p-5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Submitted Credentials
                </span>
                <span className="text-[10px] text-text-muted flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                  Live verification listener active
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-2 text-text-secondary">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Full Name
                  </span>
                  <span className="font-semibold text-text-primary">
                    {profile?.name || "Student Volunteer"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-border-subtle">
                  <span className="flex items-center gap-2 text-text-secondary">
                    <Building2 className="h-4 w-4 text-text-muted" />
                    Department
                  </span>
                  <span className="font-medium text-text-primary">
                    {profile?.department || "Civil Engineering"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-border-subtle">
                  <span className="flex items-center gap-2 text-text-secondary">
                    <GraduationCap className="h-4 w-4 text-text-muted" />
                    Semester
                  </span>
                  <span className="font-medium text-text-primary">
                    {profile?.semester || "S6"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-border-subtle">
                  <span className="flex items-center gap-2 text-text-secondary">
                    <Phone className="h-4 w-4 text-text-muted" />
                    Mobile Number
                  </span>
                  <span className="font-medium text-text-primary">
                    {profile?.phone || "Pending"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-border-subtle">
                  <span className="flex items-center gap-2 text-text-secondary">
                    <Mail className="h-4 w-4 text-text-muted" />
                    Institutional Email
                  </span>
                  <span className="font-medium text-text-primary">
                    {profile?.email || "volunteer@cusat.ac.in"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action */}
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => signOut()}
              className="w-full text-text-secondary hover:text-text-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out of account
            </Button>
            <p className="text-[11px] text-text-muted text-center pt-1">
              Need immediate lead access? Contact your Sponsorship Committee Head at SOE CUSAT.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-2xl w-full mx-auto text-center pt-4 border-t border-border-subtle text-[11px] text-text-muted">
        PRAROHA'26 • Civil Engineering Department • SOE CUSAT
      </footer>
    </div>
  );
}
