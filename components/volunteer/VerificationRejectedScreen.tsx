"use client";

import React, { useState } from "react";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, LogOut, RefreshCw, AlertCircle } from "lucide-react";
import { VolunteerRegistrationModal } from "@/components/forms/VolunteerRegistrationModal";

export function VerificationRejectedScreen() {
  const { profile, signOut } = useAuthUser();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-error shadow-xs border border-rose-200 dark:border-rose-900/40">
            <XCircle className="h-7 w-7" />
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300">
            Registration rejected
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-text-primary">
            Verification not approved
          </h1>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            Your volunteer application was reviewed by the sponsorship committee and could not be verified at this time.
          </p>
        </div>

        {/* Reason Box */}
        {profile?.rejectionReason && (
          <Card className="border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-rose-900 dark:text-rose-200">
                  Feedback from Sponsorship Head:
                </h4>
                <p className="mt-1 text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                  "{profile.rejectionReason}"
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={() => setIsEditing(true)}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Edit & Resubmit Profile
          </Button>

          <Button
            variant="outline"
            onClick={() => signOut()}
            className="w-full"
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
    </div>
  );
}

export function AccountSuspendedScreen() {
  const { signOut } = useAuthUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 shadow-xs border border-red-200 dark:border-red-900/40">
          <XCircle className="h-7 w-7" />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-300 dark:border-red-800/50 bg-red-50 dark:bg-red-950/60 px-3 py-1 text-xs font-semibold text-red-800 dark:text-red-300">
          Account Suspended
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Access Restricted
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Your access to the PRAROHA'26 Sponsorship Outreach workspace has been suspended by the administrator. Please contact your committee head for resolution.
        </p>

        <Button
          variant="outline"
          onClick={() => signOut()}
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
