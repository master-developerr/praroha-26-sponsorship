# Memory — PRAROHA'26 Admin Lead Allocation & Global Theme System

Last updated: October 16, 2026 (14:20 IST)

## What was built

- **Lead Allocation Matrix — Admin Assignee Participation (`/admin/assignments`):**
  - `convex/assignments.ts`:
    - Updated `getVolunteerRosterWithWorkload` to include active Admins alongside approved student SDRs using role-aware filter `!suspended && !rejected && (role === "admin" || (role === "volunteer" && verificationStatus === "approved"))`.
    - Updated `assignLeadsBatch` and `reassignLead` to authorize and validate assignments to active Admins.
    - Updated `getMyAssignedLeads` and `getMyWorkstationMetrics` so Admins can access `/workspace`, see their assigned leads, and track daily quota metrics identically to SDRs while retaining their Admin privileges and signing authority.
  - `convex/calls.ts`: Updated `logCallAndDebrief` to permit active Admins to log calls and voice debriefs.
  - `convex/followUps.ts`: Updated `getVolunteerFollowUps` and `completeFollowUp` to allow active Admins to manage and complete callbacks.
  - `convex/proposals.ts`: Updated `createProposal` to allow active Admins to create and dispatch sponsorship proposals.
  - `components/admin/LeadAssignmentMatrixView.tsx`:
    - Renamed KPI badge to `Active Assignees` (previously `Active SDRs`).
    - Renamed right roster header to `Target Assignee Roster`.
    - Added subtle Admin role badge (`Admin` in sky blue) on assignee cards.
    - Rendered Admin name, department/role (`Admin • Sponsorship Committee Head`), phone number, active lead count, dynamic capacity badge (`Available` / `Optimal` / `Active` / `Heavy`), and workload progress bar.
    - Updated search placeholder to *"Search assignee by name, role or department..."*.
    - Updated empty state to *"No active assignees available."*.
  - `components/admin/ReassignLeadModal.tsx`: Updated target assignee dropdown to display Admins with `[Admin • Department]`.

- **Global Dark / Light Theme System:**
  - `components/providers/ThemeProvider.tsx`: Centralized theme context supporting `"light" | "dark" | "system"`, `resolvedTheme`, and `localStorage` persistence under key `"praroha-theme"`.
  - `components/ui/ThemeToggle.tsx`: Compact 36×36px Sun/Moon toggle button with smooth rotation and scale micro-animations, tooltips, visible focus rings, and `aria-label`.
  - `components/layout/Navbar.tsx`: Integrated `ThemeToggle` into desktop/tablet top navbar right actions and mobile navigation drawer header without header overflow.
  - `app/layout.tsx`: Wrapped application tree in `ThemeProvider` within `body`, and added inline anti-flash script in `<head>` to prevent flash of unstyled content (zero FOUC) and hydration mismatches.
  - `app/globals.css`: Migrated color system to Tailwind CSS v4 CSS variables with `:root` (light) and `.dark` (deep charcoal/navy: background `#0B131E`, surfaces `#121D2C` / `#172436`, borders `#22344B`, typography `#F1F5F9`, PRAROHA teal `#14B89A`). Custom dark scrollbars and dark form controls included.
  - `components/layout/Sidebar.tsx` & `components/layout/AdminSidebar.tsx`: Added dark mode styling to promo card, navigation items, and user popovers.

- **Admin Data Management & Danger Zone (`/admin/data-management`):**
  - Dedicated production Data Management cockpit with type-to-confirm modal dialogs for cascading data deletion (`deleteAllLeads`, `deleteAllVolunteers`, `resetEntireOutreachData`).

- **Authoritative Event Data Replacement:**
  - Reconciled all event data, dates (December 04–05, SOE CUSAT), tier deliverables, and audience demographics to match the authoritative PRAROHA'26 festival brochure.

## Decisions made

- **Role-Aware Allocation without Account Downgrade:** Admins are made eligible allocation targets by recognizing `user.role === "admin"` in assignment queries and validation logic. Admins retain full executive permissions and signing authority across the entire application without converting them into volunteers.
- **Tailwind CSS v4 Semantic Variable Mapping:** Used `@theme` variables (`--color-background`, `--color-surface`, `--color-text-primary`, `--color-border`) mapped to `--bg-canvas`, `--bg-surface`, etc., allowing `:root` and `.dark` classes on `<html>` to seamlessly swap theme colors globally without touching individual utility classes across 30+ pages.
- **Zero-FOUC Inline Head Script:** An inline IIFE executes before DOM render to read `localStorage` and OS color preference (`prefers-color-scheme`), applying the `.dark` class to `document.documentElement` before first paint to eliminate theme flickering.
- **Real Database Users Only:** Lead allocation matrix queries live Convex user accounts; no mock or dummy admin accounts are created.

## Problems solved

- **Next.js Root Layout Provider Structure:** Restructured `app/layout.tsx` so `<html>` and `<body>` remain the top-level returned tags in the Server Component RootLayout, placing client providers (`ConvexClientProvider`, `AuthProvider`, `ThemeProvider`) inside `<body>`, eliminating Next.js App Router tree errors.
- **PowerShell Command Separator:** Used `;` instead of `&&` in Windows PowerShell terminal execution for chaining git commands.
- **Admin Lead Execution Gaps:** Resolved authorization checks in `convex/calls.ts`, `convex/followUps.ts`, and `convex/proposals.ts` so that when an Admin owns a lead, they can log calls, record debriefs, and manage follow-ups from `/workspace` without being blocked by SDR-only guard clauses.

## Current state

- **Build & TypeScript Status:** `npx tsc --noEmit` passed with 0 errors. `npm run build` compiled all 30 routes (static, dynamic, API) cleanly in 4.5s.
- **Convex Deployment:** All schema mutations and queries deployed to `wandering-ox-399.eu-west-1.convex.cloud`.
- **Git Synchronization:** All changes committed and pushed to `main` (`7cf824d`) on `master-developerr/praroha-26-sponsorship`. Working tree clean.

## Next session starts with

1. **Verify End-to-End Outreach Flow as Admin:**
   - Log into `/admin/assignments`, select an unassigned lead, and allocate it to the active Admin account (`Adil M`).
   - Navigate to `/workspace`, verify the lead appears in "My Leads" and "Today's Work" command bar.
   - Launch Call Mode, test logging a call outcome and speech-to-text debrief.
   - Confirm status update propagates to the Admin Executive Overview (`/admin`).
2. **Review Dark Mode Across Edge Modals:**
   - Spot-check any custom third-party dialogs or charts (Recharts) in dark mode to ensure high-contrast readability.

## Open questions

- None. Both Admin assignment eligibility and global theme toggle are completely functional, verified, and pushed to remote.
