# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Admin / Sponsorship Head**: Head of the student sponsorship committee (Civil Engineering Department, SOE CUSAT). Oversees festival revenue targets, ingests external corporate lead spreadsheets, resolves duplicate company/contact collisions, allocates leads across the assignee roster with workload balancing, audits call reports and voice debriefs, configures gamification rules, and exercises exclusive signing authority over corporate commitments and formal MoUs.
- **Volunteer / Student SDR**: Student committee member conducting outbound corporate sponsorship outreach. Works exclusively within a single-page outreach workstation (`/workspace`), studies company background dossiers and verified contact intelligence, enters high-focus Call Mode to dial decision-makers, logs structured call outcomes or records in-browser audio debriefs, reviews AI-extracted fields before committing, schedules follow-ups, and advances sponsorship deals through the pipeline.

## Product Purpose

- Deliver a mission-critical, high-velocity operational cockpit engineered specifically for the student sponsorship committee of PRAROHA'26 (the annual flagship national techno-managerial festival at School of Engineering, Cochin University of Science and Technology).
- Replace scattered spreadsheets, chaotic WhatsApp groups, and lost notes with a structured, reliable execution workflow: `LEADS → CALLS → FOLLOW-UPS → PROPOSALS → NEGOTIATION → SPONSORSHIP`.
- Success means meeting and exceeding festival sponsorship revenue targets, preventing duplicate calling embarrassments, maximizing volunteer dial velocity, and providing complete administrative auditability over corporate commitments.

## Positioning

- **Operations First, AI Second**: Built specifically for collegiate student sponsorship teams calling corporate decision-makers. AI acts as a modular intelligence layer (company intelligence synthesis, concise talking points, objection rebuttals, Whisper debrief transcription, and call analysis), but the entire application remains 100% operational, responsive, and functional even if external LLM/STT services are degraded or offline.
- **Dedicated Internal Operational Cockpit**: This is not a public event portal, not a ticketing platform, not a marketing landing page, and not a generic sales CRM or automated robodialer. It is custom-built around the specific rituals, constraints, and hierarchy of university festival sponsorship.

## Operating Context

- **Event Timeline & Location**: PRAROHA'26 will take place on December 04–05, 2026 at the School of Engineering, CUSAT campus in Kochi, Kerala.
- **Outreach Environment**: Student volunteers conduct outreach between classes, in structured evening calling shifts, or from hostel rooms. High-density, fast-loading, keyboard-friendly UI with zero tab hopping is mandatory.
- **Volunteer Experience**: Strictly unified inside `/workspace`. Drawers, dialogs, and a focused Call Mode overlay maintain spatial continuity without multi-page navigation.
- **Administrative Experience**: Centralized control center (`/admin`) for CSV ingestion, lead assignment matrices, registration verifications, pipeline metrics, and debrief audits.

## Capabilities and Constraints

- **Strict 10-Stage Lifecycle**: `UNASSIGNED` → `ASSIGNED` → `CONTACTED` → `INTERESTED` → `FOLLOW_UP` → `PROPOSAL_REQUESTED` → `PROPOSAL_SENT` → `NEGOTIATION` → `WON` | `LOST`.
- **Canonical 29-Field CSV Import**: Automated 4-key duplicate detection (normalized company name, company + phone, company + email, website domain) with Skip, Merge, or New Contact resolution.
- **Contact Verification Standard**: Strict classification of phone types (`direct_official`, `office`, `regional_office`, `department`, `switchboard`, `unknown`) and contact verification tiers (`VERIFIED_DECISION_MAKER`, `VERIFIED_COMPANY_REPRESENTATIVE`, `OFFICIAL_COMPANY_CONTACT`, `UNVERIFIED`). Generic customer care numbers are never represented as verified decision-makers.
- **Call Mode & Audio Debrief**: High-focus calling overlay with 9 quick outcome buttons (`Interested`, `Asked for proposal`, `Asked for budget`, `Wrong person`, `Call back`, `Rejected`, `Non-cash opportunity`, `Meeting requested`, `Other`). In-browser voice recording transcribed via Whisper with AI field extraction, with mandatory volunteer review and edit before database commit.
- **Dual Cash & In-Kind Valuation**: Full tracking of `CASH` (in INR) alongside 13 non-cash/in-kind categories (`PRODUCT`, `SERVICES`, `TECHNICAL_SUPPORT`, `WORKSHOP`, `SPEAKER`, `PRIZES`, `SOFTWARE`, `MERCHANDISE`, `VENUE`, `PRINTING`, `TRANSPORTATION`, `OTHER_IN_KIND`), requiring an estimated monetary valuation in INR for every agreement.
- **Role-Aware Assignment Matrix**: Admins and approved volunteers can both receive lead allocations and execute calls without account downgrade.
- **Backend & Security Stack**: Convex is the ONLY backend (database, serverless functions, real-time subscriptions, file storage). Clerk handles authentication and session identity; Convex enforces independent authorization, role checks, and verification gates. Next.js 15 App Router, TypeScript strict mode (zero `any`), Tailwind CSS v4. External API keys are confined strictly to Convex Actions.

## Brand Commitments

- **Entity**: PRAROHA'26, hosted by the Civil Engineering Department, School of Engineering, Cochin University of Science and Technology (CUSAT).
- **Tone & Voice**: Serious, professional, operational, and disciplined. High-velocity engineering tool, not a playful consumer SaaS.
- **Color Discipline**: Warm ivory canvas (`#F7F7F0`), clean crisp surfaces (`#FFFFFF`), primary teal (`#237E72` / `#14B89A`), and deep forest/slate (`#203B35`). Dark mode: deep charcoal/navy canvas (`#0B131E`), layered dark surfaces (`#121D2C`, `#172436`), borders (`#22344B`), and high-contrast typography (`#F1F5F9`). No saturated neon purple or pink AI aesthetics.

## Evidence on Hand

- Authoritative festival dates (December 04–05, 2026, SOE CUSAT) and tier deliverables documented in `context/project-overview.md` and `context/architecture.md`.
- Live production codebase with 30 Next.js routes, Clerk authentication, Convex database schemas, and assigned lead management.
- Absence of automated web scraping or third-party contact enrichment APIs: external enrichment APIs are deliberately out of scope (P5).

## Product Principles

1. **Operations First, AI Second**: The entire outreach, calling, and sponsorship tracking workflow must remain fully functional and responsive even if AI services are degraded or offline.
2. **Single-Page Volunteer Workstation**: Volunteers work exclusively inside `/workspace`; contextual drawers and modal overlays prevent cognitive friction and tab-hopping.
3. **Contact Truth Over Volume**: Never label generic customer care, reception switchboards, or unverified lines as verified contacts. Protect volunteer time by maintaining transparent phone and verification classifications.
4. **Exclusive Administrative Signing Authority**: Only designated committee administrators can formally commit sponsorship packages, discount codes, cash values, and MoUs.
5. **Dual Valuation of Partnerships**: Track both in-kind deliverable descriptions and estimated monetary valuation in INR for every non-cash agreement to ensure accurate pipeline reporting.

## Accessibility & Inclusion

- WCAG 2.1 AA contrast compliance across both Light and Dark themes.
- Clear, visible keyboard focus rings on all interactive elements.
- Explicit textual labels and ARIA attributes accompanying all icons and action buttons.
- High information density designed with legible typography and generous click/tap targets for rapid calling shifts.
