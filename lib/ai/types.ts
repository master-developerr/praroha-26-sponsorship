import { LeadStage, PriorityLevel, SponsorshipCategory, SponsorshipTier } from "@/types";

export interface CompanyAnalysisResult {
  companyFitScore: number;
  priority: "HIGH" | "MEDIUM" | "NORMAL" | "LOW";
  industryRelevance: string;
  keralaRelevance: string;
  studentAudienceFit: string;
  civilEngineeringRelevance: string;
  sponsorshipPotential: string;
  whyThisCompany: string[];
  potentialBenefitsToCompany: string[];
  recommendedApproach: string[];
  recommendedContactDepartment: string[];
  recommendedAsk: {
    tier: SponsorshipTier;
    minAmount: number;
    maxAmount: number;
    rationale: string;
  };
  alternativeAsks: string[];
  likelyObjections: string[];
  confidence: number;
}

export interface CallPreparationResult {
  callObjective: string[];
  openingAngle: string[];
  whyThisCompany: string[];
  keyTalkingPoints: string[];
  valueToCompany: string[];
  whatToAsk: string[];
  likelyObjections: Array<{
    objection: string;
    howToRespond: string;
  }>;
  alternativeRequests: string[];
  nextStep: string[];
}

export interface AlternativeItem {
  category: SponsorshipCategory;
  title: string;
  description: string;
  estimatedValueINR: number;
  valueToPraroha: string;
  companyFeasibility: string;
}

export interface AlternativeAskResult {
  summary: string;
  alternatives: AlternativeItem[];
}

export interface CallDebriefAnalysisResult {
  detectedOutcome: string;
  interestLevel: "High" | "Medium" | "Low" | "None";
  rejectionReason?: string;
  objectionAnalysis?: string;
  positiveSignals: string[];
  negativeSignals: string[];
  whatVolunteerDidWell: string[];
  whatCouldImprove: string[];
  recommendedNextAction: string;
  followUpSuggestion?: {
    recommendedDaysFromNow: number;
    priority: "High" | "Medium" | "Low";
    notes: string;
  };
}

export interface VoiceDebriefExtractionResult {
  transcript: string;
  discussionSummary: string;
  detectedOutcome:
    | "Interested"
    | "Asked for proposal"
    | "Asked for budget"
    | "Wrong person"
    | "Call back"
    | "Rejected"
    | "Non-cash opportunity"
    | "Meeting requested"
    | "Other";
  targetLeadStatus: LeadStage;
  interestLevel: "High" | "Medium" | "Low" | "None";
  decisionMakerStatus: string;
  primaryObjection?: string;
  positiveSignals: string[];
  negativeSignals: string[];
  whatVolunteerDidWell: string[];
  whatCouldImprove: string[];
  recommendedNextAction: string;
  followUpSuggestion?: {
    recommendedDaysFromNow: number;
    priority: "High" | "Medium" | "Low";
    notes: string;
  };
}

export interface LeadPriorityResult {
  priorityScore: number;
  priorityLevel: "HIGH" | "MEDIUM" | "NORMAL" | "LOW";
  reasons: string[];
  nextRecommendedAction: string;
  deterministicFactors: {
    industryRelevance: number;
    keralaPresence: number;
    studentAudienceFit: number;
    civilEngineeringFit: number;
  };
}

export interface AIServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  isCached?: boolean;
  isFallback?: boolean;
  modelUsed?: string;
  promptVersion?: string;
  timestamp: number;
}
