"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import {
  Bell,
  AlertCircle,
  Clock,
  UserCheck,
  Award,
  CheckCheck,
  ChevronRight,
  PhoneCall,
  X,
} from "lucide-react";
import Link from "next/link";

interface NotificationPopoverProps {
  onOpenCallMode?: (companyId: string) => void;
}

export function NotificationPopover({ onOpenCallMode }: NotificationPopoverProps) {
  const { user, profile, role } = useAuthUser();
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const popoverRef = useRef<HTMLDivElement>(null);

  // Fetch real-time alerts from Convex
  const alertsData = useQuery(api.analytics.getNotificationAlerts, {
    userId: profile?.clerkId || profile?._id,
    role: role || "volunteer",
  });

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const overdue = (alertsData?.overdueCallbacks || []).filter(
    (item) => !dismissedIds.has(item._id)
  );
  const dueToday = (alertsData?.dueTodayCallbacks || []).filter(
    (item) => !dismissedIds.has(item._id)
  );
  const pendingUsers = (alertsData?.pendingVerifications || []).filter(
    (item: any) => !dismissedIds.has(item._id)
  );
  const recentPoints = (alertsData?.recentPoints || []).filter(
    (item: any) => !dismissedIds.has(item._id)
  );

  const totalActiveCount =
    overdue.length + dueToday.length + pendingUsers.length + recentPoints.length;

  const handleDismissAll = () => {
    const allIds = new Set<string>();
    overdue.forEach((o) => allIds.add(o._id));
    dueToday.forEach((d) => allIds.add(d._id));
    pendingUsers.forEach((p: any) => allIds.add(p._id));
    recentPoints.forEach((pt: any) => allIds.add(pt._id));
    setDismissedIds(allIds);
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
      >
        <Bell className="h-4 w-4" />
        {totalActiveCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-xs animate-in zoom-in">
            {totalActiveCount > 9 ? "9+" : totalActiveCount}
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-80 sm:w-96 rounded-xl border border-border bg-surface shadow-xl animate-in fade-in-50 slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3 bg-surface-subtle/50 rounded-t-xl">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-text-primary">Outreach Notifications</h3>
              {totalActiveCount > 0 && (
                <span className="rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 px-1.5 py-0.2 text-[10px] font-bold">
                  {totalActiveCount} new
                </span>
              )}
            </div>
            {totalActiveCount > 0 && (
              <button
                onClick={handleDismissAll}
                className="flex items-center gap-1 text-[11px] font-medium text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <CheckCheck className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>

          {/* Alerts List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border-subtle p-1">
            {totalActiveCount === 0 ? (
              <div className="py-8 text-center px-4">
                <CheckCheck className="mx-auto h-8 w-8 text-primary/40 mb-2" />
                <p className="text-xs font-semibold text-text-primary">All caught up!</p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  No overdue callbacks or pending action items.
                </p>
              </div>
            ) : (
              <>
                {/* Overdue Callbacks */}
                {overdue.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start gap-3 p-3 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                          Overdue Callback
                        </span>
                        <span className="text-[10px] text-text-muted">
                          {formatRelativeTime(item.dueDate)}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-text-primary truncate mt-0.5">
                        {item.companyName}
                      </p>
                      <p className="text-[11px] text-text-secondary truncate">
                        Contact: {item.contactName} {item.contactPhone ? `(${item.contactPhone})` : ""}
                      </p>
                      {item.notes && (
                        <p className="text-[10px] text-text-muted italic truncate mt-0.5">
                          "{item.notes}"
                        </p>
                      )}
                    </div>
                    {item.contactPhone && (
                      <a
                        href={`tel:${item.contactPhone}`}
                        className="shrink-0 p-1.5 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-900/50 dark:hover:bg-rose-900/80 dark:text-rose-200 transition-colors"
                        title="Call now"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                ))}

                {/* Due Today Callbacks */}
                {dueToday.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start gap-3 p-3 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 rounded-lg transition-colors"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                          Due Today
                        </span>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                          {new Date(item.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-text-primary truncate mt-0.5">
                        {item.companyName}
                      </p>
                      <p className="text-[11px] text-text-secondary truncate">
                        Contact: {item.contactName}
                      </p>
                    </div>
                    {item.contactPhone && (
                      <a
                        href={`tel:${item.contactPhone}`}
                        className="shrink-0 p-1.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:hover:bg-amber-900/80 dark:text-amber-200 transition-colors"
                        title="Call now"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                ))}

                {/* Pending Volunteer Verifications (Admin Only) */}
                {pendingUsers.map((u: any) => (
                  <div
                    key={u._id}
                    className="flex items-start gap-3 p-3 hover:bg-sky-50/40 dark:hover:bg-sky-950/20 rounded-lg transition-colors"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/40">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
                          Verification Queue
                        </span>
                        <span className="text-[10px] text-text-muted">
                          {formatRelativeTime(u.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-text-primary truncate mt-0.5">
                        {u.name}
                      </p>
                      <p className="text-[11px] text-text-secondary truncate">
                        {u.department} • Sem {u.semester}
                      </p>
                    </div>
                    <Link
                      href="/admin/verifications"
                      onClick={() => setIsOpen(false)}
                      className="shrink-0 p-1.5 rounded-md bg-sky-100 hover:bg-sky-200 text-sky-800 dark:bg-sky-900/50 dark:hover:bg-sky-900/80 dark:text-sky-200 transition-colors"
                      title="Review application"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}

                {/* Recent Points Earned */}
                {recentPoints.map((pt: any) => (
                  <div
                    key={pt._id}
                    className="flex items-start gap-3 p-3 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 rounded-lg transition-colors"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                          Points Earned
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                          +{pt.points} pts
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-text-primary truncate mt-0.5">
                        {pt.reason}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {formatRelativeTime(pt.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border-subtle px-4 py-2.5 bg-surface-subtle/30 rounded-b-xl flex items-center justify-between text-[11px] text-text-muted">
            <span>PRAROHA'26 Live Alert Engine</span>
            <Link
              href="/workspace"
              onClick={() => setIsOpen(false)}
              className="font-medium text-primary hover:underline"
            >
              Today's Shift →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
