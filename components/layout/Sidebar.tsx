"use client";

import React, { useState } from "react";
import type { LucideIcon } from "lucide-react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { EventInfoModal } from "@/components/volunteer/EventInfoModal";

interface NavItem {
  label: string;
  icon: LucideIcon;
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
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col justify-between border-r border-border bg-sidebar-background select-none">
      {/* Top Header & Branding matching AdminSidebar */}
      <div>
        <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.5 6 4 10 4 15a8 8 0 0 0 16 0c0-5-2.5-9-8-13z" />
              <path d="M12 2c2.5 4 4 8 4 12a4 4 0 0 1-8 0c0-4 1.5-8 4-12z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight text-text-primary leading-tight truncate">
              PRAROHA&apos;26
            </h1>
            <p className="mt-0.5 text-[11px] font-semibold leading-none text-primary truncate">
              Sponsorship Volunteer Tool
            </p>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="space-y-0.5 px-2.5 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex w-full items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-left text-xs font-semibold text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-subtle hover:text-text-primary cursor-pointer"
                >
                  <Icon className="h-4 w-4 text-text-muted" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center justify-between border-l-2 px-3 py-2.5 text-xs font-semibold transition-colors",
                  item.isActive
                    ? "border-primary bg-sidebar-active text-text-primary font-bold"
                    : "border-transparent text-text-secondary hover:border-border-strong hover:bg-surface-subtle hover:text-text-primary"
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

      {/* Bottom Section: Secondary Links & User Profile matching AdminSidebar */}
      <div className="space-y-3 px-3 pb-4">
        {/* Switch to Admin if authorized */}
        {role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center justify-between border-l-2 border-border-strong bg-surface-subtle px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-primary hover:bg-surface hover:text-text-primary"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-text-muted" />
              <span>Admin Control Room</span>
            </div>
            <ArrowRight className="h-3 w-3 text-text-muted" />
          </Link>
        )}

        {/* Secondary Links: Outreach Guide & Help */}
        <div className="space-y-0.5 border-t border-border-subtle pt-2">
          <Link
            href="/workspace/event-info"
            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 text-text-muted" />
            <span>Outreach Guide</span>
          </Link>
          <a
            href="mailto:sponsorship@praroha.in"
            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5 text-text-muted" />
            <span>Help & Support</span>
          </a>
        </div>

        {/* User Profile matching AdminSidebar */}
        <div className="relative border-t border-border-subtle pt-2">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center justify-between p-2 hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
                {profile?.name
                  ? profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                  : user?.fullName
                    ? user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                    : "AD"}
              </div>
              <div className="truncate text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs font-semibold text-text-primary">
                    {profile?.name || user?.fullName || "Adil M"}
                  </p>
                  <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-success">
                    {verificationStatus || "APPROVED"}
                  </span>
                </div>
                <p className="truncate text-[10px] text-text-muted mt-0.5">
                  {profile?.department
                    ? `${profile.department.split(" ")[0]} • ${profile.semester || "S5"}`
                    : "Civil • S5"}
                </p>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-text-muted shrink-0 ml-1" />
          </div>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute bottom-14 left-2 right-2 z-50 rounded-xl border border-border bg-surface p-1 shadow-lg animate-in fade-in">
              {role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors"
                >
                  <Shield className="h-4 w-4 text-sky-600" />
                  Admin Control Room
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
