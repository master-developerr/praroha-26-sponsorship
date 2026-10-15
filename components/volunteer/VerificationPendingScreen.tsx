"use client";

import React from "react";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, LogOut, ShieldCheck, Mail, Phone, GraduationCap, Building2 } from "lucide-react";

export function VerificationPendingScreen() {
  const { profile, signOut } = useAuthUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-mint text-primary shadow-xs">
            <Clock className="h-7 w-7 animate-pulse" />
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            Status: Pending verification
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-text-primary">
            Profile submitted
          </h1>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            Your registration has been submitted to the PRAROHA'26 sponsorship team.
            You'll get access once an admin verifies your profile.
          </p>
        </div>

        {/* Submitted Profile Summary Card */}
        <Card className="border-border bg-surface shadow-xs">
          <CardContent className="p-5 space-y-3.5">
            <div className="border-b border-border-subtle pb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Submitted Volunteer Credentials
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-text-secondary">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Full Name
                </span>
                <span className="font-semibold text-text-primary">
                  {profile?.name || "Volunteer"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-border-subtle">
                <span className="flex items-center gap-2 text-text-secondary">
                  <Building2 className="h-4 w-4 text-text-muted" />
                  Department
                </span>
                <span className="font-medium text-text-primary">
                  {profile?.department || "Department"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-border-subtle">
                <span className="flex items-center gap-2 text-text-secondary">
                  <GraduationCap className="h-4 w-4 text-text-muted" />
                  Semester
                </span>
                <span className="font-medium text-text-primary">
                  {profile?.semester || "Semester"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-border-subtle">
                <span className="flex items-center gap-2 text-text-secondary">
                  <Phone className="h-4 w-4 text-text-muted" />
                  Phone Number
                </span>
                <span className="font-medium text-text-primary">
                  {profile?.phone || "Phone"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-border-subtle">
                <span className="flex items-center gap-2 text-text-secondary">
                  <Mail className="h-4 w-4 text-text-muted" />
                  Email
                </span>
                <span className="font-medium text-text-primary">
                  {profile?.email || "Email"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-3">
          <Button
            variant="outline"
            onClick={() => signOut()}
            className="w-full text-text-secondary hover:text-text-primary"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
          <p className="text-[11px] text-text-muted text-center">
            Need urgent clearance? Contact the PRAROHA'26 Sponsorship Head at SOE CUSAT.
          </p>
        </div>
      </div>
    </div>
  );
}
