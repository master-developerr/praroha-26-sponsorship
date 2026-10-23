"use client";

import React, { Suspense } from "react";
import { RouteGuard } from "@/components/providers/RouteGuard";
import { WorkspaceProvider, useWorkspace } from "@/components/volunteer/WorkspaceContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function WorkspaceShellInner({ children }: { children: React.ReactNode }) {
  const { openEventInfo, openLeaderboard, openGlobalLogCall } = useWorkspace();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Full-Height Desktop Navigation Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Workspace Column */}
      <div className="flex flex-1 flex-col overflow-y-auto min-w-0">
        <Navbar
          onLogCallClick={openGlobalLogCall}
          onOpenEventInfo={openEventInfo}
          onOpenLeaderboard={openLeaderboard}
        />
        <main className="flex-1 p-3.5 sm:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <RouteGuard>
        <WorkspaceProvider>
          <WorkspaceShellInner>{children}</WorkspaceShellInner>
        </WorkspaceProvider>
      </RouteGuard>
    </Suspense>
  );
}
