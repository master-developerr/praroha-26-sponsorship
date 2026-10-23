"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X, Shield, Sparkles, Building2 } from "lucide-react";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getRoleDefaultRoute } from "@/lib/authRedirect";

export function LandingNavbar() {
  const { isAuthenticated, role, authState } = useAuthUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const destination = isAuthenticated
    ? authState === "PROFILE_MISSING"
      ? "/register/profile"
      : getRoleDefaultRoute(
          role,
          authState === "PENDING"
            ? "pending"
            : authState === "REJECTED"
            ? "rejected"
            : authState === "SUSPENDED"
            ? "suspended"
            : undefined
        )
    : "/sign-in";

  const navLinks = [
    { label: "Relay Engine", href: "#relay" },
    { label: "Volunteer Cockpit", href: "#volunteer-cockpit" },
    { label: "Admin Control", href: "#admin-control" },
    { label: "Event Dossier", href: "#event-dossier" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-xs py-2.5"
          : "bg-transparent py-4 border-b border-border/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Event Pill */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground font-black text-sm tracking-tight transition-transform group-hover:scale-105">
                P
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-tight text-text-primary uppercase">
                  PRAROHA&apos;26
                </span>
                <span className="text-[10px] font-mono text-text-muted leading-tight">
                  Sponsorship Operations
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-border/60 bg-surface text-[10px] font-mono text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SOE CUSAT · DEC 04–05
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 border border-border/60 rounded-full px-3 py-1 bg-surface/70 backdrop-blur-xs">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1 text-xs font-medium text-text-secondary hover:text-text-primary rounded-full transition-colors hover:bg-surface-subtle"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions & Session Gateway */}
          <div className="flex items-center gap-2">
            <ThemeToggle className="h-8 w-8 rounded-sm border-border/60" />

            {isAuthenticated ? (
              <Link
                href={destination}
                className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary-hover transition-all"
              >
                <span>Enter Workspace</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary-hover transition-all"
                >
                  <span>Join Committee</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-sm border border-border text-text-muted hover:text-text-primary md:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-md px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary rounded-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-medium border border-border rounded-sm text-text-primary"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-sm"
                >
                  Join Sponsorship Committee
                </Link>
              </>
            ) : (
              <Link
                href={destination}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-sm"
              >
                Open Workspace
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
