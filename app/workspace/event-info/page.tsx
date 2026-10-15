"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Users,
  Target,
  Trophy,
  Gift,
  Download,
  Copy,
  Check,
  Building2,
  ExternalLink,
  Megaphone,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventInfoPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "tiers" | "competitions" | "inkind" | "contacts">(
    "overview"
  );
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyPitchLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText("https://praroha26.cusat.ac.in/sponsorship-brochure.pdf");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const tiers = [
    {
      name: "Title Sponsor",
      ask: "₹5,00,000",
      tag: "1 Available (Exclusive)",
      color: "border-emerald-300 bg-emerald-50/60 text-emerald-950",
      badgeColor: "bg-emerald-600 text-white",
      deliverables: [
        "Naming rights: 'PRAROHA'26 presented by [Brand]'",
        "Prime 20x20 ft central exhibition stall in Main SOE Atrium",
        "15-minute inaugural keynote address to 3,000+ student delegates",
        "Prominent logo on main stage backdrop & 3,500+ festival delegate badges",
        "Exclusive social media spotlight series (100K+ reach across Kerala & South India)",
        "VIP banquet passes and student SDR recruitment desk clearance",
      ],
    },
    {
      name: "Powered By Sponsor",
      ask: "₹3,00,000",
      tag: "2 Available",
      color: "border-sky-300 bg-sky-50/60 text-sky-950",
      badgeColor: "bg-sky-600 text-white",
      deliverables: [
        "Co-branding: 'PRAROHA'26 Powered by [Brand]'",
        "15x15 ft outdoor display pavilion on campus promenade",
        "Technical masterclass / workshop slot for engineering students",
        "Prominent logo on official delegate kits & festival web portal",
        "Promotional flyer insertion in 2,500+ welcome kits",
      ],
    },
    {
      name: "Associate / Category Partner",
      ask: "₹1,50,000",
      tag: "4 Available",
      color: "border-indigo-300 bg-indigo-50/60 text-indigo-950",
      badgeColor: "bg-indigo-600 text-white",
      deliverables: [
        "Exclusive category title (e.g., 'Official Infrastructure Partner' or 'Official Cloud Partner')",
        "10x10 ft exhibition stall during all 3 days",
        "Logo on banner stands across technical event tracks",
        "Company promotional video played between auditorium sessions",
      ],
    },
    {
      name: "Event / Competition Partner",
      ask: "₹50,000 – ₹75,000",
      tag: "Multiple Tracks",
      color: "border-amber-300 bg-amber-50/60 text-amber-950",
      badgeColor: "bg-amber-600 text-white",
      deliverables: [
        "Naming rights to flagship competition (Hackathon, Bridge Design, CAD Modeling)",
        "Representative on the competition judge panel",
        "Trophy branding & prize distribution stage presentation",
      ],
    },
  ];

  const inKindWishlist = [
    { category: "Beverage Partner", requirement: "3,000 bottles energy drinks / packaged water", value: "₹60,000" },
    { category: "Snack & Food Partner", requirement: "Meal boxes / snack hampers for 120 volunteers & judges", value: "₹45,000" },
    { category: "Cloud & Dev Credits", requirement: "Free API keys, hosting credits for 24-hr Hackathon", value: "₹1,50,000" },
    { category: "Print & Merch Partner", requirement: "500 participant t-shirts + lanyard printing", value: "₹85,000" },
    { category: "Equipment / Tech Gear", requirement: "Surveying equipment, VR headsets for expo demo", value: "₹75,000" },
    { category: "Travel / Hospitality", requirement: "Cab vouchers / hotel stays for outstation keynote speakers", value: "₹50,000" },
  ];

  const competitions = [
    { title: "CivicHack'26", description: "24-hour national sustainable smart cities hackathon", prize: "₹50,000 Cash Pool" },
    { title: "BIM & Structural CAD Sprint", description: "Multi-storey seismic structural design & 3D BIM modeling", prize: "₹30,000 Cash Pool" },
    { title: "Truss Bridge Dynamics", description: "High-stress load testing of lightweight model bridge trusses", prize: "₹25,000 Cash Pool" },
    { title: "Concrete Tech Challenge", description: "Eco-friendly self-compacting geopolymer mix design showcase", prize: "₹20,000 Cash Pool" },
    { title: "Surveying Mastermind", description: "Total Station & GIS mapping accuracy race across campus", prize: "₹15,000 Cash Pool" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-mint px-3 py-1 text-xs font-semibold text-accent-mint-text">
              <Sparkles className="h-3.5 w-3.5" />
              Flagship Techno-Managerial Festival • SOE CUSAT
            </div>
            <h1 className="text-3xl font-black tracking-tight text-text-primary">
              PRAROHA'26 Event Intelligence
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Organized by the Department of Civil Engineering, School of Engineering, Cochin University of Science and Technology.
              Use this internal knowledge dossier to pitch verified deliverables to corporate sponsors.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-text-muted">
              <span className="flex items-center gap-1.5 font-medium text-text-primary">
                <Calendar className="h-4 w-4 text-primary" /> Feb 12 – 15, 2026
              </span>
              <span className="flex items-center gap-1.5 font-medium text-text-primary">
                <MapPin className="h-4 w-4 text-primary" /> SOE Campus, CUSAT, Kochi, Kerala
              </span>
              <span className="flex items-center gap-1.5 font-medium text-text-primary">
                <Users className="h-4 w-4 text-primary" /> 3,000+ Delegates • 45+ Colleges
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={handleCopyPitchLink}
              className="gap-2 shadow-xs"
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {isCopied ? "Brochure Link Copied!" : "Copy Pitch Link"}
            </Button>
            <a
              href="https://praroha26.cusat.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-xs font-medium text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Visit Festival Portal
            </a>
          </div>
        </div>

        {/* Decorative Backdrop Illustration Banner */}
        <div className="mt-6 rounded-xl overflow-hidden border border-border-subtle relative h-48 md:h-56 w-full">
          <Image
            src="/images/praroha-outreach-banner.png"
            alt="PRAROHA'26 Banner"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-2 overflow-x-auto text-xs">
        {[
          { key: "overview", label: "Event Overview", icon: Compass },
          { key: "tiers", label: "Sponsorship Packages", icon: Briefcase },
          { key: "competitions", label: "Competitions & Workshops", icon: Trophy },
          { key: "inkind", label: "In-Kind / Non-Cash Needs", icon: Gift },
          { key: "contacts", label: "Committee Directory", icon: Phone },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 font-semibold transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-surface p-5 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Festival Mission & Objectives
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                PRAROHA'26 is the annual national festival celebrating engineering excellence, urban innovation, sustainable materials, and managerial acumen. Hosted in Kochi — Kerala's primary commercial hub — the event brings together the brightest undergraduate, postgraduate, and doctoral students from premier technical institutions across India (IITs, NITs, and top engineering colleges).
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-surface-subtle border border-border-subtle rounded-xl">
                  <p className="text-xs font-bold text-text-primary">3,000+ Footfall</p>
                  <p className="text-[11px] text-text-muted mt-0.5">High-intent student engineers, architects, developers, and future founders.</p>
                </div>
                <div className="p-3 bg-surface-subtle border border-border-subtle rounded-xl">
                  <p className="text-xs font-bold text-text-primary">100,000+ Digital Reach</p>
                  <p className="text-[11px] text-text-muted mt-0.5">Campus ambassadors, LinkedIn spotlights, YouTube livestreams, and regional press.</p>
                </div>
                <div className="p-3 bg-surface-subtle border border-border-subtle rounded-xl">
                  <p className="text-xs font-bold text-text-primary">₹3,50,000+ Prize Pool</p>
                  <p className="text-[11px] text-text-muted mt-0.5">Prestigious national competitions drawing top talent and pan-India press coverage.</p>
                </div>
                <div className="p-3 bg-surface-subtle border border-border-subtle rounded-xl">
                  <p className="text-xs font-bold text-text-primary">Recruitment Pipeline</p>
                  <p className="text-[11px] text-text-muted mt-0.5">Direct hiring access for civil, software, robotics, and managerial roles.</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Key Demographics & Audience Breakdown
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle">
                  <span className="font-medium text-text-primary">Engineering & Architecture Students</span>
                  <span className="font-bold text-primary">68%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle">
                  <span className="font-medium text-text-primary">Computer Science & AI Hackers</span>
                  <span className="font-bold text-primary">18%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle">
                  <span className="font-medium text-text-primary">Management & MBA Delegates</span>
                  <span className="font-bold text-primary">14%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-surface p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-primary" /> Volunteer Pitch Elevator
              </h3>
              <div className="rounded-lg bg-accent-mint/40 border border-emerald-200 p-3 text-xs text-text-primary space-y-2">
                <p className="font-semibold text-emerald-950">
                  "Why should your brand partner with PRAROHA'26?"
                </p>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  "PRAROHA'26 puts your product directly in the hands of 3,000+ future engineers and corporate leaders. Whether you're hiring top tech talent, launching in the Kerala market, or reinforcing industry leadership, our physical exhibition stalls, inaugural keynote, and co-branded competitions provide measurable ROI far superior to generic online banners."
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-text-primary">Important Dates</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-border-subtle pb-1.5">
                  <span className="text-text-secondary">Sponsorship Deadline:</span>
                  <span className="font-bold text-text-primary">Jan 25, 2026</span>
                </div>
                <div className="flex justify-between border-b border-border-subtle pb-1.5">
                  <span className="text-text-secondary">Print Collateral Freeze:</span>
                  <span className="font-bold text-text-primary">Feb 01, 2026</span>
                </div>
                <div className="flex justify-between border-b border-border-subtle pb-1.5">
                  <span className="text-text-secondary">Stall Setup Date:</span>
                  <span className="font-bold text-text-primary">Feb 11, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Festival Dates:</span>
                  <span className="font-bold text-primary">Feb 12 – 15, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sponsorship Tiers */}
      {activeTab === "tiers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-5 shadow-xs flex flex-col justify-between ${tier.color}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5 ${tier.badgeColor}`}>
                    {tier.tag}
                  </span>
                  <span className="text-xl font-black">{tier.ask}</span>
                </div>
                <h3 className="text-lg font-bold mt-2">{tier.name}</h3>
                <ul className="mt-4 space-y-2 text-xs">
                  {tier.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between text-xs">
                <span className="font-medium text-text-secondary">Tax Deductible Receipt Available</span>
                <span className="font-bold">Formal MoU Required</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Competitions */}
      {activeTab === "competitions" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competitions.map((comp) => (
            <div key={comp.title} className="rounded-xl border border-border bg-surface p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary">{comp.title}</h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {comp.prize}
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{comp.description}</p>
              <div className="pt-2 text-[11px] text-text-muted flex items-center justify-between border-t border-border-subtle">
                <span>Category: Technical Competition</span>
                <span className="text-primary font-medium">Sponsorship Ask: ₹50,000</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: In-Kind */}
      {activeTab === "inkind" && (
        <div className="rounded-xl border border-border bg-surface p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-text-primary">Non-Cash / In-Kind Partnerships</h2>
            <p className="text-xs text-text-secondary mt-1">
              If a sponsor cannot commit monetary budget, pitch these essential logistics, beverage, or developer credit partnerships.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-secondary">
              <thead className="border-b border-border-subtle bg-surface-subtle/50 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="px-4 py-3">In-Kind Category</th>
                  <th className="px-4 py-3">Requirement Deliverable</th>
                  <th className="px-4 py-3">Estimated Value (INR)</th>
                  <th className="px-4 py-3 text-right">Offer Reciprocal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {inKindWishlist.map((item, i) => (
                  <tr key={i} className="hover:bg-surface-subtle/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-text-primary">{item.category}</td>
                    <td className="px-4 py-3">{item.requirement}</td>
                    <td className="px-4 py-3 font-mono font-bold text-text-primary">{item.value}</td>
                    <td className="px-4 py-3 text-right text-text-muted">Co-branding & Stall placement</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Contacts */}
      {activeTab === "contacts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" /> Faculty & Institutional Governance
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-surface-subtle rounded-lg">
                <p className="font-bold text-text-primary">Dr. Deepa G. Nair</p>
                <p className="text-text-muted">Head of Department, Civil Engineering</p>
                <p className="text-[11px] text-text-secondary mt-1">School of Engineering, CUSAT</p>
              </div>
              <div className="p-3 bg-surface-subtle rounded-lg">
                <p className="font-bold text-text-primary">Prof. K. S. Beena</p>
                <p className="text-text-muted">Staff Coordinator, PRAROHA'26</p>
                <p className="text-[11px] text-text-secondary mt-1">School of Engineering, CUSAT</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Student Sponsorship Convenors
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-surface-subtle rounded-lg space-y-1">
                <p className="font-bold text-text-primary">Adil M</p>
                <p className="text-text-muted">Convenor, Corporate Outreach & Sponsorships</p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-text-secondary font-mono">
                  <span>+91 94951 23456</span>
                  <span>•</span>
                  <span>sponsorship@praroha.cusat.ac.in</span>
                </div>
              </div>
              <div className="p-3 bg-surface-subtle rounded-lg space-y-1">
                <p className="font-bold text-text-primary">Arjun Nair</p>
                <p className="text-text-muted">Joint Convenor, Industry Relations</p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-text-secondary font-mono">
                  <span>+91 98470 65432</span>
                  <span>•</span>
                  <span>outreach@praroha.cusat.ac.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
