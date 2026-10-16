# Memory — PRAROHA'26 Reference Design Adaptations: Notion Onboarding & Cal.com Team Hub

Last updated: October 16, 2026 (18:30 IST)

## What was built

### 1. Notion Onboarding Reference Adaptation (`NotionCompanyDossierModal.tsx`)
- Adapted the 7-step Notion onboarding workflow (page title, section heading, bullets, callout, in-page database with Stage pills, search/share outcome) into an authentic corporate research document canvas for PRAROHA'26 sponsors:
  - **Notion Top-Bar & Breadcrumbs:** `PRAROHA'26 / Corporate Intelligence / {companyName}` with Share/link copy feedback and dismiss action.
  - **Page Canvas & Typography:** 36px font title, subtle meta tags, 20px section heading ("Research overview & strategic signals"), and 15–16px / 1.5 leading body bullets highlighting Kerala footprint, sponsorship track record, and campus recruiting fit.
  - **Lightbulb Callout Block:** `#f8f0d0` background in light mode (`dark:bg-amber-950/25` in dark mode) featuring the strategic pitch hook and alternative non-cash partnership angle.
  - **In-Page Deliverables Tracker Database:**
    - Live database with Table and Board views.
    - Notion-style blue `#2080e0` "+ New" action button.
    - Stage pills: `Done` (green pill), `In progress` (blue pill), `Not started` (gray pill) with interactive cycling on click.
    - Quick row insertion form with instant validation.
  - **Contextual Actions:** Direct trigger to "Launch Call Mode" and "Schedule Pitch Meeting" (Cal.com hub).

### 2. Cal.com Team Hub Reference Adaptation (`CalTeamScheduler.tsx` & `/workspace/meetings`)
- Adapted Cal.com's clean team booking flow (team branding, event rows with chips and stacked avatars, "OR" divider, 3-column booking surface) into PRAROHA'26's volunteer outreach workstation:
  - **Team Header:** Logo, "Team" title, "The team behind this very product" description, and stacked student SDR avatars.
  - **5 Event Types:**
    1. `15m Corporate Discovery Call` (Round robin)
    2. `30m Proposal & Deliverable Customization` (Collective)
    3. `45m Executive MoU & Signing Authority` (Exclusive / Sponsorship Head)
    4. `20m In-Kind Alignment` (Logistics team)
    5. `15m Follow-up Callback` (Instant dispatch)
  - **OR Divider:** "Book a team member instead" leading to individual SDR assignments.
  - **3-Column Booking Surface:**
    - Column 1: Event summary, duration badge, venue/telecom details.
    - Column 2: 59×59px day tiles calendar (October 2026) with bookable day styling (`#e5e7eb` / `dark:bg-slate-800`), selected day highlight (`#292929` / `dark:bg-teal-600`), and today dot indicator.
    - Column 3: Scrolling time slot column (10:00 AM to 5:00 PM) with 12h/24h format switcher.
  - **Booking Confirmation & Live Convex Follow-Up Creation:**
    - Form with pre-populated company and decision-maker contact details, email, phone, and customized agenda.
    - Direct integration with `api.followUps.scheduleFollowUp` Convex mutation, generating real verified callbacks on the calendar.
    - Clean confirmed booking screen with calendar invite recap.

### 3. Unified Workspace Architecture & Multi-Surface Integration
- **New Page Route ([app/workspace/meetings/page.tsx](file:///d:/everything%20for%20coding/sponsorship%20management%20system/app/workspace/meetings/page.tsx)):** Standalone Cal.com team hub in `/workspace/meetings`.
- **Sidebar Navigation ([components/layout/Sidebar.tsx](file:///d:/everything%20for%20coding/sponsorship%20management%20system/components/layout/Sidebar.tsx)):** Added "Meetings & Dispatch" with `CalendarClock` icon.
- **Unified Workspace Context ([components/volunteer/WorkspaceContext.tsx](file:///d:/everything%20for%20coding/sponsorship%20management%20system/components/volunteer/WorkspaceContext.tsx)):**
  - Exposes `openNotionDossier(companyId)` and `openCalScheduler(lead?)` everywhere across the single-page workspace.
  - Mounts `<NotionCompanyDossierModal />` and `<CalTeamScheduler isModal />` globally.
- **Table & Drawer Triggers:**
  - [components/volunteer/LeadsTable.tsx](file:///d:/everything%20for%20coding/sponsorship%20management%20system/components/volunteer/LeadsTable.tsx): Row-level "Notion" and "Meet" action buttons.
  - [components/admin/CompanyDossierDrawer.tsx](file:///d:/everything%20for%20coding/sponsorship%20management%20system/components/admin/CompanyDossierDrawer.tsx): Added "Notion Doc" button in the drawer footer.
  - [app/workspace/page.tsx](file:///d:/everything%20for%20coding/sponsorship%20management%20system/app/workspace/page.tsx) & [app/workspace/leads/page.tsx](file:///d:/everything%20for%20coding/sponsorship%20management%20system/app/workspace/leads/page.tsx): Connected all handlers cleanly.

## Validation Status
- **TypeScript Strict Mode:** Passed with 0 errors (`npx tsc --noEmit`).
- **Brand Consistency:** Retained PRAROHA'26 branding (`#0D7A68`, Ivory `#F6F7F5`, Charcoal `#0B131E`, Surfaces `#FFFFFF` / `#121D2C`).
- **WCAG AA Compliance:** Dual-theme support verified across light and dark modes.
