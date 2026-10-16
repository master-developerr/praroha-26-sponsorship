export const LEAD_PRIORITIZATION_PROMPT_VERSION = "v1.0";

export interface LeadPrioritizationPromptInput {
  companyName: string;
  industry: string;
  niche: string;
  priority: string;
  leadScore?: number;
  keralaPresence?: string;
  sponsorshipHistory?: string;
  primaryContactName?: string;
  primaryContactDesignation?: string;
  contactVerificationLevel?: string;
  calculatedScore: number;
  calculatedLevel: "HIGH" | "MEDIUM" | "NORMAL" | "LOW";
  deterministicFactors: {
    industryRelevance: number;
    keralaPresence: number;
    studentAudienceFit: number;
    civilEngineeringFit: number;
  };
}

export function buildLeadPrioritizationPrompt(input: LeadPrioritizationPromptInput): string {
  return `You are a sponsorship pipeline director for PRAROHA'26 (Division of Civil Engineering, SOE CUSAT, Cochin University of Science and Technology, Kochi).

The application has computed a deterministic priority baseline for this company:
- Baseline Score: ${input.calculatedScore} / 100
- Baseline Level: ${input.calculatedLevel}
- Industry Relevance Factor: ${input.deterministicFactors.industryRelevance} / 30
- Civil Engineering Alignment: ${input.deterministicFactors.civilEngineeringFit} / 25
- Kerala Presence Factor: ${input.deterministicFactors.keralaPresence} / 25
- Student Audience Fit: ${input.deterministicFactors.studentAudienceFit} / 20

COMPANY PROFILE:
- Name: ${input.companyName}
- Industry / Niche: ${input.industry} / ${input.niche}
- Kerala Presence: ${input.keralaPresence || "Not verified"}
- Sponsorship Record: ${input.sponsorshipHistory || "Unknown"}
- Contact on File: ${input.primaryContactName || "None"} (${input.primaryContactDesignation || "N/A"})
- Contact Verification: ${input.contactVerificationLevel || "UNVERIFIED"}

INSTRUCTIONS:
1. Explain WHY a student volunteer should or should not prioritize contacting this company now.
2. Provide 3-5 concise bullet reasons explaining the rating.
3. Recommend a concrete immediate next action (e.g. "Identify marketing manager via LinkedIn", "Call regional office between 10am-12pm", "Pitch In-Kind software licenses").
4. Maintain the deterministic score (${input.calculatedScore}) and level (${input.calculatedLevel}).

Format your output strictly as a JSON object matching this exact structure:
{
  "priorityScore": ${input.calculatedScore},
  "priorityLevel": "${input.calculatedLevel}",
  "reasons": ["Key strategic reason 1", "Key strategic reason 2", "Key strategic reason 3"],
  "nextRecommendedAction": "Concrete immediate next action step",
  "deterministicFactors": {
    "industryRelevance": ${input.deterministicFactors.industryRelevance},
    "keralaPresence": ${input.deterministicFactors.keralaPresence},
    "studentAudienceFit": ${input.deterministicFactors.studentAudienceFit},
    "civilEngineeringFit": ${input.deterministicFactors.civilEngineeringFit}
  }
}`;
}

