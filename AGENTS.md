# PRAROHA'26 Sponsorship Outreach & Volunteer Execution System – Principal Engineering Manual & AI Agent Guidelines

Welcome to the **PRAROHA'26 Sponsorship Outreach & Volunteer Execution System** engineering environment.

You are acting as a **Principal Software Architect, Staff Engineer, and AI Systems Designer**. Your primary directive is to design, implement, and maintain an internal, high-velocity operational workspace designed specifically for the sponsorship committee of PRAROHA'26 — the annual flagship national techno-managerial festival at the School of Engineering, Cochin University of Science and Technology (CUSAT).

This document serves as the absolute source of truth for architectural decisions, implementation workflows, coding standards, and domain logic. Adhere strictly to these guidelines. Deviations are unacceptable unless explicitly authorized through architectural review.

---

## 1. Product Philosophy & Directives

### 1.1 What This System IS and IS NOT

**This is NOT:**
- A public event website
- A landing page or marketing site
- A general event-management SaaS
- A ticketing platform
- A generic customer relationship manager (CRM)
- An AI-first chatbot or autonomous sales agent

**This IS:**
- An internal **"SPONSORSHIP OUTREACH & VOLUNTEER EXECUTION SYSTEM"**
- A dedicated operational cockpit built for the student sponsorship committee of PRAROHA'26 (Civil Engineering Department, SOE CUSAT).

### 1.2 The Primary Users
1. **ADMIN / SPONSORSHIP HEAD:** Controls lead ingestion, validates CSV imports, resolves company duplicates, assigns leads, monitors outreach velocity, audits call reports and voice debriefs, manages sponsorship packages and proposals, configures gamification points, and exercises exclusive signing authority over corporate commitments.
2. **VOLUNTEER / STUDENT SDR:** Works inside a focused, single-page outreach workstation (`/workspace`). Studies company intelligence and contact verification, reviews concise talking points, enters Call Mode, speaks with corporate decision-makers, records structured outcomes or voice debriefs, schedules follow-ups, and advances sponsorship deals through the pipeline.

### 1.3 Core Product Principle: Operations First, AI Second
The fundamental system hierarchy is:
```
LEADS → CALLS → FOLLOW-UPS → PROPOSALS → NEGOTIATION → SPONSORSHIP
```
AI acts as an intelligence layer that assists this workflow at each step (company dossiers, talking points, objection guidance, voice debrief transcription, call analysis). 

**Critical Rule:** AI IS NOT THE CORE PRODUCT. The application must remain completely useful, responsive, and functional even if external LLM/STT services are degraded or offline.

### 1.4 Engineering Tenets
- **Zero Technical Debt Intent:** Clean, maintainable, modular, and self-documenting code from day one.
- **Strict Typing:** TypeScript strict mode is non-negotiable. `any` is strictly prohibited.
- **Single-Page Volunteer Workstation:** The volunteer experience is strictly unified inside `/workspace` using contextual drawers, dialogs, and a focused Call Mode overlay. Zero multi-page tab hopping.
- **Security by Default:** Zero-trust architecture. Clerk manages identity, but Convex independently validates authorization, roles, and verification status for all data queries and mutations.
- **Aesthetic Excellence:** Serious, polished, corporate, 2026-quality UI. Not playful SaaS, no neon purple/pink AI styles, and no excessive gradients.

---

## 2. Technology Stack

Our stack is chosen for maximum real-time performance, developer velocity, and operational reliability. **Under no circumstances should alternative infrastructure (e.g., Supabase, Firebase, standard PostgreSQL, Prisma, MongoDB) be introduced.**

### 2.1 Core Stack
- **Frontend Framework:** Next.js (App Router) with React
- **Language:** TypeScript (Strict Mode)
- **Styling & UI:** Tailwind CSS v4, shadcn/ui component primitives, Lucide React icons
- **Backend & Database:** Convex (Single source of truth for Database, Serverless Functions, File Storage, and Realtime Engine)
- **Authentication:** Clerk (Cloud authentication, session tokens, and OAuth identity)
- **File Storage:** Convex File Storage (Debrief audio recordings, event brochures, pitch collateral)
- **Forms & Validation:** React Hook Form + Zod
- **Data Grids & Charts:** TanStack Table and Recharts
- **Micro-Animations:** Framer Motion (drawers, modal backdrops, call mode focus transitions)

### 2.2 Backend Constraints
- **Convex is the ONLY backend.** It serves as our database, serverless backend, real-time subscription engine, and audio file store.
- External API keys (LLM, Whisper STT) are confined strictly to Convex Actions. Never expose third-party API keys to client bundles.

---

## 3. Feature Priorities (P0 → P5)

Every architectural decision and development task must strictly respect this priority sequence:

### P0 — CORE / ESSENTIAL
1. **Authentication & Volunteer Verification:** Clerk auth + mandatory 4-field registration (Full Name, Phone, Semester, Department) + Admin verification gate (`/admin/verifications`).
2. **Lead Database:** Relational company and contact records with search, sector filtering, and priority indicators.
3. **Lead Import / CSV Management:** Drag-and-drop CSV upload, 29-field canonical schema parsing, validation, duplicate detection, and import preview.
4. **Lead Assignment:** Admin assignment matrix, workload balancing, and volunteer lead isolation.
5. **Company & Contact Intelligence:** Detailed dossiers, contact verification status, and phone type classification.
6. **Lead Status Management:** Exact 10-stage lifecycle (`UNASSIGNED` to `WON`/`LOST`).
7. **Call Mode:** Minimalist, high-focus in-call overlay with 9 quick outcome buttons.
8. **Call Outcome / Debrief:** Structured logging + in-browser voice debrief recording with volunteer review/edit before saving.
9. **Follow-Up Management:** Due-today, upcoming, and overdue callbacks prominently surfaced.

### P1 — SPONSORSHIP OPERATIONS
10. **Sponsorship Pipeline:** Visual stage progression and aggregate pipeline financial metrics.
11. **Sponsorship Package Management:** Tier definitions (Title, Powered By, Associate, Custom, In-Kind).
12. **Cash + Non-Cash / In-Kind Tracking:** 13 non-cash categories + estimated monetary valuation.
13. **Proposal Management:** Proposal requests, dispatch logging, and deliverable commitments.
14. **Company Relationship Timeline:** Historical chronological record of all calls, debriefs, notes, and stage changes.
15. **Event Information Panel:** Internal reference modal/drawer for PRAROHA'26 deliverables, audience demographics, and brochure.

### P2 — AI ASSISTANCE (Modular Intelligence Layer)
16. **AI Company Intelligence:** Contextual synthesis of company alignment with PRAROHA'26.
17. **AI Call Preparation:** Concise talking points and natural conversation openings (no rigid scripts).
18. **AI Objection Handling:** Tactical responses for common collegiate sponsorship objections.
19. **Voice Transcription:** Server-side Whisper transcription of volunteer post-call audio debriefs.
20. **AI Call Analysis:** Automated extraction of outcomes, decision-maker status, objections, and next actions.
21. **AI Sponsorship Recommendation:** Suggested tiers, ask ranges, and in-kind partnership angles (clearly labeled as recommendations, not facts).

### P3 — TEAM MANAGEMENT
22. **Admin Dashboard:** High-level metrics for pipeline value, outreach volume, and active volunteers.
23. **Volunteer Performance:** Individual conversion rates, calls logged, and verified activity.
24. **Points System:** Configurable transactional points ledger with idempotency guarantees.
25. **Leaderboard:** Real-time team ranking podium.
26. **Team Intelligence:** Aggregated insights into outreach roadblocks and conversion bottlenecks.

### P4 — SUPPORTING FEATURES
27. **Notifications:** Follow-up alerts and verification state updates.
28. **Search:** Global and table-specific fuzzy search across companies and contacts.
29. **Filtering:** Advanced multi-attribute filters (tier, sector, priority, verification level).
30. **Advanced Lead Views:** Density controls and column sorting.
31. **Activity History:** Immutable audit trail for administrative mutations.

### P5 — FUTURE / DO NOT PRIORITIZE NOW
32. Email automation
33. WhatsApp integration
34. Automatic web lead scraping
35. Third-party contact enrichment APIs
36. Advanced sales predictive analytics
37. External CRM integrations

---

## 4. Volunteer Experience: Single-Page Workspace Rule

The volunteer experience is **STRICTLY SINGLE-PAGE** on `/workspace`. 

Do NOT create separate pages or sub-tabs for Leads, Companies, Calls, Follow-ups, or Event Info. Everything a student volunteer needs during outreach must remain accessible in context:

1. **Today's Work:** Top action bar displaying daily call quota progress, calls remaining, overdue follow-ups, today's callbacks, and high-priority leads.
2. **Lead List:** High-density table displaying Company, Contact, Niche, Priority, Status, and Next Action with one-click drawer triggers.
3. **Company Detail Drawer / Modal:** Slide-over drawer containing:
   - **Company:** Name, industry, niche, size, revenue, Kerala presence, relevant projects, sponsorship history, sponsorship evidence, why good lead, why company benefits, sponsorship potential, recommended approach.
   - **Contact:** Name, designation, phone, phone type, email, LinkedIn, contact verification level, contact source.
   - **Call Preparation:** Concise talking points, key facts, discovery questions, likely objections, non-cash alternatives, and budget guidance. (NO long rigid scripts).
4. **Call Mode:** When clicking "Start Call", the UI transitions into a minimal, zero-distraction view showing contact details, phone number, concise talking points, and 9 quick outcome buttons:
   - `Interested`
   - `Asked for proposal`
   - `Asked for budget`
   - `Wrong person`
   - `Call back`
   - `Rejected`
   - `Non-cash opportunity`
   - `Meeting requested`
   - `Other`
5. **After Call (Voice Debrief):** Volunteer records natural voice summary $\rightarrow$ transcribed via Whisper $\rightarrow$ AI extracts key structured fields $\rightarrow$ Volunteer reviews and edits all fields before committing to database.

---

## 5. CSV Lead Import & Duplicate Engine (Canonical Schema)

The admin must be able to upload a spreadsheet with the following canonical 29-field CSV format:

```csv
company_name,industry,niche,priority,lead_score,contact_name,contact_designation,phone,email,location,website,linkedin,company_size,annual_revenue,kerala_presence,sponsorship_history,sponsorship_evidence,why_good_lead,why_company_benefits,recommended_sponsorship_type,recommended_ask_min,recommended_ask_max,alternative_support,source,source_url,contact_source,contact_verified,notes,lead_status
```

### Required Fields:
`company_name`, `industry`, `niche`, `priority`, `contact_name`, `contact_designation`, `phone`

### Import Flow:
`UPLOAD CSV → PARSE → VALIDATE → DUPLICATE DETECTION → IMPORT PREVIEW → ADMIN CONFIRMS → BATCH INSERT → UNASSIGNED POOL → ASSIGN VOLUNTEERS`

- **Duplicate Detection Keys:**
  1. Normalized Company Name
  2. Company Name + Phone Number
  3. Company Name + Email Address
  4. Company Website / Domain
- **Conflict Actions:** `Skip`, `Merge`, or `Import as New Contact`.
- **Note:** Do NOT require volunteer assignment columns in the CSV. Assignment is strictly an admin operation post-import.

---

## 6. Contact Verification Standard

A phone number must **never** be assumed to be a verified sponsorship decision-maker.

### Phone Type Classification:
- `direct_official`: Direct mobile or extension of the decision-maker
- `office`: Official branch/regional office desk
- `regional_office`: Kerala / South India regional headquarters
- `department`: Marketing, HR, or CSR department phone
- `switchboard`: General corporate reception switchboard
- `unknown`: Unverified origin

### Contact Verification Levels:
- `VERIFIED_DECISION_MAKER`: Confirmed brand manager, CMO, regional marketing head, or CSR director
- `VERIFIED_COMPANY_REPRESENTATIVE`: Confirmed company employee or coordinator
- `OFFICIAL_COMPANY_CONTACT`: Official public corporate contact line
- `UNVERIFIED`: Scraped, crowd-sourced, or unconfirmed contact

*Rule: Never label generic customer care, local retail dealer numbers, or unrelated employee lines as verified contacts. UI must clearly distinguish contact quality.*

---

## 7. Lead Status & Sponsorship Taxonomy

### Lead Status Lifecycle (Strict 10 Stages):
`UNASSIGNED` → `ASSIGNED` → `CONTACTED` → `INTERESTED` → `FOLLOW_UP` → `PROPOSAL_REQUESTED` → `PROPOSAL_SENT` → `NEGOTIATION` → `WON` | `LOST`

### Sponsorship Categories (Cash + In-Kind):
- `CASH`
- `PRODUCT` (Beverages, snacks, electronics, gadgets)
- `SERVICES` (Logistics, media coverage, streaming)
- `TECHNICAL_SUPPORT` (Equipment, sound, lighting)
- `WORKSHOP` (Technical masterclass sponsorship)
- `SPEAKER` (Keynote session sponsorship)
- `PRIZES` (Hackathon or competition prizes)
- `SOFTWARE` (Cloud credits, licenses, dev tools)
- `MERCHANDISE` (Volunteer/participant t-shirts, kit bags)
- `VENUE` (Facility or stage setup)
- `PRINTING` (Flex banners, brochures, certificates)
- `TRANSPORTATION` (Travel partner)
- `OTHER_IN_KIND`

*Rule: Non-cash partnerships must track both in-kind item descriptions and estimated monetary valuation in INR.*

---

## 8. Engineering Workflow (Prompt-First)

Every development task must follow this sequence:
1. **Context Acquisition:** Read `AGENTS.md` and relevant `context/*.md` files.
2. **Codebase Inspection:** Verify existing patterns, shared UI primitives in `components/ui/`, and Convex schemas.
3. **Implementation Plan & Prompt Creation:** Draft plan adhering to the standard template and save in `prompts/`.
4. **Approval Gate:** Confirm plan before generating large-scale code changes.
5. **Implementation:** Build components and backend functions cleanly.
6. **Validation:** Execute typecheck, lint, and build checks.
7. **Manual Testing Instructions:** Provide precise reproduction and validation steps.

---
*End of PRAROHA'26 Engineering Manual. Proceed with operational rigor.*

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
