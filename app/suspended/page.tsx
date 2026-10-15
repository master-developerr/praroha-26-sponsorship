"use client";

import React from "react";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, LogOut, Mail } from "lucide-react";

export default function SuspendedVerificationPage() {
  const { signOut } = useAuthUser();

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
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 shadow-xs">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              Account Suspended
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Access Restricted
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Your access to the PRAROHA'26 Sponsorship Outreach workspace has been temporarily suspended by an administrator.
            </p>
          </div>

          <Card className="border-border bg-surface shadow-xs text-left">
            <CardContent className="p-4 space-y-2 text-xs">
              <span className="font-semibold text-text-primary">Need this resolved?</span>
              <p className="text-text-secondary leading-relaxed">
                Contact the PRAROHA'26 Sponsorship Committee or your department faculty coordinator to request account reinstatement.
              </p>
              <div className="pt-2 flex items-center gap-2 text-primary font-medium">
                <Mail className="h-3.5 w-3.5" />
                <span>sponsorship@praroha.in</span>
              </div>
            </CardContent>
          </Card>

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
      </main>

      {/* Footer */}
      <footer className="max-w-xl w-full mx-auto text-center pt-4 border-t border-border-subtle text-[11px] text-text-muted">
        PRAROHA'26 • School of Engineering, Cochin University of Science and Technology
      </footer>
    </div>
  );
}
