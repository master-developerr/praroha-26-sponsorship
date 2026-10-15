import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Get high-level directory metrics for master lead management
 */
export const getCompanyMetrics = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("companies").collect();
    const total = all.length;
    const unassigned = all.filter((c) => c.leadStatus === "UNASSIGNED").length;
    const won = all.filter((c) => c.leadStatus === "WON").length;
    const lost = all.filter((c) => c.leadStatus === "LOST").length;
    const inPipeline = total - unassigned - won - lost;

    return {
      total,
      unassigned,
      inPipeline,
      won,
      lost,
    };
  },
});

/**
 * Get all company leads with search, multi-attribute filters, and primary contact
 */
export const getAllCompanies = query({
  args: {
    search: v.optional(v.string()),
    industry: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let companies = await ctx.db.query("companies").order("desc").collect();

    // In-memory multi-attribute filtering for real-time reactivity
    if (args.industry && args.industry !== "all") {
      companies = companies.filter((c) => c.industry === args.industry);
    }
    if (args.status && args.status !== "all") {
      companies = companies.filter((c) => c.leadStatus === args.status);
    }
    if (args.priority && args.priority !== "all") {
      companies = companies.filter((c) => c.priority === args.priority);
    }
    if (args.search && args.search.trim().length > 0) {
      const q = args.search.toLowerCase().trim();
      companies = companies.filter(
        (c) =>
          c.companyName.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.niche.toLowerCase().includes(q) ||
          (c.location && c.location.toLowerCase().includes(q))
      );
    }

    // Attach primary contact and active assigned volunteer for each company
    const results = await Promise.all(
      companies.map(async (company) => {
        const contacts = await ctx.db
          .query("contacts")
          .withIndex("by_company_id", (q) => q.eq("companyId", company._id))
          .collect();

        const primaryContact = contacts.find((ct) => ct.isPrimary) || contacts[0] || null;

        // Lookup active assignment
        const activeAssignment = await ctx.db
          .query("leadAssignments")
          .withIndex("by_company_id", (q) => q.eq("companyId", company._id))
          .filter((q) => q.eq(q.field("status"), "active"))
          .first();

        let assignedVolunteer = null;
        if (activeAssignment) {
          const volunteerUser = await ctx.db.get(activeAssignment.volunteerId);
          if (volunteerUser) {
            assignedVolunteer = {
              _id: volunteerUser._id,
              name: volunteerUser.name,
              department: volunteerUser.department,
              assignedAt: activeAssignment.assignedAt,
            };
          }
        }

        return {
          ...company,
          primaryContact,
          totalContacts: contacts.length,
          assignedVolunteer,
        };
      })
    );


    return results;
  },
});

/**
 * Get distinct industries for filtering
 */
export const getDistinctIndustries = query({
  args: {},
  handler: async (ctx) => {
    const companies = await ctx.db.query("companies").collect();
    const set = new Set<string>();
    companies.forEach((c) => {
      if (c.industry) set.add(c.industry);
    });
    return Array.from(set).sort();
  },
});

/**
 * Get full company dossier + all associated contacts
 */
export const getCompanyDetails = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    if (!company) return null;

    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
      .collect();

    return {
      ...company,
      contacts,
    };
  },
});

/**
 * 4-Way Duplicate Detection Batch Query
 */
export const checkDuplicatesBatch = query({
  args: {
    items: v.array(
      v.object({
        rowIndex: v.number(),
        normalizedName: v.string(),
        namePhoneHash: v.string(),
        nameEmailHash: v.string(),
        domain: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const collisions: Array<{
      rowIndex: number;
      matchedBy: "name" | "phone" | "email" | "domain";
      existingCompanyId: Id<"companies">;
      existingCompanyName: string;
      existingContactName?: string;
      existingPhone?: string;
    }> = [];

    // Pre-fetch all companies to perform fast in-memory indexing for the batch
    const allCompanies = await ctx.db.query("companies").collect();
    const allContacts = await ctx.db.query("contacts").collect();

    const companyByName = new Map<string, typeof allCompanies[0]>();
    const companyByDomain = new Map<string, typeof allCompanies[0]>();

    allCompanies.forEach((comp) => {
      companyByName.set(comp.normalizedName, comp);
      if (comp.website) {
        const d = comp.website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0].toLowerCase().trim();
        if (d) companyByDomain.set(d, comp);
      }
    });

    const contactByPhone = new Map<string, typeof allContacts[0]>();
    const contactByEmail = new Map<string, typeof allContacts[0]>();

    allContacts.forEach((ct) => {
      const digits = ct.phone.replace(/\D/g, "");
      const p = digits.length >= 10 ? digits.slice(-10) : digits;
      if (p) contactByPhone.set(p, ct);
      if (ct.email) contactByEmail.set(ct.email.trim().toLowerCase(), ct);
    });

    for (const item of args.items) {
      // 1. Normalized Name check
      if (item.normalizedName && companyByName.has(item.normalizedName)) {
        const comp = companyByName.get(item.normalizedName)!;
        collisions.push({
          rowIndex: item.rowIndex,
          matchedBy: "name",
          existingCompanyId: comp._id,
          existingCompanyName: comp.companyName,
        });
        continue;
      }

      // 2. Name + Phone check
      if (item.namePhoneHash) {
        const phone = item.namePhoneHash.split(":")[1];
        if (phone && contactByPhone.has(phone)) {
          const ct = contactByPhone.get(phone)!;
          const comp = allCompanies.find((c) => c._id === ct.companyId);
          if (comp) {
            collisions.push({
              rowIndex: item.rowIndex,
              matchedBy: "phone",
              existingCompanyId: comp._id,
              existingCompanyName: comp.companyName,
              existingContactName: ct.contactName,
              existingPhone: ct.phone,
            });
            continue;
          }
        }
      }

      // 3. Name + Email check
      if (item.nameEmailHash) {
        const email = item.nameEmailHash.split(":")[1];
        if (email && contactByEmail.has(email)) {
          const ct = contactByEmail.get(email)!;
          const comp = allCompanies.find((c) => c._id === ct.companyId);
          if (comp) {
            collisions.push({
              rowIndex: item.rowIndex,
              matchedBy: "email",
              existingCompanyId: comp._id,
              existingCompanyName: comp.companyName,
              existingContactName: ct.contactName,
            });
            continue;
          }
        }
      }

      // 4. Domain check
      if (item.domain && companyByDomain.has(item.domain)) {
        const comp = companyByDomain.get(item.domain)!;
        collisions.push({
          rowIndex: item.rowIndex,
          matchedBy: "domain",
          existingCompanyId: comp._id,
          existingCompanyName: comp.companyName,
        });
      }
    }

    return collisions;
  },
});

/**
 * Batch Lead Ingestion Mutation with Skip, Merge, and New Contact handling
 */
export const importLeadsBatch = mutation({
  args: {
    adminClerkId: v.string(),
    rows: v.array(
      v.object({
        company_name: v.string(),
        industry: v.string(),
        niche: v.string(),
        priority: v.union(
          v.literal("High"),
          v.literal("Medium"),
          v.literal("Normal"),
          v.literal("Low")
        ),
        lead_score: v.optional(v.number()),
        contact_name: v.string(),
        contact_designation: v.string(),
        phone: v.string(),
        email: v.optional(v.string()),
        location: v.optional(v.string()),
        website: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        company_size: v.optional(v.string()),
        annual_revenue: v.optional(v.string()),
        kerala_presence: v.optional(v.string()),
        sponsorship_history: v.optional(v.string()),
        sponsorship_evidence: v.optional(v.string()),
        why_good_lead: v.optional(v.string()),
        why_company_benefits: v.optional(v.string()),
        recommended_sponsorship_type: v.optional(v.string()),
        recommended_ask_min: v.optional(v.number()),
        recommended_ask_max: v.optional(v.number()),
        alternative_support: v.optional(v.string()),
        source: v.optional(v.string()),
        source_url: v.optional(v.string()),
        contact_source: v.optional(v.string()),
        contact_verified: v.union(
          v.literal("VERIFIED_DECISION_MAKER"),
          v.literal("VERIFIED_COMPANY_REPRESENTATIVE"),
          v.literal("OFFICIAL_COMPANY_CONTACT"),
          v.literal("UNVERIFIED")
        ),
        notes: v.optional(v.string()),
        conflictAction: v.optional(
          v.union(v.literal("skip"), v.literal("merge"), v.literal("new_contact"))
        ),
        existingCompanyId: v.optional(v.id("companies")),
      })
    ),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .unique();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can import leads");
    }

    const now = Date.now();
    let imported = 0;
    let merged = 0;
    let skipped = 0;

    for (const row of args.rows) {
      if (row.conflictAction === "skip") {
        skipped++;
        continue;
      }

      // Handle Merge onto existing company
      if (row.conflictAction === "merge" && row.existingCompanyId) {
        const patch: Record<string, unknown> = { updatedAt: now };
        if (row.website) patch.website = row.website;
        if (row.location) patch.location = row.location;
        if (row.company_size) patch.companySize = row.company_size;
        if (row.annual_revenue) patch.annualRevenue = row.annual_revenue;
        if (row.kerala_presence) patch.keralaPresence = row.kerala_presence;
        if (row.sponsorship_history) patch.sponsorshipHistory = row.sponsorship_history;
        if (row.why_good_lead) patch.whyGoodLead = row.why_good_lead;
        if (row.notes) patch.notes = row.notes;

        await ctx.db.patch(row.existingCompanyId, patch);

        // Also add contact if provided
        await ctx.db.insert("contacts", {
          companyId: row.existingCompanyId,
          contactName: row.contact_name,
          designation: row.contact_designation,
          phone: row.phone,
          phoneType: "unknown",
          email: row.email,
          linkedin: row.linkedin,
          contactVerification: row.contact_verified,
          contactSource: row.contact_source || "Merged CSV Import",
          isPrimary: false,
          createdAt: now,
        });

        merged++;
        continue;
      }

      // Handle New Contact onto existing company
      if (row.conflictAction === "new_contact" && row.existingCompanyId) {
        await ctx.db.insert("contacts", {
          companyId: row.existingCompanyId,
          contactName: row.contact_name,
          designation: row.contact_designation,
          phone: row.phone,
          phoneType: "unknown",
          email: row.email,
          linkedin: row.linkedin,
          contactVerification: row.contact_verified,
          contactSource: row.contact_source || "CSV Import New Contact",
          isPrimary: false,
          createdAt: now,
        });
        merged++;
        continue;
      }

      // Normal Insert: Fresh company + primary contact
      const normName = row.company_name.toLowerCase().replace(/[^\w\s]/gi, " ").trim();
      const dedupHash = `${normName}:${row.phone.replace(/\D/g, "")}`;

      const companyId = await ctx.db.insert("companies", {
        companyName: row.company_name,
        normalizedName: normName,
        deduplicationHash: dedupHash,
        industry: row.industry,
        niche: row.niche,
        priority: row.priority,
        leadScore: row.lead_score,
        website: row.website,
        linkedin: row.linkedin,
        location: row.location,
        companySize: row.company_size,
        annualRevenue: row.annual_revenue,
        keralaPresence: row.kerala_presence,
        sponsorshipHistory: row.sponsorship_history,
        sponsorshipEvidence: row.sponsorship_evidence,
        whyGoodLead: row.why_good_lead,
        whyCompanyBenefits: row.why_company_benefits,
        recommendedSponsorshipType: row.recommended_sponsorship_type || "CASH",
        recommendedAskMin: row.recommended_ask_min,
        recommendedAskMax: row.recommended_ask_max,
        alternativeSupport: row.alternative_support,
        source: row.source || "Admin CSV Import",
        sourceUrl: row.source_url,
        leadStatus: "UNASSIGNED",
        notes: row.notes,
        createdAt: now,
        updatedAt: now,
      });

      await ctx.db.insert("contacts", {
        companyId,
        contactName: row.contact_name,
        designation: row.contact_designation,
        phone: row.phone,
        phoneType: "unknown",
        email: row.email,
        linkedin: row.linkedin,
        contactVerification: row.contact_verified,
        contactSource: row.contact_source || "CSV Import",
        isPrimary: true,
        createdAt: now,
        updatedAt: now,
      });

      imported++;
    }

    // Record audit log
    await ctx.db.insert("auditLogs", {
      actorId: args.adminClerkId,
      action: "csv_import_batch",
      entityType: "companies",
      entityId: "batch_import",
      changes: JSON.stringify({
        totalProcessed: args.rows.length,
        imported,
        merged,
        skipped,
      }),
      timestamp: now,
    });

    return { imported, merged, skipped };
  },
});

/**
 * Create a single company and primary contact manually
 */
export const createSingleLead = mutation({
  args: {
    adminClerkId: v.string(),
    companyName: v.string(),
    industry: v.string(),
    niche: v.string(),
    priority: v.union(
      v.literal("High"),
      v.literal("Medium"),
      v.literal("Normal"),
      v.literal("Low")
    ),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    notes: v.optional(v.string()),
    contactName: v.string(),
    designation: v.string(),
    phone: v.string(),
    phoneType: v.union(
      v.literal("direct_official"),
      v.literal("office"),
      v.literal("regional_office"),
      v.literal("department"),
      v.literal("switchboard"),
      v.literal("unknown")
    ),
    email: v.optional(v.string()),
    contactVerification: v.union(
      v.literal("VERIFIED_DECISION_MAKER"),
      v.literal("VERIFIED_COMPANY_REPRESENTATIVE"),
      v.literal("OFFICIAL_COMPANY_CONTACT"),
      v.literal("UNVERIFIED")
    ),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .unique();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can create new company leads");
    }

    const now = Date.now();
    const normName = args.companyName.toLowerCase().replace(/[^\w\s]/gi, " ").trim();
    const dedupHash = `${normName}:${args.phone.replace(/\D/g, "")}`;

    const companyId = await ctx.db.insert("companies", {
      companyName: args.companyName.trim(),
      normalizedName: normName,
      deduplicationHash: dedupHash,
      industry: args.industry.trim(),
      niche: args.niche.trim(),
      priority: args.priority,
      location: args.location?.trim(),
      website: args.website?.trim(),
      notes: args.notes?.trim(),
      leadStatus: "UNASSIGNED",
      createdAt: now,
      updatedAt: now,
    });

    const contactId = await ctx.db.insert("contacts", {
      companyId,
      contactName: args.contactName.trim(),
      designation: args.designation.trim(),
      phone: args.phone.trim(),
      phoneType: args.phoneType,
      email: args.email?.trim(),
      contactVerification: args.contactVerification,
      isPrimary: true,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      actorId: args.adminClerkId,
      action: "create_single_lead",
      entityType: "companies",
      entityId: companyId,
      changes: JSON.stringify({
        companyName: args.companyName,
        contactName: args.contactName,
      }),
      timestamp: now,
    });

    return { companyId, contactId };
  },
});

/**
 * Update an existing company lead and its primary contact
 */
export const updateLead = mutation({
  args: {
    adminClerkId: v.string(),
    companyId: v.id("companies"),
    companyName: v.string(),
    industry: v.string(),
    niche: v.string(),
    priority: v.union(
      v.literal("High"),
      v.literal("Medium"),
      v.literal("Normal"),
      v.literal("Low")
    ),
    leadStatus: v.optional(
      v.union(
        v.literal("UNASSIGNED"),
        v.literal("ASSIGNED"),
        v.literal("CONTACTED"),
        v.literal("INTERESTED"),
        v.literal("FOLLOW_UP"),
        v.literal("PROPOSAL_REQUESTED"),
        v.literal("PROPOSAL_SENT"),
        v.literal("NEGOTIATION"),
        v.literal("WON"),
        v.literal("LOST")
      )
    ),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    notes: v.optional(v.string()),
    recommendedSponsorshipType: v.optional(v.string()),
    recommendedAskMin: v.optional(v.number()),
    recommendedAskMax: v.optional(v.number()),
    alternativeSupport: v.optional(v.string()),
    contactId: v.optional(v.id("contacts")),
    contactName: v.string(),
    designation: v.string(),
    phone: v.string(),
    phoneType: v.union(
      v.literal("direct_official"),
      v.literal("office"),
      v.literal("regional_office"),
      v.literal("department"),
      v.literal("switchboard"),
      v.literal("unknown")
    ),
    email: v.optional(v.string()),
    contactVerification: v.union(
      v.literal("VERIFIED_DECISION_MAKER"),
      v.literal("VERIFIED_COMPANY_REPRESENTATIVE"),
      v.literal("OFFICIAL_COMPANY_CONTACT"),
      v.literal("UNVERIFIED")
    ),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .unique();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can update company leads");
    }

    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error("Company lead not found");
    }

    const now = Date.now();
    const normName = args.companyName.toLowerCase().replace(/[^\w\s]/gi, " ").trim();
    const dedupHash = `${normName}:${args.phone.replace(/\D/g, "")}`;

    await ctx.db.patch(args.companyId, {
      companyName: args.companyName.trim(),
      normalizedName: normName,
      deduplicationHash: dedupHash,
      industry: args.industry.trim(),
      niche: args.niche.trim(),
      priority: args.priority,
      ...(args.leadStatus ? { leadStatus: args.leadStatus } : {}),
      location: args.location?.trim(),
      website: args.website?.trim(),
      notes: args.notes?.trim(),
      recommendedSponsorshipType: args.recommendedSponsorshipType?.trim(),
      recommendedAskMin: args.recommendedAskMin,
      recommendedAskMax: args.recommendedAskMax,
      alternativeSupport: args.alternativeSupport?.trim(),
      updatedAt: now,
    });

    if (args.contactId) {
      await ctx.db.patch(args.contactId, {
        contactName: args.contactName.trim(),
        designation: args.designation.trim(),
        phone: args.phone.trim(),
        phoneType: args.phoneType,
        email: args.email?.trim(),
        contactVerification: args.contactVerification,
        updatedAt: now,
      });
    } else {
      const existingContact = await ctx.db
        .query("contacts")
        .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
        .first();

      if (existingContact) {
        await ctx.db.patch(existingContact._id, {
          contactName: args.contactName.trim(),
          designation: args.designation.trim(),
          phone: args.phone.trim(),
          phoneType: args.phoneType,
          email: args.email?.trim(),
          contactVerification: args.contactVerification,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("contacts", {
          companyId: args.companyId,
          contactName: args.contactName.trim(),
          designation: args.designation.trim(),
          phone: args.phone.trim(),
          phoneType: args.phoneType,
          email: args.email?.trim(),
          contactVerification: args.contactVerification,
          isPrimary: true,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    await ctx.db.insert("auditLogs", {
      actorId: admin._id,
      action: "update_lead",
      entityType: "companies",
      entityId: args.companyId,
      changes: JSON.stringify({
        companyName: args.companyName,
        industry: args.industry,
        priority: args.priority,
        status: args.leadStatus,
      }),
      timestamp: now,
    });

    return { success: true };
  },
});

/**
 * Delete a company lead and clean up related records
 */
export const deleteLead = mutation({
  args: {
    adminClerkId: v.string(),
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .unique();

    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can delete company leads");
    }

    const company = await ctx.db.get(args.companyId);
    if (!company) {
      throw new Error("Company lead not found");
    }

    // 1. Delete associated contacts
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
      .collect();

    for (const ct of contacts) {
      await ctx.db.delete(ct._id);
    }

    // 2. Delete associated lead assignments
    const assignments = await ctx.db
      .query("leadAssignments")
      .withIndex("by_company_id", (q) => q.eq("companyId", args.companyId))
      .collect();

    for (const a of assignments) {
      await ctx.db.delete(a._id);
    }

    // 3. Delete company record
    await ctx.db.delete(args.companyId);

    // 4. Audit Log
    const now = Date.now();
    await ctx.db.insert("auditLogs", {
      actorId: admin._id,
      action: "delete_lead",
      entityType: "companies",
      entityId: args.companyId,
      changes: JSON.stringify({
        deletedCompanyName: company.companyName,
        deletedAt: now,
      }),
      timestamp: now,
    });

    return { success: true };
  },
});
