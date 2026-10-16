# Build Plan
 
> [!NOTE]
> The single source of truth for the project roadmap and architectural phases is located at root [BUILD_PLAN.md](file:///d:/everything%20for%20coding/sponsorship%20management%20system/BUILD_PLAN.md) and progress matrix at [IMPLEMENTATION_PROGRESS.md](file:///d:/everything%20for%20coding/sponsorship%20management%20system/IMPLEMENTATION_PROGRESS.md).

## Core Principle

Full page UI built with mock data first — verified visually before any logic is written. Then functionality is built and wired to the UI step by step. Every feature must be visible and testable before moving to the next. No backend-only phases.

Features are organized strictly by priority:
- **Phase 1: Foundation & Authentication (P0)**
- **Phase 2: Lead Database & Canonical CSV Import System (P0)**
- **Phase 3: Volunteer Single-Page Workstation & Assignment Matrix (P0)**
- **Phase 4: Call Workflow, Call Mode & Debrief Management (P0)**
- **Phase 5: Sponsorship Pipeline, Packages & In-Kind Operations (P1)**
- **Phase 6: Modular AI Intelligence Layer (P2)**
- **Phase 7: Team Management, Admin Dashboard & Gamification (P3)**
- **Phase 8: Supporting Features & Analytics (P4)**
- **Phase 9: Security Verification & Quality Assurance**

---

## Phase 1 — Foundation & Authentication (P0)

### 01 Project Foundation & UI Primitives [COMPLETED]
Verify base Next.js App Router workspace layout, global design tokens, and core UI component primitives.
- **UI:**
  - Global application shell with warm canvas (`bg-background` `#F7F7F0`), surface cards (`bg-surface` `#FFFFFF`), neutral borders (`border-border` `#E2E5DE`), and primary teal (`#237E72`).
  - Compact top navigation bar (`components/layout/Navbar.tsx`) containing PRAROHA'26 festival branding, active user identity snippet, role indicator, and sign-out action.
  - Base shadcn/ui primitives verified: Button, Input, Select, Dialog, Drawer/Sheet, Dropdown Menu, Table, Badge, StatCard, and EmptyState.
  - Toast notification container for operational feedback.
- **Logic:**
  - Next.js App Router root layout setup (`app/layout.tsx`) wrapping `ClerkProvider`, `ConvexClientProvider`, and `AuthProvider`.
  - Tailwind CSS v4 token integration via `@theme` in `app/globals.css`.
  - Strict TypeScript configuration check across all component props.
  - Lucide React icon integration.

### 02 Clerk Cloud Authentication & Route Guards [COMPLETED]
Configure Clerk authentication for students and team leads.
- **UI:**
  - Branded sign-in and sign-up views embedded within `app/(auth)/sign-in` and `app/(auth)/sign-up`.
  - Quick demo evaluation panel for switching between dev personas during review.
  - Loading state skeleton during authentication hydration.
  - Central dispatcher (`app/page.tsx`) redirecting visitors based on role and verification status.
- **Logic:**
  - Clerk client configuration via environment variables (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`).
  - Next.js middleware (`middleware.ts`) enforcing session authentication on `/workspace` and `/admin/*` routes when live Clerk keys are provided.
  - Root route (`app/page.tsx`) role dispatcher routing approved volunteers to `/workspace` and admins to `/admin`.

### 03 Convex Database Schema & Indexes [COMPLETED]
Declare database collections and query performance indexes for all 17 sponsorship domain entities before any data is written.
- **UI:** None (backend foundational schema).
- **Logic:**
  - Defined complete schema in `convex/schema.ts` matching `architecture.md`:
    - `users`, `companies`, `contacts`, `leadAssignments`, `calls`, `callDebriefs`, `followUps`, `proposals`, `sponsorships`, `sponsorshipPackages`, `eventInformation`, `pointTransactions`, `aiAnalysis`, and `auditLogs`.
  - Configured secondary indexes: `by_clerk_id`, `by_norm_name`, `by_dedup_hash`, `by_company_id`, `by_volunteer_id`, `by_lead_status`, `by_verification`, and `by_source_id`.

### 04 User Synchronization & Role Management [COMPLETED]
Synchronize authenticated Clerk users with Convex and initialize user status.
- **UI:** Identity status badge in navbar displaying role (`Volunteer` vs `Admin`) and verification status (`Approved`, `Pending`, `Rejected`, or `Suspended`).
- **Logic:**
  - `AuthProvider` client context (`components/providers/AuthProvider.tsx`) providing reactive user state and dev persona simulation.
  - Convex mutations in `convex/users.ts`: `syncClerkUser` (upsert user on login), `seedDevUserStatus`, and `promoteUserToAdminByEmail` (bootstrap initial admin).
  - Default assignment: `role: 'volunteer'`, `verificationStatus: 'pending'`.
  - Admin role provisioning: authorized exclusively via database mutation or `promoteUserToAdminByEmail`.

### 05 Mandatory Volunteer Registration Modal [COMPLETED]
Mandatory first-time profile completion modal presented to authenticated volunteers before workspace access.
- **UI:**
  - Blocking modal overlay (`components/forms/VolunteerRegistrationModal.tsx`) displayed on `/workspace` or root dispatcher when registration is incomplete.
  - Form containing strictly the four required fields:
    1. Full Name (text input)
    2. Phone Number (tel input with 10-digit validation)
    3. Semester (select dropdown: S1 to S8)
    4. Department (select dropdown: Civil, Computer Science, IT, Electronics, Electrical, Mechanical, Safety & Fire)
  - Information banner: *"Your registration will be submitted to the PRAROHA'26 Core Team for verification."*
- **Logic:**
  - Client query checks `getCurrentUser` on mount.
  - Form state managed with React Hook Form and validation rules.
  - Convex mutation (`users:registerVolunteerProfile`) updates profile details and sets `verificationStatus: 'pending'`, recording an audit log entry.

### 06 Admin Verification Interface & Server-Side Gate [COMPLETED]
Administrative verification queue to approve or reject student volunteer registrations, paired with strict server-side access enforcement.
- **UI:**
  - Admin verification console (`app/admin/verifications/page.tsx`, `components/admin/AdminVerificationView.tsx`) with pending volunteer queue table.
  - Volunteer inspection card displaying submitted name, phone, semester, department, and registration timestamp.
  - Action buttons: "Approve Volunteer", "Reject Registration", and "Suspend Account".
  - Rejection dialog with required text area for admin feedback reason.
  - Volunteer holding screen (`components/volunteer/VerificationPendingScreen.tsx`) for `pending` status.
  - Rejection banner (`components/volunteer/VerificationRejectedScreen.tsx`) for `rejected` status with admin reason and resubmit trigger.
- **Logic:**
  - Convex query `users:getUsersByVerification` filtered by verification status (`pending`, `approved`, `rejected`, `suspended`).
  - Convex mutations `users:approveVolunteer`, `users:rejectVolunteer`, and `users:suspendVolunteer` strictly asserting `admin.role === 'admin'`.
  - Server-side enforcement invariant: Protected Convex queries assert `user.verificationStatus === 'approved'`.

---

## Phase 2 — Lead Database & Canonical CSV Import System (P0)

### 07 Master Company Lead Directory UI [COMPLETED]
Build the administrative master company directory UI with live Convex data and filtering.
- **UI:**
  - Admin master company management view (`app/admin/leads/page.tsx`, `components/admin/MasterLeadDirectoryView.tsx`).
  - High-level directory statistics: Total Leads, Assigned Leads, Unassigned Pool, and Confirmed Sponsors.
  - Comprehensive data grid showing company name, sector, niche, priority tag, assigned volunteer, 10-stage lifecycle status, primary contact, and actions.
  - Action toolbar: "Import Leads (CSV)", "Download CSV Template", and "Add Single Lead".
- **Logic:**
  - Convex queries `companies:getAllCompanies`, `companies:getCompanyMetrics`, and `companies:getDistinctIndustries`.
  - Real-time client-side and server-side filtering by assignment status, industry sector, lead status, and priority.

### 08 Canonical 29-Field CSV Parser & Pre-Flight Validator [COMPLETED]
Build the CSV file upload dropzone and schema validator conforming to the canonical 29-field format.
- **UI:**
  - Import modal (`components/admin/LeadImportModal.tsx`) with drag-and-drop zone for `.csv` files.
  - Schema validation feedback: confirms presence of 7 mandatory fields (`company_name`, `industry`, `niche`, `priority`, `contact_name`, `contact_designation`, `phone`).
  - Error alert for missing columns or malformed rows with line numbers.
- **Logic:**
  - Client-side CSV parser (`lib/csvParser.ts`) converting CSV rows to typed objects with quoted field handling.
  - Validator checking phone numbers (10 digits) and priority levels (`High`, `Medium`, `Normal`, `Low`).

### 09 4-Way Duplicate Detection Engine [COMPLETED]
Build the duplicate detection hashing algorithm to identify existing company and contact collisions.
- **UI:** Pre-flight import report displaying total rows, valid new leads, invalid rows, and duplicates flagged.
- **Logic:**
  - Duplicate hashing utility (`lib/deduplication.ts`):
    1. Normalized Name (lowercase, punctuation stripped, suffix removal e.g. "Pvt Ltd", "Corp")
    2. Name + Phone (normalized name + 10-digit phone)
    3. Name + Email (normalized name + lowercase email)
    4. Domain/Website (apex domain extraction)
  - Convex query (`companies:checkDuplicatesBatch`) evaluating collisions against existing database records.

### 10 Duplicate Resolution Table & Batch Ingestion [COMPLETED]
Build the collision resolution interface and batch database ingestion mutation.
- **UI:**
  - Side-by-side comparison table in `LeadImportModal` showing incoming row vs existing database record.
  - Per-row conflict selector: `Skip` (default), `Merge`, or `Import as New Contact`.
  - "Confirm & Import Valid Leads" primary button with progress feedback.
- **Logic:**
  - Convex mutation (`companies:importLeadsBatch`) asserting `admin.role === 'admin'`:
    - Inserts companies with `leadStatus: 'UNASSIGNED'`.
    - Inserts associated contact records with `phoneType` and `contactVerification`.
    - Merges fields on existing records if `merge` selected, or appends contact if `new_contact` selected.

### 11 Company & Contact Intelligence View [COMPLETED]
Build detailed company and contact intelligence inspection interfaces.
- **UI:**
  - Slide-over drawer (`components/admin/CompanyDossierDrawer.tsx`) with comprehensive company dossier:
    - Company: name, industry, niche, company size, revenue, Kerala presence, strategic alignment, and sponsorship potential.
    - Contacts list with verification chips: `VERIFIED_DECISION_MAKER` (emerald), `VERIFIED_COMPANY_REPRESENTATIVE` (teal), `OFFICIAL_COMPANY_CONTACT` (sky), `UNVERIFIED` (amber).
    - Phone type indicators: `direct_official`, `office`, `regional_office`, `department`, `switchboard`, `unknown`.
  - Tabbed interface: Overview, Contacts, Call History, Proposals, and AI Dossier.
- **Logic:**
  - Convex queries `companies:getCompanyDetails` and `companies:getCompanyTimeline`.
  - Contact verification status and phone classification rendered with high visual contrast.

---

## Phase 3 — Volunteer Single-Page Workstation & Assignment Matrix (P0)

### 12 Volunteer Single-Page Workstation Shell & Today's Work Bar [COMPLETED]
Build the responsive single-page volunteer dashboard shell using live Convex data.
- **UI:**
  - Header bar with greeting: *"Good day, [Volunteer Name]"*, today's date, and PRAROHA'26 active shift indicator.
  - "Today's Work" command bar (`TodayWorkBar`):
    - Daily calls completed vs target quota (0 / 15 calls pacing).
    - Calls remaining count.
    - Overdue follow-ups badge (high-urgency coral alert `#F18A70`).
    - Follow-ups due today badge.
    - High-priority (P0 Critical) leads indicator.
  - Quick action buttons: "Event Deck & Tiers" and direct drawer triggers.
- **Logic:**
  - Live query `api.assignments.getMyWorkstationMetrics`. Single continuous page on `/workspace` (no sub-page routing).

### 13 Volunteer Assigned Leads Table [COMPLETED]
Build the central interactive leads table on the volunteer workstation using live Convex subscriptions.
- **UI:**
  - Filter and search bar: search by company/contact/niche, filter by priority and lifecycle tabs (`All Assigned`, `To Contact`, `In Progress`, `Follow-up`, `Interested`).
  - Dense data table (`LeadsTable`) displaying:
    - Company name & industry tag
    - Primary contact person, designation, phone type badge, and verification level
    - Priority pill (`High`, `Medium`, `Normal`, `Low`)
    - 10-stage status badge (`LeadStatusBadge`)
    - Assignment timeline & last contacted date
    - Row action buttons: "Dossier" (slide-over drawer) and direct dial "Call" trigger
  - Empty state: Custom empty states for unassigned vs filter mismatch.
- **Logic:**
  - Live query `api.assignments.getMyAssignedLeads`, client-side multi-attribute search and filtering.

### 14 Admin Lead Assignment Matrix [COMPLETED]
Build the administrative lead assignment and reassignment manager.
- **UI:**
  - Assignment workspace (`app/admin/assignments/page.tsx`).
  - 2-column distribution layout: Unassigned Leads pool on left, Approved Volunteers roster on right.
  - Volunteer workload indicators: current active leads per volunteer, capacity status pills (`Available`, `Moderate`, `Near Capacity`), and visual workload progress bars.
  - Sticky bulk assignment bar: select multiple unassigned leads $\rightarrow$ choose target volunteer $\rightarrow$ click "Allocate Leads".
  - Reassignment modal (`ReassignLeadModal`): reassign an active lead to a different volunteer with mandatory audit reason.
- **Logic:**
  - Convex mutations: `assignments:assignLeadsBatch` and `assignments:reassignLead`.
  - Reassignment audit tracking: creates immutable entries in `auditLogs` and updates `leadAssignments.status` to `reassigned`.

### 15 Live Convex Data Wiring & Volunteer Data Isolation [COMPLETED]
Connect the volunteer workstation and admin assignment views to live Convex database queries and mutations.
- **UI:** Real-time reactivity: leads assigned by admin immediately appear in the volunteer's workstation table without page refresh.
- **Logic:**
  - Convex queries:
    - `assignments:getMyAssignedLeads`: strictly scoped to authenticated user ID and `verificationStatus === 'approved'`.
    - `assignments:getUnassignedPool`: returns leads where status is `UNASSIGNED` with attached primary contacts.
    - `assignments:getVolunteerRosterWithWorkload`: returns approved SDRs with live active workload counts.
  - Invariant enforcement: Volunteers cannot query leads belonging to peers.


---

## Phase 4 — Call Workflow, Call Mode & Debrief Management (P0)

### 16 Company Detail Drawer & Concise Talking Points [COMPLETED]
Build the slide-over company dossier drawer with concise call preparation points.
- **UI:**
  - Slide-over drawer (`CompanyDossierDrawer`) opening from the right when clicking a lead.
  - Company overview: industry, niche, company size, revenue, Kerala presence, sponsorship history.
  - Contact intelligence card: name, designation, phone, phone type, email, verification level.
  - Call preparation section (`ConciseTalkingPoints`):
    - 3 concise talking points connecting company marketing goals with PRAROHA'26.
    - Natural conversation opening hook (NO memorized scripts).
    - 3 probing discovery questions.
    - Likely objections with tailored counter-responses.
    - Alternative non-cash sponsorship options.
  - Action buttons: "Start Call" (primary) and "Log Debrief".
- **Logic:**
  - Wired live to `api.companies.getCompanyDetails`.

### 17 Call Mode Minimal In-Call Overlay [COMPLETED]
Build the minimal, high-focus in-call overlay.
- **UI:**
  - Full-screen distraction-free overlay (`CallModeOverlay`) activated on "Start Call".
  - Background dashboard dimmed and blurred.
  - Clean card displaying:
    - Contact Name, Designation, Company Name.
    - Large clickable phone number with direct dial action (`tel:`).
    - Contact verification level badge.
    - Sticky concise talking points reference box.
    - **9 Quick Outcome Buttons:**
      1. `Interested`
      2. `Asked for proposal`
      3. `Asked for budget`
      4. `Wrong person`
      5. `Call back`
      6. `Rejected`
      7. `Non-cash opportunity`
      8. `Meeting requested`
      9. `Other`
- **Logic:**
  - Call stopwatch timer tracking start time and elapsed duration.
  - Clicking any quick outcome button records call duration, sets outcome, closes Call Mode, and immediately opens the Post-Call Debrief modal.

### 18 Post-Call Debrief Form & Manual Outcome Logging [COMPLETED]
Build the post-call debrief logging modal.
- **UI:**
  - Modal dialog (`CallReportModal`) with structured fields:
    - Outcome tag (pre-populated from Call Mode).
    - Interest level (High, Medium, Low, None).
    - Decision-maker status selector.
    - Primary objection raised selector.
    - Qualitative discussion notes textarea.
    - Immediate callback scheduler with date/time, priority, and notes.
- **Logic:**
  - Convex mutation (`calls:logCallAndDebrief`): atomic insert into `calls` and `callDebriefs`, updates company status and `lastContactedAt`, schedules `followUps`, and logs audit trail.

### 19 Follow-Up Management Widgets [COMPLETED]
Build actionable follow-up widgets across the volunteer workstation and admin hub.
- **UI:**
  - "Follow-ups & Callbacks" widget (`FollowUpList`) with direct "Call Now" shortcuts.
  - "Overdue Callbacks" alert box highlighted in urgent coral styling (`#F18A70`).
  - "Due Today Callbacks" list with quick action triggers.
  - "Upcoming Shifts" list for future scheduling.
- **Logic:**
  - Convex query (`followUps:getVolunteerFollowUps`) categorizing by `dueDate`.
  - Mutations: `followUps:completeFollowUp` and `followUps:scheduleFollowUp`.


---

## Phase 5 — Sponsorship Pipeline, Packages & In-Kind Operations (P1)

### 20 10-Stage Sponsorship Pipeline Visualizer [COMPLETED]
Build the visual pipeline tracker for sponsorship progression.
- **UI:**
  - Full-featured 10-stage interactive Kanban board and summary table view (`app/admin/commitments/page.tsx`).
  - Exact 10 lifecycle stages: `UNASSIGNED`, `ASSIGNED`, `CONTACTED`, `INTERESTED`, `FOLLOW_UP`, `PROPOSAL_REQUESTED`, `PROPOSAL_SENT`, `NEGOTIATION`, `WON`, `LOST`.
  - Financial KPI metric cards header: Total Pipeline Potential Value, Total Confirmed Revenue, Confirmed Cash, Confirmed In-Kind Valuation, In Negotiation, Total Sourced Leads.
  - Per-stage aggregate financial valuation header pills and lead count badges.
  - Quick stage advance action buttons with strict server-side transition checks.
- **Logic:**
  - Convex query `pipeline:getPipelineBoard` grouping companies into columns with contacts, volunteer assignments, latest proposals, and confirmed commitment values.
  - Convex mutation `pipeline:updateLeadStage` advancing stages and logging immutable audit records.

### 21 Sponsorship Packages & Proposal Management [COMPLETED]
Build the proposal request, dispatch logging, and deliverable management module.
- **UI:**
  - Proposal creation modal (`CreateProposalModal`) supporting 5 package tiers: `Title` (₹5L+), `Powered By` (₹3L+), `Associate` (₹1.5L+), `Custom`, `In-Kind`.
  - Deliverables selector with 10 standard items (stalls, main stage backdrop, passes, t-shirts, website branding) + custom deliverables text input.
  - Dispatch state selection (`Mark as Sent` vs `Save as Draft`) which automatically transitions lead status to `PROPOSAL_SENT` or `PROPOSAL_REQUESTED`.
  - Dossier proposals tab inside `CompanyDossierDrawer` listing all historical proposals with deliverables and valuation breakdown.
- **Logic:**
  - Convex collection `proposals` with `by_company_id`, `by_volunteer_id`, and `by_status` secondary indexes.
  - Convex mutations `proposals:createProposal` and `proposals:updateProposalStatus` with atomic status updates and audit logs.

### 22 Cash + 13 In-Kind Categories Tracking & Valuation [COMPLETED]
Build the non-cash sponsorship valuation and categorization system.
- **UI:**
  - Non-cash checkbox in `CreateProposalModal` and `OpportunityApprovalModal` supporting all 13 canonical categories: `PRODUCT`, `SERVICES`, `TECHNICAL_SUPPORT`, `WORKSHOP`, `SPEAKER`, `PRIZES`, `SOFTWARE`, `MERCHANDISE`, `VENUE`, `PRINTING`, `TRANSPORTATION`, `OTHER_IN_KIND` (+ `CASH`).
  - Fair-market INR valuation input and deliverable inventory description.
  - Dynamic dual-value calculation banner displaying `Total Deal Valuation = Cash Amount (₹) + In-Kind Estimated Valuation (₹)`.
- **Logic:**
  - Schema validation enforcing non-negative cash and in-kind valuation numbers.
  - Real-time pipeline aggregation queries calculating total liquid cash intake vs operational non-cash savings.

### 23 Admin Commitment Authorization Portal [COMPLETED]
Build the formal sponsorship commitment authorization console.
- **UI:**
  - Administrative authorization modal (`OpportunityApprovalModal`) accessible from `app/admin/commitments` for leads in `NEGOTIATION` and `CompanyDossierDrawer`.
  - Contractual summary card showing company profile, assigned SDR, agreed cash amount, in-kind valuation, deliverables checklist, MoU reference, and signing notes.
  - Prominent "Authorize & Ratify Sponsorship" signing trigger with exclusive core admin authority gate.
- **Logic:**
  - Convex mutation `pipeline:authorizeCommitment` strictly enforcing `user.role === 'admin'`.
  - Inserts formal binding record in `sponsorshipCommitments` collection, advances company `leadStatus: 'WON'`, accepts linked proposal, and creates immutable entry in `auditLogs`.

### 24 In-Workspace Event Information Panel [COMPLETED]
Build the internal reference panel for PRAROHA'26 deliverables.
- **UI:**
  - Contextual modal (`EventInfoModal`) accessible directly from the `/workspace` header action ("Event Deck & Tiers") and the left navigation sidebar ("Event Info").
  - 4 canonical reference tabs:
    1. **Sponsorship Tiers & Pricing**: Title (₹5L+), Powered By (₹3L+), Associate (₹1.5L+), Event Partner (₹50K+).
    2. **13 In-Kind Wishlist & Valuation**: Product/Beverages, Technical/Hardware, Printing & Signage, Software, Transportation, Merchandise.
    3. **Audience & Demographics**: 5,000+ student footfall, 45+ colleges, 3 days, ₹3L+ prize pool, engineering streams breakdown.
    4. **Brochure & Pitch Links**: One-click PDF download (`praroha-2026-sponsorship-brochure.pdf`), copy pitch link, and 20-second phone pitch script.
- **Logic:**
  - Embedded client-side modal with high-density token-compliant styling and accessible backdrop dismissal.

### 25 Company Relationship Timeline [COMPLETED]
Build the unified chronological interaction history on company dossiers.
- **UI:**
  - Embedded chronological activity stream (`CompanyTimeline`) inside `CompanyDossierDrawer` tab 4.
  - Shows vertical chronological sequence of calls, post-call debriefs, callback follow-up states, proposal dispatches, and ratified commitments with distinctive status badges and icons.
- **Logic:**
  - Convex query `pipeline:getCompanyRelationshipTimeline` aggregating and sorting records from `calls`, `callDebriefs`, `followUps`, `proposals`, and `sponsorshipCommitments`.

---

## Phase 6 — Modular AI Intelligence Layer (P2)

### 26 AI Company Intelligence Synthesis [COMPLETED]
Build the server-side Gemini AI action and UI for company background synthesis.
- **UI:**
  - Dedicated "AI Strategic Intelligence" tab in `CompanyDossierDrawer` and contextual overview quick-trigger.
  - Interactive `CompanyAIAnalysisCard` displaying company fit score meter (0-100), civil engineering synergy notes, regional Kerala presence, student demographic affinity, bulleted value propositions for sponsors, recommended contact departments, and confidence score.
  - Dynamic "Regenerate" trigger and non-blocking deterministic fallback notice.
- **Logic:**
  - Route handler `POST /api/ai/company-analysis` invoking `aiService.generateCompanyAnalysis(company)`.
  - Versioned prompt `lib/ai/prompts/companyAnalysis.ts` (`v1.0`) with strict anti-hallucination constraints.
  - Zod response schema `companyAnalysisSchema` in `lib/ai/schemas/index.ts`.
  - Persistent caching in Convex collection `aiAnalyses` with SHA-256 fingerprinting.

### 27 AI Call Preparation & Live Objection Battlecards [COMPLETED]
Build server-side generation of concise live talking points and tactical objection responses.
- **UI:**
  - `CallPreparationCard` embedded directly in `CompanyDossierDrawer` tab 3 ("Call Prep Battlecards").
  - Rapid 2-second glanceable bullet points designed specifically for a volunteer actively holding a phone:
    - Primary Call Objective
    - Natural Opening Angle (no rigid scripts)
    - Key PRAROHA'26 Stature Points
    - Direct Discovery Questions to Ask
    - Live Objection Counter-Strategies ("IF: [Objection] → RESPOND: [Counter-Phrase]")
    - In-Kind Fallback Pivots if budget is rejected
    - Next Immediate Step
- **Logic:**
  - Route handler `POST /api/ai/call-prep` calling `aiService.prepareCall(company)`.
  - Versioned prompt `lib/ai/prompts/callPreparation.ts` (`v1.0`).
  - Convex persistence and fallback in `lib/ai/fallback.ts`.

### 28 Alternative (In-Kind) Sponsorship Asks [COMPLETED]
Build the AI alternative sponsorship proposal generator across 13 non-cash categories.
- **UI:**
  - `AlternativeAskCard` embedded in both the "AI Strategic Intelligence" tab and "Proposals & In-Kind" tab of `CompanyDossierDrawer`.
  - Displays tailored non-cash opportunities across the 13 canonical categories (`PRODUCT`, `SERVICES`, `TECHNICAL_SUPPORT`, `WORKSHOP`, `SPEAKER`, `PRIZES`, `SOFTWARE`, `MERCHANDISE`, `VENUE`, `PRINTING`, `TRANSPORTATION`, `OTHER_IN_KIND`).
  - Shows estimated INR valuation, strategic value to PRAROHA'26, company feasibility score, and 1-click "Draft Proposal" pre-population trigger.
- **Logic:**
  - Route handler `POST /api/ai/alternative-ask` calling `aiService.generateAlternativeAsk(company)`.
  - Versioned prompt `lib/ai/prompts/alternativeAsk.ts` (`v1.0`).
  - Guaranteed sector alignment (e.g. concrete materials for cement firms, CAD/BIM credits for software firms, refreshments for FMCG).

### 29 AI Call Debrief Analysis & Volunteer Coaching [COMPLETED]
Build the automated debrief evaluation, signal extraction, and coaching engine.
- **UI:**
  - Contextual `DebriefAnalysisCard` embedded directly inside the `CallReportModal` below the discussion notes textarea.
  - Real-time "Analyze Debrief with AI" action evaluating volunteer notes or transcripts.
  - Displays detected outcome tag, interest level, positive signals, risk points/objections, volunteer coaching critique, and recommended callback timing.
  - 1-click "Apply AI Suggestions" button that automatically populates the form's outcome, interest level, and follow-up callback schedule while leaving 100% edit authority with the student volunteer.
- **Logic:**
  - Route handler `POST /api/ai/call-debrief` calling `aiService.analyzeCallDebrief(input)`.
  - Versioned prompt `lib/ai/prompts/callDebrief.ts` (`v1.0`).
  - Schema validation via `callDebriefSchema`.

### 30 Lead Prioritization Explanation & Factor Breakdown [COMPLETED]
Build the deterministic factor analysis and AI reasoning explainer.
- **UI:**
  - `LeadPriorityExplainer` popover component rendered beside lead priority badges in `CompanyDossierDrawer`.
  - Displays 4 deterministic baseline factor bars: Industry Synergies (/30), Civil Alignment (/25), Kerala Presence (/25), and Student Demographics (/20).
  - Clear bullet explanations of "Why contact this company now" and recommended immediate next action.
- **Logic:**
  - Route handler `POST /api/ai/lead-priority` invoking `aiService.prioritizeLead(company)`.
  - Enforces invariant that Gemini never hallucinates numerical baseline scores; explains deterministic baseline.

### 31 Operations-First AI Architecture & Resilience [COMPLETED]
Build the core Gemini AI service abstraction, caching layer, and zero-downtime fallback.
- **Architecture:**
  - Provider: Google Gemini API via official `@google/genai` SDK (`gemini-2.5-flash`).
  - Abstraction: `AIService` interface with `GeminiAIService` implementation (`lib/ai/service.ts`).
  - Server-Side Only: Client components call Next.js Route Handlers (`app/api/ai/*`), which call `AIService`. `GEMINI_API_KEY` is never exposed to browser bundles.
  - Operations-First Fallback: Complete deterministic fallback engine (`lib/ai/fallback.ts`) guaranteeing 100% application functionality when API keys are missing or external APIs are degraded.
  - Persistent Cache: Convex collection `aiAnalyses` with secondary indexes `by_company_and_type` and `by_input_hash`.

---

## Phase 7 — Team Management, Admin Dashboard & Gamification (P3)
 
### 32 Admin Executive Overview Dashboard [COMPLETED]
Build the high-level macro operational hub for sponsorship heads.
- **UI:**
  - Executive dashboard view (`components/admin/ExecutiveDashboardView.tsx`) mounted at `app/admin/page.tsx`.
  - 4 Bento KPI cards: Total Pipeline Value (Cash + In-Kind sum), Total Outbound Calls, Confirmed Corporate Commitments, and Active SDRs.
  - Daily outreach velocity area chart (Recharts) plotting completed calls, proposals sent, and deals won over the past 7 days.
  - Tab switcher to toggle between Executive Cockpit and Full Volunteer Honors Leaderboard.
- **Logic:**
  - Convex query `analytics:getExecutiveDashboard` aggregating data across `companies`, `sponsorshipCommitments`, `calls`, `proposals`, and `users`.

### 33 Volunteer Performance & Workload Analytics [COMPLETED]
Build individual volunteer performance tracking views.
- **UI:**
  - Personal performance card (`PersonalPerformanceCard`) embedded in the `/workspace` right rail: personal SDR rank, total points, total calls logged, deals won, and 1-click trigger to open the team Leaderboard.
  - Interactive Leaderboard modal (`LeaderboardPodium`) on `/workspace` for SDR peer benchmarking.
- **Logic:**
  - Real-time Convex query `gamification:getUserPointsSummary` returning user's active rank and stats.

### 34 Transactional Points Ledger & Rules Configuration [COMPLETED]
Build the gamification points ledger with idempotency guarantees.
- **UI:**
  - Discretionary points adjustment modal (`AdjustPointsModal`) for admins with quick preset buttons (+10, +25, +50, +100, -10, -25) and mandatory audit rationale.
  - Points badges and category indicators in the team leaderboard roster.
- **Logic:**
  - Convex collection `pointTransactions` with fields (`userId`, `points`, `reason`, `category`, `sourceId`, `awardedBy`, `createdAt`) and indexes `by_user_id`, `by_source_id`, `by_created_at`.
  - Mutation `gamification:awardPoints` enforcing idempotency via `sourceId` lookup before inserting.
  - Auto-awarding wired in `calls:logCallAndDebrief` (+10 base call, +15 decision-maker reached, +50 proposal requested) and in `pipeline:authorizeCommitment` (+200 deal won).
  - Admin adjustment mutation `gamification:adminAdjustPoints` asserting `admin` role and logging to `auditLogs`.

### 35 Real-Time Volunteer Leaderboard Podium [COMPLETED]
Build the real-time team rankings podium.
- **UI:**
  - `LeaderboardPodium` (`components/volunteer/LeaderboardPodium.tsx`):
    - Top 3 Podium Pedestals: Gold (1st), Silver (2nd), Bronze (3rd) with crown/medal badges, avatar initials, department/semester, points total, and conversion stats.
    - Full searchable team roster table with Rank, Volunteer details, Calls Logged, Deals Won, Total Points badge, and Admin "+/- Points" action button.
- **Logic:**
  - Convex query `gamification:getLeaderboard` returning real-time sorted SDR rankings and podium highlights.

### 36 Team Intelligence & Roadblock Insights [COMPLETED]
Build aggregated intelligence views on common outreach roadblocks and sector responsiveness.
- **UI:**
  - Objection Roadblocks card in `ExecutiveDashboardView`: proportional bars showing most frequent gatekeeper objections (e.g. "Budget already allocated", "Decision maker unreachable", "Timing doesn't align").
  - Sector Responsiveness card: conversion rates and total deals categorized by industry niche (Cement & Infrastructure, IT & Software, FMCG, Banking & Finance).
- **Logic:**
  - Convex query `analytics:getExecutiveDashboard` calculating objection counts from `callDebriefs` and conversion percentages from `companies`.

---

## Phase 8 — Supporting Features & Analytics (P4)

### 37 Notifications & Overdue Callback Alerters [COMPLETED]
Build in-app notification center and real-time badge alerters for due callbacks.
- **UI:**
  - `NotificationPopover` (`components/layout/NotificationPopover.tsx`) attached to the bell icon in `Navbar.tsx`.
  - Displays real-time unread count pill badge with pulse animation when items are due.
  - Interactive multi-tab card surfaces:
    - **Overdue Callbacks:** Highlighting corporate contact, overdue delta, and direct "Call Now" trigger.
    - **Today's Callbacks:** Categorized by due timestamp.
    - **Pending Verifications (Admin-only):** Real-time alerts for incoming volunteer registrations with 1-click review link.
    - **Points Earned (Volunteer-only):** Recent point awards and gamification milestone alerts.
  - "Dismiss All" trigger to clear active alerts.
- **Logic:**
  - Reactive Convex query `analytics:getNotificationAlerts` evaluating `followUps` (`dueDate < now`), `users` (`verificationStatus === 'pending'`), and `pointTransactions` (last 24 hours).

### 38 Global & Table Search and Advanced Filtering [COMPLETED]
Build universal search and multi-attribute filtering across the platform.
- **UI:**
  - `GlobalCommandPalette` (`components/search/GlobalCommandPalette.tsx`) triggered via `⌘K` / `Ctrl+K` keyboard shortcut or clicking the search bar in `Navbar.tsx`.
  - Instant fuzzy search across companies and contacts with highlight matches.
  - Quick System Actions: "Log an Outreach Call", "PRAROHA'26 Event Deck & Tiers", "View Volunteer Leaderboard", "Administrative Audit Trail".
  - Quick Navigation links: Volunteer Workspace, Assigned Companies, Pipeline Overview, Admin Verification Gate.
  - Direct call dialer shortcut (`tel:`) on contact search hits.
  - Multi-attribute filters in `LeadsTable` (`components/volunteer/LeadsTable.tsx`):
    - Sector filter dropdown (All Sectors, Cement & Concrete, IT & SaaS, Banking, Real Estate, etc.).
    - Contact Verification filter dropdown (All Contacts, Decision Makers, Company Reps, Official Line, Unverified).
    - Table density toggle button (Compact vs Normal row height).
- **Logic:**
  - Reactive Convex query `analytics:globalSearch` searching across normalized `companies` and `contacts`.

### 39 Audit Log Console & Data Export Hub [COMPLETED]
Build the administrative audit trail viewer and 1-click data export console.
- **UI:**
  - Mounted at `app/admin/analytics/page.tsx` with dual tab interface: "Administrative Audit Trail" and "1-Click Data Exports".
  - `AuditLogConsole` (`components/admin/AuditLogConsole.tsx`):
    - Filterable by Action (`create`, `update`, `delete`, `approve`, `reject`, `reassign`, `authorize`), Entity Type (`company`, `user`, `leadAssignment`, `commitment`, `pointTransaction`), and Actor.
    - Free text search across actions, entity IDs, and JSON change payloads.
    - Expandable JSON diff modal for inspection of modified attributes.
  - `DataExportHub` (`components/admin/DataExportHub.tsx`):
    - 3 Bento export cards:
      1. **Master Lead Directory:** Complete 29-field canonical schema CSV.
      2. **Outreach Calls & Voice Debriefs:** All call logs, duration, outcomes, objections, and next actions.
      3. **Ratified Sponsorship Commitments:** Financial cash + in-kind packages, deliverables count, and authorized MoU records.
    - 1-click CSV download using RFC-4180 compliant generator (`lib/export/csvExport.ts`).
- **Logic:**
  - Convex query `analytics:getAuditLogsFiltered` with indexed timestamp sorting (`by_timestamp`).
  - Convex query `analytics:getExportData` formatting normalized records for CSV generation.

---

## Phase 9 — Security Verification & Quality Assurance

### 40 End-to-End Authorization & Verification Boundary Verification [COMPLETED]
Verify server-side security rules, data access isolation, and exclusive administrative authorities.
- **Logic:**
  - **Server-Side Role & Verification Gates:**
    - `convex/users.ts`: Hardened `approveVolunteer`, `rejectVolunteer`, `suspendVolunteer`, and `setUserRole` to strictly verify `admin.role === "admin"`.
    - `convex/companies.ts`: Hardened `importLeadsBatch` and `createSingleLead` to strictly verify `admin.role === "admin"`.
    - `convex/calls.ts`: Enforced exclusive authority gate in `logCallAndDebrief` ensuring non-admins cannot advance deal status to `WON`.
    - `components/layout/DevPersonaSwitcher.tsx`: Locked out in production builds (`if (process.env.NODE_ENV === "production") return null;`).
  - **Automated Security Verification Suite (`convex/analytics:runSecurityBoundarySuite`):**
    - Mutation runs 8 automated assertion tests asserting zero-trust boundaries:
      1. *Unapproved Volunteer Isolation:* Users with `pending` verification status query zero company leads.
      2. *Peer Lead Isolation:* Approved volunteers can only query companies explicitly assigned to them; peer assignments are completely invisible.
      3. *Lead Reassignment Gate:* Non-admins cannot call `assignLeads` or reassign accounts.
      4. *Volunteer Verification Gate:* Non-admins cannot approve registrations in `approveVolunteer`.
      5. *Commitment Ratification Gate:* Non-admins cannot call `authorizeCommitment` or sign corporate agreements.
      6. *Deal Stage Restriction:* Non-admins cannot set company `leadStatus` to `WON`.
      7. *CSV Ingestion Gate:* Non-admins cannot call `importLeadsBatch` to insert company leads.
      8. *Points Adjustment Gate:* Non-admins cannot execute discretionary points adjustments.
    - Verified with 8 of 8 tests passing (`allPassed: true`).

### 41 Responsive & Accessibility Polish [COMPLETED]
Ensure visual excellence, responsive layout fidelity, and accessibility across all screen sizes and input methods.
- **UI:**
  - **Mobile Viewport Scaling (down to 375px):**
    - `Navbar.tsx`: Integrated mobile hamburger trigger (`lg:hidden`) and accessible slide-out mobile navigation drawer with backdrop blur, role badges, navigation links, user profile details, and sign-out button.
    - `app/workspace/page.tsx`: Wrapped desktop sidebar with `hidden lg:flex` and added `min-w-0` flex container containment to prevent horizontal page overflow.
    - `app/admin/layout.tsx`: Wrapped desktop admin sidebar with `hidden lg:flex` and added `min-w-0` to admin main area.
    - `components/admin/CompanyDossierDrawer.tsx`: Added `overflow-x-auto no-scrollbar` to tabs row for small mobile screens.
    - `components/volunteer/LeadsTable.tsx`: Full horizontal scroll container (`overflow-x-auto`) preserving high-density data grid usability on narrow screens.
  - **WCAG-AA Accessibility & Keyboard Navigation:**
    - High-contrast focus rings upgraded across all interactive primitives (`components/ui/button.tsx`): `focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden`.
    - `CallModeOverlay.tsx`: Added high-contrast `focus-visible` styling to all 9 quick outcome buttons for zero-mouse keyboard execution.
    - Accessible dialogs and drawers with `role="dialog"`, `aria-modal="true"`, and native `Escape` key listeners.
- **Verification:**
  - Full production build (`npm run build`) passing 18/18 routes in 3.5s with zero errors.
  - Strict TypeScript check (`npx tsc --noEmit`) passing with 0 errors.
  - Browser subagent verification at 375x720 mobile viewport and desktop keyboard tab focus.
