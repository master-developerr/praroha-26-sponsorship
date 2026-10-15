# Library Docs

Project-specific usage patterns for every third-party library in this project. This file only covers how we use each library in this specific project — rules, patterns, and constraints specific to the PRAROHA'26 Sponsorship Outreach & Volunteer Management Tool.

Read the relevant section before implementing any feature that touches these libraries.

---

## Before Using Any Library

Before implementing any feature that uses a third-party library:

1. **Check if an MCP server is configured** for that library. Some tools have MCP servers that give the AI agent direct access to real-time documentation, logs, and debugging tools. If an MCP server is available — use it before falling back to general knowledge.

2. **Check AGENTS.md** at the project root — it lists every skill installed for this project and how to use them. Skills contain up-to-date API documentation, usage patterns, and best practices specific to this codebase.

3. **Read this file** for project-specific patterns that override general library knowledge.

The order of authority is:

```
MCP server (real-time docs) → Skills via AGENTS.md → This file (project rules) → General training knowledge
```

Never rely on general training knowledge alone for library APIs — they change frequently and training data may be outdated.

---

## Engineering Philosophy (YAGNI)

The project follows the YAGNI (You Aren't Gonna Need It) principle. 
Developers should always prefer integrating mature, production-ready libraries instead of rebuilding them. 
This file describes HOW we use those libraries inside this project, not how the libraries work internally. 
Only build custom infrastructure if it creates a direct competitive advantage for the PRAROHA'26 festival sponsorship campaign.

Delegated infrastructure for PRAROHA'26:
- **Authentication** → Clerk
- **Backend, Database & Storage** → Convex (Serverless Database, Realtime Subscriptions, and Convex File Storage)
- **AI Call Copilot** → Server-side LLM API (orchestrated via Convex Actions)
- **Voice Debrief Transcription** → Hosted Speech-to-Text API (Whisper via Convex Actions)
- **Forms & Validation** → React Hook Form + Zod
- **UI & Icons** → Tailwind CSS, shadcn/ui, and Lucide React
- **Micro-Animations** → Framer Motion
- **Data Grids & Analytics** → TanStack Table and Recharts
- **Error Tracking (Optional)** → Sentry
- **External API Rate Limiting (Optional)** → Upstash Redis

---

## Convex

**Check first:** Check AGENTS.md for an installed Convex skill. If a Convex MCP server is configured — use it.

Convex is the single source of truth for all application data, real-time syncing, serverless business logic, and private file storage.

### Client vs Server

```typescript
// app/layout.tsx — Browser Context (Root Provider)
"use client";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

```typescript
// Server Actions / Route Handlers (Server Context)
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const leadDetails = await fetchQuery(api.companies.getCompanyDetails, { companyId });
```

**Rules:**

- **Browser client**: Use Client Components with Convex React hooks (`useQuery`, `useMutation`, `useAction`).
- **Server client**: Use Server Components (`fetchQuery`), API route handlers (`fetchMutation`), and Server Actions.
- **Realtime by default**: UI updates occur automatically over WebSockets via `useQuery`. Never build manual polling, long-polling, or custom WebSocket listeners.

---

### DB Queries & Mutations

All queries and mutations must validate arguments and enforce server-side authorization.

```typescript
// Read (React Component — components/volunteer/LeadsTable.tsx)
const assignedLeads = useQuery(api.companies.getMyAssignedLeads);

// Read (Convex Server Function — convex/companies.ts)
import { query } from "./_generated/server";

export const getMyAssignedLeads = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Fetch user profile and verify approval status
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.verificationStatus !== "approved") {
      throw new Error("Unauthorized: Volunteer registration is pending or unapproved");
    }

    // Query active assignments scoped to current volunteer
    const activeAssignments = await ctx.db
      .query("leadAssignments")
      .withIndex("by_volunteer_id", (q) => q.eq("volunteerId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    const companyIds = activeAssignments.map((a) => a.companyId);
    return await Promise.all(companyIds.map((id) => ctx.db.get(id)));
  },
});
```

```typescript
// Insert / Update (Convex Server Function — convex/callReports.ts)
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitCallReport = mutation({
  args: {
    assignmentId: v.id("leadAssignments"),
    companyId: v.id("companies"),
    callOutcome: v.string(),
    discussionSummary: v.string(),
    debriefAudioStorageId: v.optional(v.string()),
    debriefTranscript: v.optional(v.string()),
    aiExtractedInsights: v.optional(v.string()),
    nextActionProposed: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.verificationStatus !== "approved") {
      throw new Error("Unauthorized: Only approved volunteers can submit reports");
    }

    // Verify assignment ownership
    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment || assignment.volunteerId !== user._id) {
      throw new Error("Unauthorized: Assignment does not belong to this volunteer");
    }

    const reportId = await ctx.db.insert("callReports", {
      ...args,
      volunteerId: user._id,
      isVerifiedByAdmin: false,
      pointsAwarded: 0,
      createdAt: Date.now(),
    });

    // Update company last contacted timestamp
    await ctx.db.patch(args.companyId, {
      lastContactedAt: Date.now(),
    });

    return reportId;
  },
});
```

**Rules:**

- **Zero Client Trust**: Never trust client-supplied user IDs, roles, or approval status. Always load the user record via `ctx.auth.getUserIdentity()` and verify `verificationStatus === 'approved'`.
- **Validation**: Validate all function arguments using `v` from `convex/values`.
- **Index Usage**: Always use `.withIndex` for filtered queries. Ensure indexes exist in `convex/schema.ts`.

---

## Clerk Authentication

**Check first:** Check AGENTS.md for an installed Clerk skill.

Clerk handles cloud identity, sessions, and OAuth handshakes. Convex handles authorization and application role verification.

### Current User & Session Resolution

```typescript
// Server Component / Server Action
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const { userId } = await auth();
const user = await currentUser();
if (!userId) redirect("/sign-in");
```

```typescript
// Convex Backend Function
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("Unauthenticated");
const clerkId = identity.subject; // Maps to Clerk's user ID
```

### Protecting Routes & Middleware

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/workspace(.*)", "/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### Authorization State Machine

The application enforces 5 discrete states:
1. `unauthenticated` $\rightarrow$ Redirect to Clerk sign-in / sign-up.
2. `authenticated` (incomplete profile) $\rightarrow$ Displays mandatory 4-field registration modal on `/workspace`.
3. `pending_verification` $\rightarrow$ Profile submitted; volunteer workspace displays holding banner ("Pending Core Admin Approval"). Gated from accessing lead data.
4. `approved` $\rightarrow$ Full access to assigned leads, AI Copilot, call reporting, and leaderboard.
5. `rejected` $\rightarrow$ Displays rejection reason provided by admin with option to edit and resubmit profile.

**Rules:**

- Never build custom password or session management. Clerk manages authentication tokens.
- Clerk authentication does **not** equal authorization. Convex functions must independently assert `user.verificationStatus === 'approved'` before returning lead contact numbers or pitch materials.
- Admin privileges must come from a trusted server-side record in the Convex `users` collection, not an untrusted client parameter.

---

## AI Integration (Call Copilot)

The AI Call Copilot prepares volunteers before cold calls with concise battlecards. It is executed strictly on the server via Convex Actions.

### Architecture & Invocation

```typescript
// convex/aiCopilot.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const generatePrepGuide = action({
  args: {
    assignmentId: v.id("leadAssignments"),
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    // 1. Verify caller authentication via query
    const user = await ctx.runQuery(api.users.getCurrentUser);
    if (!user || user.verificationStatus !== "approved") {
      throw new Error("Unauthorized");
    }

    // 2. Fetch company and event facts
    const company = await ctx.runQuery(api.companies.getById, { id: args.companyId });
    const eventFacts = await ctx.runQuery(api.eventInfo.getVerifiedDeliverables);

    // 3. Construct prompt with zero-hallucination constraints
    const prompt = `
You are the PRAROHA'26 Sponsorship Copilot. Generate a structured cold-call preparation guide.
Company: ${company.name} (${company.industry || "General"})
Target Tier: ${company.tier || "Associate"}
Festival Deliverables: ${JSON.stringify(eventFacts)}

Rules:
- Generate strictly JSON matching the required schema.
- Do NOT fabricate previous sponsorship history, budgets, or contact names.
- Provide 3-5 concise talking points linking the company's business to PRAROHA'26 students.
- Provide 3 natural discovery questions.
- Provide common objections and counter-responses.
- Suggest 2 non-cash / in-kind sponsorship alternatives.
`;

    // 4. Server-side LLM call using private environment variable
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    const result = await response.json();
    const content = JSON.parse(result.choices[0].message.content);

    // 5. Cache result on assignment record
    await ctx.runMutation(api.assignments.cachePrepNotes, {
      assignmentId: args.assignmentId,
      notes: JSON.stringify(content),
    });

    return content;
  },
});
```

**Rules:**

- **Zero Secret Exposure**: LLM API keys must remain strictly in server environment variables (`LLM_API_KEY`). Never expose keys to client bundles.
- **Untrusted Output**: Treat all model responses as untrusted. Validate structured JSON output using Zod before persisting.
- **Zero Hallucination Directive**: The prompt must explicitly prohibit inventing contact details, past sponsorship deals, or phantom company budgets. Verified festival facts from `eventInformation` serve as the absolute ground truth.
- **Keep Prompts Concise**: Battlecard outputs must be short bullet points optimized for live phone calls, not long scripted essays.
- **Graceful Degradation**: Handle provider rate limits and timeouts cleanly without crashing the volunteer interface.

---

## Voice Transcription (Debrief Processing)

The voice debrief feature allows volunteers to record their personal recollection after a call.

### Architecture & Invocation

```typescript
// Client audio submission: components/volunteer/VoiceDebriefRecorder.tsx
// 1. Record audio using Web MediaRecorder API (max 120s)
// 2. Fetch upload URL from Convex mutation: callReports.generateDebriefUploadUrl
// 3. Upload raw audio blob to Convex File Storage
// 4. Invoke Convex Action: transcription.processVoiceDebrief with storageId

// convex/transcription.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const processVoiceDebrief = action({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Retrieve audio file URL from Convex File Storage
    const audioUrl = await ctx.storage.getUrl(args.storageId);
    if (!audioUrl) throw new Error("Audio file not found in storage");

    const audioResponse = await fetch(audioUrl);
    const audioBlob = await audioResponse.blob();

    // 2. Prepare multipart form data for Whisper STT API
    const formData = new FormData();
    formData.append("file", audioBlob, "debrief.webm");
    formData.append("model", "whisper-1");
    formData.append("language", "en");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STT_API_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();
    const transcript = data.text;

    // 3. Generate bullet-point summary from transcript
    const summaryPrompt = `Extract key takeaways, objections, and agreed next steps from this post-call debrief:\n"${transcript}"`;
    // ... Invoke LLM for structured summary ...

    return {
      transcript,
      summary: "Discussion highlights extracted from audio debrief",
    };
  },
});
```

**Rules:**

- **Post-Call Scope**: The system records strictly the volunteer's own spoken debrief after the call concludes. It does **not** record the telephone line.
- **Volunteer Review**: Transcripts and AI summaries must be presented to the volunteer for review and manual correction before saving to `callReports`.
- **Text Fallback**: If browser microphone permissions are denied, the UI must seamlessly fall back to pure text note logging.
- **Storage Limits**: Audio clips are capped at 120 seconds to prevent unnecessary storage and transcription costs.

---

## Private File Storage (Convex File Storage)

Convex File Storage provides built-in, access-controlled asset hosting for audio debriefs and festival pitch collateral.

### Usage

```typescript
// 1. Generate secure upload URL in Convex Mutation
export const generateDebriefUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl();
  },
});

// 2. Client uploads file directly to returned URL
const uploadUrl = await generateUploadUrl();
const result = await fetch(uploadUrl, {
  method: "POST",
  headers: { "Content-Type": audioBlob.type },
  body: audioBlob,
});
const { storageId } = await result.json();

// 3. Store storageId in collection
await submitCallReport({ debriefAudioStorageId: storageId, ... });
```

**Rules:**

- Store only the `storageId` in database documents, not long-lived public URLs.
- Resolve public/download URLs dynamically on the server via `ctx.storage.getUrl(storageId)`.
- Never expose private volunteer voice recordings on public unauthenticated endpoints.

---

## React Hook Form & Zod

Forms use React Hook Form for state management and Zod for schema validation.

### Volunteer Registration Schema

```typescript
// lib/validations/registration.ts
import { z } from "zod";

export const volunteerRegistrationSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  semester: z.enum(["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"], {
    errorMap: () => ({ message: "Please select your current semester" }),
  }),
  department: z.enum(
    ["Computer Science", "Information Technology", "Electronics", "Electrical", "Mechanical", "Civil", "Safety & Fire"],
    { errorMap: () => ({ message: "Please select your department" }) },
  ),
});

export type VolunteerRegistrationFormData = z.infer<typeof volunteerRegistrationSchema>;
```

### Component Integration

```typescript
// components/forms/VolunteerRegistrationModal.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { volunteerRegistrationSchema, VolunteerRegistrationFormData } from "@/lib/validations/registration";

export function VolunteerRegistrationModal() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerRegistrationFormData>({
    resolver: zodResolver(volunteerRegistrationSchema),
  });

  const onSubmit = async (data: VolunteerRegistrationFormData) => {
    // Invoke Convex mutation to save profile
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 4 Required inputs */}
    </form>
  );
}
```

**Rules:**

- Define the Zod schema first and export its inferred TypeScript type.
- Share validation rules between the client and Server Actions/mutations where applicable.
- Never rely solely on client-side Zod validation; Convex mutation argument validators (`v`) provide the authoritative server boundary.

---

## UI (shadcn/ui, Tailwind CSS, Lucide)

The frontend is an internal single-page volunteer workspace with contextual drawers and dialogs.

**Rules:**

- **shadcn/ui**: Components reside in `components/ui/`. Use established primitives (Dialog, Sheet, Button, Input, Table, Badge).
- **Tailwind CSS**: Use semantic design tokens from `globals.css` (`bg-background`, `border-border`, `text-text-primary`). Avoid hardcoded hex colors.
- **Lucide React**: Primary icon library. Use standardized sizing (`className="w-4 h-4"` or `className="w-5 h-5"`).
- **Single-Page Experience**: Do not create unnecessary navigation routes for individual volunteer tasks. Use `Sheet` (drawer) for `LeadDetailDrawer` and `CallCopilotDrawer`, and `Dialog` for `CallReportModal` and `EventInfoModal`.

---

## Animations (Framer Motion)

Animations must remain subtle, professional, and accessible.

```typescript
import { motion, AnimatePresence } from "framer-motion";

export function ModalBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

**Rules:**

- Use Framer Motion strictly for drawer slides, modal backdrops, and interactive micro-animations.
- Respect accessibility: wrap animations in `prefers-reduced-motion` checks or rely on CSS transitions where appropriate.
- Never introduce heavy page-scroll or marketing reveal animation libraries (e.g., GSAP).

---

## Recharts & TanStack Table

### TanStack Table (Data Grids)

Used for high-density lead management tables in both the volunteer and admin interfaces.

**Use cases:**
- "My Leads" table on `/workspace`.
- Master Lead Directory and Assignment Matrix on `/admin/leads` and `/admin/assignments`.
- Pending Volunteer Verification queue on `/admin/verifications`.

**Rules:**
- Use headless `@tanstack/react-table` with Tailwind CSS styling.
- Implement client-side sorting and stage filtering for volunteer lead lists.

### Recharts (Visual Analytics)

Used for sponsorship pipeline visualization in the Admin workspace and volunteer performance tracking.

**Use cases:**
- Outreach Funnel: Contacted $\rightarrow$ Qualified $\rightarrow$ Proposals $\rightarrow$ Confirmed Sponsors.
- Team Daily Call Volume (Bar chart over past 14 days).
- Industry Sector Breakdown (Donut chart).

**Rules:**
- Always wrap charts in `ResponsiveContainer`.
- Style tooltips cleanly using theme tokens.

---

## Next/Image

Images use `next/image` for performance optimization.

**Rules:**

- Provide explicit `width` and `height` attributes or use `fill` with a relative parent container.
- Configure remote domains in `next.config.ts` for sponsoring company logos and festival assets hosted on external domains.

---

## Sentry (Optional Monitoring)

Sentry provides error monitoring and action latency tracking.

**Rules:**

- Initialized via `@sentry/nextjs`.
- Automatically catches unhandled exceptions in server routes and client boundaries.
- **Privacy Rule**: Never log raw phone numbers, student contact details, audio blobs, or verbatim call transcripts to Sentry error contexts.

---

## Upstash Redis (Optional Cache & Rate Limiting)

Upstash Redis is **not** a primary database and is strictly optional.

### Usage Restrictions

- **Permitted Use Cases**: External LLM/Search API rate limiting and caching expensive external company research results.
- **Forbidden Use Cases**:
  - Never cache authentication tokens or session claims.
  - Never use Redis as proof of volunteer registration approval.
  - Never use Redis to authorize administrative privileges.
  - Never bypass Convex database authorization checks using a cached state.

```typescript
// Rate limiting an external research action
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
});
```

Convex remains the authoritative database. If Redis fails or is unavailable, the application must safely fall back to Convex.
