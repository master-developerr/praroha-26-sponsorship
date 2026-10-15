# Feature 01 Implementation Blueprint: Authentication, Onboarding, Verification & Role Foundation

## 1. System Overview & Scope
Feature 01 establishes the foundational user journey, identity gating, and visual design system for the **PRAROHA'26 Sponsorship Outreach & Volunteer Execution System**.

### In-Scope (Feature 01 Only):
1. **Design System & Visual Benchmark:** Tailwind CSS v4 `@theme` configuration matching the supplied 2026 enterprise reference dashboard (warm canvas `#F7F7F0`, crisp white cards, PRAROHA teal `#0D7A68`, deep navy typography `#1E293B`, subtle borders `#E2E5DE`).
2. **Convex Database Foundation:** Schema definitions for `users` and `auditLogs` with required secondary indexes (`by_clerk_id`, `by_verification`, `by_role`).
3. **Clerk Authentication & Route Guarding:**
   - Public auth pages `/sign-in` and `/sign-up`.
   - Next.js middleware and centralized role/verification dispatcher (`app/page.tsx`).
   - Development auth switcher enabling instant switching between Volunteer, Pending, Admin, and New User for immediate verification of all 7 test cases.
4. **Mandatory 4-Field Volunteer Registration:**
   - Blocking modal requiring: Full Name, Phone Number (10 digits), Academic Semester (S1–S8), Department.
   - Status transitions to `pending` upon submission.
5. **Verification State Holding Screens:**
   - `pending` holding screen (*"Profile submitted — Awaiting admin verification"*).
   - `rejected` holding screen (with admin's rejection reason and option to edit/resubmit profile).
   - `suspended` holding screen (access blocked).
6. **Admin Verification Shell & Management:**
   - Admin view at `/admin` and `/admin/verifications`.
   - Queue of pending volunteers with inspection view.
   - Approve action (updates `verificationStatus = 'approved'`, logs to `auditLogs`).
   - Reject action with mandatory rejection reason modal (updates `verificationStatus = 'rejected'`, logs to `auditLogs`).
7. **Base Volunteer Workspace Shell (`/workspace`):**
   - Strictly single-page layout matching the reference dashboard image.
   - Left Sidebar (Branding, navigation items with Dashboard active, bottom promo card, user identity).
   - Top Header (Global search input, date indicator, notification bell, `+ Log a Call` button).
   - Greeting hero area with editorial illustration placeholder.
   - 4 Stat Cards displaying 0 counts (Calls, Companies, Follow-ups, Points).
   - Empty state for "My Assigned Leads" (*"No leads assigned yet"*).
   - Right-side contextual widgets (Today's Tasks, Upcoming Follow-ups, Performance donut, Recent Activity) with zero-state placeholders.

### Out of Scope (Strictly Deferred to Feature 02+):
- No CSV import or duplicate detection engine.
- No lead assignment matrix or lead management.
- No calling, Call Mode overlay, voice debriefs, or Whisper transcription.
- No AI synthesis, objections, or recommendations.
- No sponsorship pipeline, packages, or proposals.
- No gamification points rules or leaderboard.

---

## 2. Architectural Decisions & Conventions

1. **Convex Schema (`convex/schema.ts`):**
   - `users`: `clerkId`, `email`, `name`, `phone`, `semester`, `department`, `role` (`'admin' | 'volunteer'`), `verificationStatus` (`'pending' | 'approved' | 'rejected' | 'suspended'`), `rejectionReason`, `reviewedBy`, `reviewedAt`, `createdAt`, `updatedAt`.
   - `auditLogs`: `actorId`, `action`, `entityType`, `entityId`, `changes`, `timestamp`.
2. **Centralized Route Guard (`app/page.tsx` & Client Guards):**
   - Resolves authentication and verification:
     - Not authenticated $\rightarrow$ `/sign-in`
     - Authenticated + profile missing $\rightarrow$ Registration modal
     - Authenticated + `pending` $\rightarrow$ Verification pending screen
     - Authenticated + `rejected` $\rightarrow$ Rejection screen with reason
     - Authenticated + `suspended` $\rightarrow$ Suspended screen
     - Authenticated + `approved` + `volunteer` $\rightarrow$ `/workspace`
     - Authenticated + `approved` + `admin` $\rightarrow$ `/admin`
3. **Dual Auth Support (Clerk + Dev Mode):**
   - Works with Clerk credentials while providing a dedicated local testing switcher in development mode, allowing instant verification of all 7 required test cases.
