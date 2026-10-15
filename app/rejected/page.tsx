"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, LogOut, RefreshCw, AlertCircle } from "lucide-react";
import { VolunteerRegistrationModal } from "@/components/forms/VolunteerRegistrationModal";

export default function RejectedVerificationPage() {
  const { profile, signOut } = useAuthUser();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-xl w-full mx-auto flex items-center justify-between pb-4 border-b border-border-subtle">
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

      {/* Main Content */}
      <main className="max-w-md w-full mx-auto my-auto py-8">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-error shadow-xs">
            <XCircle className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              Registration Not Approved
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Verification Rejected
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Your volunteer application was reviewed by the sponsorship committee and could not be verified in its current state.
            </p>
          </div>

          {/* Feedback Card */}
          {profile?.rejectionReason && (
            <Card className="border-rose-200 bg-rose-50/60 shadow-xs text-left">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-rose-900">
                    Reason from Sponsorship Head:
                  </h4>
                  <p className="mt-1 text-xs text-rose-800 leading-relaxed font-medium">
                    "{profile.rejectionReason}"
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsEditing(true)}
              className="w-full font-semibold shadow-xs"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Update & Resubmit Profile
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => signOut()}
              className="w-full text-text-secondary hover:text-text-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>

        <VolunteerRegistrationModal
          isOpen={isEditing}
          initialValues={{
            name: profile?.name,
            phone: profile?.phone,
            semester: profile?.semester,
            department: profile?.department,
          }}
          onComplete={() => setIsEditing(false)}
        />
      </main>

      {/* Footer */}
      <footer className="max-w-xl w-full mx-auto text-center pt-4 border-t border-border-subtle text-[11px] text-text-muted">
        PRAROHA'26 • School of Engineering, Cochin University of Science and Technology
      </footer>
    </div>
  );
}
