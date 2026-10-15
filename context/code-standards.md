# Code Standards

Implementation rules and conventions for the entire project. The AI agent must follow these in every session without exception. These rules prevent pattern drift across sessions and guarantee consistent architectural integrity for the **PRAROHA'26 Sponsorship Outreach & Volunteer Execution System**.

---

## 1. Engineering Mindset

The AI agent on this project operates as a senior software architect and staff engineer:
- **Think before implementing** — understand the business logic and user workflow before writing code.
- **Read context files first** — verify specifications against `architecture.md`, `project-overview.md`, and `ui-registry.md`.
- **Scope is sacred** — build only what the current feature requires. Never introduce speculative abstractions.
- **Operations First, AI Second** — core lead, call, and follow-up flows must work flawlessly without external AI.
- **Every feature must be testable** — components and mutations must be visually or programmatically verified immediately.
- **Clean over clever** — maintainable, self-documenting code is always preferred over dense, opaque abstractions.
- **Graceful degradation** — external API failures (LLM, Whisper STT) must never crash the UI; always provide manual fallbacks.

---

## 2. Engineering Philosophy (YAGNI)

This project strictly adheres to the **YAGNI (You Aren't Gonna Need It)** principle:
- **Authentication** → Clerk (Cloud sessions, OAuth, token management)
- **Backend, Database & Storage** → Convex (Reactive database, serverless mutations, File Storage)
- **AI Intelligence Layer** → Server-side LLM API (orchestrated via Convex Actions; strictly modular)
- **Voice Debrief Transcription** → Hosted Whisper STT API (orchestrated via Convex Actions)
- **Forms & Validation** → React Hook Form + Zod
- **UI & Icons** → Tailwind CSS v4, shadcn/ui, Lucide React
- **Micro-Animations** → Framer Motion (drawers, modal backdrops, call overlay)
- **Data Grids & Analytics** → TanStack Table and Recharts
- **External API Rate Limiting (Optional)** → Upstash Redis (strictly for third-party API quotas; never for auth or data)

---

## 3. TypeScript Standards

- Strict mode enabled in `tsconfig.json` — non-negotiable.
- **Never use `any`** — use `unknown` and narrow types using type guards or Zod schemas.
- Avoid type assertions (`as SomeType`) unless strictly necessary and documented with an explanatory comment.
- Explicit return types on all exported functions, API handlers, and Convex mutations/queries.
- Use `type` for object shapes, unions, and intersections; use `interface` only for extendable component props.

```typescript
// types/index.ts — Canonical Domain Types

export type UserRole = "admin" | "volunteer";

export type VolunteerVerificationStatus = "pending" | "approved" | "rejected";

export type LeadStage =
  | "UNASSIGNED"
  | "ASSIGNED"
  | "CONTACTED"
  | "INTERESTED"
  | "FOLLOW_UP"
  | "PROPOSAL_REQUESTED"
  | "PROPOSAL_SENT"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export type PhoneType =
  | "direct_official"
  | "office"
  | "regional_office"
  | "department"
  | "switchboard"
  | "unknown";

export type ContactVerificationLevel =
  | "VERIFIED_DECISION_MAKER"
  | "VERIFIED_COMPANY_REPRESENTATIVE"
  | "OFFICIAL_COMPANY_CONTACT"
  | "UNVERIFIED";

export type QuickCallOutcome =
  | "Interested"
  | "Asked for proposal"
  | "Asked for budget"
  | "Wrong person"
  | "Call back"
  | "Rejected"
  | "Non-cash opportunity"
  | "Meeting requested"
  | "Other";

export type SponsorshipType =
  | "CASH"
  | "PRODUCT"
  | "SERVICES"
  | "TECHNICAL_SUPPORT"
  | "WORKSHOP"
  | "SPEAKER"
  | "PRIZES"
  | "SOFTWARE"
  | "MERCHANDISE"
  | "VENUE"
  | "PRINTING"
  | "TRANSPORTATION"
  | "OTHER_IN_KIND";

export interface CanonicalCsvRow {
  company_name: string;
  industry: string;
  niche: string;
  priority: "High" | "Medium" | "Normal";
  lead_score?: number;
  contact_name: string;
  contact_designation: string;
  phone: string;
  email?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  company_size?: string;
  annual_revenue?: string;
  kerala_presence?: string;
  sponsorship_history?: string;
  sponsorship_evidence?: string;
  why_good_lead?: string;
  why_company_benefits?: string;
  recommended_sponsorship_type?: SponsorshipType;
  recommended_ask_min?: number;
  recommended_ask_max?: number;
  alternative_support?: string;
  source?: string;
  source_url?: string;
  contact_source?: string;
  contact_verified?: ContactVerificationLevel;
  notes?: string;
  lead_status?: LeadStage;
}
```

---

## 4. Convex Backend Rules & Invariants

1. **Server-Side Enforcement:** Route protections on the frontend are purely convenience UX. Convex Queries, Mutations, and Actions must independently verify the authenticated Clerk ID, load the user record, and assert `verificationStatus === 'approved'` before returning lead data or accepting writes.
2. **Strict Volunteer Scoping:** Queries returning leads for volunteers must always filter by `volunteerId === currentUser._id`. Unassigned leads or leads assigned to other volunteers must never be returned.
3. **Exclusive Administrative Signing Authority:** Only users with `role === 'admin'` can approve registrations, reassign leads, alter points, or authorize sponsorship pledges.
4. **Idempotent Gamification:** Mutations to `pointTransactions` must check `by_source_id` index to guarantee that a given `callDebriefId` or `sponsorshipId` cannot credit points more than once.
5. **Numeric UTC Timestamps:** Store all dates and timestamps (`createdAt`, `dueDate`, `lastContactedAt`, `reviewedAt`) as numeric UTC epoch milliseconds (`Date.now()`). Localization occurs strictly on the client.
6. **Zero Secret Leakage:** Third-party LLM, Whisper, and Clerk secret keys must execute exclusively in Convex Actions or Next.js server route handlers. Never expose them to client bundles.

---

## 5. CSV Lead Import & Deduplication Standards

1. **Mandatory Schema Validation:** The CSV parser must enforce that all 7 required columns are present:
   `company_name`, `industry`, `niche`, `priority`, `contact_name`, `contact_designation`, `phone`.
2. **Deduplication Hashing:**
   ```typescript
   export function normalizeCompanyName(name: string): string {
     return name
       .toLowerCase()
       .replace(/[^a-z0-9]/g, "")
       .replace(/(pvtltd|pvt|ltd|llc|inc|limited|corporation|corp)$/, "");
   }
   ```
3. **No Volunteer Assignment in CSV:** Do not require or allow volunteer assignment columns in the CSV. Ingestion is strictly an administrative operation, with assignment handled in the Assignment Matrix post-import.

---

## 6. Call Workflow & Debriefing Standards

1. **Call Mode Focus:** When a call starts, the UI transitions to `CallModeOverlay`. Background elements are disabled.
2. **Direct Dial Trigger:** Phone numbers must render with `tel:` protocols for 1-click dialing.
3. **Voice Debrief Review Obligation:** Transcripts and AI extractions must be rendered in editable input controls. The volunteer must explicitly verify or edit the text before persisting to the database.
4. **Concise Talking Points:** AI-generated call guides must provide bullet points and natural conversation openings. Never generate rigid, word-for-word scripts.
