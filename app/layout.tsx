import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PRAROHA'26 — Sponsorship Outreach & Volunteer Execution System",
  description:
    "Internal sponsorship operational cockpit for PRAROHA'26, Division of Civil Engineering, SOE CUSAT.",
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
      <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function() {
                try {
                  var stored = localStorage.getItem('praroha-theme');
                  var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();`,
            }}
          />
        </head>
        <body className="min-h-full flex flex-col bg-background text-text-primary" suppressHydrationWarning>
          <ConvexClientProvider>
            <AuthProvider>
              <ThemeProvider>
                {children}
              </ThemeProvider>
            </AuthProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
