"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface PrarohaHeroVisualProps {
  variant?: "auth-split" | "auth-mobile" | "dashboard-hero" | "custom";
  className?: string;
  imageClassName?: string;
  fadeDirection?: "left" | "bottom" | "both" | "none";
  overlay?: boolean | "subtle-teal" | "subtle-dark";
  objectPosition?: string;
  priority?: boolean;
  alt?: string;
}

export function PrarohaHeroVisual({
  variant = "custom",
  className,
  imageClassName,
  fadeDirection = "none",
  overlay = false,
  objectPosition = "center",
  priority = true,
  alt = "PRAROHA'26 Sponsorship Outreach & Volunteer Execution System",
}: PrarohaHeroVisualProps) {
  // Variant defaults
  if (variant === "auth-split") {
    return (
      <div
        className={cn(
          "relative h-full w-full min-h-screen overflow-hidden bg-slate-900 select-none",
          className
        )}
      >
        <Image
          src="/images/praroha26-sponsorship-hero.png"
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 60vw"
          className={cn(
            "object-cover transition-opacity duration-300",
            imageClassName
          )}
          style={{ objectPosition }}
        />

        {/* Subtle atmospheric vignette / depth gradient that highlights the central artwork */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/15 pointer-events-none" />
        <div className="absolute inset-0 bg-teal-950/10 mix-blend-multiply pointer-events-none" />

        {/* Subtle Institutional Brand Caption at bottom */}
        <div className="absolute bottom-6 left-6 right-6 z-10 hidden sm:flex items-center justify-between text-white/90 drop-shadow-md">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
            <span>School of Engineering, CUSAT</span>
            <span className="text-white/40">•</span>
            <span className="text-teal-200">Department of Civil Engineering</span>
          </div>
          <span className="text-[11px] font-mono text-white/70">PRAROHA'26</span>
        </div>
      </div>
    );
  }

  if (variant === "auth-mobile") {
    return (
      <div
        className={cn(
          "relative w-full h-48 sm:h-56 overflow-hidden bg-surface-subtle select-none border-b border-border-subtle",
          className
        )}
      >
        <Image
          src="/images/praroha26-sponsorship-hero.png"
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className={cn(
            "object-cover",
            imageClassName
          )}
          style={{ objectPosition: objectPosition || "center" }}
        />
        {/* Soft bottom fade into page background */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none" />
      </div>
    );
  }

  if (variant === "dashboard-hero") {
    return (
      <div
        className={cn(
          "pointer-events-none absolute right-0 top-0 bottom-0 select-none overflow-hidden",
          className
        )}
      >
        <div className="relative h-full w-full">
          <Image
            src="/images/praroha26-sponsorship-hero.png"
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 0vw, (max-width: 1200px) 40vw, 45vw"
            className={cn(
              "object-cover transition-opacity duration-300",
              imageClassName
            )}
            style={{ objectPosition }}
          />

          {/* Natural multi-directional gradient blends so artwork dissolves smoothly into hero */}
          {(fadeDirection === "left" || fadeDirection === "both") && (
            <div className="absolute inset-y-0 left-0 w-2/5 sm:w-1/2 bg-gradient-to-r from-surface via-surface/60 to-transparent pointer-events-none" />
          )}
          {(fadeDirection === "bottom" || fadeDirection === "both") && (
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface via-surface/40 to-transparent pointer-events-none" />
          )}
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-surface/50 to-transparent pointer-events-none" />
        </div>
      </div>
    );
  }

  // Custom standalone rendering
  return (
    <div className={cn("relative overflow-hidden select-none", className)}>
      <Image
        src="/images/praroha26-sponsorship-hero.png"
        alt={alt}
        fill
        priority={priority}
        className={cn("object-cover", imageClassName)}
        style={{ objectPosition }}
      />
      {overlay === "subtle-teal" && (
        <div className="absolute inset-0 bg-teal-950/20 mix-blend-multiply pointer-events-none" />
      )}
      {overlay === "subtle-dark" && (
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      )}
      {(fadeDirection === "left" || fadeDirection === "both") && (
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-surface to-transparent pointer-events-none" />
      )}
      {(fadeDirection === "bottom" || fadeDirection === "both") && (
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
      )}
    </div>
  );
}
