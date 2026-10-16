"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  PhoneCall,
  BarChart3,
  Trophy,
  FileText,
  Settings,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  LogOut,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { EventInfoModal } from "@/components/volunteer/EventInfoModal";

interface NavItem {
  label: string;
  icon: any;
  href: string;
  isActive: boolean;
  onClick?: () => void;
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, profile, role, verificationStatus, signOut } = useAuthUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isEventInfoModalOpen, setIsEventInfoModalOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/workspace",
      isActive: pathname === "/workspace",
    },
    {
      label: "My Leads",
      icon: Users,
      href: "/workspace/leads",
      isActive: pathname === "/workspace/leads",
    },
    {
      label: "Follow-ups",
      icon: Calendar,
      href: "/workspace/follow-ups",
      isActive: pathname === "/workspace/follow-ups",
    },
    {
      label: "Call Reports",
      icon: PhoneCall,
      href: "/workspace/reports",
      isActive: pathname === "/workspace/reports",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/workspace/analytics",
      isActive: pathname === "/workspace/analytics",
    },
    {
      label: "Leaderboard",
      icon: Trophy,
      href: "/workspace/leaderboard",
      isActive: pathname === "/workspace/leaderboard",
    },
    {
      label: "Event Info",
      icon: FileText,
      href: "/workspace/event-info",
      isActive: pathname === "/workspace/event-info",
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-border bg-surface select-none sticky top-0 shrink-0">
      {/* Top Header & Branding */}
      <div>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border-subtle">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-mint/70 text-primary shadow-xs">
            <svg
              className="h-6 w-6"
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
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight text-text-primary leading-tight truncate">
              PRAROHA'26
            </h1>
            <p className="text-[11px] font-medium text-text-secondary leading-none mt-0.5 truncate">
              Sponsorship Volunteer Tool
            </p>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-text-primary hover:bg-surface-subtle hover:text-primary transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-text-muted" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] rounded px-1.5 py-0.5 bg-accent-mint text-primary font-bold">
                    Deck
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all",
                  item.isActive
                    ? "bg-accent-mint text-accent-mint-text shadow-2xs font-bold"
                    : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      item.isActive ? "text-primary" : "text-text-muted"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Promo Card, Secondary Links & User Profile */}
      <div className="space-y-3 px-3 pb-4">
        {/* Editorial Promo Card */}
        <div className="relative overflow-hidden rounded-xl border border-[#BEE3D3] dark:border-teal-900/50 bg-gradient-to-br from-[#E6F4EA] via-[#D9EEE4] to-[#C7E9DA] dark:from-teal-950/40 dark:via-surface-subtle dark:to-teal-950/20 p-3.5 text-text-primary shadow-xs">
          <div className="relative z-10 space-y-1.5">
            <h3 className="text-xs font-bold leading-snug text-primary">
              More Sponsors.
              <br />
              Bigger PRAROHA'26.
            </h3>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-medium text-text-secondary">SOE CUSAT</span>
              <button
                onClick={() => setIsEventInfoModalOpen(true)}
                aria-label="View campaign details"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow-xs hover:bg-primary-hover transition-colors cursor-pointer"
              >
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-primary/10 blur-sm pointer-events-none" />
        </div>

        {/* Secondary Links: Settings & Help */}
        <div className="space-y-0.5 border-t border-border-subtle pt-2">
          <button
            onClick={() => setIsEventInfoModalOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
          >
            <Settings className="h-4 w-4 text-text-muted" />
            <span>Outreach Guide</span>
          </button>
          <a
            href="mailto:sponsorship@praroha.in"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
          >
            <HelpCircle className="h-4 w-4 text-text-muted" />
            <span>Help & Support</span>
          </a>
        </div>

        {/* User Profile Snippet */}
        <div className="relative border-t border-border-subtle pt-2">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center justify-between rounded-xl p-2 hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-xs">
                {profile?.name
                  ? profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "VN"}
              </div>
              <div className="truncate text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs font-semibold text-text-primary">
                    {profile?.name || user?.fullName || "Volunteer"}
                  </p>
                  <span className="shrink-0 inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    {verificationStatus || "approved"}
                  </span>
                </div>
                <p className="truncate text-[10px] text-text-muted mt-0.5">
                  {profile?.department
                    ? `${profile.department.split(" ")[0]} • ${profile.semester || "S6"}`
                    : "SOE CUSAT"}
                </p>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-text-muted shrink-0 ml-1" />
          </div>

          {/* User Popover Menu */}
          {showUserMenu && (
            <div className="absolute bottom-14 left-2 right-2 z-50 rounded-xl border border-border bg-surface p-1 shadow-lg animate-in fade-in">
              {role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors"
                >
                  <Shield className="h-4 w-4 text-sky-600" />
                  Admin Cockpit
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Event Info Modal */}
      <EventInfoModal
        isOpen={isEventInfoModalOpen}
        onClose={() => setIsEventInfoModalOpen(false)}
      />
    </aside>
  );
}
