"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

function SignUpContent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6">
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
            Join PRAROHA'26 Outreach
          </h1>
          <p className="text-xs text-text-secondary">
            Register as a student sponsorship volunteer
          </p>
        </div>

        <div className="flex justify-center">
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
          />
        </div>

        <p className="text-center text-[11px] text-text-muted">
          Already registered?{" "}
          <Link href="/sign-in" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
