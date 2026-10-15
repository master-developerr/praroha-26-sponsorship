# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

The single source of truth for the design language is the **PRAROHA'26 Sponsorship Outreach & Volunteer Execution System Design System**.

---

## 1. Design System Foundations

The application unites **two connected visual expressions** under a single shared token architecture:
1. **Authentication & Onboarding:** Welcoming, energetic, and illustration-led while remaining crisp and professional.
2. **Volunteer & Admin Workspaces:** Serious, professional, calm, information-dense, structured, and operational (inspired by the SmartShelf dashboard reference).

### Color System Tokens

```css
/* Core Palette Tokens */
--color-background: #F7F7F0;     /* Warm Canvas */
--color-surface: #FFFFFF;        /* Crisp White Surface */
--color-primary: #237E72;        /* Primary Teal (Main Action Accent) */
--color-secondary: #203B35;      /* Deep Forest Slate */
--color-accent-mint: #D9EEE4;    /* Soft Mint Tint */
--color-accent-yellow: #F5D978;  /* Butter Yellow */
--color-accent-coral: #F18A70;   /* Coral Highlight (Overdue Callbacks) */

--color-text-primary: #252A27;   /* Charcoal Black */
--color-text-secondary: #626B65; /* Medium Slate */
--color-text-muted: #818982;     /* Muted Grey */
--color-border: #E2E5DE;         /* Neutral Divider Border */

/* Semantic Status Tokens */
--color-success: #22C55E;        /* Confirmed / Approved / WON */
--color-warning: #EAB308;        /* Follow-up Due Today */
--color-error: #EF4444;          /* Rejected / LOST */
--color-info: #0EA5E9;           /* Proposal Sent / Review */
--color-status-pending: #D97706; /* Pending Verification / Unassigned */
--color-status-overdue: #F18A70; /* Overdue Callback */
```

### Semantic Status Badges & Accents

| Status Name | Background Token | Text Token | Border Token | Usage Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **WON / Approved** | `bg-emerald-50` | `text-emerald-700` | `border-emerald-200` | Confirmed sponsor, Approved volunteer |
| **INTERESTED / Contacted** | `bg-teal-50` | `text-teal-700` | `border-teal-200` | Interested decision-maker, initial contact |
| **PROPOSAL_REQUESTED** | `bg-indigo-50` | `text-indigo-700` | `border-indigo-200` | Custom pitch deck or pricing requested |
| **PROPOSAL_SENT** | `bg-sky-50` | `text-sky-700` | `border-sky-200` | Brochure formally dispatched |
| **NEGOTIATION** | `bg-purple-50` | `text-purple-700` | `border-purple-200` | MoU drafting, deliverables finalization |
| **Follow-up Due Today** | `bg-yellow-50` | `text-yellow-800` | `border-yellow-200` | Scheduled callback due today |
| **Overdue Callback** | `bg-orange-50` | `text-orange-800` | `border-orange-300` | Missed callback deadline (urgent) |
| **Pending Verification** | `bg-amber-50` | `text-amber-800` | `border-amber-200` | Volunteer awaiting admin gate |
| **LOST / Rejected** | `bg-rose-50` | `text-rose-700` | `border-rose-200` | Deal lost, volunteer rejected |
| **UNASSIGNED / Neutral** | `bg-surface` | `text-text-secondary`| `border-border` | Unassigned lead pool |

### Contact Verification Badges

| Level | Badge Classes | Icon | Meaning |
| :--- | :--- | :--- | :--- |
| **VERIFIED_DECISION_MAKER** | `bg-emerald-100 text-emerald-800 border-emerald-300` | `CheckCheck` | Confirmed Brand Manager / CMO / CSR Head |
| **VERIFIED_COMPANY_REPRESENTATIVE** | `bg-teal-100 text-teal-800 border-teal-300` | `Check` | Verified employee or internal referral |
| **OFFICIAL_COMPANY_CONTACT** | `bg-sky-100 text-sky-800 border-sky-300` | `Building2` | Confirmed official corporate desk line |
| **UNVERIFIED** | `bg-amber-100 text-amber-800 border-amber-300` | `AlertCircle` | Scraped or crowdsourced contact |

---

## 2. Shared UI Primitives

### Button `[IMPLEMENTED]`
- **Purpose:** Principal action trigger (variants: `primary`, `secondary`, `outline`, `ghost`, `danger`, `link`).
- **Target Path:** `components/ui/button.tsx`
- **Tokens Used:** `bg-primary` (`#0D7A68`), `text-white`, `hover:bg-primary-hover`, `rounded-lg`, `font-medium text-sm shadow-xs`.

### Input `[IMPLEMENTED]`
- **Purpose:** Standard single-line form text and telephone input with label and validation error.
- **Target Path:** `components/ui/input.tsx`
- **Tokens Used:** `bg-surface border border-border text-text-primary focus:border-primary focus:ring-primary/15`, `rounded-lg`.

### Select `[IMPLEMENTED]`
- **Purpose:** Custom stylized dropdown select with chevron and error states.
- **Target Path:** `components/ui/select.tsx`
- **Tokens Used:** `bg-surface border border-border text-text-primary`, `rounded-lg`.

### Card `[IMPLEMENTED]`
- **Purpose:** Foundational content container (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
- **Target Path:** `components/ui/card.tsx`
- **Tokens Used:** `bg-surface border border-border rounded-xl shadow-xs`.

### Dialog / Modal `[IMPLEMENTED]`
- **Purpose:** Accessible modal dialog with backdrop blur, escape key listener, and size options (`sm`, `md`, `lg`, `xl`).
- **Target Path:** `components/ui/dialog.tsx`
- **Tokens Used:** Backdrop `bg-slate-900/40 backdrop-blur-xs`, container `bg-surface border border-border rounded-xl shadow-lg`.

### StatCard `[IMPLEMENTED]`
- **Purpose:** Benchmark reference stat card with icon, value, percentage badge, title, and subtle SVG sparkline indicator.
- **Target Path:** `components/ui/stat-card.tsx`

### EmptyState `[IMPLEMENTED]`
- **Purpose:** Clean placeholder container for tables and widgets with zero items.
- **Target Path:** `components/ui/empty-state.tsx`

### StatusBadge / Chip `[IMPLEMENTED]`
- **Purpose:** Domain status badges for `VerificationBadge` (`pending`, `approved`, `rejected`, `suspended`) and `RoleBadge` (`admin`, `volunteer`).
- **Target Path:** `components/ui/badge.tsx`

---

## 3. Layout & Shell Components

### TopHeader / Navbar `[IMPLEMENTED]`
- **Purpose:** Global header matching reference: search bar with `⌘K`, notification bell with dot, PRAROHA date badge, and `+ Log a Call` button.
- **Target Path:** `components/layout/Navbar.tsx`

### Sidebar `[IMPLEMENTED]`
- **Purpose:** Left navigation sidebar matching reference: PRAROHA flower logo, Dashboard (active mint pill), nav items with phase badges, editorial promo banner ("More Sponsors. Bigger PRAROHA'26"), and volunteer user profile footer.
- **Target Path:** `components/layout/Sidebar.tsx`

### AdminSidebar `[IMPLEMENTED]`
- **Purpose:** Dedicated administrative leadership sidebar for PRAROHA Core Team.
- **Target Path:** `components/layout/AdminSidebar.tsx`

### DevPersonaSwitcher `[IMPLEMENTED]`
- **Purpose:** Floating development toolbar for testing all 7 user flows in 1 click (Approved Volunteer, Pending, Rejected, Suspended, Admin Lead, New User, Signed Out).
- **Target Path:** `components/layout/DevPersonaSwitcher.tsx`

---

## 4. Feature 01 Specific Components

### VolunteerRegistrationModal `[IMPLEMENTED]`
- **Purpose:** Mandatory 4-field registration modal for first-time students (Full Name, Phone, Semester, Department) saving to Convex.
- **Target Path:** `components/forms/VolunteerRegistrationModal.tsx`

### VerificationPendingScreen `[IMPLEMENTED]`
- **Purpose:** Holding view for pending volunteers with submitted credential card and sign out.
- **Target Path:** `components/volunteer/VerificationPendingScreen.tsx`

### VerificationRejectedScreen & AccountSuspendedScreen `[IMPLEMENTED]`
- **Purpose:** Status screens for rejected (with admin feedback and re-edit button) and suspended accounts.
- **Target Path:** `components/volunteer/VerificationRejectedScreen.tsx`

### AdminVerificationView `[IMPLEMENTED]`
- **Purpose:** Admin queue with Pending, Approved, Rejected tabs, inspection modal, instant approval, and rejection reason feedback modal.
- **Target Path:** `components/admin/AdminVerificationView.tsx`

### VolunteerDashboardView `[IMPLEMENTED]`
- **Purpose:** Full single-page volunteer workspace view matching the benchmark reference image (Greeting hero with quote pill, 4 stat cards, empty assigned leads table, and 4 right contextual widgets).
- **Target Path:** `components/volunteer/VolunteerDashboardView.tsx`

---

## 5. Feature 02 Lead Database & CSV Import Components

### MasterLeadDirectoryView `[IMPLEMENTED]`
- **Purpose:** High-density administrative lead directory with search, sector/status/priority filters, pagination, and KPI metric cards.
- **Target Path:** `components/admin/MasterLeadDirectoryView.tsx`
- **Features:**
  - KPI Stat Cards: Total Leads, Unassigned Pool, In Outreach Pipeline, Verified Contacts.
  - Search & Multi-Filter bar: Full-text fuzzy search, Industry dropdown, Priority filter, Status filter.
  - Interactive Actions: "Import Leads (CSV)" trigger, "+ Add Single Lead" trigger, per-row "Dossier" drawer trigger.

### LeadImportModal `[IMPLEMENTED]`
- **Purpose:** 4-step canonical CSV import wizard with pre-flight schema analysis and duplicate resolution table.
- **Target Path:** `components/admin/LeadImportModal.tsx`
- **Steps:**
  1. File Upload (drag-and-drop zone + sample CSV template generator).
  2. Pre-Flight Analysis (summary chips for valid/invalid rows and syntax error table).
  3. Duplicate Detection & Collision Resolution (side-by-side comparison with `Skip`, `Merge`, or `Import as New Contact`).
  4. Ingestion Confirmation (progress state and final report).

### CompanyDossierDrawer `[IMPLEMENTED]`
- **Purpose:** Contextual slide-over drawer showing complete 29-field corporate profile and verified decision-makers.
- **Target Path:** `components/admin/CompanyDossierDrawer.tsx`
- **Sections:**
  - Header with Company Name, Website, Sector pill, Priority badge, and Lead Status badge.
  - Verified Contacts list with `PhoneTypeBadge`, `ContactVerificationBadge`, direct call link, and email copy.
  - Outreach Intelligence & Rationale (Kerala presence, sponsorship history, why good lead, why company benefits).
  - Financial Guidance (Recommended Tier, Ask Range in INR, non-cash alternatives).

### ManualLeadCreateModal `[IMPLEMENTED]`
- **Purpose:** Direct manual lead creation modal for adding individual companies and attaching decision-makers.
- **Target Path:** `components/forms/ManualLeadCreateModal.tsx`

---

## 6. Volunteer Single-Page Workstation Components (Phase 3+)

### TodayWorkBar `[IMPLEMENTED]`
- **Purpose:** Top action strip summarizing daily call quota pacing, remaining targets, overdue alerts, and high-priority lead counts.
- **Target Path:** `components/volunteer/TodayWorkBar.tsx`
- **Features:**
  - Progress bar showing `callsCompleted / dailyTarget` (0 / 15 calls pacing).
  - Calls Remaining chip (`text-text-secondary text-xs font-semibold`).
  - Overdue Callbacks alert pill (Urgent coral alert `--color-accent-coral: #F18A70`, `bg-[#F18A70]/10 text-[#F18A70] border-[#F18A70]`).
  - Follow-ups Due Today pill (`bg-amber-100 text-amber-800 border-amber-300`).
  - High-Priority Leads counter (`bg-rose-100 text-rose-700 border-rose-200`).
  - Quick utility buttons: "Event Deck & Tiers" and active shift indicator.

### LeadsTable `[IMPLEMENTED]`
- **Purpose:** Primary high-density data grid displaying corporate leads assigned to the authenticated volunteer.
- **Target Path:** `components/volunteer/LeadsTable.tsx`
- **Features:**
  - Filter Tabs: `All Assigned`, `To Contact`, `In Progress`, `Follow-up`, `Interested`.
  - Inline search by company, niche, contact name, or phone.
  - Priority filter dropdown (`High`, `Medium`, `Normal`, `Low`).
  - Columns:
    1. Company Entity, Industry & Location
    2. Primary Contact, Designation, `PhoneTypeBadge`, `ContactVerificationBadge`
    3. `PriorityBadge`
    4. `LeadStatusBadge`
    5. Assignment timeline & last contacted date
    6. Actions: "Dossier" (triggers `CompanyDossierDrawer`) and "Call" direct phone link.

### ReassignLeadModal `[IMPLEMENTED]`
- **Purpose:** Admin modal for reallocating corporate lead ownership between approved SDRs with mandatory audit reason.
- **Target Path:** `components/admin/ReassignLeadModal.tsx`
- **Features:** Target SDR selector with live capacity indicators, required audit reason text area, and atomic Convex mutation.

### LeadDetailDrawer `[PLANNED]`
- **Purpose:** Slide-over drawer displaying company profile, contact details, and concise call prep.
- **Target Path:** `components/volunteer/LeadDetailDrawer.tsx`
- **Sections:**
  - Header: Company name, website link, industry pill, current lead status.
  - Contact Details Card: Direct phone, phone type pill, email, LinkedIn, verification level.
  - Concise Talking Points Accordion (`ConciseTalkingPoints.tsx`): 3 tailored points, opening hook, discovery questions, objection tips.
  - Historical Timeline: Past calls, outcomes, voice debrief notes.
  - Sticky Footer: "Start Call" (primary) and "Log Debrief".

### CallModeOverlay `[IMPLEMENTED]`
- **Purpose:** High-focus, distraction-free in-call overlay activated during active phone outreach.
- **Target Path:** `components/volunteer/CallModeOverlay.tsx`
- **Layout & Visuals:**
  - Full-screen dimmed backdrop (`bg-slate-900/60 backdrop-blur-sm z-50`).
  - Centered high-contrast card (`bg-surface border border-border rounded-2xl shadow-2xl p-6 max-w-2xl w-full`).
  - Large Contact Name (`text-xl font-bold text-text-primary`) & Designation.
  - Clickable phone number with direct dial trigger (`tel:`).
  - Live stopwatch timer with pulsing red indicator (`font-mono text-sm bg-rose-50 border border-rose-200 text-rose-700`).
  - Embedded non-rigid `ConciseTalkingPoints` reference card.
  - Embedded 9 `QuickOutcomeButtonGroup` triggers.

### QuickOutcomeButtonGroup `[IMPLEMENTED]`
- **Purpose:** 9 one-click outcome buttons to rapidly classify the outreach call.
- **Target Path:** Embedded in `components/volunteer/CallModeOverlay.tsx`
- **Outcome Buttons:**
  1. `Interested` (`bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100`)
  2. `Asked for proposal` (`bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100`)
  3. `Asked for budget` (`bg-indigo-50 text-indigo-800 border-indigo-300 hover:bg-indigo-100`)
  4. `Wrong person` (`bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100`)
  5. `Call back` (`bg-yellow-50 text-yellow-800 border-yellow-300 hover:bg-yellow-100`)
  6. `Rejected` (`bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100`)
  7. `Non-cash opportunity` (`bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100`)
  8. `Meeting requested` (`bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100`)
  9. `Other` (`bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100`)

### ConciseTalkingPoints `[IMPLEMENTED]`
- **Purpose:** Non-rigid battlecards and talking cues for volunteer calls (NO rigid scripts).
- **Target Path:** `components/volunteer/ConciseTalkingPoints.tsx`
- **Tabs / Sections:**
  - Talking Points: 3 concise bullets linking company goals with PRAROHA'26.
  - Opening Hook: 15-second natural introduction.
  - Discovery Questions: 3 high-yield questions to uncover marketing priorities and CSR budget.
  - Objection Battlecards: Collegiate objection counter-points (budget locked, wrong time, academic only).
  - In-Kind / Non-Cash Angles: Tangible product, voucher, workshop, and equipment alternatives.

### CallReportModal `[IMPLEMENTED]`
- **Purpose:** Structured post-call debrief and manual outcome logging dialog.
- **Target Path:** `components/volunteer/CallReportModal.tsx`
- **Sections:**
  - Pre-selected Quick Outcome badge with duration summary.
  - Target Stage Progression dropdown (auto-mapped based on outcome, SDR editable).
  - Interest Level chips: High, Medium, Low, None.
  - Decision-Maker Status dropdown (`reached_decision_maker`, `reached_gatekeeper`, `wrong_contact`, `unreachable`).
  - Primary Objection dropdown.
  - Qualitative notes textarea.
  - Follow-up Callback scheduler (toggleable with date/time, priority, and notes).

### FollowUpList `[IMPLEMENTED]`
- **Purpose:** Actionable callback widget displaying due-today, overdue, and upcoming follow-ups.
- **Target Path:** `components/volunteer/FollowUpList.tsx`
- **Items:**
  - Overdue Section: Highlighted with urgent coral borders (`border-l-4 border-l-[#F18A70]`).
  - Due Today Section: Highlighted with butter yellow borders (`border-l-4 border-l-amber-500`).
  - Upcoming Section: Clean slate cards (`border-l-4 border-l-primary/60`).
  - One-click "Call Now" shortcut button launching `CallModeOverlay` directly.
  - One-click "Mark Done" action calling `followUps:completeFollowUp`.

### EventInfoModal `[IMPLEMENTED]`
- **Purpose:** Internal modal reference for PRAROHA'26 deliverables and sponsorship brochure.
- **Target Path:** `components/volunteer/EventInfoModal.tsx`
- **Tabs:** Deliverables & Stalls, Tier Pricing (Title ₹5L+, Powered By ₹3L+, Associate ₹1.5L+), 13 In-Kind Wishlist & Valuation, Student Demographics (5000+ engineers), Brochure PDF Download & Quick Phone Pitch.

### CreateProposalModal `[IMPLEMENTED]`
- **Purpose:** Sponsorship proposal generation and dispatch logging dialog with in-kind fair-market valuation.
- **Target Path:** `components/pipeline/CreateProposalModal.tsx`
- **Features:** 5 package tiers (`Title`, `Powered By`, `Associate`, `Custom`, `In-Kind`), 13 non-cash category selectors, real-time total commercial valuation calculator, 10 standard + custom promised deliverables checklist, dispatch state switcher (`sent` vs `draft`).

### CompanyTimeline `[IMPLEMENTED]`
- **Purpose:** Unified chronological interaction history stream embedded in `CompanyDossierDrawer`.
- **Target Path:** `components/pipeline/CompanyTimeline.tsx`
- **Features:** Vertical activity feed uniting calls, post-call debriefs, follow-up callbacks, proposal dispatches, and ratified commitments with semantic badge styling and actor attribution.

### LeaderboardPodium `[IMPLEMENTED]`
- **Purpose:** Real-time team rankings podium celebrating verified outreach, closed deals, and gamification points.
- **Target Path:** `components/volunteer/LeaderboardPodium.tsx`
- **Visuals:** Gold, silver, and bronze pedestals for Top 3 SDRs with crown/medal badges and conversion stats, followed by a searchable team roster with rank, volunteer details, points badges, and admin adjustment controls.

---

## 4. Admin Management Hub Components

### LeadImportModal `[PLANNED]`
- **Purpose:** Drag-and-drop CSV importer enforcing the canonical 29-field schema.
- **Target Path:** `components/admin/LeadImportModal.tsx`
- **Features:**
  - Drag-and-drop zone with instant CSV header parsing.
  - Pre-flight schema validation badge (verifies 7 required fields).
  - Row error indicator with exact line numbers.

### DuplicateResolutionTable `[PLANNED]`
- **Purpose:** Side-by-side comparison table to resolve company and contact collisions.
- **Target Path:** `components/admin/DuplicateResolutionTable.tsx`
- **Features:**
  - Displays incoming CSV row alongside existing database match.
  - Per-row action radio group: `Skip` | `Merge Missing Fields` | `Import as New Contact`.

### AssignmentMatrix `[PLANNED]`
- **Purpose:** 2-column bulk assigner and workload balancer for leads.
- **Target Path:** `components/admin/AssignmentMatrix.tsx`
- **Layout:**
  - Left column: Unassigned leads pool with multi-select checkboxes.
  - Right column: Approved volunteer roster cards with capacity badges and current active lead counts.
  - Bulk action toolbar: "Assign Selected (X) Leads to [Volunteer]".

### OpportunityApprovalModal `[IMPLEMENTED]`
- **Purpose:** Binding sponsorship commitment authorization modal (exclusive admin authority).
- **Target Path:** `components/admin/OpportunityApprovalModal.tsx`
- **Fields:** Company, package tier, cash amount (₹), in-kind category & estimated fair-market value (₹), in-kind inventory description, deliverables checklist, MoU document reference, "Authorize Commitment (Move to WON)" button.

### SponsorshipCommitmentsPage (10-Stage Pipeline Visualizer) `[IMPLEMENTED]`
- **Purpose:** Administrative pipeline visualizer and commitment authorization hub.
- **Target Path:** `app/admin/commitments/page.tsx`
- **Features:** 6 financial KPI metric cards, 10-stage interactive Kanban board with per-stage financial sums, summary table view switcher, quick stage advancement, and direct commitment authorization triggers.

---

## 5. Design Consistency Rules

1. **Strictly Single-Page for Volunteers:** Never create separate pages for leads, calls, or debriefs. Use drawers, dialogs, and the `CallModeOverlay`.
2. **Operations First, AI Second:** Every form and outcome can be logged manually. Never block a volunteer if AI is offline.
3. **Always Pair Status Color with Text Labels & Icons:** Never rely on color alone to indicate lead status or verification level.
4. **Use Semantic Design Tokens:** Use `bg-primary`, `bg-surface`, `border-border` — never raw hex codes.
5. **Enforce Contact Verification Distinctions:** Clearly display whether a phone number is a verified decision-maker or an unverified corporate desk.
6. **No AI Clichés:** No purple gradients, robot avatars, or generic chat bubbles. Use crisp cards, subtle teal badges, and glanceable live phone bullets.

---

## 6. AI Intelligence & Sales-Assistance Components `[IMPLEMENTED]`

### CompanyAIAnalysisCard `[IMPLEMENTED]`
- **Purpose:** Full strategic company intelligence dossier synthesizing PRAROHA'26 festival fit.
- **Path:** `components/ai/CompanyAIAnalysisCard.tsx`
- **Features:** 0–100 company fit score meter, Civil Engineering synergy notes, Kerala presence footprint, student demographic affinity, bulleted sponsor value propositions, recommended ask tier & INR range, and dynamic cache/regenerate triggers.

### CallPreparationCard `[IMPLEMENTED]`
- **Purpose:** Rapid 2-second glanceable live call battlecard for student volunteers actively on the phone.
- **Path:** `components/ai/CallPreparationCard.tsx`
- **Features:** Call objective, natural opening angle (no rigid scripts), festival stature points, questions to ask, live objection counter-phrases, and in-kind fallback pivots.

### AlternativeAskCard `[IMPLEMENTED]`
- **Purpose:** AI alternative sponsorship portfolio when companies reject financial sponsorship.
- **Path:** `components/ai/AlternativeAskCard.tsx`
- **Features:** Customized non-cash opportunities across 13 categories (`PRODUCT`, `SERVICES`, `TECHNICAL_SUPPORT`, `WORKSHOP`, `SPEAKER`, `PRIZES`, `SOFTWARE`, `MERCHANDISE`, `VENUE`, `PRINTING`, `TRANSPORTATION`, `OTHER_IN_KIND`), INR valuations, value to PRAROHA, feasibility ratings, and 1-click proposal draft pre-population.

### DebriefAnalysisCard `[IMPLEMENTED]`
- **Purpose:** Automated post-call evaluation, signal extraction, and coaching review.
- **Path:** `components/ai/DebriefAnalysisCard.tsx`
- **Features:** Embedded in `CallReportModal`, extracts positive interest signals and risk points, identifies outcome, rates interest, provides volunteer critique, and offers a 1-click "Apply AI Suggestions" button.

### LeadPriorityExplainer `[IMPLEMENTED]`
- **Purpose:** Deterministic scoring explanation popover.
- **Path:** `components/ai/LeadPriorityExplainer.tsx`
- **Features:** Displays 4-factor deterministic scoring baseline (Industry, Civil, Kerala, Student Demographics), bulleted rationale on why to call, and recommended immediate next step.

---

## 7. Team Management, Gamification & Executive Dashboard Components `[IMPLEMENTED]`

### ExecutiveDashboardView `[IMPLEMENTED]`
- **Purpose:** Macro executive command center at `/admin` for sponsorship heads and convenors.
- **Path:** `components/admin/ExecutiveDashboardView.tsx`
- **Features:**
  - 4 Bento KPI Metric Cards: Total Pipeline Value (Liquid cash + in-kind valuation), Outbound Calls Logged, Ratified Corporate Deals, and Active Approved SDRs.
  - 7-Day Outreach Velocity Area Chart (Recharts) with dual gradients for daily calls, proposals, and deals won.
  - Corporate Roadblock Insights: Frequency distribution bars of common objections (Budget allocated, wrong timing, etc.).
  - Sector Responsiveness Table: Conversion percentages and win counts by industry.
  - Tab Switcher: Seamless toggle between Executive Cockpit and Team Honors Leaderboard.

### PersonalPerformanceCard `[IMPLEMENTED]`
- **Purpose:** Compact personal metric badge on `/workspace` for student SDRs.
- **Path:** `components/volunteer/PersonalPerformanceCard.tsx`
- **Features:**
  - Shows student's current team rank with Trophy icon and points pill.
  - Summarizes completed calls, deals won, and conversion rate.
  - 1-click trigger button ("View Full Leaderboard") to launch the `LeaderboardPodium` dialog.

### AdjustPointsModal `[IMPLEMENTED]`
- **Purpose:** Discretionary gamification adjustment modal with strict administrative authorization and audit logs.
- **Path:** `components/admin/AdjustPointsModal.tsx`
- **Features:**
  - Target SDR identification badge and current points tally.
  - Preset delta buttons: `+10 (Helpful Prep)`, `+25 (Meeting Held)`, `+50 (Key Lead Added)`, `+100 (Exceptional Lead)`, `-10 (Inactivity)`, `-25 (Missed Callback)`.
  - Custom point input.
  - Mandatory audit notes textarea explaining the reason for adjustment.
  - Atomic mutation calling `gamification:adminAdjustPoints`.

---

## 8. Supporting Features, Search, Notifications & Analytics Components `[IMPLEMENTED]`

### NotificationPopover `[IMPLEMENTED]`
- **Purpose:** In-app reactive notification drawer mounted on the bell icon in `Navbar.tsx`.
- **Path:** `components/layout/NotificationPopover.tsx`
- **Features:**
  - Real-time unread badge count with zoom-in badge pill.
  - Multi-card reactive alert panels for Overdue Callbacks (with direct "Call Now" shortcuts), Due Today Callbacks, Pending Volunteer Verifications (admin view), and Recent Point Awards (volunteer view).
  - Relative time formatting (`2h ago`, `Just now`, etc.).
  - "Dismiss All" button with localized session persistence.

### GlobalCommandPalette `[IMPLEMENTED]`
- **Purpose:** Universal quick-navigation and search modal opened via `⌘K` / `Ctrl+K` or Navbar search bar.
- **Path:** `components/search/GlobalCommandPalette.tsx`
- **Features:**
  - Instant fuzzy search across companies and contacts with highlight matches.
  - Quick action links (Log Call, Event Deck, Volunteer Leaderboard, Audit Console).
  - Direct telephone click-to-dial action (`tel:`) on contact search hits.
  - One-click routing to company dossiers in volunteer or admin mode.

### AuditLogConsole `[IMPLEMENTED]`
- **Purpose:** Administrative audit log stream and inspection console mounted at `/admin/analytics`.
- **Path:** `components/admin/AuditLogConsole.tsx`
- **Features:**
  - Searchable by action, entity ID, or JSON change payload.
  - Filterable by Action (`create`, `update`, `delete`, `approve`, `reject`, `reassign`, `authorize`) and Entity Type (`company`, `user`, `leadAssignment`, `commitment`, `pointTransaction`).
  - Expandable JSON diff modal (`DiffModal`) with formatted monospace syntax view of mutated attributes.
  - Actor enrichment displaying admin name, email, and role.

### DataExportHub `[IMPLEMENTED]`
- **Purpose:** 1-click administrative data export dashboard for festival records and audits.
- **Path:** `components/admin/DataExportHub.tsx`
- **Features:**
  - 3 Bento download cards for:
    1. **Master Lead Directory:** 29-field canonical schema CSV.
    2. **Outreach Calls & Voice Debriefs:** Complete call logs, durations, outcomes, objections, and next actions.
    3. **Ratified Sponsorship Commitments:** Financial cash + in-kind packages, deliverables count, and authorized MoU records.
  - Browser-side blob generation using RFC-4180 compliant CSV generator (`lib/export/csvExport.ts`).

### LeadsTable Density & Multi-Attribute Filters `[IMPLEMENTED]`
- **Purpose:** High-density data grid controls on `/workspace`.
- **Path:** `components/volunteer/LeadsTable.tsx`
- **Features:**
  - Multi-attribute Sector Filter (All Sectors, Cement & Concrete, IT & SaaS, Banking, Real Estate, etc.).
  - Contact Verification Filter (All Contacts, Decision Makers, Company Reps, Official Line, Unverified).
  - Density Toggle Button (Compact row height `py-1.5` vs Normal row height `py-3`).

---

## 9. Responsive Layout & Accessibility Components `[IMPLEMENTED]`

### Mobile Navigation Drawer & Hamburger Trigger `[IMPLEMENTED]`
- **Purpose:** Responsive navigation menu for small viewports (<1024px) ensuring SDRs and Admins can access all routes on mobile devices down to 375px.
- **Path:** Integrated inside `components/layout/Navbar.tsx`
- **Features:**
  - Accessible hamburger button trigger visible strictly on `lg:hidden`.
  - Full-height off-canvas slide-out sheet (`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-surface`).
  - Dimmed focus backdrop (`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50`).
  - Dynamic role badge pill (`Admin` vs `Volunteer`) matching user permissions.
  - Active route highlighting with primary teal background and border.
  - Mobile sign-out trigger with direct confirmation.
  - Keyboard accessible with native `Escape` listener and backdrop tap dismiss.

### High-Contrast WCAG-AA Focus Indicators `[IMPLEMENTED]`
- **Purpose:** Accessible keyboard navigation compliance ensuring zero-mouse SDR outreach execution.
- **Paths:** `components/ui/button.tsx`, `components/volunteer/CallModeOverlay.tsx`
- **Features:**
  - `focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden` on all button variants.
  - Quick outcome buttons in Call Mode support instant keyboard tab selection with elevated visual contrast rings.




