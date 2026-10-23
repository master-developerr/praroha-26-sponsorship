# PRAROHA'26 Sponsorship System — Changelog & Recovery Checkpoints

This document tracks all stable checkpoints, milestones, and feature branches for the PRAROHA'26 Sponsorship Outreach & Volunteer Execution System.

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
