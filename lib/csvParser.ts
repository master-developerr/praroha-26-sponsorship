/**
 * Canonical 29-Field CSV Parser and Validator for PRAROHA'26
 */

import { generateDuplicateHashes, DuplicateDetectionHashes } from "./deduplication";

export const CANONICAL_FIELDS = [
  "company_name",
  "industry",
  "niche",
  "priority",
  "lead_score",
  "contact_name",
  "contact_designation",
  "phone",
  "email",
  "location",
  "website",
  "linkedin",
  "company_size",
  "annual_revenue",
  "kerala_presence",
  "sponsorship_history",
  "sponsorship_evidence",
  "why_good_lead",
  "why_company_benefits",
  "recommended_sponsorship_type",
  "recommended_ask_min",
  "recommended_ask_max",
  "alternative_support",
  "source",
  "source_url",
  "contact_source",
  "contact_verified",
  "notes",
  "lead_status",
] as const;

export const REQUIRED_FIELDS = [
  "company_name",
  "industry",
  "niche",
  "priority",
  "contact_name",
  "contact_designation",
  "phone",
] as const;

export interface CanonicalLeadRow {
  company_name: string;
  industry: string;
  niche: string;
  priority: "High" | "Medium" | "Normal" | "Low";
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
  recommended_sponsorship_type?: string;
  recommended_ask_min?: number;
  recommended_ask_max?: number;
  alternative_support?: string;
  source?: string;
  source_url?: string;
  contact_source?: string;
  contact_verified?: "VERIFIED_DECISION_MAKER" | "VERIFIED_COMPANY_REPRESENTATIVE" | "OFFICIAL_COMPANY_CONTACT" | "UNVERIFIED";
  notes?: string;
  lead_status?: string;

  // Computed hashes
  hashes: DuplicateDetectionHashes;
  rowNumber: number;
}

export interface InvalidRowReport {
  rowNumber: number;
  rawData: Record<string, string>;
  errors: string[];
}

export interface ParseResult {
  totalRows: number;
  validRows: CanonicalLeadRow[];
  invalidRows: InvalidRowReport[];
  missingRequiredHeaders: string[];
}

/**
 * Robust CSV Line Splitter supporting quoted values with internal commas
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeHeaderKey(header: string): string {
  return header
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

export function parseCanonicalCsv(csvContent: string): ParseResult {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return {
      totalRows: 0,
      validRows: [],
      invalidRows: [],
      missingRequiredHeaders: [...REQUIRED_FIELDS],
    };
  }

  // Parse header line
  const rawHeaders = parseCsvLine(lines[0]);
  const headerMap: Record<string, number> = {};
  rawHeaders.forEach((h, idx) => {
    headerMap[normalizeHeaderKey(h)] = idx;
  });

  // Verify presence of mandatory headers
  const missingRequiredHeaders = REQUIRED_FIELDS.filter(
    (req) => !(req in headerMap)
  );

  const validRows: CanonicalLeadRow[] = [];
  const invalidRows: InvalidRowReport[] = [];

  for (let r = 1; r < lines.length; r++) {
    const rowValues = parseCsvLine(lines[r]);
    const rawData: Record<string, string> = {};
    Object.keys(headerMap).forEach((key) => {
      rawData[key] = rowValues[headerMap[key]] || "";
    });

    const errors: string[] = [];

    // Check mandatory fields
    const company_name = rawData["company_name"] || "";
    const industry = rawData["industry"] || "";
    const niche = rawData["niche"] || "";
    const contact_name = rawData["contact_name"] || "";
    const contact_designation = rawData["contact_designation"] || "";
    const phone = rawData["phone"] || "";

    if (!company_name) errors.push("Missing company_name");
    if (!industry) errors.push("Missing industry");
    if (!niche) errors.push("Missing niche");
    if (!contact_name) errors.push("Missing contact_name");
    if (!contact_designation) errors.push("Missing contact_designation");
    if (!phone) errors.push("Missing phone number");

    // Normalize priority
    let priority: "High" | "Medium" | "Normal" | "Low" = "Medium";
    const rawPriority = (rawData["priority"] || "").toLowerCase();
    if (rawPriority.includes("high") || rawPriority.includes("p0") || rawPriority.includes("p1") || rawPriority.includes("critical")) priority = "High";
    else if (rawPriority.includes("normal") || rawPriority.includes("p2")) priority = "Normal";
    else if (rawPriority.includes("low") || rawPriority.includes("p3")) priority = "Low";
    else if (rawPriority.includes("medium")) priority = "Medium";

    // Normalize contact verification level
    let contact_verified: "VERIFIED_DECISION_MAKER" | "VERIFIED_COMPANY_REPRESENTATIVE" | "OFFICIAL_COMPANY_CONTACT" | "UNVERIFIED" = "UNVERIFIED";
    const rawVer = (rawData["contact_verified"] || "").toUpperCase();
    if (rawVer.includes("DECISION")) contact_verified = "VERIFIED_DECISION_MAKER";
    else if (rawVer.includes("REPRESENTATIVE")) contact_verified = "VERIFIED_COMPANY_REPRESENTATIVE";
    else if (rawVer.includes("OFFICIAL")) contact_verified = "OFFICIAL_COMPANY_CONTACT";

    const website = rawData["website"] || undefined;
    const email = rawData["email"] || undefined;

    if (errors.length > 0) {
      invalidRows.push({
        rowNumber: r + 1,
        rawData,
        errors,
      });
    } else {
      const hashes = generateDuplicateHashes(company_name, phone, email, website);
      validRows.push({
        company_name,
        industry,
        niche,
        priority,
        lead_score: rawData["lead_score"] ? Number(rawData["lead_score"]) : undefined,
        contact_name,
        contact_designation,
        phone,
        email,
        location: rawData["location"] || undefined,
        website,
        linkedin: rawData["linkedin"] || undefined,
        company_size: rawData["company_size"] || undefined,
        annual_revenue: rawData["annual_revenue"] || undefined,
        kerala_presence: rawData["kerala_presence"] || undefined,
        sponsorship_history: rawData["sponsorship_history"] || undefined,
        sponsorship_evidence: rawData["sponsorship_evidence"] || undefined,
        why_good_lead: rawData["why_good_lead"] || undefined,
        why_company_benefits: rawData["why_company_benefits"] || undefined,
        recommended_sponsorship_type: rawData["recommended_sponsorship_type"] || "CASH",
        recommended_ask_min: rawData["recommended_ask_min"] ? Number(rawData["recommended_ask_min"]) : undefined,
        recommended_ask_max: rawData["recommended_ask_max"] ? Number(rawData["recommended_ask_max"]) : undefined,
        alternative_support: rawData["alternative_support"] || undefined,
        source: rawData["source"] || "Admin CSV Import",
        source_url: rawData["source_url"] || undefined,
        contact_source: rawData["contact_source"] || undefined,
        contact_verified,
        notes: rawData["notes"] || undefined,
        lead_status: "UNASSIGNED",
        hashes,
        rowNumber: r + 1,
      });
    }
  }

  return {
    totalRows: lines.length - 1,
    validRows,
    invalidRows,
    missingRequiredHeaders,
  };
}

export function generateCsvTemplate(): string {
  const header = CANONICAL_FIELDS.join(",");
  const sampleRow = [
    "UltraTech Cement Ltd",
    "Construction Materials",
    "Cement & Concrete",
    "High",
    "90",
    "K. Ramanathan",
    "Regional Head South India",
    "9847123456",
    "k.ramanathan@ultratech.com",
    "Kochi / Mumbai",
    "https://www.ultratechcement.com",
    "https://linkedin.com/in/kramanathan",
    "10000+",
    "50000 Cr+",
    "Large manufacturing presence in Palakkad & depots across Ernakulam",
    "Sponsored CREDAI Conclave 2024",
    "https://credaikerala.com/sponsors",
    "Largest civil construction material brand in Kerala, ideal for SOE civil techfest",
    "Direct talent engagement with 2500+ civil engineering students and alumni",
    "CASH",
    "200000",
    "500000",
    "Technical keynote, concrete mix design workshop",
    "Alumni Industry Referral",
    "https://civil.cusat.ac.in",
    "Direct Regional Desk",
    "VERIFIED_DECISION_MAKER",
    "Prioritize early outreach before Q4 marketing budget freeze",
    "UNASSIGNED",
  ].map((v) => (v.includes(",") ? `"${v}"` : v)).join(",");

  return `${header}\n${sampleRow}\n`;
}
