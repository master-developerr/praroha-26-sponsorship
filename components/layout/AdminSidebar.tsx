"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserCheck,
  Building2,
  Users2,
  PhoneCall,
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
      badge: "Active",
    },
    {
      label: "Volunteer Verification",
      icon: UserCheck,
      href: "/admin/verifications",
      isActive: pathname.startsWith("/admin/verifications"),
      badge: "Active",
    },
    {
      label: "Master Lead Directory",
      icon: Building2,
      href: "/admin/leads",
      isActive: pathname.startsWith("/admin/leads"),
      badge: "Active",
    },
    {
      label: "Lead Allocation Matrix",
      icon: Users2,
      href: "/admin/assignments",
      isActive: pathname.startsWith("/admin/assignments"),
      badge: "Active",
    },
    {
      label: "Sponsorship Commitments",
      icon: FileCheck2,
      href: "/admin/commitments",
      isActive: pathname.startsWith("/admin/commitments"),
      badge: "Active",
    },
    {
      label: "Audit & Data Export",
      icon: BarChart3,
      href: "/admin/analytics",
      isActive: pathname.startsWith("/admin/analytics"),
      badge: "Active",
    },
    {
      label: "Honors Leaderboard",
      icon: Award,
      href: "/admin/leaderboard",
      isActive: pathname.startsWith("/admin/leaderboard"),
      badge: "Active",
    },
    {
      label: "Data Management",
      icon: Database,
      href: "/admin/data-management",
      isActive: pathname.startsWith("/admin/data-management"),
      badge: "Active",
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-border bg-surface select-none">
      <div>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border-subtle">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-text-primary leading-tight">
              PRAROHA'26
            </h1>
            <p className="text-[11px] font-semibold text-sky-700 leading-none mt-0.5">
              Admin Leadership Cockpit
            </p>
          </div>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  item.isActive
                    ? "bg-sky-50 text-sky-900 shadow-xs font-bold"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-subtle"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      item.isActive ? "text-sky-700" : "text-text-muted"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] rounded px-1.5 py-0.2 font-mono font-medium ${
                      item.isActive
                        ? "bg-sky-100 text-sky-800"
                        : "bg-surface-subtle text-text-muted border border-border-subtle"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 px-3 pb-4">
        {/* Switch to Volunteer Workspace */}
        <Link
          href="/workspace"
          className="flex items-center justify-between rounded-xl border border-border bg-surface-subtle px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-3.5 w-3.5 text-text-muted" />
            <span>Volunteer Workspace</span>
          </div>
          <span className="rounded bg-accent-mint px-1.5 py-0.5 text-[10px] font-semibold text-accent-mint-text">
            Live
          </span>
        </Link>

        {/* User Profile */}
        <div className="relative border-t border-border-subtle pt-2">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center justify-between rounded-xl p-2 hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-700 text-xs font-bold text-white shadow-xs">
                AD
              </div>
              <div className="truncate text-left">
                <p className="truncate text-xs font-semibold text-text-primary">
                  {profile?.name || user?.fullName || "Admin"}
                </p>
                <p className="truncate text-[10px] font-medium text-sky-700">
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
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
