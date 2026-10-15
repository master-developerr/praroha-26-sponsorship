# Feature 02 Implementation Blueprint: Lead Database & Canonical CSV Import System

## 1. System Overview & Scope
Feature 02 implements the master company directory, the canonical 29-field CSV import pipeline, 4-way deduplication engine, and company/contact intelligence inspection interface for PRAROHA'26.

### In-Scope:
1. **Convex Schema Updates:** Add `companies` and `contacts` tables with strict typing and secondary query indexes.
2. **Canonical 29-Field CSV Parser (`lib/csvParser.ts`):** Client-side parser with column normalization and validation for the 7 mandatory fields.
3. **4-Way Duplicate Detection Engine (`lib/deduplication.ts`):** Hashing algorithms for Normalized Name, Name+Phone, Name+Email, and Domain.
4. **Convex Backend Operations (`convex/companies.ts` & `convex/contacts.ts`):** Batch duplicate detection, batch ingestion with `Skip`/`Merge`/`New Contact` conflict handling, metric aggregations, and single lead creation.
5. **Admin Master Company Directory (`app/admin/leads/page.tsx`):** Metric stat cards, multi-attribute filter toolbar, high-density data grid, and action triggers.
6. **CSV Import & Duplicate Resolution Wizard (`components/admin/LeadImportModal.tsx`):** Drag-and-drop dropzone, schema validation report, side-by-side collision resolver, and commit trigger.
7. **Company & Contact Intelligence Dossier (`components/admin/CompanyDossierDrawer.tsx`):** Detailed company profile drawer with contact verification tags and Kerala presence.
8. **Manual Single Lead Modal (`components/forms/ManualLeadCreateModal.tsx`):** Fast creation dialog.

### Out of Scope:
- No volunteer lead allocation matrix (Feature 03).
- No call logging, Call Mode overlay, or voice debriefs (Feature 04).
- No sponsorship pipeline stage progression mutations (Feature 05).
