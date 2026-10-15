# Project Overview

## 1. Product Definition

The **PRAROHA'26 Sponsorship Outreach & Volunteer Execution System** is an internal, high-velocity operational workspace designed specifically for the student sponsorship committee of PRAROHA'26 — the annual flagship national techno-managerial festival hosted by the Civil Engineering Department at the School of Engineering, Cochin University of Science and Technology (CUSAT).

### What This System IS and IS NOT

**This is NOT:**
- A public event website or visitor portal
- A marketing landing page
- A general event-management SaaS
- A ticketing platform
- A generic customer relationship manager (CRM)
- An autonomous sales bot or automated dialer

**This IS:**
- A dedicated, high-density **"SPONSORSHIP OUTREACH & VOLUNTEER EXECUTION SYSTEM"**
- A mission-critical operational tool for collegiate sponsorship acquisition, tracking, and volunteer execution.

---

## 2. Primary Users & Core Workflow

The system is engineered around two distinct operational roles:

### 1. ADMIN / SPONSORSHIP HEAD
- Ingests external corporate leads via the canonical CSV Import wizard.
- Validates imported data and resolves duplicate company/contact collisions.
- Distributes and reassigns leads across the verified volunteer roster using the Assignment Matrix.
- Monitors live outreach velocity, pending callbacks, and overdue follow-up alerts.
- Reviews and audits submitted call reports, audio debriefs, and AI transcripts.
- Authorizes and formally commits sponsorship proposals, packages, cash figures, and in-kind valuations (exclusive administrative signing authority).
- Oversees team productivity, configures gamification point rules, and tracks festival revenue targets.

### 2. VOLUNTEER / STUDENT SDR
- Works exclusively within a single-page outreach workstation (`/workspace`).
- Views assigned corporate leads, daily call quotas, and due callbacks.
- Opens company dossiers to study verified contact intelligence, past festival history, and concise talking points.
- Enters **Call Mode** — a focused, distraction-free calling overlay equipped with contact details and 9 quick outcome buttons.
- Completes post-call self-debriefs via in-browser voice recording or structured text.
- Reviews and edits AI-extracted call intelligence before committing the report to the database.
- Schedules structured follow-ups and advances leads along the sponsorship pipeline.

---

## 3. Core Product Principle: Operations First, AI Second

The fundamental operational hierarchy of the system is:
```
LEADS
  ↓
CALLS
  ↓
FOLLOW-UPS
  ↓
PROPOSALS
  ↓
NEGOTIATION
  ↓
SPONSORSHIP
```

AI serves as a modular intelligence layer that assists volunteers and administrators at each phase (company research synthesis, concise talking points, objection rebuttals, voice debrief transcription, call analysis, and tier recommendations).

**Architectural Invariant:** AI IS NOT THE CORE PRODUCT. The entire application must remain 100% operational, usable, and robust even if third-party AI/LLM APIs are temporarily degraded or offline.

---

## 4. Feature Priorities (P0 → P5)

Development, schema design, and UI architecture are organized strictly according to these priorities:

### P0 — CORE / ESSENTIAL
1. **Authentication & Volunteer Verification:** Clerk identity integration + mandatory 4-field registration modal (Full Name, Phone Number, Semester, Department) + Admin verification gate (`/admin/verifications`).
2. **Lead Database:** Structured relational store for companies and contacts with instant search, sector tags, and priority rankings.
3. **Lead Import / CSV Management:** Canonical 29-field CSV parser, pre-flight schema validation, duplicate detection, and import preview.
4. **Lead Assignment:** Administrative assignment matrix, workload balancing, and volunteer data isolation.
5. **Company & Contact Intelligence:** Complete company profiles, verified decision-maker tagging, and phone type classification.
6. **Lead Status Management:** Exact 10-stage lifecycle (`UNASSIGNED` to `WON`/`LOST`).
7. **Call Mode:** High-focus, distraction-free in-call interface with 9 quick outcome buttons.
8. **Call Outcome / Debrief:** Post-call report form + in-browser voice debrief recording with mandatory volunteer review/edit before saving.
9. **Follow-Up Management:** Prominent widgets for overdue, today's, and upcoming callbacks.

### P1 — SPONSORSHIP OPERATIONS
10. **Sponsorship Pipeline:** Kanban and table visualizers tracking lead stage progression and aggregate financial pipeline values.
11. **Sponsorship Package Management:** Formal tier definitions (Title, Powered By, Associate, Custom, In-Kind).
12. **Cash + Non-Cash / In-Kind Tracking:** Comprehensive tracking of 13 non-cash categories with estimated monetary valuation.
13. **Proposal Management:** Proposal requests, deliverable tracking, deck dispatch logging, and MoU attachment.
14. **Company Relationship Timeline:** Unified chronological history of all calls, debriefs, notes, and volunteer handoffs.
15. **Event Information Panel:** Internal reference modal/drawer detailing PRAROHA'26 dates, student demographics, deliverables, and official brochure.

### P2 — AI ASSISTANCE (Modular Intelligence Layer)
16. **AI Company Intelligence:** Contextual synthesis connecting target company marketing objectives with PRAROHA'26.
17. **AI Call Preparation:** Concise talking points, key facts, and discovery questions (NO long rigid scripts).
18. **AI Objection Handling:** Tailored responses for collegiate sponsorship objections.
19. **Voice Transcription:** Server-side Whisper transcription of volunteer post-call audio debriefs.
20. **AI Call Analysis:** Automated extraction of outcomes, decision-maker status, objections, and next actions.
21. **AI Sponsorship Recommendation:** Suggested packages, ask ranges, and in-kind angles (clearly labeled as recommendations).

### P3 — TEAM MANAGEMENT
22. **Admin Dashboard:** High-level metrics for total pipeline, cash vs. in-kind commitments, and outreach volume.
23. **Volunteer Performance:** Individual conversion rates, calls logged, and verified activity.
24. **Points System:** Configurable transactional points ledger with idempotency guarantees.
25. **Leaderboard:** Real-time team ranking podium celebrating verified effort and closed sponsorships.
26. **Team Intelligence:** Aggregated insights into common gatekeeper roadblocks and objections.

### P4 — SUPPORTING FEATURES
27. **Notifications:** Alerts for due callbacks and registration approvals.
28. **Search:** Global and table-specific fuzzy search across companies and contacts.
29. **Filtering:** Advanced multi-attribute filters (tier, sector, priority, verification level).
30. **Advanced Lead Views:** Density controls and column sorting.
31. **Activity History:** Immutable audit trail for administrative mutations.

### P5 — FUTURE / DO NOT PRIORITIZE NOW
32. Email automation
33. WhatsApp community integration
34. Automatic web lead discovery/scraping
35. Third-party contact enrichment APIs
36. Advanced predictive sales analytics
37. External CRM integrations

---

## 5. Volunteer Experience: Single-Page Workspace

The volunteer interface is **STRICTLY SINGLE-PAGE** on `/workspace`. Multi-page tab routing for volunteers is prohibited. Everything a student volunteer requires remains accessible in context:

### 1. Today's Work (Top Command Bar)
- Daily outreach progress: calls completed vs. target quota (e.g., 9 / 15 calls).
- Calls remaining for the active shift.
- Overdue follow-ups badge (high-urgency warning).
- Follow-ups due today counter.
- High-priority leads indicator.

### 2. Lead List (Primary Workstation Section)
Dense, readable table displaying:
- **Company Name:** With industry and niche pills.
- **Contact:** Decision-maker name, designation, and phone.
- **Priority:** High, Medium, or Normal.
- **Status:** Current 10-stage lifecycle badge.
- **Next Action:** Next scheduled callback or deliverable deadline.
- **Row Actions:** "Open Dossier", "Start Call", and "Quick Notes".

### 3. Company Detail Drawer / Modal
When clicking a lead, a contextual drawer slides in displaying:
- **Company Profile:** Company name, industry, niche, company size, annual revenue, Kerala regional presence, relevant projects, sponsorship history, sponsorship evidence, why this is a good lead, why the company benefits from PRAROHA, sponsorship potential, and recommended approach.
- **Contact Intelligence:** Contact name, designation, direct phone, phone type, email, LinkedIn URL, contact verification level, and contact source.
- **Call Preparation (Concise Talking Points):** 3–5 tailored talking points, key PRAROHA'26 facts, probing discovery questions, likely objections with counter-responses, non-cash alternative options, and budget response guidance.  
  *(Crucial Rule: Provide concise bullet points that enable natural student conversation. Never generate long, rigid, memorized scripts).*

### 4. Call Mode (High-Focus In-Call Overlay)
When clicking **"Start Call"**, the UI transitions into a minimal, focused overlay:
- Contact Name, Designation, and Company Name.
- Clickable telephone number with direct dial trigger.
- Contact verification level badge.
- Sticky concise talking points & key facts reference.
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

### 5. After Call & Voice Debrief
- **Voice Debrief Option:** The volunteer records a 30–90 second natural recollection immediately after hanging up (*"Spoke to the regional marketing manager. Interested in student footfall. Asked for the brochure and requested a callback next Tuesday."*).
- **Transcription & Structured Extraction:** Transcribed via Whisper, extracting:
  - Outcome tag
  - Interest level (High, Medium, Low, None)
  - Decision-maker status
  - Primary objection raised
  - Important company information learned
  - Requested action from festival team
  - Next action to perform
  - Follow-up date and time
- **Mandatory Volunteer Verification:** The volunteer reviews and edits all generated fields before confirming submission.

---

## 6. Admin Experience

The administrative layout provides structured oversight across the campaign:
- **CSV Import Wizard:** Upload, validate, detect duplicates, and preview spreadsheet imports.
- **Lead Assignment Matrix:** Bulk assign unassigned leads and reassign active accounts with workload balancing.
- **Verification Queue (`/admin/verifications`):** Approve or reject first-time student registrations.
- **Call Report & Debrief Audit Console:** Listen to debrief recordings, inspect transcripts, and verify outreach quality.
- **Pipeline & Proposal Authorization:** Exclusive authority to approve sponsorship packages, discount codes, MoUs, and cash/in-kind commitments.
- **Event Information CMS:** Edit PRAROHA'26 deliverable collateral, pricing tiers, and brochure assets.
- **Points Ledger & Leaderboard Config:** Configure gamification point values and audit awards.

---

## 7. CSV Lead Import System (Canonical Schema)

Admin spreadsheet imports must conform to the canonical 29-field CSV schema:

```csv
company_name,industry,niche,priority,lead_score,contact_name,contact_designation,phone,email,location,website,linkedin,company_size,annual_revenue,kerala_presence,sponsorship_history,sponsorship_evidence,why_good_lead,why_company_benefits,recommended_sponsorship_type,recommended_ask_min,recommended_ask_max,alternative_support,source,source_url,contact_source,contact_verified,notes,lead_status
```

### Required Fields:
1. `company_name`
2. `industry`
3. `niche`
4. `priority`
5. `contact_name`
6. `contact_designation`
7. `phone`

*All other 22 fields are optional and ingest rich background intelligence if provided.*  
*Note: Assignment fields are strictly omitted from the CSV. Volunteer assignment occurs via the Admin Assignment Matrix after import.*

### Import Pipeline & Duplicate Detection:
`UPLOAD CSV → PARSE → VALIDATE → DUPLICATE DETECTION → IMPORT PREVIEW → ADMIN CONFIRMS → IMPORT → UNASSIGNED POOL`

- **Duplicate Detection Matches on:**
  1. Normalized Company Name
  2. Company Name + Phone Number
  3. Company Name + Email Address
  4. Company Website / Domain
- **Conflict Resolution Options:**
  - `Skip`: Ignore incoming row
  - `Merge`: Update existing company intelligence without overwriting active lead status
  - `Import as New Contact`: Create secondary contact under the existing company record

---

## 8. Contact Verification Standards

To prevent volunteers from dialing customer service desks or random scraped numbers:

### Phone Type Classification:
- `direct_official`: Direct personal mobile or office extension of the decision-maker
- `office`: Official branch/regional office line
- `regional_office`: Kerala / South India corporate office
- `department`: Marketing, HR, or CSR department line
- `switchboard`: Central corporate reception switchboard
- `unknown`: Unverified origin

### Contact Verification Levels:
- `VERIFIED_DECISION_MAKER`: Confirmed sponsorship decision-maker (Brand Manager, CMO, CSR Head)
- `VERIFIED_COMPANY_REPRESENTATIVE`: Confirmed corporate employee or internal coordinator
- `OFFICIAL_COMPANY_CONTACT`: Official public corporate contact line
- `UNVERIFIED`: Scraped, crowdsourced, or unconfirmed contact

---

## 9. Lead Status & Sponsorship Taxonomy

### Lead Status Lifecycle (Strict 10 Stages):
1. `UNASSIGNED`: In the pool, awaiting volunteer allocation.
2. `ASSIGNED`: Allocated to a volunteer; pending initial research or dial.
3. `CONTACTED`: Call placed, gatekeeper reached, or message left.
4. `INTERESTED`: Decision-maker expressed interest in festival association.
5. `FOLLOW_UP`: Specific callback or action scheduled.
6. `PROPOSAL_REQUESTED`: Official pitch deck or customized proposal requested.
7. `PROPOSAL_SENT`: Brochure/proposal dispatched; awaiting review.
8. `NEGOTIATION`: Terms, deliverables, or deliverables being finalized.
9. `WON`: Formally confirmed sponsorship agreement.
10. `LOST`: Explicit rejection, unresolvable budget constraint, or dropped lead.

### Sponsorship Types (Cash + In-Kind):
- `CASH`: Financial sponsorship in INR.
- Non-Cash / In-Kind Categories:
  - `PRODUCT`: Refreshments, energy drinks, snacks, electronics, gadgets.
  - `SERVICES`: Media coverage, video production, photography, live streaming.
  - `TECHNICAL_SUPPORT`: Sound engineering, stage rigging, lighting hardware.
  - `WORKSHOP`: Industry masterclass or hackathon workshop hosting.
  - `SPEAKER`: Expert keynote speaker or panelist travel/session.
  - `PRIZES`: Cash vouchers, tech gadgets, or course vouchers for competition winners.
  - `SOFTWARE`: Developer licenses, cloud credits, API keys for hackathons.
  - `MERCHANDISE`: T-shirts, volunteer jackets, delegate lanyards, kit bags.
  - `VENUE`: Off-campus staging or facility assistance.
  - `PRINTING`: Event flex banners, standees, brochures, certificates.
  - `TRANSPORTATION`: Student delegate buses, airport transfers.
  - `OTHER_IN_KIND`: Custom non-cash support.

*Rule: Every non-cash sponsorship tracks both the in-kind description and an estimated monetary valuation in INR (e.g., Cash: ₹0, In-Kind Estimated Value: ₹75,000, Total Partnership Value: ₹75,000).*

---

## 10. Design & UX Principles

- **Professional & Serious:** Designed for focused operations, not playful consumer SaaS.
- **Information-Dense:** High-density tables, compact paddings, and high data density.
- **Color Discipline:** Warm ivory canvas (`#F7F7F0`), crisp white surfaces (`#FFFFFF`), primary teal (`#237E72`), and deep forest (`#203B35`). No purple/pink neon AI gradients.
- **Contextual Workflows:** Volunteers never leave `/workspace`; drawers, modals, and the Call Mode overlay maintain spatial continuity.
- **Accessible & Tested:** High contrast (WCAG-AA), keyboard navigability, clear focus rings, and explicit textual labels paired with all icons.
