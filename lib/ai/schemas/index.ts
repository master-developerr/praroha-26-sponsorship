import { z } from "zod";

export const companyAnalysisSchema = z.object({
  companyFitScore: z.number().min(0).max(100),
  priority: z.enum(["HIGH", "MEDIUM", "NORMAL", "LOW"]),
  industryRelevance: z.string(),
  keralaRelevance: z.string(),
  studentAudienceFit: z.string(),
  civilEngineeringRelevance: z.string(),
  sponsorshipPotential: z.string(),
  whyThisCompany: z.array(z.string()),
  potentialBenefitsToCompany: z.array(z.string()),
  recommendedApproach: z.array(z.string()),
  recommendedContactDepartment: z.array(z.string()),
  recommendedAsk: z.object({
    tier: z.enum([
      "Title",
      "Co-Sponsor",
      "Associate",
      "Supporting",
      "Community",
      "Event Sponsor",
      "Powered By",
      "Custom",
      "In-Kind",
    ]),
    minAmount: z.number(),
    maxAmount: z.number(),
    rationale: z.string(),
  }),
  alternativeAsks: z.array(z.string()),
  likelyObjections: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

export const callPreparationSchema = z.object({
  callObjective: z.array(z.string()),
  openingAngle: z.array(z.string()),
  whyThisCompany: z.array(z.string()),
  keyTalkingPoints: z.array(z.string()),
  valueToCompany: z.array(z.string()),
  whatToAsk: z.array(z.string()),
  likelyObjections: z.array(
    z.object({
      objection: z.string(),
      howToRespond: z.string(),
    })
  ),
  alternativeRequests: z.array(z.string()),
  nextStep: z.array(z.string()),
});

export const alternativeAskSchema = z.object({
  summary: z.string(),
  alternatives: z.array(
    z.object({
      category: z.enum([
        "CASH",
        "PRODUCT",
        "SERVICES",
        "TECHNICAL_SUPPORT",
        "WORKSHOP",
        "SPEAKER",
        "PRIZES",
        "SOFTWARE",
        "MERCHANDISE",
        "VENUE",
        "PRINTING",
        "TRANSPORTATION",
        "OTHER_IN_KIND",
      ]),
      title: z.string(),
      description: z.string(),
      estimatedValueINR: z.number(),
      valueToPraroha: z.string(),
      companyFeasibility: z.string(),
    })
  ),
});

export const callDebriefSchema = z.object({
  detectedOutcome: z.string(),
  interestLevel: z.enum(["High", "Medium", "Low", "None"]),
  rejectionReason: z.string().optional(),
  objectionAnalysis: z.string().optional(),
  positiveSignals: z.array(z.string()),
  negativeSignals: z.array(z.string()),
  whatVolunteerDidWell: z.array(z.string()),
  whatCouldImprove: z.array(z.string()),
  recommendedNextAction: z.string(),
  followUpSuggestion: z
    .object({
      recommendedDaysFromNow: z.number(),
      priority: z.enum(["High", "Medium", "Low"]),
      notes: z.string(),
    })
    .optional(),
});

export const leadPrioritySchema = z.object({
  priorityScore: z.number().min(0).max(100),
  priorityLevel: z.enum(["HIGH", "MEDIUM", "NORMAL", "LOW"]),
  reasons: z.array(z.string()),
  nextRecommendedAction: z.string(),
  deterministicFactors: z.object({
    industryRelevance: z.number(),
    keralaPresence: z.number(),
    studentAudienceFit: z.number(),
    civilEngineeringFit: z.number(),
  }),
});

export const voiceDebriefExtractionSchema = z.object({
  transcript: z.string(),
  discussionSummary: z.string(),
  detectedOutcome: z.enum([
    "Interested",
    "Asked for proposal",
    "Asked for budget",
    "Wrong person",
    "Call back",
    "Rejected",
    "Non-cash opportunity",
    "Meeting requested",
    "Other",
  ]),
  targetLeadStatus: z.enum([
    "UNASSIGNED",
    "ASSIGNED",
    "CONTACTED",
    "INTERESTED",
    "FOLLOW_UP",
    "PROPOSAL_REQUESTED",
    "PROPOSAL_SENT",
    "NEGOTIATION",
    "WON",
    "LOST",
  ]),
  interestLevel: z.enum(["High", "Medium", "Low", "None"]),
  decisionMakerStatus: z.string(),
  primaryObjection: z.string().optional(),
  positiveSignals: z.array(z.string()),
  negativeSignals: z.array(z.string()),
  whatVolunteerDidWell: z.array(z.string()),
  whatCouldImprove: z.array(z.string()),
  recommendedNextAction: z.string(),
  followUpSuggestion: z
    .object({
      recommendedDaysFromNow: z.number(),
      priority: z.enum(["High", "Medium", "Low"]),
      notes: z.string(),
    })
    .optional(),
});

