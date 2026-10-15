"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { PrarohaHeroVisual } from "@/components/ui/PrarohaHeroVisual";

function SignInContent() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* 1. Mobile Visual Banner (<768px): Compact 180-220px header with PRAROHA'26 artwork */}
      <div className="block md:hidden shrink-0">
        <PrarohaHeroVisual variant="auth-mobile" priority objectPosition="center" />
      </div>

      {/* 2. Desktop Left Panel (55–60% width): Full-Height Landscape Visual Artwork */}
      <div className="hidden md:block md:w-[56%] lg:w-[58%] xl:w-[60%] shrink-0 relative min-h-screen">
        <PrarohaHeroVisual variant="auth-split" priority objectPosition="center" />
      </div>

      {/* 3. Authentication Content Panel (40–45% width): Centered Clerk Sign In */}
      <div className="flex flex-1 flex-col justify-center items-center px-4 py-8 sm:px-8 lg:px-12 min-h-[calc(100vh-200px)] md:min-h-screen bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
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
                <div className="flex w-full items-center justify-center rounded-2xl border border-border bg-surface p-8 shadow-sm">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              }
            />
          </div>

          <div className="text-center space-y-1">
            <p className="text-[11px] text-text-muted">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-primary font-semibold hover:underline">
                Register as volunteer
              </Link>
            </p>
            <p className="text-[11px] text-text-muted">
              PRAROHA'26 • Civil Engineering Department • SOE CUSAT
            </p>
          </div>
        </div>
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
