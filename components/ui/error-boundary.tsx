"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthErrorFallbackProps {
  error?: string | null;
  onRetry?: () => void;
  onSignOut?: () => void;
  title?: string;
  description?: string;
}

/**
 * Enterprise PRAROHA'26 Error Screen for Authentication and Route Guards.
 * Never leaves the user on a blank white screen or infinite spinner.
 */
export function AuthErrorFallback({
  error,
  onRetry,
  onSignOut,
  title = "Unable to connect to PRAROHA'26",
  description = "The application encountered a timeout or connection issue while verifying your credentials.",
}: AuthErrorFallbackProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 text-center animate-in fade-in duration-300">
      <div className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 shadow-xs">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold tracking-tight text-text-primary">
            {title}
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            {description}
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-border-subtle bg-surface-subtle p-3 text-left">
            <p className="text-[11px] font-mono text-text-muted break-words">
              {error}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2.5 pt-2">
          {onRetry && (
            <Button
              variant="primary"
              size="md"
              onClick={onRetry}
              className="w-full font-semibold shadow-xs"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </Button>
          )}

          {onSignOut && (
            <Button
              variant="outline"
              size="md"
              onClick={onSignOut}
              className="w-full text-text-secondary hover:text-text-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out & Reconnect
            </Button>
          )}

          <a
            href="/sign-in"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-primary font-medium hover:underline pt-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </a>
        </div>
      </div>

      <p className="mt-6 text-[11px] text-text-muted">
        PRAROHA'26 • School of Engineering, CUSAT
      </p>
    </div>
  );
}

interface SectionErrorBoundaryProps {
  children: ReactNode;
  sectionTitle?: string;
  fallback?: ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Section-level error boundary.
 * Prevents a failure in one query or widget from crashing the whole dashboard.
 */
export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || "An unexpected error occurred in this section.",
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[SectionErrorBoundary] Error in section "${this.props.sectionTitle || "Dashboard Section"}":`,
      error,
      errorInfo
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
              Unable to load {this.props.sectionTitle || "this section"}
            </span>
            <button
              onClick={this.handleReset}
              className="text-[11px] font-semibold text-rose-700 hover:underline cursor-pointer"
            >
              Try Again
            </button>
          </div>
          <p className="text-[11px] text-rose-800/80">
            {this.state.errorMessage}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
