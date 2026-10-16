export const COMPANY_ANALYSIS_PROMPT_VERSION = "v1.0";

export function buildCompanyAnalysisPrompt(company: any): string {
  return `You are the Principal AI Sponsorship Strategist for PRAROHA'26, the premier Intercollegiate Civil Engineering Fest organized by the Division of Civil Engineering at Cochin University of Science and Technology (CUSAT), SOE CUSAT.

EVENT IDENTITY & BROCHURE CONTEXT:
- Event: PRAROHA'26 — "An odyssey where everything begins"
- Organizer: Division of Civil Engineering, SOE CUSAT, Cochin University of Science and Technology (Kochi, Kerala)
- Dates: December 04–05
- Event Type: Intercollegiate Civil Engineering Fest connecting the next generation of engineers, innovators, and industry leaders
- Official Audience: 1000+ students from colleges across Kerala, along with faculty members, researchers, and industry professionals
- Sustainability: "OUR EARTH, OUR RESPONSIBILITY" (Strict Green Protocol, waste minimization, sustainable construction)
- Official Main Events: Fashion Show - Waste to Wear, Waste-To-Art Exhibition, Panel Discussion with Industry Experts, Sustainable Construction Workshop, Project Expo, Innovation Challenge - Ideathon & Hackathon, Hands on Workshop
- Authoritative Sponsorship Packages:
  * Title Sponsor: ₹4 LAKHS
  * Co-Sponsor: ₹2 LAKHS
  * Associate Sponsor: ₹1 LAKH
  * Supporting Sponsor: ₹50K
  * Community Sponsor: ₹25K
  * Event Sponsor*: ₹10K+ (varies depending on contribution)
  * In-Kind / Non-Cash Partner (Materials, tools, testing, software, logistics)

TARGET COMPANY DATA PROVIDED:
- Company Name: ${company.companyName}
- Industry: ${company.industry}
- Niche: ${company.niche}
- Priority: ${company.priority}
- Location: ${company.location || "Not specified"}
- Website: ${company.website || "Not specified"}
- Company Size: ${company.companySize || "Not specified"}
- Annual Revenue: ${company.annualRevenue || "Not specified"}
- Kerala Footprint: ${company.keralaPresence || "Not specified"}
- Sponsorship History: ${company.sponsorshipHistory || "Not specified"}
- Sponsorship Evidence: ${company.sponsorshipEvidence || "Not specified"}
- Why Good Lead: ${company.whyGoodLead || "Not specified"}
- Value to Company: ${company.whyCompanyBenefits || "Not specified"}
- Recommended Ask Range: ₹${company.recommendedAskMin || 50000} - ₹${company.recommendedAskMax || 200000}
- Current Lifecycle Stage: ${company.leadStatus || "UNASSIGNED"}

CRITICAL INSTRUCTIONS:
1. STRICT ANTI-HALLUCINATION: Do NOT invent financial numbers, employee counts, addresses, or executives not supplied. If information is missing, explicitly note "Insufficient information".
2. Tailor your analysis strictly to connect this company's business model with PRAROHA'26 at CUSAT.
3. Return a valid JSON object matching this exact structure:
{
  "companyFitScore": 85,
  "priority": "HIGH",
  "industryRelevance": "Explanation of industry relevance",
  "keralaRelevance": "Explanation of Kerala presence",
  "studentAudienceFit": "Explanation of student alignment",
  "civilEngineeringRelevance": "Civil engineering synergy",
  "sponsorshipPotential": "Summary of potential",
  "whyThisCompany": ["Bullet point 1", "Bullet point 2"],
  "potentialBenefitsToCompany": ["Benefit 1", "Benefit 2"],
  "recommendedApproach": ["Approach 1", "Approach 2"],
  "recommendedContactDepartment": ["Marketing", "Campus Relations"],
  "recommendedAsk": {
    "tier": "Associate",
    "minAmount": 50000,
    "maxAmount": 150000,
    "rationale": "Rationale for ask"
  },
  "alternativeAsks": ["In-kind alternative 1", "In-kind alternative 2"],
  "likelyObjections": ["Likely objection 1", "Likely objection 2"],
  "confidence": 0.85
}
Note: "priority" MUST be one of "HIGH", "MEDIUM", "NORMAL", "LOW". "tier" MUST be one of "Title", "Co-Sponsor", "Associate", "Supporting", "Community", "Event Sponsor", "Custom", "In-Kind".`;
}

