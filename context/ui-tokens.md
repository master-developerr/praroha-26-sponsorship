# UI Tokens

Design tokens for the **PRAROHA’26 Sponsorship Outreach & Volunteer Execution System**. All colors, typography, spacing, radius, shadow, and component values are extracted from the approved Design System, UI Registry, and SmartShelf dashboard reference. Use these exact token values throughout the codebase — never hardcode raw hex values or use unmapped Tailwind utility classes in components.

The product unifies **two visual expressions** across one coherent token architecture:
1. **Authentication & Onboarding:** Energetic, welcoming, colorful, illustration-led, and professional.
2. **Volunteer & Admin Workspaces:** Clean, restrained, professional, information-dense, and structured.

---

## 1. How to Use

This project is architected for **Tailwind CSS v4** with a CSS-first token configuration. All design tokens are defined using the `@theme` directive in `app/globals.css`.

Tailwind CSS v4 automatically synthesizes utility classes from variables declared in `@theme`:

- `--color-primary` → `bg-primary`, `text-primary`, `border-primary`, `ring-primary`
- `--color-surface` → `bg-surface`, `text-surface`, `border-surface`
- `--color-accent` → `bg-accent`, `text-accent`, `border-accent`
- `--color-highlight-yellow` → `bg-highlight-yellow`, `text-highlight-yellow`
- `--color-highlight-coral` → `bg-highlight-coral`, `text-highlight-coral`

```tsx
// Correct — uses generated utility classes
className="bg-surface text-text-primary border border-border rounded-lg shadow-sm"

// Correct — semantic interactive button
className="bg-primary hover:bg-primary/90 text-white rounded-md font-semibold text-sm"

// Correct — status badge for Won / Confirmed deal
className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full"

// Never — hardcoded hex values
className="bg-[#237E72] text-[#252A27]"

// Never — raw Tailwind default palette classes
className="bg-teal-600 text-gray-900 border-zinc-200"
```

---

## 2. globals.css — Complete Token Definition

`@theme` definition for `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* Typography */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Canvas & Base Surfaces */
  --color-background: #F7F7F0;     /* Warm Canvas */
  --color-surface: #FFFFFF;        /* Crisp Surface */
  --color-surface-subtle: #FAF9F5; /* Subtle Card Wash */

  /* Dividers & Borders */
  --color-border: #E2E5DE;         /* Neutral Divider Border */
  --color-border-subtle: #ECEFE8;  /* Inner Card Divider */

  /* Text & Labels */
  --color-text-primary: #252A27;   /* Slate Charcoal */
  --color-text-secondary: #626B65; /* Medium Sage Slate */
  --color-text-muted: #818982;     /* Muted Grey */

  /* Brand Interactive Tokens */
  --color-primary: #237E72;        /* Primary Teal */
  --color-secondary: #203B35;      /* Deep Forest */

  /* Supporting Accents & Highlights */
  --color-accent-mint: #D9EEE4;    /* Soft Mint Tint */
  --color-accent-yellow: #F5D978;  /* Butter Yellow */
  --color-accent-coral: #F18A70;   /* Coral Highlight (Overdue Callbacks) */

  /* Semantic Status Tokens (WCAG-AA Compliant) */
  --color-success: #16845B;        /* Confirmed / Approved / WON */
  --color-warning: #B45309;        /* Follow-up Due Today */
  --color-error: #DC2626;          /* Rejected / LOST */
  --color-info: #0284C7;           /* Proposal Sent / Review */

  /* Spacing Scale (4px base) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 20px;
  --spacing-2xl: 24px;
  --spacing-3xl: 32px;
  --spacing-4xl: 40px;

  /* Border Radii */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* Shadows (Tuned for Slate Teal Tint) */
  --shadow-xs: 0 1px 2px rgba(32, 59, 53, 0.04);
  --shadow-sm: 0 1px 3px rgba(32, 59, 53, 0.06), 0 1px 2px rgba(32, 59, 53, 0.04);
  --shadow-md: 0 4px 6px -1px rgba(32, 59, 53, 0.08), 0 2px 4px -2px rgba(32, 59, 53, 0.04);
  --shadow-lg: 0 10px 15px -3px rgba(32, 59, 53, 0.10), 0 4px 6px -4px rgba(32, 59, 53, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(32, 59, 53, 0.14), 0 8px 10px -6px rgba(32, 59, 53, 0.06);
}
```

---

## 3. Semantic Status Token Mappings

### 10 Lead Lifecycle Statuses
| Lead Status | Background Class | Text Class | Border Class |
| :--- | :--- | :--- | :--- |
| `UNASSIGNED` | `bg-zinc-50` | `text-zinc-600` | `border-zinc-200` |
| `ASSIGNED` | `bg-blue-50` | `text-blue-700` | `border-blue-200` |
| `CONTACTED` | `bg-cyan-50` | `text-cyan-700` | `border-cyan-200` |
| `INTERESTED` | `bg-teal-50` | `text-teal-700` | `border-teal-200` |
| `FOLLOW_UP` | `bg-yellow-50` | `text-yellow-800` | `border-yellow-200` |
| `PROPOSAL_REQUESTED` | `bg-indigo-50` | `text-indigo-700` | `border-indigo-200` |
| `PROPOSAL_SENT` | `bg-sky-50` | `text-sky-700` | `border-sky-200` |
| `NEGOTIATION` | `bg-purple-50` | `text-purple-700` | `border-purple-200` |
| `WON` | `bg-emerald-50` | `text-emerald-700` | `border-emerald-200` |
| `LOST` | `bg-rose-50` | `text-rose-700` | `border-rose-200` |

### Contact Verification Badges
| Level | Background Class | Text Class | Border Class |
| :--- | :--- | :--- | :--- |
| `VERIFIED_DECISION_MAKER` | `bg-emerald-100` | `text-emerald-900` | `border-emerald-300` |
| `VERIFIED_COMPANY_REPRESENTATIVE` | `bg-teal-100` | `text-teal-900` | `border-teal-300` |
| `OFFICIAL_COMPANY_CONTACT` | `bg-sky-100` | `text-sky-900` | `border-sky-300` |
| `UNVERIFIED` | `bg-amber-100` | `text-amber-900` | `border-amber-300` |

### Lead Priority Badges
| Priority | Background Class | Text Class | Border Class | Label |
| :--- | :--- | :--- | :--- | :--- |
| `High` | `bg-rose-50` | `text-rose-700` | `border-rose-200` | `P0 - CRITICAL` |
| `Medium` | `bg-amber-50` | `text-amber-700` | `border-amber-200` | `P1 - HIGH` |
| `Normal` | `bg-blue-50` | `text-blue-700` | `border-blue-200` | `P2 - MEDIUM` |
| `Low` | `bg-zinc-50` | `text-zinc-600` | `border-zinc-200` | `P3 - LOW` |

### Phone Type Badges
| Phone Type | Background Class | Text Class | Border Class | Label |
| :--- | :--- | :--- | :--- | :--- |
| `direct_official` | `bg-emerald-50` | `text-emerald-700` | `border-emerald-200` | `Direct Mobile / Desk` |
| `office` | `bg-blue-50` | `text-blue-700` | `border-blue-200` | `Main Office Desk` |
| `regional_office` | `bg-indigo-50` | `text-indigo-700` | `border-indigo-200` | `Regional HQ / Kerala` |
| `department` | `bg-purple-50` | `text-purple-700` | `border-purple-200` | `Marketing / CSR Dept` |
| `switchboard` | `bg-amber-50` | `text-amber-700` | `border-amber-200` | `Corporate Switchboard` |
| `unknown` | `bg-zinc-50` | `text-zinc-600` | `border-zinc-200` | `Unclassified Origin` |

### Quick Outcome Button Palette (Call Mode)
| Outcome | Background Class | Text Class | Border Class | Hover Class |
| :--- | :--- | :--- | :--- | :--- |
| `Interested` | `bg-emerald-50` | `text-emerald-800` | `border-emerald-300` | `hover:bg-emerald-100` |
| `Asked for proposal` | `bg-sky-50` | `text-sky-800` | `border-sky-300` | `hover:bg-sky-100` |
| `Asked for budget` | `bg-indigo-50` | `text-indigo-800` | `border-indigo-300` | `hover:bg-indigo-100` |
| `Wrong person` | `bg-zinc-50` | `text-zinc-700` | `border-zinc-200` | `hover:bg-zinc-100` |
| `Call back` | `bg-yellow-50` | `text-yellow-800` | `border-yellow-300` | `hover:bg-yellow-100` |
| `Rejected` | `bg-rose-50` | `text-rose-800` | `border-rose-300` | `hover:bg-rose-100` |
| `Non-cash opportunity`| `bg-purple-50` | `text-purple-800` | `border-purple-300` | `hover:bg-purple-100` |
| `Meeting requested` | `bg-teal-50` | `text-teal-800` | `border-teal-300` | `hover:bg-teal-100` |
| `Other` | `bg-zinc-50` | `text-zinc-700` | `border-zinc-200` | `hover:bg-zinc-100` |

### Call Mode & Debrief Modal Interactive Tokens
| Element | Visual State | Tokens / Classes |
| :--- | :--- | :--- |
| Active Call Stopwatch | Live In-Call Badge | `bg-rose-50 border border-rose-200 text-rose-700 font-mono text-sm px-2.5 py-1 rounded-full` + pulsing red beacon `bg-rose-500 animate-pulse` |
| Click-to-Call Dialer | Primary Tel Trigger | `bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 font-medium shadow-sm` |
| Call Mode Backdrop | Distraction-free Scrim | `bg-slate-900/60 backdrop-blur-sm z-50` |
| Interest Level: High | Selected Chip | `bg-emerald-100 text-emerald-800 border-emerald-400 font-semibold ring-2 ring-emerald-500/20` |
| Interest Level: Medium | Selected Chip | `bg-amber-100 text-amber-800 border-amber-400 font-semibold ring-2 ring-amber-500/20` |
| Interest Level: Low | Selected Chip | `bg-blue-100 text-blue-800 border-blue-400 font-semibold ring-2 ring-blue-500/20` |
| Interest Level: None | Selected Chip | `bg-zinc-200 text-zinc-800 border-zinc-400 font-semibold ring-2 ring-zinc-500/20` |
| Decision-Maker Status | Reached vs Gatekeeper | `Direct Decision-Maker` (`text-emerald-700`), `Gatekeeper/Assistant` (`text-amber-700`), `Wrong Department` (`text-zinc-600`) |
| Overdue Callback Card | Urgent Follow-up | `bg-surface border-l-4 border-l-[#F18A70] border-y border-r border-border hover:shadow-sm` |
| Due Today Callback Card | Active Shift Follow-up | `bg-surface border-l-4 border-l-amber-500 border-y border-r border-border hover:shadow-sm` |
| Upcoming Callback Card | Future Shift Follow-up | `bg-surface border-l-4 border-l-primary/60 border-y border-r border-border hover:shadow-sm` |

### 14 Sponsorship Types (Cash & In-Kind Categories)
- `CASH`: Emerald tint (`bg-emerald-50 text-emerald-800 border-emerald-300`)
- `PRODUCT`: Amber tint (`bg-amber-50 text-amber-800 border-amber-300`)
- `SERVICES`: Blue tint (`bg-blue-50 text-blue-800 border-blue-300`)
- `TECHNICAL_SUPPORT`: Slate tint (`bg-slate-50 text-slate-800 border-slate-300`)
- `WORKSHOP`: Violet tint (`bg-violet-50 text-violet-800 border-violet-300`)
- `SPEAKER`: Indigo tint (`bg-indigo-50 text-indigo-800 border-indigo-300`)
- `PRIZES`: Yellow tint (`bg-yellow-50 text-yellow-800 border-yellow-300`)
- `SOFTWARE`: Cyan tint (`bg-cyan-50 text-cyan-800 border-cyan-300`)
- `MERCHANDISE`: Orange tint (`bg-orange-50 text-orange-800 border-orange-300`)
- `VENUE`: Stone tint (`bg-stone-50 text-stone-800 border-stone-300`)
- `PRINTING`: Zinc tint (`bg-zinc-50 text-zinc-800 border-zinc-300`)
- `TRANSPORTATION`: Sky tint (`bg-sky-50 text-sky-800 border-sky-300`)
- `OTHER_IN_KIND`: Neutral tint (`bg-surface text-text-primary border-border`)

### SDR Workload Capacity Badges (Assignment Matrix)
| Capacity Level | Active Leads Bracket | Background Class | Text Class | Border Class | Label |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Available` | 0 – 4 leads | `bg-emerald-50` | `text-emerald-800` | `border-emerald-200` | `Optimal (N active)` |
| `Moderate` | 5 – 14 leads | `bg-amber-50` | `text-amber-800` | `border-amber-200` | `Active (N active)` |
| `Near Capacity` | 15+ leads | `bg-rose-50` | `text-rose-800` | `border-rose-200` | `Heavy (N active)` |

### Workstation Today's Outreach Command Tokens
| Metric Item | Token Role | Value / Class |
| :--- | :--- | :--- |
| Daily Quota Progress | Pacing bar & target | `bg-primary`, `text-primary`, target `15 calls/day` |
| High-Priority Alert | P0 Critical leads | `bg-rose-100 text-rose-700 border-rose-200` |
| Overdue Callbacks | Urgent alert | `--color-accent-coral: #F18A70`, `bg-[#F18A70]/10 text-[#F18A70] border-[#F18A70]` |
| Due Today Callbacks | Scheduled shifts | `bg-amber-100 text-amber-800 border-amber-300` |
| To Contact Queue | Uncontacted leads | `bg-blue-100 text-blue-800 border-blue-200` |

---

## 4. Pipeline, Proposal & Commitment Tokens

### Sponsorship Package Tier Pills
| Package Tier | Background Class | Text Class | Border Class | Indicative Ask |
| :--- | :--- | :--- | :--- | :--- |
| `Title` | `bg-emerald-500` | `text-white` | `border-emerald-600` | ₹5,00,000+ (Exclusive naming rights) |
| `Powered By` | `bg-sky-500` | `text-white` | `border-sky-600` | ₹3,00,000+ (Co-branding on all collateral) |
| `Associate` | `bg-indigo-500` | `text-white` | `border-indigo-600` | ₹1,50,000+ (Category exclusive partner) |
| `Custom` | `bg-amber-500` | `text-white` | `border-amber-600` | Negotiated custom deliverable mix |
| `In-Kind` | `bg-purple-500` | `text-white` | `border-purple-600` | Operational goods / services donation |

### Proposal Dispatch Status Badges
| Status | Badge Classes | Meaning |
| :--- | :--- | :--- |
| `draft` | `bg-amber-50 text-amber-800 border-amber-300` | Proposal saved internally, pending dispatch |
| `sent` | `bg-sky-50 text-sky-800 border-sky-300` | Formally dispatched to company decision-maker |
| `accepted` | `bg-emerald-50 text-emerald-800 border-emerald-300` | Company agreed, ready for admin commitment |
| `rejected` | `bg-rose-50 text-rose-800 border-rose-300` | Terms declined by sponsor |
| `superseded` | `bg-zinc-100 text-zinc-600 border-zinc-200` | Replaced by newer revised proposal |

### Relationship Timeline Stream Tokens
| Event Type | Icon Token | Badge Styling | Left Border / Node |
| :--- | :--- | :--- | :--- |
| `call` | `PhoneCall` | `bg-teal-50 text-teal-800 border-teal-200` | Soft teal node bullet |
| `debrief` | `FileText` | `bg-indigo-50 text-indigo-800 border-indigo-200` | Indigo node bullet |
| `follow_up` | `Calendar` | `bg-yellow-50 text-yellow-800 border-yellow-200` | Butter yellow node bullet |
| `proposal` | `Trophy` | `bg-sky-50 text-sky-800 border-sky-200` | Sky blue node bullet |
| `commitment` | `Award` | `bg-emerald-100 text-emerald-900 border-emerald-300` | Confirmed emerald gold node bullet |

### Commitment Authorization Security Tokens
| Element | Visual State | Value / Class |
| :--- | :--- | :--- |
| Admin Signing Authority Gate | Security Indicator | `bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg` |
| Deal Valuation Callout | Commercial Revenue | `text-2xl font-black text-emerald-700` |
| Ratified Deal Pill | Exclusive Contract | `bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold uppercase` |

---

## 5. AI Visual Language & Intelligence Tokens

### Design System Principles for AI
- **No Clichés:** Strictly NO purple AI gradients, neon glows, robot icons, generic chatbot bubbles, or excessive sparkle effects.
- **Tone:** Professional, serious, integrated sales-enablement cockpit.
- **Accent:** Subtle teal indicator with crisp structured cards and high-density typography.

### AI Component Token Values
| AI Element | Visual Role | Token / Utility Classes |
| :--- | :--- | :--- |
| Subtle AI Indicator Badge | Live model or engine | `bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-[10px] font-medium` |
| Deterministic Baseline Pill | Offline / local mode | `bg-surface text-text-muted border border-border text-[10px] font-medium` |
| Company Fit Score Meter | 0–100 numerical fit | `bg-surface border border-border text-teal-600 dark:text-teal-400 font-bold text-xs` |
| Live Call Opening Angle | Tactical phone opener | `border border-border bg-surface text-primary font-bold text-xs` |
| Objection Counter Card | Live call counter-phrase | `border border-amber-500/20 bg-amber-500/5 p-2 rounded-md border-l-2 border-teal-500` |
| In-Kind Alternative Cards | Non-cash sponsorship | `border border-border bg-surface hover:border-teal-500/30 p-3 rounded-lg` |
| In-Kind Category Badge | 13 non-cash categories | `bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 text-[10px] font-bold` |
| Debrief Positive Signal | Detected verbal interest | `text-emerald-600 dark:text-emerald-400 font-bold text-[10px]` |
| Debrief Friction Point | Detected objection/budget freeze | `text-red-500 font-bold text-[10px]` |
| 1-Click Apply AI Suggestions | Pre-fill debrief form | `bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px] px-2.5 py-1 rounded` |
| Lead Priority Factor Bar | Deterministic 4-factor breakdown | `p-1.5 rounded bg-surface-subtle border border-border text-[11px]` |
---

## 6. Gamification, Leaderboard & Executive Dashboard Tokens

### Honors Leaderboard & Podium Visual Tokens
| Element | Visual State | Tokens / Classes |
| :--- | :--- | :--- |
| Rank 1 (Gold Pedestal) | 1st Place Champion | `bg-amber-500/10 border-amber-500/40 text-amber-700`, Crown icon `text-amber-500`, Medal `bg-amber-100 text-amber-800` |
| Rank 2 (Silver Pedestal) | 2nd Place Runner-Up | `bg-slate-500/10 border-slate-400/40 text-slate-700`, Medal `bg-slate-100 text-slate-800` |
| Rank 3 (Bronze Pedestal) | 3rd Place Honors | `bg-amber-700/10 border-amber-700/40 text-amber-800`, Medal `bg-amber-50 text-amber-900` |
| Points Score Badge | Metric Highlight | `bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-full text-xs` |
| Personal Rank Pill | SDR Workspace Badge | `bg-primary/10 text-primary border border-primary/20 font-bold text-xs px-2 py-0.5 rounded` |
| Discretionary Adjust Button | Admin Control | `border border-border text-xs px-2 py-1 rounded hover:bg-surface-subtle font-medium` |

### Executive Dashboard Bento & Velocity Tokens
| Element | Visual Role | Token / Utility Classes |
| :--- | :--- | :--- |
| Bento Macro KPI Card | Top-level summary metric | `bg-surface border border-border rounded-xl p-5 shadow-xs hover:border-primary/30 transition-colors` |
| Recharts Velocity Line | Area fill & stroke | Stroke `var(--color-primary)` (`#237E72`), Fill Gradient `opacity-20 to opacity-0`, Grid `var(--color-border)` (`#E2E5DE`) |
| Objection Roadblock Bar | Qualitative friction metric | Container `bg-surface-subtle h-2 rounded-full`, Fill `bg-amber-500 rounded-full`, Label `text-xs text-text-secondary` |
| Sector Conversion Chip | Industry responsiveness | `bg-surface text-text-primary border border-border text-xs font-semibold px-2 py-1 rounded-md` |

---

## 7. Supporting Features, Search, Notifications & Export Tokens

### Notification Center & Real-Time Alert Tokens
| Element | Visual State | Token / Utility Classes |
| :--- | :--- | :--- |
| Navbar Bell Trigger | Icon container | `h-9 w-9 rounded-lg border border-border bg-surface text-text-secondary hover:bg-surface-subtle transition-colors relative` |
| Active Count Pill | Unread alerts badge | `bg-rose-500 text-white text-[9px] font-bold rounded-full h-4 min-w-[16px] px-1 shadow-xs absolute -top-1 -right-1` |
| Overdue Callback Alert Card | Urgent callback alert | `bg-rose-50 border border-rose-200 text-rose-900 rounded-lg p-2.5` |
| Overdue Timing Tag | Time delta indicator | `text-[10px] font-bold text-rose-600 bg-rose-100/80 px-1.5 py-0.5 rounded` |
| Due Today Callback Card | Active shift callback | `bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-2.5` |
| Pending Verification Alert | Admin-only queue alert | `bg-teal-50 border border-teal-200 text-teal-900 rounded-lg p-2.5` |
| Points Milestone Alert | SDR gamification reward | `bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg p-2.5` |
| Direct Call Dial Shortcut | In-popover dial action | `bg-primary hover:bg-primary/90 text-white font-semibold text-xs px-2.5 py-1 rounded shadow-xs` |

### Universal Global Search (⌘K Command Palette) Tokens
| Element | Visual Role | Token / Utility Classes |
| :--- | :--- | :--- |
| Navbar Search Trigger | Command trigger bar | `h-9 px-3 rounded-lg border border-border bg-surface-subtle text-text-muted hover:border-primary/40 text-xs w-64 flex items-center justify-between` |
| Keyboard Shortcut Chip | ⌘K / Ctrl+K badge | `bg-surface border border-border text-[10px] font-mono text-text-muted px-1.5 py-0.5 rounded` |
| Palette Dialog Backdrop | Dimmed focus transition | `fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4` |
| Palette Search Input | High-focus input | `w-full h-12 bg-transparent text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-hidden border-b border-border` |
| Company Result Hit | Matched lead item | `hover:bg-surface-subtle p-2.5 rounded-xl flex items-center justify-between transition-colors` |
| Contact Result Hit | Matched decision-maker | `hover:bg-surface-subtle p-2.5 rounded-xl flex items-center justify-between transition-colors` |
| Direct Phone Callout | In-search click-to-dial | `bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 text-[11px] font-medium px-2 py-1 rounded` |

### Leads Table Density & Multi-Attribute Filters
| Element | Visual State | Token / Utility Classes |
| :--- | :--- | :--- |
| Table Row (Normal Density) | Comfortable spacing | `py-3 px-4 text-xs font-medium border-b border-border` |
| Table Row (Compact Density)| High-density data mode | `py-1.5 px-3 text-[11px] font-medium border-b border-border` |
| Sector Filter Select | Multi-industry filter | `h-8 px-2.5 rounded-lg border border-border bg-surface text-xs text-text-primary focus:border-primary` |
| Contact Verification Select| Quality gate filter | `h-8 px-2.5 rounded-lg border border-border bg-surface text-xs text-text-primary focus:border-primary` |
| Density Toggle Button | Mode switcher | `h-8 px-2.5 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-subtle text-xs flex items-center gap-1.5` |

### Administrative Audit Trail & Data Export Tokens
| Element | Visual Role | Token / Utility Classes |
| :--- | :--- | :--- |
| Audit Action Badge (`create`)| Entity insertion | `bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase` |
| Audit Action Badge (`update`)| Mutation event | `bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase` |
| Audit Action Badge (`authorize`)| Deal ratification | `bg-teal-50 text-teal-800 border border-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase` |
| Audit Action Badge (`reassign`)| Workload balancing | `bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase` |
| Diff Inspector Modal | Payload JSON view | `bg-slate-950 text-emerald-400 font-mono text-xs p-3 rounded-lg border border-slate-800 max-h-64 overflow-auto` |
| Bento Export Card | Master download unit | `bg-surface border border-border hover:border-primary/40 rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between` |
| 1-Click CSV Download Button | Export trigger | `bg-primary hover:bg-primary/90 text-white font-semibold text-xs px-3 py-2 rounded-lg flex items-center justify-center gap-2 shadow-xs` |
| RFC-4180 Format Badge | Standard CSV chip | `bg-surface-subtle border border-border text-[10px] font-mono text-text-secondary px-2 py-0.5 rounded` |

---

## 8. Responsive Layout & WCAG-AA Accessibility Tokens

### Mobile Navigation Drawer & Hamburger Trigger
| Element | Visual Role | Token / Utility Classes |
| :--- | :--- | :--- |
| Mobile Hamburger Trigger | Mobile menu button (`lg:hidden`) | `p-2 rounded-lg border border-border bg-surface text-text-secondary hover:bg-surface-subtle transition-colors focus-visible:ring-2 focus-visible:ring-primary` |
| Drawer Backdrop Overlay | Dimmed focus transition | `fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity` |
| Slide-Over Drawer Sheet | Off-canvas mobile menu | `fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-surface border-r border-border shadow-xl z-50 flex flex-col` |
| Drawer Header Branding | Festival identity bar | `p-4 border-b border-border flex items-center justify-between` |
| Drawer Nav Link (Active) | Current location | `bg-primary/10 text-primary font-semibold text-xs rounded-lg px-3 py-2.5 flex items-center gap-2.5 border border-primary/20` |
| Drawer Nav Link (Inactive)| Unselected route | `text-text-secondary hover:text-text-primary hover:bg-surface-subtle font-medium text-xs rounded-lg px-3 py-2.5 flex items-center gap-2.5 transition-colors` |
| Drawer Role Badge (Admin)| Executive access | `bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider` |
| Drawer Role Badge (Volunteer)| Student SDR access | `bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider` |
| Mobile Sign Out Button | Safe session termination | `w-full text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg py-2 flex items-center justify-center gap-2 transition-colors` |

### Responsive Viewport Containment Tokens
| Container | Viewport Invariant | Utility Classes |
| :--- | :--- | :--- |
| Workspace Main Grid | Zero horizontal stretch | `flex-1 min-w-0 overflow-y-auto px-4 py-4 lg:px-8` |
| Admin Layout Container | Zero horizontal stretch | `flex-1 min-w-0 flex flex-col overflow-y-auto` |
| Desktop Sidebar Wrapper| Tablet/mobile collapse | `hidden lg:flex w-64 border-r border-border flex-col bg-surface-subtle` |
| High-Density Leads Table | Horizontal swipeable scroll | `overflow-x-auto w-full border border-border rounded-xl bg-surface shadow-xs` |
| Dossier Tabs Row | Narrow screen horizontal scroll| `flex items-center gap-2 overflow-x-auto no-scrollbar pb-1` |

### WCAG-AA Focus Indicators & Keyboard Navigation
| Element | Visual State | Utility Classes |
| :--- | :--- | :--- |
| Standard Interactive Button | Keyboard Tab Focus | `focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden` |
| Call Mode Quick Outcome Button | Keyboard High-Contrast Focus | `focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden active:scale-[0.98]` |
| Form Input / Textarea | Accessible Active Focus | `focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-hidden` |
| Command Palette Item | Keyboard Arrow Highlight | `aria-selected:bg-surface-subtle aria-selected:text-primary outline-hidden` |
| Accessible Modal Dialog | Screen Reader Landmark | `role="dialog" aria-modal="true" aria-labelledby="..."` |

---

## 9. Foundation, Authentication & Canonical Lead Ingestion Tokens (Features 1 & 2)

### Authentication & Central Dispatcher Tokens
| Element | Visual State | Utility Classes |
| :--- | :--- | :--- |
| Sign-In Brand Banner | Brand Icon Container | `h-12 w-12 rounded-2xl bg-accent-mint/60 text-primary shadow-xs flex items-center justify-center` |
| Dev Persona Switcher Bar | Fixed Bottom Tester | `fixed bottom-3 right-3 z-50 bg-slate-900/90 text-white rounded-xl shadow-lg border border-slate-700/80 px-3 py-2 text-xs flex items-center gap-2` |
| Central Dispatcher Spinner | Hydration Loading | `h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent` |
| Holding Screen Card | Pending Verification | `bg-surface border border-border rounded-2xl p-8 max-w-md text-center shadow-sm` |
| Rejection Reason Banner | Feedback Alert | `bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs` |

### Mandatory Volunteer Registration Modal Tokens
| Element | Form State | Utility Classes |
| :--- | :--- | :--- |
| Registration Dialog Frame | Blocking Modal Shell | `fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4` |
| 4-Field Form Container | Structured Inputs | `space-y-4 max-w-md w-full bg-surface rounded-2xl border border-border p-6 shadow-xl` |
| Input Error Text | Zod / Regex Feedback | `text-[11px] font-medium text-rose-600 mt-1` |
| Information Banner | Admin Gate Notice | `bg-teal-50 border border-teal-200 text-teal-800 rounded-xl p-3 text-xs flex items-start gap-2` |
| Register Submit Button | Final Submission | `bg-primary hover:bg-primary/90 text-white font-semibold text-xs py-2.5 rounded-lg w-full shadow-xs` |

### Admin Volunteer Verification Queue Tokens
| Element | Queue Role | Utility Classes |
| :--- | :--- | :--- |
| Verification Tab (Active) | Queue Status Selector | `bg-primary text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-xs` |
| Verification Tab (Inactive) | Queue Status Selector | `bg-surface text-text-secondary hover:text-text-primary border border-border text-xs px-3 py-1.5 rounded-lg` |
| Volunteer Candidate Card | Queue ListItem | `bg-surface border border-border rounded-xl p-4 hover:border-primary/30 transition-colors` |
| Approve Button | Verification Approval | `bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5` |
| Reject Button | Rejection Feedback Trigger | `bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5` |
| Rejection Dialog Reason | Mandatory Notes Area | `w-full h-24 bg-surface border border-border rounded-lg p-2.5 text-xs text-text-primary focus:border-rose-500 focus:ring-1 focus:ring-rose-500` |

### 29-Field CSV Import & Duplicate Engine Tokens
| Element | Ingestion Role | Utility Classes |
| :--- | :--- | :--- |
| CSV Dropzone (Default) | File Input Drag Target | `border-2 border-dashed border-border hover:border-primary/60 bg-surface-subtle/50 rounded-xl p-8 text-center cursor-pointer transition-colors` |
| CSV Dropzone (Active/Hover)| Dragging File Over | `border-2 border-dashed border-primary bg-primary/5 rounded-xl p-8 text-center` |
| Schema Valid Indicator | 7 Mandatory Columns Pass | `bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5` |
| Missing Columns Warning | Incomplete Header Alert | `bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs` |
| Duplicate Collision Row | Conflict Inspection | `bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-xs space-y-2` |
| Conflict Action Selector | Skip / Merge / New Contact | `h-8 px-2.5 rounded-lg border border-border bg-surface text-xs font-medium text-text-primary focus:border-primary` |
| Batch Import Progress Bar | Live Commit Feedback | `h-2 bg-surface-subtle rounded-full overflow-hidden w-full relative` with inner `bg-primary transition-all duration-300` |



