"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserCheck,
  Building2,
  Users2,
  FileCheck2,
  Award,
  BarChart3,
  ArrowLeft,
  ChevronDown,
  LogOut,
  ShieldAlert,
  Database,
} from "lucide-react";
import { useAuthUser } from "@/components/providers/AuthProvider";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuthUser();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const adminNavItems = [
    {
      label: "Executive Overview",
      icon: BarChart3,
      href: "/admin",
      isActive: pathname === "/admin",
    },
    {
      label: "Volunteer Verification",
      icon: UserCheck,
      href: "/admin/verifications",
      isActive: pathname.startsWith("/admin/verifications"),
    },
    {
      label: "Master Lead Directory",
      icon: Building2,
      href: "/admin/leads",
      isActive: pathname.startsWith("/admin/leads"),
    },
    {
      label: "Lead Allocation Matrix",
      icon: Users2,
      href: "/admin/assignments",
      isActive: pathname.startsWith("/admin/assignments"),
    },
    {
      label: "Sponsorship Commitments",
      icon: FileCheck2,
      href: "/admin/commitments",
      isActive: pathname.startsWith("/admin/commitments"),
    },
    {
      label: "Audit & Data Export",
      icon: BarChart3,
      href: "/admin/analytics",
      isActive: pathname.startsWith("/admin/analytics"),
    },
    {
      label: "Honors Leaderboard",
      icon: Award,
      href: "/admin/leaderboard",
      isActive: pathname.startsWith("/admin/leaderboard"),
    },
    {
      label: "Data Management",
      icon: Database,
      href: "/admin/data-management",
      isActive: pathname.startsWith("/admin/data-management"),
    },
  ];

  return (
    <aside className="flex h-screen w-60 flex-col justify-between border-r border-border bg-sidebar-background select-none">
      <div>
        <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-text-primary leading-tight">
              PRAROHA&apos;26
            </h1>
            <p className="mt-0.5 text-[11px] font-semibold leading-none text-primary">
              Sponsorship control room
            </p>
          </div>
        </div>

        <nav className="space-y-0.5 px-2.5 py-4">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between border-l-2 px-3 py-2.5 text-xs font-semibold transition-colors ${item.isActive
                    ? "border-primary bg-sidebar-active text-text-primary font-bold"
                    : "border-transparent text-text-secondary hover:border-border-strong hover:bg-surface-subtle hover:text-text-primary"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${item.isActive ? "text-primary" : "text-text-muted"
                      }`}
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 px-3 pb-4">
        {/* Switch to Volunteer Workspace */}
        <Link
          href="/workspace"
          className="flex items-center justify-between border-l-2 border-border-strong bg-surface-subtle px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-primary hover:bg-surface hover:text-text-primary"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-3.5 w-3.5 text-text-muted" />
            <span>Volunteer Workspace</span>
          </div>
        </Link>

        {/* User Profile */}
        <div className="relative border-t border-border-subtle pt-2">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center justify-between p-2 hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
                {(profile?.name || user?.fullName || "AD").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="truncate text-left">
                <p className="truncate text-xs font-semibold text-text-primary">
                  {profile?.name || user?.fullName || "Admin"}
                </p>
                <p className="truncate text-[10px] font-medium text-primary">
                  Sponsorship Head
                </p>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-text-muted shrink-0 ml-1" />
          </div>

          {showUserMenu && (
            <div className="absolute bottom-14 left-2 right-2 z-50 rounded-xl border border-border bg-surface p-1 shadow-lg animate-in fade-in">
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
    </aside>
  );
}
