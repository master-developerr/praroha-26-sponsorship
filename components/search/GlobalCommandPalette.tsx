"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import {
  Search,
  Command,
  PhoneCall,
  FileText,
  Award,
  Download,
  Building2,
  User,
  ArrowRight,
  Sparkles,
  BarChart3,
  X,
  Calendar,
  Layers,
} from "lucide-react";

interface GlobalCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onLogCall?: () => void;
  onOpenEventInfo?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenCompanyDossier?: (companyId: string) => void;
}

export function GlobalCommandPalette({
  isOpen,
  onClose,
  onLogCall,
  onOpenEventInfo,
  onOpenLeaderboard,
  onOpenCompanyDossier,
}: GlobalCommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Reactive global search across companies and contacts
  const searchResults = useQuery(
    api.analytics.globalSearch,
    searchQuery.trim().length >= 2 ? { query: searchQuery } : "skip"
  );

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Global keydown handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered from parent or external listener
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      label: "Log an Outreach Call",
      description: "Launch direct dialer and call outcome recorder",
      icon: PhoneCall,
      action: () => {
        onClose();
        if (onLogCall) onLogCall();
      },
      category: "Action",
    },
    {
      label: "PRAROHA'26 Event Deck & Tiers",
      description: "Review brochure deliverables, student demographics, and pricing",
      icon: Calendar,
      action: () => {
        onClose();
        if (onOpenEventInfo) onOpenEventInfo();
      },
      category: "Reference",
    },
    {
      label: "Honors Leaderboard Podium",
      description: "Check SDR team rankings, points, and closed deals",
      icon: Award,
      action: () => {
        onClose();
        if (onOpenLeaderboard) onOpenLeaderboard();
      },
      category: "Gamification",
    },
    {
      label: "Data Export & Audit Console",
      description: "Download CSVs and view administrative activity logs",
      icon: Download,
      action: () => {
        onClose();
        router.push("/admin/analytics");
      },
      category: "Admin",
    },
    {
      label: "Executive Overview Cockpit",
      description: "Macro KPIs, velocity area chart, and team roadblock analytics",
      icon: BarChart3,
      action: () => {
        onClose();
        router.push("/admin");
      },
      category: "Admin",
    },
    {
      label: "Volunteer Single-Page Workspace",
      description: "Today's calling queue, assigned leads, and callbacks",
      icon: Layers,
      action: () => {
        onClose();
        router.push("/workspace");
      },
      category: "Workspace",
    },
  ];

  const filteredActions = searchQuery.trim()
    ? quickActions.filter(
        (a) =>
          a.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : quickActions;

  const companies = searchResults?.companies || [];
  const contacts = searchResults?.contacts || [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-border px-4 py-3 bg-surface-subtle/30">
          <Search className="h-5 w-5 text-text-muted mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type a company, contact, or command..."
            className="h-9 w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 rounded-md text-text-muted hover:text-text-primary cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-medium text-text-muted bg-surface border border-border rounded px-1.5 py-0.5 shadow-2xs">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[420px] overflow-y-auto divide-y divide-border-subtle p-2">
          {/* Companies Section */}
          {companies.length > 0 && (
            <div className="py-2">
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center justify-between">
                <span>Matching Companies ({companies.length})</span>
                <Building2 className="h-3 w-3" />
              </div>
              <div className="space-y-1">
                {companies.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onClose();
                      if (onOpenCompanyDossier) {
                        onOpenCompanyDossier(c.id);
                      } else {
                        router.push(`/admin/leads?id=${c.id}`);
                      }
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-subtle transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          {c.industry} • {c.niche}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border bg-surface text-text-secondary">
                        {c.leadStatus}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-text-muted group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contacts Section */}
          {contacts.length > 0 && (
            <div className="py-2">
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center justify-between">
                <span>Verified Decision Makers ({contacts.length})</span>
                <User className="h-3 w-3" />
              </div>
              <div className="space-y-1">
                {contacts.map((ct) => (
                  <div
                    key={ct.id}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-subtle transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-primary">
                          {ct.name}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          {ct.designation} at <span className="font-medium text-text-secondary">{ct.companyName}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {ct.phone && (
                        <a
                          href={`tel:${ct.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors"
                        >
                          <PhoneCall className="h-3 w-3" />
                          <span>{ct.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions & Navigation */}
          {filteredActions.length > 0 && (
            <div className="py-2">
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center justify-between">
                <span>Commands & Navigation</span>
                <Sparkles className="h-3 w-3" />
              </div>
              <div className="space-y-1">
                {filteredActions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      onClick={item.action}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-subtle transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-border text-text-secondary group-hover:border-primary/40 group-hover:text-primary transition-colors">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-text-muted">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-text-muted rounded bg-surface border border-border px-1.5 py-0.5">
                        {item.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No results message */}
          {searchQuery.trim().length >= 2 &&
            companies.length === 0 &&
            contacts.length === 0 &&
            filteredActions.length === 0 && (
              <div className="py-8 text-center px-4">
                <Search className="mx-auto h-8 w-8 text-text-muted/40 mb-2" />
                <p className="text-xs font-semibold text-text-primary">
                  No records matching "{searchQuery}"
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Try searching by company name, sector, or contact designation.
                </p>
              </div>
            )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="border-t border-border px-4 py-2.5 bg-surface-subtle/50 flex items-center justify-between text-[11px] text-text-muted">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-surface border border-border px-1 rounded">esc</kbd> to close</span>
            <span><kbd className="font-mono bg-surface border border-border px-1 rounded">↵</kbd> to select</span>
          </div>
          <span className="font-medium text-primary">PRAROHA'26 Global Palette</span>
        </div>
      </div>
    </div>
  );
}
