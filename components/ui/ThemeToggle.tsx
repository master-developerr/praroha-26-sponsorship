"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-focus-ring cursor-pointer shadow-2xs ${className}`}
    >
      <div className="relative h-4 w-4">
        <Sun
          className={`h-4 w-4 text-amber-500 transition-all duration-300 absolute inset-0 ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0 pointer-events-none"
          }`}
        />
        <Moon
          className={`h-4 w-4 text-text-primary transition-all duration-300 absolute inset-0 ${
            isDark
              ? "rotate-90 scale-0 opacity-0 pointer-events-none"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />
      </div>
      <span className="sr-only">{label}</span>
    </button>
  );
}
