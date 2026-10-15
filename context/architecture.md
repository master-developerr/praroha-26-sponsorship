# Architecture

## 1. System Stack

| Layer                          | Technology               | Role & Architectural Boundaries                                                     |
| ------------------------------ | ------------------------ | ----------------------------------------------------------------------------------- |
| **Framework**                  | Next.js (App Router)     | Application shell, server-side route guards, Clerk webhook endpoint. Zero DB logic. |
| **Auth**                       | Clerk                    | Cloud authentication, session JWTs, and OAuth identity provider.                   |
| **Backend & Database**         | Convex                   | Reactive ACID database, serverless mutations, queries, actions, and real-time sync.|
| **File Storage**               | Convex File Storage      | Secure private storage for volunteer debrief audio files and festival PDF assets.   |
| **AI Intelligence Layer**      | Server-Side LLM API      | Modular synthesis for company intelligence, talking points, objections & analysis. |
| **Audio Transcription**        | Hosted STT / Whisper API | Automatic speech-to-text transcription of post-call volunteer audio debriefs.       |
| **Styling & Design System**    | Tailwind CSS v4 + shadcn | CSS-first `@theme` token definitions and accessible, unstyled UI primitives.         |
| **Language**                   | TypeScript (Strict mode) | End-to-end static type safety across client components and backend functions.       |
| **Forms & Validation**         | React Hook Form + Zod    | Client-side form management and strict schema validation for registration & imports.|
| **Data Grids & Lists**         | TanStack Table           | High-density company lead sorting, multi-attribute filtering, and pagination.       |
| **Data Visualization**         | Recharts                 | Sponsorship pipeline progression, conversion funnels, and volunteer metric charts.  |
| **Icons & Media**              | Lucide React             | Consistent, crisp 16px/20px operational iconography.                               |
| **Micro-Animations**           | Framer Motion            | Drawer slide-overs, modal backdrops, and Call Mode focus state transitions.         |
| **Cache Layer (Optional)**     | Upstash Redis            | Strictly for external LLM rate limiting and search caching; never for auth or data.|

---

## 2. Information Architecture (Primary Domains)

The system is organized around 17 primary operational domains:

1. **AUTH:** Clerk identity verification, session tokens, and route protection.
2. **VOLUNTEERS:** Mandatory 4-field registration, academic details, verification states (`pending`, `approved`, `rejected`).
3. **COMPANIES:** Corporate entities, industry, niche, company size, revenue, Kerala presence, sponsorship history.
4. **CONTACTS:** Corporate decision-makers, phone numbers, phone types, emails, LinkedIn URLs, verification levels, sources.
5. **LEADS:** Relational pairing of companies with festival sponsorship campaign targets and priorities.
6. **ASSIGNMENTS:** Lead distribution, volunteer ownership, workload balance, and reassignment history.
7. **CALLS:** In-call operational session, Call Mode overlay, quick outcome triggers, and call timestamps.
8. **DEBRIEFS:** Post-call qualitative summaries, audio recordings, Whisper transcripts, and AI-extracted insights.
9. **FOLLOW_UPS:** Due-today, upcoming, and overdue callbacks, action items, and completion tracking.
10. **PIPELINE:** 10-stage lifecycle progression (`UNASSIGNED` to `WON`/`LOST`) and aggregate pipeline valuation.
11. **PROPOSALS:** Custom deck requests, deliverable options, dispatched dates, and MoU attachments.
12. **SPONSORSHIPS:** Confirmed commitments, cash amounts, and 13 in-kind non-cash categories with estimated valuations.
13. **EVENT:** PRAROHA'26 deliverables, student demographics, package pricing tiers, and official brochure.
14. **ADMIN:** CSV import engine, duplicate detector, verification queue, pipeline authorizations, and audit log.
15. **AI:** Modular intelligence layer (Company Intel, Call Brief, Objection Handling, Transcription, Call Analysis, Recommendations).
16. **ANALYTICS:** Conversion funnel analytics, sector distributions, and XLSX/CSV reporting.
17. **GAMIFICATION:** Configurable points ledger, verified effort vs. outcome rewards, and real-time leaderboard podium.

---

## 3. Folder Structure

```
/
├── AGENTS.md                              → Principal engineering directives and AI agent guidelines
├── context/                               → Authoritative project specifications and design tokens
│   ├── project-overview.md                → Product definition, user roles, P0-P5 priorities, workflows
│   ├── architecture.md                    → System architecture, stack, schemas, and invariants
│   ├── system-flow.md                     → End-to-end distributed system execution flows
│   ├── user-flow.md                       → Behavioral specifications and user journeys
│   ├── build-plan.md                      → Step-by-step implementation roadmap (P0 → P5)
│   ├── progress-tracker.md                → Living status tracker and phase checklists
│   ├── ui-tokens.md                       → Tailwind CSS v4 @theme token variables
│   ├── ui-rules.md                        → Layout, density, typography, and Call Mode visual rules
│   ├── ui-registry.md                     → Comprehensive component registry and props specifications
│   ├── code-standards.md                  → Engineering standards, TypeScript types, and conventions
│   └── library-docs.md                    → Convex, Clerk, Whisper, and Recharts integration patterns
├── app/                                   → Next.js App Router application shell
│   ├── layout.tsx                         → Root layout with ClerkProvider and ConvexClientProvider
│   ├── page.tsx                           → Role-based dispatcher (routes to /workspace or /admin)
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── workspace/
│   │   └── page.tsx                       → SINGLE-PAGE VOLUNTEER WORKSTATION (Sole volunteer route)
│   ├── admin/
│   │   ├── layout.tsx                     → Persistent admin sidebar and navigation shell
│   │   ├── page.tsx                       → Macro executive sponsorship overview and metrics
│   │   ├── verifications/page.tsx         → Volunteer registration review queue
│   │   ├── leads/page.tsx                 → Master company lead directory and CSV import wizard
│   │   ├── assignments/page.tsx           → Volunteer lead assignment matrix and workload balancer
│   │   ├── reports/page.tsx               → Call report audits and debrief audio playback console
│   │   ├── opportunities/page.tsx         → Sponsorship commitments and MoU authorization portal
│   │   ├── rewards/page.tsx               → Points rules configuration and manual awards ledger
│   │   └── analytics/page.tsx             → Funnel charts, sector breakdowns, and data export
│   └── api/
│       └── webhooks/clerk/route.ts        → Clerk user synchronization webhook handler
├── components/
│   ├── ui/                                → Base shadcn/ui primitives (button, dialog, sheet, table, etc.)
│   ├── layout/
│   │   ├── Navbar.tsx                     → Global header with festival countdown and user identity
│   │   └── AdminSidebar.tsx               → Collapsible administrative sidebar
│   ├── volunteer/
│   │   ├── TodayWorkBar.tsx               → Quota counter, calls remaining, overdue & today's callbacks
│   │   ├── LeadsTable.tsx                 → Primary high-density table of assigned companies
│   │   ├── LeadDetailDrawer.tsx           → Slide-over drawer with company & contact dossier
│   │   ├── CallModeOverlay.tsx            → High-focus in-call overlay with 9 quick outcome buttons
│   │   ├── ConciseTalkingPoints.tsx       → Non-rigid, bulleted pitch points and discovery questions
│   │   ├── CallReportModal.tsx            → Structured post-call report form
│   │   ├── VoiceDebriefRecorder.tsx       → In-browser audio recorder for volunteer debriefs
│   │   ├── DebriefReviewModal.tsx         → Transcript inspection, AI extraction review & edit screen
│   │   ├── FollowUpList.tsx               → Actionable overdue, today, and upcoming callback widget
│   │   ├── EventInfoModal.tsx             → PRAROHA'26 deliverables, brochure, and FAQ reference
│   │   ├── PerformanceCard.tsx            → Individual stats (calls, meetings, points, current rank)
│   │   └── LeaderboardPodium.tsx          → Real-time team rankings podium
│   ├── admin/
│   │   ├── LeadImportModal.tsx            → 29-field CSV dropzone, parser, and error validator
│   │   ├── DuplicateResolutionTable.tsx   → Side-by-side collision resolver (skip, merge, new contact)
│   │   ├── ImportPreviewSummary.tsx       → Pre-flight counts (valid, invalid, duplicate rows)
│   │   ├── AssignmentMatrix.tsx           → 2-column bulk assigner and workload balancer
│   │   ├── VerificationCard.tsx           → Student registration inspection card (approve/reject)
│   │   ├── ReportAuditDrawer.tsx          → Audio debrief player, transcript viewer, point approver
│   │   ├── OpportunityApprovalModal.tsx   → Binding authorization modal for cash & in-kind pledges
│   │   └── AuditLogTable.tsx              → Immutable audit trail viewer
│   └── forms/
│       ├── VolunteerRegistrationModal.tsx → Mandatory 4-field first-time registration modal
│       └── ManualLeadCreateModal.tsx      → Single company and contact entry form
├── convex/                                → Convex reactive backend and database
│   ├── schema.ts                          → Canonical schema declarations and secondary indexes
│   ├── users.ts                           → Identity sync, role checks, and volunteer status mutations
│   ├── companies.ts                       → Company CRUD, search, and deduplication queries
│   ├── contacts.ts                        → Contact intelligence and verification mutations
│   ├── assignments.ts                     → Lead allocation, reassignments, and workload queries
│   ├── calls.ts                           → Call session initiation and outcome tag mutations
│   ├── debriefs.ts                        → Voice debrief audio linking and AI summary persistence
│   ├── followUps.ts                       → Callback scheduling, overdue checks, and completion mutations
│   ├── proposals.ts                       → Deck dispatch logging, deliverable tracking, MoU links
│   ├── sponsorships.ts                    → Cash and 13 in-kind category commitment mutations
│   ├── eventInfo.ts                       → PRAROHA'26 collateral, tier descriptions, and brochure
│   ├── points.ts                          → Idempotent points ledger, rule configs, and leaderboard
│   ├── aiActions.ts                       → Serverless Convex Actions for LLM synthesis (Modular)
│   ├── transcription.ts                   → Serverless Convex Action for Whisper STT audio processing
│   ├── auditLogs.ts                       → Immutable administrative action logger
│   └── _generated/                        → Auto-generated Convex TypeScript types
├── lib/
│   ├── clerk.ts                           → Clerk session validation helpers
│   ├── csvParser.ts                       → Client-side 29-field CSV parser and validator
│   ├── deduplication.ts                   → 4-way duplicate hashing algorithms
│   └── utils.ts                           → Currency formatters, date utilities, cn() Tailwind merge
└── types/
    └── index.ts                           → Canonical domain interfaces, 10 statuses, and 14 sponsorship types
```

---

## 4. Convex Database Schema

### 1. `users`
| Field               | Type   | Notes                                                                            |
| ------------------- | ------ | -------------------------------------------------------------------------------- |
| `_id`               | Id     | Convex unique identifier                                                         |
| `clerkId`           | string | Unique ID from Clerk (Indexed: `by_clerk_id`)                                    |
| `email`             | string | Primary student email from Clerk                                                 |
| `name`              | string | Full name entered during registration                                            |
| `phone`             | string | Contact phone collected during registration                                       |
| `semester`          | string | Academic semester (e.g., "S1" through "S8")                                       |
| `department`        | string | Department (Civil, Computer Science, IT, Mechanical, Electrical, Safety, etc.)     |
| `role`              | string | Authorization role: `"admin"` \| `"volunteer"`                                   |
| `verificationStatus`| string | State: `"pending"` \| `"approved"` \| `"rejected"` (Indexed: `by_verification`)   |
| `rejectionReason`   | string | Optional admin feedback reason if rejected                                       |
| `reviewedBy`        | Id     | References `users` (Admin reviewer; optional)                                     |
| `reviewedAt`        | number | Epoch timestamp (UTC) of verification                                            |
| `createdAt`         | number | Epoch timestamp (UTC)                                                            |

### 2. `companies`
| Field                     | Type   | Notes                                                                       |
| ------------------------- | ------ | --------------------------------------------------------------------------- |
| `_id`                     | Id     | Convex unique identifier                                                    |
| `companyName`             | string | Official corporate entity name                                              |
| `normalizedName`          | string | Lowercased, stripped punctuation name for search (Indexed: `by_norm_name`)   |
| `deduplicationHash`       | string | Deterministic hash for duplicate detection (Indexed: `by_dedup_hash`)       |
| `industry`                | string | Sector / Industry (e.g., Construction, Infrastructure, Tech, FMCG, Banking)   |
| `niche`                   | string | Specific business niche (e.g., Cement, CAD Software, Heavy Equipment)       |
| `priority`                | string | Priority rank: `"High"` \| `"Medium"` \| `"Normal"`                        |
| `leadScore`               | number | Optional computed or imported lead score (0–100)                            |
| `website`                 | string | Company homepage URL                                                        |
| `linkedin`                | string | Company LinkedIn profile URL                                                |
| `location`                | string | Corporate headquarters or branch city                                       |
| `companySize`             | string | Employee bracket (e.g., "500-1000", "10,000+")                              |
| `annualRevenue`           | string | Estimated revenue bracket                                                   |
| `keralaPresence`          | string | Regional offices, manufacturing plants, or retail presence in Kerala        |
| `sponsorshipHistory`      | string | Documented past event sponsorships                                          |
| `sponsorshipEvidence`     | string | Evidence URLs or campaign notes of past student/fest sponsorships           |
| `whyGoodLead`             | string | Strategic rationale for targeting this company                              |
| `whyCompanyBenefits`      | string | Value proposition connecting company brand to PRAROHA'26 audience           |
| `recommendedSponsorshipType`| string| Initial target: `"CASH"` \| non-cash category                              |
| `recommendedAskMin`       | number | Minimum recommended ask in INR                                              |
| `recommendedAskMax`       | number | Maximum recommended ask in INR                                              |
| `alternativeSupport`      | string | Viable in-kind or workshop alternatives                                     |
| `source`                  | string | Lead source (e.g., "Civil Alumni Network", "CREDAI Directory", "LinkedIn") |
| `sourceUrl`               | string | Reference link for lead discovery                                           |
| `leadStatus`              | string | 10-stage lifecycle (Indexed: `by_lead_status`)                              |
| `notes`                   | string | General administrative notes                                                |
| `lastContactedAt`         | number | Epoch timestamp (UTC) of most recent outreach                               |
| `createdAt`               | number | Epoch timestamp (UTC)                                                       |

### 3. `contacts`
| Field               | Type   | Notes                                                                            |
| ------------------- | ------ | -------------------------------------------------------------------------------- |
| `_id`               | Id     | Convex unique identifier                                                         |
| `companyId`         | Id     | References `companies` (Indexed: `by_company_id`)                                 |
| `contactName`       | string | Decision-maker or representative name                                            |
| `designation`       | string | Job title (e.g., "Regional Marketing Head", "CSR Director", "Brand Lead")       |
| `phone`             | string | Primary telephone / mobile number                                                |
| `phoneType`         | string | Classification: `"direct_official"` \| `"office"` \| `"regional_office"` \| `"department"` \| `"switchboard"` \| `"unknown"` |
| `email`             | string | Direct corporate email address                                                   |
| `linkedin`          | string | Personal LinkedIn profile URL                                                    |
| `contactVerification`| string| Level: `"VERIFIED_DECISION_MAKER"` \| `"VERIFIED_COMPANY_REPRESENTATIVE"` \| `"OFFICIAL_COMPANY_CONTACT"` \| `"UNVERIFIED"` (Indexed) |
| `contactSource`     | string | How contact details were acquired (e.g., "Direct Call", "Alumni Referral")      |
| `isPrimary`         | boolean| True if primary contact for the company lead                                     |
| `createdAt`         | number | Epoch timestamp (UTC)                                                            |

### 4. `leadAssignments`
| Field               | Type   | Notes                                                                            |
| ------------------- | ------ | -------------------------------------------------------------------------------- |
| `_id`               | Id     | Convex unique identifier                                                         |
| `companyId`         | Id     | References `companies` (Indexed: `by_company_id`)                                 |
| `volunteerId`       | Id     | References `users` (Indexed: `by_volunteer_id`)                                  |
| `assignedBy`        | Id     | References `users` (Admin who performed assignment)                              |
| `status`            | string | Status: `"active"` \| `"reassigned"` \| `"released"`                            |
| `assignedAt`        | number | Epoch timestamp (UTC)                                                            |
| `updatedAt`         | number | Epoch timestamp (UTC)                                                            |

### 5. `calls`
| Field               | Type   | Notes                                                                            |
| ------------------- | ------ | -------------------------------------------------------------------------------- |
| `_id`               | Id     | Convex unique identifier                                                         |
| `companyId`         | Id     | References `companies` (Indexed: `by_company_id`)                                 |
| `contactId`         | Id     | References `contacts`                                                            |
| `volunteerId`       | Id     | References `users` (Indexed: `by_volunteer_id`)                                  |
| `quickOutcome`      | string | Outcome: `"Interested"` \| `"Asked for proposal"` \| `"Asked for budget"` \| `"Wrong person"` \| `"Call back"` \| `"Rejected"` \| `"Non-cash opportunity"` \| `"Meeting requested"` \| `"Other"` |
| `startedAt`         | number | Epoch timestamp (UTC) when Call Mode initiated                                   |
| `endedAt`           | number | Epoch timestamp (UTC) when call concluded                                        |
| `durationSeconds`   | number | Total call duration in seconds                                                   |
| `createdAt`         | number | Epoch timestamp (UTC)                                                            |

### 6. `callDebriefs`
| Field                     | Type   | Notes                                                                       |
| ------------------------- | ------ | --------------------------------------------------------------------------- |
| `_id`                     | Id     | Convex unique identifier                                                    |
| `callId`                  | Id     | References `calls` (Indexed: `by_call_id`)                                  |
| `companyId`               | Id     | References `companies`                                                      |
| `volunteerId`             | Id     | References `users`                                                          |
| `discussionSummary`       | string | Qualitative notes submitted by volunteer                                    |
| `interestLevel`           | string | Level: `"High"` \| `"Medium"` \| `"Low"` \| `"None"`                        |
| `decisionMakerStatus`     | string | E.g. `"Spoke directly to decision-maker"`, `"Gatekeeper redirected"`        |
| `primaryObjection`        | string | Specific objection raised (if any)                                          |
| `importantInfoLearned`    | string | Key discoveries (e.g., budget cycles, new branch openings)                  |
| `requestedAction`         | string | What the company asked from PRAROHA (e.g., send tier 2 deck)                |
| `nextAction`              | string | What volunteer must do next                                                 |
| `debriefAudioStorageId`   | string | Convex File Storage ID for voice recording (optional)                       |
| `debriefTranscript`       | string | Whisper STT transcript of the recording (optional)                          |
| `isVerifiedByAdmin`       | boolean| True if audited and approved by admin                                       |
| `verifiedBy`              | Id     | References `users` (Admin auditor; optional)                                |
| `pointsAwarded`           | number | Points credited to volunteer for this verified outreach                     |
| `createdAt`               | number | Epoch timestamp (UTC)                                                       |

### 7. `followUps`
| Field               | Type   | Notes                                                                            |
| ------------------- | ------ | -------------------------------------------------------------------------------- |
| `_id`               | Id     | Convex unique identifier                                                         |
| `companyId`         | Id     | References `companies` (Indexed: `by_company_id`)                                 |
| `volunteerId`       | Id     | References `users` (Indexed: `by_volunteer_and_status`)                          |
| `dueDate`           | number | Scheduled deadline epoch timestamp (UTC)                                         |
| `status`            | string | Status: `"pending"` \| `"completed"` \| `"cancelled"`                           |
| `nextAction`        | string | Clear action directive (e.g., "Call back after board meeting", "Send custom MoU") |
| `notes`             | string | Contextual reminders                                                             |
| `completedAt`       | number | Epoch timestamp (UTC) when action completed                                      |
| `createdAt`         | number | Epoch timestamp (UTC)                                                            |

### 8. `proposals`
| Field               | Type   | Notes                                                                            |
| ------------------- | ------ | -------------------------------------------------------------------------------- |
| `_id`               | Id     | Convex unique identifier                                                         |
| `companyId`         | Id     | References `companies` (Indexed: `by_company_id`)                                 |
| `volunteerId`       | Id     | References `users`                                                               |
| `packageTier`       | string | Targeted package: `"Title"` \| `"PoweredBy"` \| `"Associate"` \| `"Custom"` \| `"InKind"` |
| `customDeliverables`| string | Tailored deliverables discussed                                                  |
| `dispatchedAt`      | number | Epoch timestamp (UTC) when proposal emailed/sent                                 |
| `dispatchedBy`      | Id     | References `users`                                                               |
| `mouStorageId`      | string | Optional Convex File Storage ID for uploaded proposal or MoU document            |
| `status`            | string | Status: `"draft"` \| `"sent"` \| `"accepted"` \| `"rejected"` \| `"revised"`    |
| `createdAt`         | number | Epoch timestamp (UTC)                                                            |

### 9. `sponsorships`
| Field                     | Type   | Notes                                                                       |
| ------------------------- | ------ | --------------------------------------------------------------------------- |
| `_id`                     | Id     | Convex unique identifier                                                    |
| `companyId`               | Id     | References `companies` (Indexed: `by_company_id`)                           |
| `volunteerId`             | Id     | Primary volunteer credited with deal                                        |
| `sponsorshipType`         | string | Type: `"CASH"` or one of the 13 non-cash categories                         |
| `cashAmount`              | number | Financial sponsorship figure in INR (0 if pure in-kind)                     |
| `inKindEstimatedValue`    | number | Estimated monetary valuation in INR for non-cash support                    |
| `inKindDescription`       | string | Concrete inventory of products, services, or equipment pledged             |
| `totalPartnershipValue`   | number | Sum of `cashAmount` + `inKindEstimatedValue` in INR                         |
| `status`                  | string | Status: `"proposed"` \| `"under_negotiation"` \| `"confirmed"` \| `"declined"` |
| `approvedBy`              | Id     | References `users` (Admin with exclusive signing authority; optional)       |
| `approvedAt`              | number | Epoch timestamp (UTC) of official commitment                                |
| `createdAt`               | number | Epoch timestamp (UTC)                                                       |

### 10. `sponsorshipPackages`
| Field               | Type   | Notes                                                                            |
| ------------------- | ------ | -------------------------------------------------------------------------------- |
| `_id`               | Id     | Convex unique identifier                                                         |
| `tierName`          | string | Package title: `"Title Sponsor"` \| `"Powered By"` \| `"Associate"` \| etc.      |
| `basePrice`         | number | Standard ask price in INR                                                        |
| `deliverables`      | string | Itemized list of benefits (banners, stage time, stalls, logo on t-shirts)        |
| `isActive`          | boolean| True if currently offered                                                        |

### 11. `eventInformation`
| Field               | Type   | Notes                                                                            |
| ------------------- | ------ | -------------------------------------------------------------------------------- |
| `_id`               | Id     | Convex unique identifier                                                         |
| `sectionKey`        | string | Unique identifier: `"overview"` \| `"tiers"` \| `"demographics"` \| `"brochure"` |
| `title`             | string | Display title                                                                    |
| `content`           | string | Structured markdown or JSON detailing PRAROHA'26 facts                           |
| `fileStorageId`     | string | Optional Convex File Storage ID for official PDF brochure                        |
| `updatedBy`         | Id     | References `users` (Admin editor)                                                |
| `updatedAt`         | number | Epoch timestamp (UTC)                                                            |

### 12. `pointTransactions`
| Field               | Type   | Notes                                                                            |
| ------------------- | ------ | -------------------------------------------------------------------------------- |
| `_id`               | Id     | Convex unique identifier                                                         |
| `volunteerId`       | Id     | References `users` (Indexed: `by_volunteer_id`)                                  |
| `actionType`        | string | Action: `"valid_call"` \| `"decision_maker_reached"` \| `"follow_up_completed"` \| `"proposal_requested"` \| `"meeting_obtained"` \| `"sponsorship_won"` \| `"admin_adjustment"` |
| `points`            | number | Numerical point score (+ or -)                                                   |
| `sourceId`          | string | Deduplication key (e.g., `callDebriefId` or `sponsorshipId`) (Indexed)           |
| `notes`             | string | Audit description of the award                                                   |
| `awardedBy`         | Id     | References `users` (Admin or system)                                             |
| `createdAt`         | number | Epoch timestamp (UTC)                                                            |

### 13. `aiAnalysis`
| Field               | Type   | Notes                                                                            |
| ------------------- | ------ | -------------------------------------------------------------------------------- |
| `_id`               | Id     | Convex unique identifier                                                         |
| `companyId`         | Id     | References `companies` (Indexed: `by_company_id`)                                 |
| `analysisType`      | string | Type: `"company_intel"` \| `"call_prep"` \| `"debrief_extraction"` \| `"recommendation"` |
| `structuredOutput`  | string | Serialized JSON containing concise points, questions, and objection tips         |
| `rawPrompt`         | string | System & user prompt record for auditability                                     |
| `createdAt`         | number | Epoch timestamp (UTC)                                                            |

### 14. `auditLogs`
| Field               | Type   | Notes                                                                            |
| ------------------- | ------ | -------------------------------------------------------------------------------- |
| `_id`               | Id     | Convex unique identifier                                                         |
| `actorId`           | Id     | References `users` (User performing the administrative action)                    |
| `action`            | string | Action: `"verify_volunteer"` \| `"reassign_lead"` \| `"approve_sponsorship"` \| etc.|
| `entityType`        | string | Table: `"users"` \| `"companies"` \| `"sponsorships"`                            |
| `entityId`          | string | ID of affected entity                                                            |
| `changes`           | string | Serialized delta of changes                                                      |
| `timestamp`         | number | Epoch timestamp (UTC)                                                            |

---

## 5. CSV Lead Import & Duplicate Engine

### Canonical 29-Field Schema:
```csv
company_name,industry,niche,priority,lead_score,contact_name,contact_designation,phone,email,location,website,linkedin,company_size,annual_revenue,kerala_presence,sponsorship_history,sponsorship_evidence,why_good_lead,why_company_benefits,recommended_sponsorship_type,recommended_ask_min,recommended_ask_max,alternative_support,source,source_url,contact_source,contact_verified,notes,lead_status
```

### Required Fields:
`company_name`, `industry`, `niche`, `priority`, `contact_name`, `contact_designation`, `phone`.

### Duplicate Detection Strategy:
For every row, compute:
1. `normalizedName`: Lowercased, stripped punctuation, and standard company suffix removal (Pvt Ltd, LLC, Inc, Ltd).
2. `namePhoneHash`: Hash of `normalizedName + sanitizedPhone`.
3. `nameEmailHash`: Hash of `normalizedName + sanitizedEmail`.
4. `domainHash`: Extracted apex domain (e.g., `company.com`) from website.

If an existing record matches any of these keys, flag row as duplicate in the import preview with 3 admin choices:
- `Skip`: Do not import.
- `Merge`: Update missing company background fields without overwriting active lead stage.
- `Import as New Contact`: Append contact under the existing company record.

---

## 6. Contact Verification Standard

Every contact record enforces clear verification boundaries:

### Phone Type:
- `direct_official`: Direct mobile or extension of the decision-maker
- `office`: Official branch desk line
- `regional_office`: Kerala regional headquarters
- `department`: Marketing/CSR department phone
- `switchboard`: Central corporate reception
- `unknown`: Unverified origin

### Verification Level:
- `VERIFIED_DECISION_MAKER`: Brand Manager, CMO, CSR Director (Verified sponsorship authority).
- `VERIFIED_COMPANY_REPRESENTATIVE`: Verified employee or internal referral.
- `OFFICIAL_COMPANY_CONTACT`: Confirmed public corporate line.
- `UNVERIFIED`: Scraped or crowdsourced number.

---

## 7. Modular AI Architecture (Secondary Layer)

AI functions execute strictly as isolated, server-side Convex Actions:
- **Module A: Company Intelligence:** Ingests company profile and outputs marketing alignment notes.
- **Module B: Call Brief:** Generates 3–5 concise talking points, natural opening hook, and 3 discovery questions. (Never long scripts).
- **Module C: Objection Handling:** Provides 1–2 sentence natural responses for common objections.
- **Module D: Voice Transcription:** Whisper STT processing of audio debriefs stored in Convex File Storage.
- **Module E: Call Analysis:** Extracts outcome, interest level, objections, and next actions.
- **Module F: Sponsorship Recommendation:** Suggests appropriate package tiers and in-kind angles.

*Rule: If an AI action times out or fails, the UI gracefully defaults to manual text entry and static PRAROHA'26 event facts.*

---

## 8. Architectural Invariants

1. **Server-Side Authorization Invariant:** Frontend guards are purely for UX. Every Convex query and mutation must independently assert authenticated identity via Clerk, check user record in Convex, and verify `verificationStatus === 'approved'`.
2. **Volunteer Isolation Invariant:** Volunteer lead queries must strictly filter by `volunteerId === currentUser._id`. Volunteers cannot query leads belonging to peers or the unassigned pool.
3. **Single-Page Invariant:** The volunteer experience is strictly unified inside `/workspace`. Navigation away from this route during outreach is prohibited.
4. **Admin Exclusive Authority Invariant:** Only users with `role === 'admin'` can approve volunteer registrations, reassign leads, authorize sponsorship commitments, or adjust points.
5. **Idempotent Gamification Invariant:** Points transactions must enforce idempotency via unique `sourceId` references in `pointTransactions`. Double-crediting is impossible.
6. **Numeric Timestamps:** All dates and timestamps are stored as numeric UTC epoch milliseconds (`Date.now()`).
7. **Zero Secret Leakage:** Third-party LLM, Whisper STT, and Clerk secret keys must never exist in client-side bundles.
