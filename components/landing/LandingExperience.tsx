"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { InteractiveRelaySimulator } from "@/components/landing/InteractiveRelaySimulator";
import { DualWorkspaceShowcase } from "@/components/landing/DualWorkspaceShowcase";
import { LifecycleWorkflowGrid } from "@/components/landing/LifecycleWorkflowGrid";
import { EventIdentitySection } from "@/components/landing/EventIdentitySection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export function LandingExperience() {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-primary/20 selection:text-primary">
      {/* 1. Global Navigation */}
      <LandingNavbar />

      {/* 2. Product-First Hero Section with Live Terminal Preview */}
      <HeroSection />

      {/* 3. Interactive Lead Relay Simulator */}
      <InteractiveRelaySimulator />

      {/* 4. Dual Workspace Showcase (Volunteer Cockpit vs Admin Control) */}
      <DualWorkspaceShowcase />

      {/* 5. 6 Operational Pillars / Architecture Grid */}
      <LifecycleWorkflowGrid />

      {/* 6. PRAROHA'26 Event & Civil Engineering Identity */}
      <EventIdentitySection />

      {/* 7. Institutional Footer */}
      <LandingFooter />
    </div>
  );
}
