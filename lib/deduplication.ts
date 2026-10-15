/**
 * 4-Way Duplicate Detection & Hashing Algorithms for PRAROHA'26
 */

export function normalizeCompanyName(name: string): string {
  if (!name) return "";
  let clean = name.toLowerCase().trim();

  // Strip punctuation except alphanumeric and spaces
  clean = clean.replace(/[^\w\s]/gi, " ");

  // Strip common corporate suffixes
  const suffixes = [
    /\bprivate limited\b/g,
    /\bpvt ltd\b/g,
    /\blimited\b/g,
    /\bltd\b/g,
    /\bcorporation\b/g,
    /\bcorp\b/g,
    /\bllc\b/g,
    /\binc\b/g,
    /\bincorporated\b/g,
    /\bco\b/g,
    /\bcompany\b/g,
  ];

  for (const suffix of suffixes) {
    clean = clean.replace(suffix, " ");
  }

  // Collapse consecutive whitespace
  return clean.replace(/\s+/g, " ").trim();
}

export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  // Take last 10 digits if available to handle international prefixes like +91
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export function extractApexDomain(url: string): string {
  if (!url) return "";
  try {
    let normalizedUrl = url.trim().toLowerCase();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl;
    }
    const hostname = new URL(normalizedUrl).hostname;
    const parts = hostname.replace(/^www\./, "").split(".");
    if (parts.length >= 2) {
      return parts.slice(-2).join(".");
    }
    return hostname;
  } catch {
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0].toLowerCase().trim();
  }
}

export interface DuplicateDetectionHashes {
  normalizedName: string;
  namePhoneHash: string;
  nameEmailHash: string;
  domain: string;
}

export function generateDuplicateHashes(
  companyName: string,
  phone?: string,
  email?: string,
  website?: string
): DuplicateDetectionHashes {
  const normName = normalizeCompanyName(companyName);
  const cleanPhone = phone ? sanitizePhoneNumber(phone) : "";
  const cleanEmail = email ? email.trim().toLowerCase() : "";
  const cleanDomain = website ? extractApexDomain(website) : "";

  return {
    normalizedName: normName,
    namePhoneHash: cleanPhone ? `${normName}:${cleanPhone}` : "",
    nameEmailHash: cleanEmail ? `${normName}:${cleanEmail}` : "",
    domain: cleanDomain,
  };
}
