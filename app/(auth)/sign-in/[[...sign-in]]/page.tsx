"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignIn } from "@clerk/nextjs";
import { useAuthUser, DevPersonaKey } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, UserCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

function SignInContent() {
  const router = useRouter();
  const { setActivePersona } = useAuthUser();
  const [showDemoOptions, setShowDemoOptions] = useState(false);

  const handleSelectDemo = (persona: DevPersonaKey) => {
    setActivePersona(persona);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Strategic PRAROHA'26 Illustration Banner */}
        <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-[#BEE3D3] shadow-xs bg-surface">
          <Image
            src="/images/praroha-outreach-banner.png"
            alt="PRAROHA'26 Outreach System"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-mint/60 text-primary shadow-xs">
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.5 6 4 10 4 15a8 8 0 0 0 16 0c0-5-2.5-9-8-13z" />
              <path d="M12 2c2.5 4 4 8 4 12a4 4 0 0 1-8 0c0-4 1.5-8 4-12z" />
              <path d="M7 13c-2 2-3 4-3 6" />
              <path d="M17 13c2 2 3 4 3 6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            PRAROHA'26
          </h1>
          <p className="text-xs text-text-secondary">
            Sponsorship Outreach & Volunteer Execution System
          </p>
        </div>

        {/* Clerk Sign In Box */}
        <div className="flex justify-center">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            fallback={
              <div className="w-full rounded-2xl border border-border bg-surface p-6 shadow-sm text-center space-y-4">
                <p className="text-xs text-text-secondary">
                  Sign in with your CUSAT email to access the sponsorship outreach cockpit.
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleSelectDemo("approved_volunteer")}
                  >
                    Enter as Volunteer (Arjun Nair)
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            }
          />
        </div>

        {/* Quick Demo Evaluation Panel */}
        <div className="rounded-xl border border-border-subtle bg-surface-subtle p-4 text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-text-primary flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Quick Testing & Verification Access
            </span>
            <button
              onClick={() => setShowDemoOptions(!showDemoOptions)}
              className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
            >
              {showDemoOptions ? "Hide" : "Show Options"}
            </button>
          </div>

          {showDemoOptions && (
            <div className="pt-2 space-y-2 animate-in fade-in">
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Test each Feature 01 workflow immediately:
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => handleSelectDemo("approved_volunteer")}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-left hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  <span className="font-medium text-text-primary">
                    1. Approved Volunteer (Arjun Nair)
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                    /workspace
                  </span>
                </button>

                <button
                  onClick={() => handleSelectDemo("pending_volunteer")}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-left hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  <span className="font-medium text-text-primary">
                    2. Pending Volunteer (Rahul Sharma)
                  </span>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold">
                    Holding Screen
                  </span>
                </button>

                <button
                  onClick={() => handleSelectDemo("rejected_volunteer")}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-left hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  <span className="font-medium text-text-primary">
                    3. Rejected Volunteer (Ananya Sen)
                  </span>
                  <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-semibold">
                    Rejection Screen
                  </span>
                </button>

                <button
                  onClick={() => handleSelectDemo("admin_lead")}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-left hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  <span className="font-medium text-text-primary">
                    4. Admin Lead (Siddharth Menon)
                  </span>
                  <span className="text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-semibold">
                    /admin
                  </span>
                </button>

                <button
                  onClick={() => handleSelectDemo("new_user")}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-left hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  <span className="font-medium text-text-primary">
                    5. New User (Registration Modal)
                  </span>
                  <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-semibold">
                    4-Field Modal
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-text-muted">
          PRAROHA'26 • Civil Engineering Department • SOE CUSAT
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
