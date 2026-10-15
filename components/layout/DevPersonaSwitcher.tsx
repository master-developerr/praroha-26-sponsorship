"use client";

import React, { useState } from "react";
import { useAuthUser, DevPersonaKey } from "@/components/providers/AuthProvider";
import { UserCheck, Shield, Clock, XCircle, AlertTriangle, UserPlus, LogOut, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function DevPersonaSwitcher() {
  const { activePersona, setActivePersona, role, verificationStatus } = useAuthUser();
  const [isOpen, setIsOpen] = useState(false);

  // Strictly disabled in production builds to prevent privilege escalation
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const personas: {
    key: DevPersonaKey;
    label: string;
    role: string;
    status: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    {
      key: "approved_volunteer",
      label: "Approved Volunteer (Arjun)",
      role: "volunteer",
      status: "approved",
      icon: UserCheck,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      key: "pending_volunteer",
      label: "Pending Volunteer (Rahul)",
      role: "volunteer",
      status: "pending",
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      key: "rejected_volunteer",
      label: "Rejected Volunteer (Ananya)",
      role: "volunteer",
      status: "rejected",
      icon: XCircle,
      color: "text-rose-600 bg-rose-50",
    },
    {
      key: "suspended_volunteer",
      label: "Suspended Volunteer (Kiran)",
      role: "volunteer",
      status: "suspended",
      icon: AlertTriangle,
      color: "text-red-700 bg-red-50",
    },
    {
      key: "admin_lead",
      label: "Admin Lead (Siddharth)",
      role: "admin",
      status: "approved",
      icon: Shield,
      color: "text-sky-600 bg-sky-50",
    },
    {
      key: "new_user",
      label: "New Unregistered User",
      role: "none",
      status: "none",
      icon: UserPlus,
      color: "text-purple-600 bg-purple-50",
    },
    {
      key: "logged_out",
      label: "Signed Out Visitor",
      role: "none",
      status: "none",
      icon: LogOut,
      color: "text-zinc-600 bg-zinc-100",
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="mb-2 w-72 rounded-xl border border-border bg-surface p-2 shadow-lg animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2">
            <span className="text-xs font-semibold text-text-primary">
              Feature 01 Test Personas
            </span>
            <span className="rounded bg-accent-mint px-1.5 py-0.5 text-[10px] font-bold text-accent-mint-text">
              DEV MODE
            </span>
          </div>
          <div className="mt-1 space-y-1">
            {personas.map((p) => {
              const Icon = p.icon;
              const isSelected = activePersona === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => {
                    setActivePersona(p.key);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer",
                    isSelected
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
                  )}
                >
                  <div className={cn("flex h-6 w-6 items-center justify-center rounded-md", p.color)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="truncate font-medium">{p.label}</p>
                    <p className="text-[10px] text-text-muted">
                      {p.role} • {p.status}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary shadow-md hover:bg-surface-subtle transition-all cursor-pointer"
      >
        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span>Test Role: <strong className="text-primary capitalize">{activePersona.replace("_", " ")}</strong></span>
        <ChevronUp className={cn("h-3.5 w-3.5 text-text-muted transition-transform", isOpen && "rotate-180")} />
      </button>
    </div>
  );
}
