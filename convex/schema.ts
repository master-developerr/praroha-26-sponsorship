import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.string(),
    semester: v.string(),
    department: v.string(),
    role: v.union(v.literal("admin"), v.literal("volunteer")),
    verificationStatus: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("suspended")
    ),
    rejectionReason: v.optional(v.string()),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    totalPoints: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_verification", ["verificationStatus"])
    .index("by_role", ["role"]),

  companies: defineTable({
    companyName: v.string(),
    normalizedName: v.string(),
    deduplicationHash: v.string(),
    industry: v.string(),
    niche: v.string(),
    priority: v.union(
      v.literal("High"),
      v.literal("Medium"),
      v.literal("Normal"),
      v.literal("Low")
    ),
    leadScore: v.optional(v.number()),
    website: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    location: v.optional(v.string()),
    companySize: v.optional(v.string()),
    annualRevenue: v.optional(v.string()),
    keralaPresence: v.optional(v.string()),
    sponsorshipHistory: v.optional(v.string()),
    sponsorshipEvidence: v.optional(v.string()),
    whyGoodLead: v.optional(v.string()),
    whyCompanyBenefits: v.optional(v.string()),
    recommendedSponsorshipType: v.optional(v.string()),
    recommendedAskMin: v.optional(v.number()),
    recommendedAskMax: v.optional(v.number()),
    alternativeSupport: v.optional(v.string()),
    source: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    leadStatus: v.union(
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
    ),
    notes: v.optional(v.string()),
    lastContactedAt: v.optional(v.number()),
    isArchived: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_norm_name", ["normalizedName"])
    .index("by_dedup_hash", ["deduplicationHash"])
    .index("by_lead_status", ["leadStatus"])
    .index("by_priority", ["priority"])
    .index("by_industry", ["industry"])
    .index("by_archived", ["isArchived"]),

  contacts: defineTable({
    companyId: v.id("companies"),
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
    linkedin: v.optional(v.string()),
    contactVerification: v.union(
      v.literal("VERIFIED_DECISION_MAKER"),
      v.literal("VERIFIED_COMPANY_REPRESENTATIVE"),
      v.literal("OFFICIAL_COMPANY_CONTACT"),
      v.literal("UNVERIFIED")
    ),
    contactSource: v.optional(v.string()),
    isPrimary: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_company_id", ["companyId"])
    .index("by_verification", ["contactVerification"]),

  leadAssignments: defineTable({
    companyId: v.id("companies"),
    volunteerId: v.id("users"),
    assignedBy: v.id("users"),
    status: v.union(
      v.literal("active"),
      v.literal("reassigned"),
      v.literal("released")
    ),
    priority: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    dailyTarget: v.optional(v.number()),
    instructions: v.optional(v.string()),
    reassignReason: v.optional(v.string()),
    assignedAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_company_id", ["companyId"])
    .index("by_volunteer_id", ["volunteerId"])
    .index("by_volunteer_and_status", ["volunteerId", "status"]),

  calls: defineTable({
    companyId: v.id("companies"),
    contactId: v.optional(v.id("contacts")),
    volunteerId: v.id("users"),
    quickOutcome: v.union(
      v.literal("Interested"),
      v.literal("Asked for proposal"),
      v.literal("Asked for budget"),
      v.literal("Wrong person"),
      v.literal("Call back"),
      v.literal("Rejected"),
      v.literal("Non-cash opportunity"),
      v.literal("Meeting requested"),
      v.literal("Other")
    ),
    startedAt: v.number(),
    endedAt: v.number(),
    durationSeconds: v.number(),
    createdAt: v.number(),
  })
    .index("by_company_id", ["companyId"])
    .index("by_volunteer_id", ["volunteerId"])
    .index("by_created_at", ["createdAt"]),

  callDebriefs: defineTable({
    callId: v.id("calls"),
    companyId: v.id("companies"),
    volunteerId: v.id("users"),
    discussionSummary: v.string(),
    interestLevel: v.union(
      v.literal("High"),
      v.literal("Medium"),
      v.literal("Low"),
      v.literal("None")
    ),
    decisionMakerStatus: v.string(),
    primaryObjection: v.optional(v.string()),
    importantInfoLearned: v.optional(v.string()),
    requestedAction: v.optional(v.string()),
    nextAction: v.optional(v.string()),
    debriefAudioStorageId: v.optional(v.string()),
    debriefTranscript: v.optional(v.string()),
    isVerifiedByAdmin: v.boolean(),
    verifiedBy: v.optional(v.id("users")),
    pointsAwarded: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_call_id", ["callId"])
    .index("by_company_id", ["companyId"])
    .index("by_volunteer_id", ["volunteerId"]),

  followUps: defineTable({
    companyId: v.id("companies"),
    volunteerId: v.id("users"),
    callId: v.optional(v.id("calls")),
    dueDate: v.number(),
    priority: v.union(
      v.literal("High"),
      v.literal("Medium"),
      v.literal("Low")
    ),
    notes: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_company_id", ["companyId"])
    .index("by_volunteer_id", ["volunteerId"])
    .index("by_volunteer_and_status", ["volunteerId", "status"])
    .index("by_due_date", ["dueDate"]),

  auditLogs: defineTable({
    actorId: v.string(),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    changes: v.string(),
    timestamp: v.number(),
  })
    .index("by_entity", ["entityType", "entityId"])
    .index("by_actor", ["actorId"])
    .index("by_timestamp", ["timestamp"]),

  proposals: defineTable({
    companyId: v.id("companies"),
    volunteerId: v.id("users"),
    packageTier: v.union(
      v.literal("Title"),
      v.literal("Co-Sponsor"),
      v.literal("Associate"),
      v.literal("Supporting"),
      v.literal("Community"),
      v.literal("Event Sponsor"),
      v.literal("Powered By"),
      v.literal("Custom"),
      v.literal("In-Kind")
    ),
    cashAmount: v.number(),
    inKindCategory: v.optional(
      v.union(
        v.literal("CASH"),
        v.literal("PRODUCT"),
        v.literal("SERVICES"),
        v.literal("TECHNICAL_SUPPORT"),
        v.literal("WORKSHOP"),
        v.literal("SPEAKER"),
        v.literal("PRIZES"),
        v.literal("SOFTWARE"),
        v.literal("MERCHANDISE"),
        v.literal("VENUE"),
        v.literal("PRINTING"),
        v.literal("TRANSPORTATION"),
        v.literal("OTHER_IN_KIND")
      )
    ),
    inKindDescription: v.optional(v.string()),
    inKindEstimatedValue: v.optional(v.number()),
    totalValuation: v.number(),
    deliverables: v.array(v.string()),
    customDeliverables: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("superseded")
    ),
    sentAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_company_id", ["companyId"])
    .index("by_volunteer_id", ["volunteerId"])
    .index("by_status", ["status"]),

  sponsorshipCommitments: defineTable({
    companyId: v.id("companies"),
    proposalId: v.optional(v.id("proposals")),
    volunteerId: v.id("users"),
    authorizedBy: v.id("users"),
    packageTier: v.string(),
    status: v.optional(
      v.union(
        v.literal("PROSPECT"),
        v.literal("NEGOTIATING"),
        v.literal("PROPOSED"),
        v.literal("VERBAL_COMMITMENT"),
        v.literal("CONFIRMED"),
        v.literal("DELIVERABLES_PENDING"),
        v.literal("COMPLETED"),
        v.literal("CANCELLED")
      )
    ),
    cashAmount: v.number(),
    inKindEstimatedValue: v.number(),
    totalValuation: v.number(),
    inKindCategory: v.optional(v.string()),
    inKindDescription: v.optional(v.string()),
    deliverablesCommitment: v.array(v.string()),
    mouReference: v.optional(v.string()),
    notes: v.optional(v.string()),
    authorizedAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_company_id", ["companyId"])
    .index("by_authorized_by", ["authorizedBy"])
    .index("by_volunteer_id", ["volunteerId"])
    .index("by_status", ["status"]),

  aiAnalyses: defineTable({
    companyId: v.id("companies"),
    type: v.union(
      v.literal("company_analysis"),
      v.literal("call_prep"),
      v.literal("alternative_ask"),
      v.literal("call_debrief"),
      v.literal("lead_priority")
    ),
    model: v.string(),
    promptVersion: v.string(),
    inputHash: v.string(),
    result: v.string(),
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_company_and_type", ["companyId", "type"])
    .index("by_input_hash", ["inputHash"]),

  pointTransactions: defineTable({
    userId: v.id("users"),
    points: v.number(),
    reason: v.string(),
    category: v.union(
      v.literal("call_logged"),
      v.literal("decision_maker_reached"),
      v.literal("proposal_requested"),
      v.literal("sponsorship_won"),
      v.literal("admin_adjustment")
    ),
    sourceId: v.string(),
    awardedBy: v.optional(v.id("users")),
    createdAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_source_id", ["sourceId"])
    .index("by_created_at", ["createdAt"]),

  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("lead_assigned"),
      v.literal("follow_up_due"),
      v.literal("lead_reassigned"),
      v.literal("volunteer_approved"),
      v.literal("volunteer_rejected"),
      v.literal("volunteer_suspended"),
      v.literal("deal_won"),
      v.literal("announcement"),
      v.literal("general")
    ),
    read: v.boolean(),
    link: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_and_read", ["userId", "read"])
    .index("by_created_at", ["createdAt"]),

  pointConfigurations: defineTable({
    eventType: v.string(), // e.g. "call_completed", "lead_contacted", "positive_response", "meeting_obtained", "proposal_generated", "sponsorship_won"
    points: v.number(),
    label: v.string(),
    description: v.string(),
    updatedBy: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_event_type", ["eventType"]),
});


