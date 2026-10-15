# UI Rules

Concise rules for building the **PRAROHA'26 Sponsorship Outreach & Volunteer Execution System** UI. The approved Design System, UI Registry, and UI Tokens are the authoritative sources of truth. These rules establish practical patterns and constraints to maintain unwavering visual consistency without over-specifying every detail.

---

## 1. Core Visual Directives

1. **Serious, Professional & Operational:** This is an internal sponsorship execution tool for a premier collegiate festival, not a playful consumer app or gaming dashboard.
2. **No Neon AI Aesthetics:** Avoid glowing neon purple/pink cards, excessive radial gradients, and generic "futuristic" AI styling. The design must feel grounded, structured, and modern 2026 enterprise-grade.
3. **Single-Page Volunteer Workstation (Hard Rule):** The volunteer workflow takes place entirely on `/workspace`. Multi-page tab routing for volunteers is forbidden. Contextual drawers, dialogs, and overlays maintain unbroken spatial continuity.
4. **Information-Dense but Readable:** High-density table rows (40px–44px height), compact cell padding (`py-2.5 px-3`), and crisp typography.

---

## 2. Typography

Import **Inter** via `next/font/google` in the root layout (`app/layout.tsx`):

```typescript
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

### Scale & Hierarchy
- **H1 (32px, 700, line-height 120%):** Workspace and section headers.
- **H2 (24px, 600, line-height 125%):** Drawer titles and modal headings.
- **H3 (18px, 600, line-height 130%):** Group headers, card titles.
- **Body Medium (14px, 400, line-height 150%):** Standard table cell text, qualitative notes.
- **Body Small (13px, 400, line-height 140%):** High-density table text, contact designations.
- **Caption (12px, 500, line-height 140%):** Timestamps, verification badges, status pills.
- **Button (14px, 600, line-height 140%):** Interactive buttons and action triggers.

---

## 3. Color Usage & Status Badging

- **Warm Canvas:** `#F7F7F0` (`bg-background` — base page canvas).
- **Surface:** `#FFFFFF` (`bg-surface` — cards, tables, drawers, modals).
- **Primary Teal:** `#237E72` (`bg-primary` — primary interactive buttons, focus rings, active links).
- **Deep Forest:** `#203B35` (`bg-secondary` — high-contrast text and dark header accents).
- **Soft Mint:** `#D9EEE4` (`bg-accent-mint` — subtle badge tints, active highlights).
- **Butter Yellow:** `#F5D978` (`bg-accent-yellow` — due-today follow-up highlights).
- **Coral:** `#F18A70` (`bg-accent-coral` — urgent overdue callback alerts).

### Color Independence
Color must **never** be used alone to communicate status. Always pair colored badges with clear textual labels and descriptive Lucide icons.

---

## 4. Volunteer Workstation (`/workspace`) Layout Rules

1. **Top Command Bar (`TodayWorkBar`):**
   - Must be sticky or immediately visible at the top of the viewport.
   - Houses the daily quota progress bar, calls remaining, overdue callbacks alert, and today's callbacks counter.
2. **Primary Leads Table (`LeadsTable`):**
   - High-density rows with zebra striping or crisp border dividers (`border-border`).
   - One-click row triggers: clicking company opens `LeadDetailDrawer`; clicking "Start Call" launches `CallModeOverlay`.
3. **Slide-Over Drawer (`LeadDetailDrawer`):**
   - Width: `w-full sm:max-w-xl lg:max-w-2xl`.
   - Right-side slide-over with clean backdrop dismiss.
   - Header stays sticky while body scrolls.
   - Contains concise talking points accordion, contact intelligence card, and past timeline.

---

## 5. Call Mode Overlay Rules

When clicking **"Start Call"**, the UI must enter a dedicated focus mode:

1. **Dimmed Backdrop:** `bg-black/60 backdrop-blur-sm` covers the entire screen.
2. **Centered Minimal Card:** `bg-surface border-2 border-primary rounded-2xl shadow-2xl p-6 max-w-xl w-full`.
3. **Contact Highlights:**
   - Large Contact Name (`text-2xl font-bold text-text-primary`) and Designation (`text-sm text-text-secondary`).
   - Large clickable telephone number (`text-xl font-mono text-primary hover:underline`) triggering direct dial (`tel:`).
   - Contact verification badge (`VERIFIED_DECISION_MAKER`, etc.).
4. **Sticky Concise Talking Points:** Scrollable container with 3 bulleted pitch points and discovery questions.
5. **9 Quick Outcome Buttons:** Prominently arrayed at the bottom of the card for rapid 1-click classification.
6. **Zero Navigation:** The volunteer cannot wander to other pages while in Call Mode. Clicking an outcome button closes Call Mode and opens the debrief modal.

---

## 6. Voice Debrief & Review Modal Rules

1. **Audio Recording Visuals:**
   - Microphone button with recording state animation.
   - Active duration counter with maximum 120s limit.
   - Audio playback preview for verification before upload.
2. **Review Screen (`DebriefReviewModal`):**
   - Verbatim Whisper transcript displayed in an editable textarea.
   - Extracted fields (outcome, interest level, objections, next action) displayed as interactive form inputs.
   - Volunteer **must** be able to edit any field before submitting to the database.

---

## 7. Admin Workspace Layout Rules

1. **Persistent Sidebar (`AdminSidebar`):**
   - Collapsible left sidebar navigating between Overview, Leads, Assignments, Verifications, Reports, Opportunities, Rewards, and Analytics.
2. **Assignment Matrix (`AssignmentMatrix`):**
   - 2-column layout: Unassigned Leads on left, Approved Volunteers with workload capacity counters on right.
   - Supports bulk lead selection and 1-click allocation.
3. **CSV Import Wizard (`LeadImportModal`):**
   - Clean drag-and-drop zone.
   - Pre-flight validation report showing valid vs duplicate rows.
   - Side-by-side duplicate resolution table (`DuplicateResolutionTable`).

---

## 8. Anti-Patterns (What NOT to Do)

- ❌ **Do NOT** split the volunteer dashboard into separate pages (`/leads`, `/calls`, `/contacts`).
- ❌ **Do NOT** use dark mode or neon cyber aesthetics for operational sponsorship tables.
- ❌ **Do NOT** generate long, rigid, memorized scripts for volunteers (use concise talking points).
- ❌ **Do NOT** label scraped or customer service numbers as verified decision-makers.
- ❌ **Do NOT** allow non-admins to approve sponsorship pledges or alter volunteer points.
- ❌ **Do NOT** hardcode hex colors in component files.
