"use client";

import React, { Suspense, useEffect } from "react";
import { SignIn } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthFrame } from "@/components/auth/AuthFrame";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { sanitizeReturnPath } from "@/lib/authRedirect";

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { user, isAuthenticated, isLoading, authState, role } = useAuthUser();
  const redirectTarget = sanitizeReturnPath(searchParams.get("redirect"));
  const isDark = resolvedTheme === "dark";

  // If user is already authenticated, redirect them to their role-appropriate destination
  useEffect(() => {
    if (isAuthenticated && user) {
      const destination =
        role === "admin"
          ? (redirectTarget !== "/workspace" ? redirectTarget : "/admin")
          : authState === "PROFILE_MISSING"
          ? "/register/profile"
          : authState === "PENDING"
          ? "/pending"
          : authState === "REJECTED"
          ? "/rejected"
          : authState === "SUSPENDED"
          ? "/suspended"
          : redirectTarget;

      router.replace(destination);
    }
  }, [isAuthenticated, user, role, authState, redirectTarget, router]);

  return (
    <AuthFrame mode="sign-in">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent mb-3" />
          <p className="text-xs font-semibold text-text-primary">Loading authentication...</p>
          <p className="text-[11px] text-text-muted mt-1">Verifying PRAROHA session</p>
        </div>
      ) : isAuthenticated && user ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent mb-3" />
          <p className="text-xs font-semibold text-text-primary">Signed in as {user.fullName || user.email}</p>
          <p className="text-[11px] text-text-muted mt-1">Redirecting to your dashboard...</p>
        </div>
      ) : (
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl={redirectTarget}
          appearance={{
            variables: {
              colorPrimary: isDark ? "#8fd3c4" : "#147d6f",
              colorBackground: isDark ? "#121D2C" : "#ffffff",
            },
            elements: {
              rootBox: "w-full",
              cardBox: "w-full shadow-none border-none bg-transparent",
              card: "w-full bg-transparent p-0 shadow-none border-none",
              main: "bg-transparent shadow-none border-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "border-border bg-surface text-text-primary hover:bg-surface-subtle",
              dividerLine: "bg-border",
              dividerText: "text-text-muted text-xs",
              formFieldLabel: "text-text-primary font-medium text-xs",
              formFieldInput: "border-border bg-input-background text-text-primary focus:border-primary focus:ring-1 focus:ring-primary",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary-hover font-semibold",
              footerActionLink: "text-primary hover:text-primary-hover font-medium",
              footer: "bg-transparent",
            },
          }}
        />
      )}
    </AuthFrame>
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

