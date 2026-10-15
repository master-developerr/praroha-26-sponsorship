"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const FALLBACK_CONVEX_URL = "https://wandering-ox-399.eu-west-1.convex.cloud";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || FALLBACK_CONVEX_URL;

if (process.env.NODE_ENV !== "production" && !process.env.NEXT_PUBLIC_CONVEX_URL) {
  console.warn(
    "[CONVEX] NEXT_PUBLIC_CONVEX_URL was not set in environment. Falling back to default cloud deployment:",
    FALLBACK_CONVEX_URL
  );
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
