# PRAROHA'26 Sponsorship System — Changelog & Recovery Checkpoints

This document tracks all stable checkpoints, milestones, and feature branches for the PRAROHA'26 Sponsorship Outreach & Volunteer Execution System.

---

## Feature / Fix: Lead Dossier Redesign & Call Assignment Safety Engine

- **Date:** 2026-10-23
- **Branch:** `feature/lead-dossier-and-call-safety`
- **Feature:** Enterprise B2B CRM record view redesign for `CompanyDossierDrawer` and complete resolution of random phone dialing and call assignment safety across the volunteer workspace.

### Changes:
- **Lead Dossier Modal Redesign (`components/admin/CompanyDossierDrawer.tsx`):**
  - Restructured as a premium B2B CRM record view (Attio/Linear/Salesforce standards, editorial layout, clean typography, zero AI-slop gradients).
  - Sticky header with dominant company name, sector/category subtitle, status badges row (`Assigned to You` / `Assigned: {name}` / `Unassigned`, stage, priority, score gauge, and INR target ask pill).
  - Section 01 (Company Snapshot): Location, industry, size, annual revenue, website link, Kerala footprint, and lead source in a high-density key-value grid.
  - Section 02 (Sponsorship Fit): Target ask range, visual fit score meter (0-100), alternative support, why this lead matters (green subtle accent), and potential sponsor ROI (blue subtle accent).
  - Section 03 (AI Sponsorship Intelligence): Integrated intelligence card with synthesized reasoning and "View AI Dossier" action.
  - Section 04 (Corporate Contacts): Actionable contact cards with designation, phone, phone type badge, verification badge, unverified warning banner, email, LinkedIn, and per-contact call trigger.
  - Section 05 (Internal Outreach Notes): Confidential outreach notes clearly separated from external corporate information.
  - Sticky footer with contextual "Start Call" (disabled if unassigned or missing phone), "Draft Proposal", and "Close Dossier".
- **Call Safety & Confirmation Gate:**
  - Created `components/volunteer/CallConfirmationDialog.tsx`: Lightweight pre-call confirmation dialog displaying exact company name, contact name, designation, phone in large monospace, phone type, verification level, and amber warning if unverified.
  - Created `components/volunteer/SelectLeadToCallModal.tsx`: Controlled search-and-filter dialog listing assigned leads for top-navbar call triggers when no lead is currently selected.
  - Updated `components/volunteer/WorkspaceContext.tsx`: `startCallMode` validates lead ownership and non-empty phone, strictly opening `CallConfirmationDialog` rather than dialing blindly. `openGlobalLogCall` launches `SelectLeadToCallModal`.
  - Updated `app/workspace/layout.tsx`: Replaced blind `assignedLeads.find(...)` with `openGlobalLogCall`.
  - Updated `app/workspace/page.tsx`: Fixed `handleStartNextCall` to validate phone presence and route through confirmation gate.
  - Updated `components/volunteer/LeadsTable.tsx`: Disabled "Call" action if contact phone is missing.
  - Updated `convex/companies.ts`: `getCompanyDetails` queries `leadAssignments` to return `activeAssignment` with volunteer details.
  - Updated `components/ui/dialog.tsx`: Added support for bespoke modal layouts (`hideHeader`, `className`, `contentClassName`, `"4xl"`, `"5xl"`).

### Verified:
- `npx tsc --noEmit` — 0 errors (Strict TypeScript passed).
- `npm run build` — All 30 routes built cleanly in production mode.
- Zero random calls: dial actions are strictly bound to explicit leads and contacts with pre-call verification.

---

## Feature / Fix: Clerk Handshake Resilience & Proxy Guard

- **Date:** 2026-10-23
- **Branch:** `feature/fix-clerk-handshake-resilience`
- **Commit:** `6e2e495`
- **Feature:** Proxy error resilience against missing secret keys and unhandled Clerk handshake crashes.

### Changes:
- `proxy.ts`:
  - Added `hasValidClerkSecret` conditional gate preventing `clerkMiddleware()` initialization if `CLERK_SECRET_KEY` is not populated.
  - Wrapped request handling in `try...catch` so runtime handshake/decryption exceptions gracefully pass through to `NextResponse.next()` rather than throwing HTTP 500 `Internal Server Error`.
  - Guaranteed client-side auth guards continue to protect sensitive routes without breaking public or callback paths.

### Verified:
- `npx tsc --noEmit` — 0 errors.
- `npm run build` — 30/30 routes compiled cleanly in 2.1s.

---

## Baseline Checkpoint: Enterprise Admin Redesign & Public Landing Suite

- **Date:** 2026-10-23
- **Branch:** `main`
- **Commit:** `29934f6`
- **Remote Status:** Synced with `origin/main`

### Changes:
- **Admin Control Room Redesign:**
  - Standardized enterprise headers (`components/admin/AdminPageHeader.tsx`) and indicator KPI strips (`components/admin/AdminKpiStrip.tsx`).
  - Implemented dual-panel assignment matrix with both SDRs and Admins selectable as targets (`components/admin/LeadAssignmentMatrixView.tsx`).
  - Added certified RFC-4180 CSV export hub and audit diff console (`components/admin/DataExportHub.tsx`, `components/admin/AuditLogConsole.tsx`).
  - Implemented Data Management center with strict phrase-confirmation resets (`components/admin/DataManagementView.tsx`).
- **Public Landing & Authentication Suite:**
  - Product-first hero with lead terminal simulator (`components/landing/HeroSection.tsx`).
  - 5-stage interactive outreach relay simulator (`components/landing/InteractiveRelaySimulator.tsx`).
  - Dual workspace comparison showcase (`components/landing/DualWorkspaceShowcase.tsx`).
  - 3-step student SDR profile clearance form (`app/register/profile/page.tsx`).
  - Live-listening verification holding lounge (`app/pending/page.tsx`).
- **Core Architecture & Types:**
  - Next.js 16 Proxy migration (`proxy.ts`), safe auth redirect sanitization (`lib/authRedirect.ts`).
  - Full dual-theme WCAG AA semantic tokens across all routes.

### Verified:
- `npx tsc --noEmit` — 0 errors (Strict TypeScript passed).
- `npm run build` — All 30 routes built cleanly (turbopack optimized).
- Visual verification across light and dark themes.

### Recovery Notes:
- Last known good state before this baseline: `269fbdc`
- Current baseline checkpoint: `29934f6`
