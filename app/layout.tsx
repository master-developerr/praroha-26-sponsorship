import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { DevPersonaSwitcher } from "@/components/layout/DevPersonaSwitcher";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PRAROHA'26 — Sponsorship Outreach & Volunteer Execution System",
  description:
    "Internal sponsorship operational cockpit for PRAROHA'26, School of Engineering, CUSAT.",
};

const clerkPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_bGl2ZS1naXJhZmZlLTIxOTAuY2xlcmsuYWNjb3VudHMuZGV2JA";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ConvexClientProvider>
        <AuthProvider>
          <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
            <body className="min-h-full flex flex-col bg-background text-text-primary" suppressHydrationWarning>
              {children}
              {process.env.NEXT_PUBLIC_ENABLE_DEV_SWITCHER === "true" && <DevPersonaSwitcher />}
            </body>
          </html>
        </AuthProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
