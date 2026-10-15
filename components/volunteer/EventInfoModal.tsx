"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Building2,
  Users,
  Trophy,
  Gift,
  FileText,
  Download,
  Copy,
  Check,
  Calendar,
  MapPin,
  ExternalLink,
  Target,
  Megaphone,
  Briefcase,
} from "lucide-react";

interface EventInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EventInfoModal({ isOpen, onClose }: EventInfoModalProps) {
  const [activeTab, setActiveTab] = useState<"tiers" | "demographics" | "inkind" | "brochure">(
    "tiers"
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
      color: "border-emerald-300 bg-emerald-50/50 text-emerald-950",
      badgeColor: "bg-emerald-600 text-white",
      highlights: [
        "Naming rights: 'PRAROHA'26 presented by [Brand]'",
        "Prime 20x20 ft central exhibition stall in Main Atrium",
        "15-minute inaugural keynote address to 3,000+ delegates",
        "Prominent logo on main stage backdrop & festival badges",
        "Exclusive social media spotlight series (100K+ reach)",
        "VIP banquet passes and student SDR recruitment desk",
      ],
    },
    {
      name: "Powered By Sponsor",
      ask: "₹3,00,000",
      tag: "2 Available",
      color: "border-sky-300 bg-sky-50/50 text-sky-950",
      badgeColor: "bg-sky-600 text-white",
      highlights: [
        "Co-branding: 'PRAROHA'26 Powered by [Brand]'",
        "15x15 ft outdoor display stall on campus promenade",
        "Technical masterclass / workshop slot for engineers",
        "Logo on official delegate kits & festival website",
        "Promotional flyer insertion in 2,500+ welcome kits",
      ],
    },
    {
      name: "Associate / Category Partner",
      ask: "₹1,50,000",
      tag: "4 Available",
      color: "border-indigo-300 bg-indigo-50/50 text-indigo-950",
      badgeColor: "bg-indigo-600 text-white",
      highlights: [
        "Exclusive category title (e.g., 'Official Concrete Partner' or 'Official Cloud Partner')",
        "10x10 ft exhibition stall during all 3 days",
        "Logo on banner stands across technical event tracks",
        "Company promotional video played between sessions",
      ],
    },
    {
      name: "Event / Competition Partner",
      ask: "₹50,000 – ₹75,000",
      tag: "Multiple",
      color: "border-amber-300 bg-amber-50/50 text-amber-950",
      badgeColor: "bg-amber-600 text-white",
      highlights: [
        "Naming rights to flagship competition (Hackathon, Bridge Design, CAD)",
        "Representative on the competition judge panel",
        "Trophy branding & prize presentation opportunity",
      ],
    },
  ];

  const inKindWishlist = [
    {
      category: "PRODUCT / BEVERAGES",
      examples: "Bottled water (5000 units), juices, energy drinks, snacks for volunteers and delegates.",
      estValuation: "₹50,000 – ₹1,50,000",
      deliverable: "Prominent sampling counter and logo on refreshment coupon.",
    },
    {
      category: "TECHNICAL / HARDWARE",
      examples: "LED stage walls (20x10 ft), line array sound system, stage trussing, streaming equipment.",
      estValuation: "₹1,00,000 – ₹2,50,000",
      deliverable: "Co-branding on cultural pro-show backdrop and livestream watermark.",
    },
    {
      category: "PRINTING & SIGNAGE",
      examples: "250+ outdoor flex banners, stage backdrop, 3,000 certificate printouts, 2,000 lanyards.",
      estValuation: "₹80,000 – ₹1,50,000",
      deliverable: "Backside logo on all badges and certificates.",
    },
    {
      category: "MERCHANDISE & T-SHIRTS",
      examples: "300 volunteer polo shirts, 2,000 participant tote bags, caps, keychains.",
      estValuation: "₹1,00,000 – ₹2,00,000",
      deliverable: "Sleeve or chest logo placement on all volunteer attire.",
    },
    {
      category: "SOFTWARE & CLOUD",
      examples: "Cloud compute credits (AWS, Azure, GCP), developer licenses, AI platform trial tokens.",
      estValuation: "₹1,50,000 – ₹3,00,000",
      deliverable: "Official Tech Infrastructure Partner title and workshop slot.",
    },
    {
      category: "TRANSPORTATION / TRAVEL",
      examples: "Shuttle bus charters between Ernakulam Junction/Airport and CUSAT campus for delegates.",
      estValuation: "₹60,000 – ₹1,20,000",
      deliverable: "Bus banner wrapping and travel partner announcements.",
    },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title="PRAROHA'26 — Event Deck, Tiers & In-Kind Guide"
      description="Internal volunteer outreach cheat sheet for School of Engineering, CUSAT flagship festival"
    >
      <div className="space-y-4 pt-2 max-h-[75vh] overflow-y-auto pr-1">
        {/* Navigation Tabs */}
        <div className="flex border-b border-border text-xs font-medium">
          <button
            onClick={() => setActiveTab("tiers")}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === "tiers"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Trophy className="h-4 w-4" />
            Sponsorship Tiers & Pricing
          </button>
          <button
            onClick={() => setActiveTab("inkind")}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === "inkind"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Gift className="h-4 w-4" />
            13 In-Kind Wishlist & Valuation
          </button>
          <button
            onClick={() => setActiveTab("demographics")}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === "demographics"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Users className="h-4 w-4" />
            Audience & Demographics
          </button>
          <button
            onClick={() => setActiveTab("brochure")}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === "brochure"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <FileText className="h-4 w-4" />
            Brochure & Pitch Links
          </button>
        </div>

        {/* Tab 1: Sponsorship Tiers */}
        {activeTab === "tiers" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-accent-mint/30 border border-primary/20 p-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-text-primary block">
                  Target Festival Sponsorship Budget: ₹25,00,000
                </span>
                <span className="text-text-secondary text-[11px]">
                  All sponsorship packages include GST exemption under educational institution status.
                </span>
              </div>
              <span className="rounded-full bg-primary text-white text-[10px] font-bold px-2.5 py-1">
                PRAROHA'26 OFFICIAL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-xl border p-4 flex flex-col justify-between ${tier.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tier.badgeColor}`}>
                        {tier.tag}
                      </span>
                      <span className="text-base font-extrabold text-text-primary tracking-tight">
                        {tier.ask}
                      </span>
                    </div>
                    <h4 className="mt-2 text-sm font-bold text-text-primary">
                      {tier.name}
                    </h4>

                    <ul className="mt-3 space-y-1.5 text-xs text-text-secondary">
                      {tier.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: In-Kind Wishlist */}
        {activeTab === "inkind" && (
          <div className="space-y-3">
            <div className="rounded-xl bg-amber-50/60 border border-amber-200 p-3 text-xs text-amber-900">
              <span className="font-semibold block mb-0.5">
                Valuation Rule for Non-Cash Partnerships:
              </span>
              Always capture both the physical deliverable item description and its fair-market INR valuation. In-kind deals count directly towards SDR points and festival operational savings.
            </div>

            <div className="space-y-2.5">
              {inKindWishlist.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-surface p-3 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary flex items-center gap-1.5">
                      <Gift className="h-3.5 w-3.5 text-primary" />
                      {item.category}
                    </span>
                    <span className="font-semibold text-primary">
                      Est. Value: {item.estValuation}
                    </span>
                  </div>
                  <p className="text-text-secondary">{item.examples}</p>
                  <div className="text-[11px] text-text-muted bg-surface-subtle px-2.5 py-1 rounded-md">
                    <strong className="text-text-secondary">Festival Deliverable:</strong> {item.deliverable}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Demographics */}
        {activeTab === "demographics" && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-surface-subtle p-3 text-center">
                <span className="text-lg font-bold text-primary block">5,000+</span>
                <span className="text-[11px] text-text-secondary">Expected Footfall</span>
              </div>
              <div className="rounded-xl border border-border bg-surface-subtle p-3 text-center">
                <span className="text-lg font-bold text-primary block">45+</span>
                <span className="text-[11px] text-text-secondary">Engineering Colleges</span>
              </div>
              <div className="rounded-xl border border-border bg-surface-subtle p-3 text-center">
                <span className="text-lg font-bold text-primary block">3 Days</span>
                <span className="text-[11px] text-text-secondary">Flagship Event</span>
              </div>
              <div className="rounded-xl border border-border bg-surface-subtle p-3 text-center">
                <span className="text-lg font-bold text-primary block">₹3,00,000+</span>
                <span className="text-[11px] text-text-secondary">Cash Prize Pool</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                Venue & Audience Profile
              </h4>
              <p className="text-text-secondary leading-relaxed">
                School of Engineering (SOE), Cochin University of Science and Technology (CUSAT), South Kalamassery, Kochi. One of South India's premier public technological institutions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span><strong>Demographics:</strong> 18–24 undergraduate & postgraduate engineers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span><strong>Geographic Reach:</strong> Kerala, Tamil Nadu, Karnataka, Andhra</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span><strong>Flagship Streams:</strong> Civil, Tech, Auto, Management, Robotics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span><strong>Digital Impressions:</strong> 250,000+ across Instagram, LinkedIn</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Brochure & Pitch Links */}
        {activeTab === "brochure" && (
          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-text-primary text-sm">
                    PRAROHA'26 Official Sponsorship Brochure (PDF)
                  </h4>
                  <p className="text-text-secondary text-[11px] mt-0.5">
                    12-page high-resolution festival prospectus with deliverables, past sponsors, and organizing committee credentials.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyPitchLink}
                  className="text-xs border-border"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      Copied Link
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href="/brochure/praroha-2026-sponsorship-brochure.pdf"
                  target="_blank"
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition-colors shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Pitch Deck (PDF)
                </a>
                <span className="text-[11px] text-text-muted">
                  Size: 4.2 MB • Updated October 2026
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-subtle p-3.5 space-y-1.5">
              <span className="font-semibold text-text-primary text-xs flex items-center gap-1.5">
                <Megaphone className="h-3.5 w-3.5 text-primary" />
                Quick 20-Second Phone Pitch for SDRs:
              </span>
              <p className="text-text-secondary leading-relaxed italic bg-surface p-2.5 rounded-lg border border-border text-[11px]">
                "PRAROHA'26 is CUSAT's flagship annual national techno-managerial festival uniting over 5,000 engineering students across South India. We're connecting industry leaders directly with next-generation engineers through on-campus experiential stalls, branded hackathons, and direct talent recruitment."
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-border-subtle">
          <Button variant="outline" onClick={onClose} size="sm">
            Close Panel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
