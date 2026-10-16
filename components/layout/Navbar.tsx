"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Plus,
  Command,
  Menu,
  X,
  LayoutDashboard,
  Users,
  Trophy,
  BarChart3,
  Building2,
  Users2,
  FileCheck2,
  UserCheck,
  Shield,
  LogOut,
  ChevronRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { NotificationPopover } from "@/components/layout/NotificationPopover";
import { GlobalCommandPalette } from "@/components/search/GlobalCommandPalette";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { eventConfig } from "@/lib/eventConfig";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar({
  onLogCallClick,
  onOpenEventInfo,
  onOpenLeaderboard,
}: {
  onLogCallClick?: () => void;
  onOpenEventInfo?: () => void;
  onOpenLeaderboard?: () => void;
}) {
  const pathname = usePathname();
  const { role, profile, signOut } = useAuthUser();
  const [showCallNotice, setShowCallNotice] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global keydown listener for ⌘K / Ctrl+K & Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleLogCall = () => {
    if (onLogCallClick) {
      onLogCallClick();
    } else {
      setShowCallNotice(true);
      setTimeout(() => setShowCallNotice(false), 3000);
    }
  };

  const isAdminPath = pathname.startsWith("/admin");

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md mr-2">
          {/* Mobile Navigation Drawer Trigger (Visible < lg) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="lg:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Global Search Bar (Triggers Command Palette) */}
          <div
            onClick={() => setIsCommandPaletteOpen(true)}
            className="relative w-full cursor-pointer group"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted group-hover:text-primary transition-colors">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              readOnly
              placeholder="Search companies, leads... (⌘K)"
              aria-label="Search companies, contacts, or leads"
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-12 text-xs text-text-primary placeholder:text-text-muted group-hover:border-primary/50 group-hover:bg-surface cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary transition-all"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-muted shadow-2xs">
                <Command className="h-2.5 w-2.5" /> K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Reactive Notification Popover */}
          <NotificationPopover />

          {/* Event Date Badge */}
          <div
            onClick={onOpenEventInfo}
            className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary shadow-xs hover:border-primary/40 transition-colors cursor-pointer"
            title="View PRAROHA'26 Event Information & Pitch Brochure"
          >
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium text-text-primary">{eventConfig.name}</span>
            <span className="text-text-muted">•</span>
            <span>{eventConfig.datesCompact}</span>
          </div>

          {/* Primary Call Action */}
          <div className="relative">
            <Button
              variant="primary"
              size="md"
              onClick={handleLogCall}
              className="font-medium bg-primary hover:bg-primary-hover shadow-xs text-xs px-3 sm:px-3.5"
            >
              <Plus className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Log a Call</span>
              <span className="sm:hidden">Call</span>
            </Button>

            {showCallNotice && (
              <div className="absolute right-0 top-11 z-50 w-64 rounded-lg border border-border bg-surface p-2.5 text-xs text-text-secondary shadow-md animate-in fade-in">
                <span className="font-semibold text-text-primary">Call Mode:</span> Launching in-call workstation.
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Modal */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[80vw] h-full bg-surface border-r border-border p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-black text-xs">
                    P26
                  </div>
                  <div>
                    <h2 className="text-xs font-bold tracking-tight text-text-primary">
                      PRAROHA'26
                    </h2>
                    <p className="text-[10px] text-text-muted">Outreach Cockpit</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <ThemeToggle />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close navigation"
                    className="rounded-md p-1.5 text-text-muted hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* User Profile Summary */}
              {profile && (
                <div className="my-4 p-3 rounded-xl bg-surface-subtle border border-border">
                  <p className="text-xs font-bold text-text-primary truncate">{profile.name}</p>
                  <p className="text-[11px] text-text-muted truncate">
                    {profile.department} • {profile.semester}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/50">
                      {role || "volunteer"}
                    </span>
                    <span className="text-[10px] font-semibold text-text-muted">
                      {profile.verificationStatus}
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1 mt-2">
                <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
                  Navigation
                </p>

                <Link
                  href="/workspace"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-text-primary hover:bg-surface-subtle transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    <span>Volunteer Workspace</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                </Link>

                {role === "admin" && (
                  <>
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-text-primary hover:bg-surface-subtle transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <BarChart3 className="h-4 w-4 text-sky-600" />
                        <span>Executive Cockpit</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                    </Link>

                    <Link
                      href="/admin/verifications"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-text-primary hover:bg-surface-subtle transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <UserCheck className="h-4 w-4 text-teal-600" />
                        <span>Volunteer Verification</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                    </Link>

                    <Link
                      href="/admin/leads"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-text-primary hover:bg-surface-subtle transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span>Master Lead Directory</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                    </Link>

                    <Link
                      href="/admin/assignments"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-text-primary hover:bg-surface-subtle transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Users2 className="h-4 w-4 text-amber-600" />
                        <span>Lead Allocation Matrix</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                    </Link>

                    <Link
                      href="/admin/commitments"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-text-primary hover:bg-surface-subtle transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileCheck2 className="h-4 w-4 text-emerald-600" />
                        <span>Sponsorship Commitments</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                    </Link>

                    <Link
                      href="/admin/analytics"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-text-primary hover:bg-surface-subtle transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Shield className="h-4 w-4 text-indigo-600" />
                        <span>Audit & Data Export</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                    </Link>
                  </>
                )}

                {onOpenEventInfo && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenEventInfo();
                    }}
                    className="flex w-full items-center justify-between p-2 rounded-lg text-xs font-semibold text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-teal-600" />
                      <span>PRAROHA Event Brochure</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                  </button>
                )}

                {onOpenLeaderboard && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenLeaderboard();
                    }}
                    className="flex w-full items-center justify-between p-2 rounded-lg text-xs font-semibold text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <span>Honors Leaderboard</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Sign Out */}
            <div className="pt-4 border-t border-border">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut();
                }}
                className="flex w-full items-center gap-2 p-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out of Cockpit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Command Palette Modal */}
      <GlobalCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onLogCall={onLogCallClick}
        onOpenEventInfo={onOpenEventInfo}
        onOpenLeaderboard={onOpenLeaderboard}
      />
    </>
  );
}

