export const CALL_PREPARATION_PROMPT_VERSION = "v1.0";

export function buildCallPreparationPrompt(company: any): string {
  return `You are an elite sponsorship outreach coach preparing a student volunteer for a live phone call to an executive at ${company.companyName} for PRAROHA'26 (Civil Engineering Dept, School of Engineering, CUSAT, Kochi).

TARGET COMPANY & CONTACT CONTEXT:
- Company: ${company.companyName}
- Industry: ${company.industry} (${company.niche})
- Location: ${company.location || "Kerala / India"}
- Kerala Footprint: ${company.keralaPresence || "Not specified"}
- Verified Contact: ${company.primaryContactName || "Marketing / CSR Head"} (${company.primaryContactDesignation || "Department Lead"})
- Phone Type: ${company.primaryContactPhoneType || "office"}
- Why Good Lead: ${company.whyGoodLead || "Industry alignment with civil/tech campus"}
- Benefits to Company: ${company.whyCompanyBenefits || "Direct access to 5,000+ engineering students"}
- Recommended Ask Range: ₹${company.recommendedAskMin || 50000} - ₹${company.recommendedAskMax || 200000}

EVENT SNAPSHOT (PRAROHA'26):
- Host: School of Engineering, CUSAT (Kochi, Kerala)
- Audience: 5,000+ high-caliber engineering students across South India
- Major Highlights: National Civil Hackathon, Bridge Design, Auto Expo, Technical Workshops, Pro-Show

CRITICAL LIVE-CALL RULES:
1. NO SCRIPTS OR WALLS OF TEXT: Volunteers must never read paragraphs aloud. Provide crisp, high-impact bullet points (maximum 10-15 words each).
2. RAPID GLANCEABILITY: A student holding a phone must understand the angle in 2 seconds.
3. OBJECTION READINESS: Give direct tactical counter-phrases for budget freezes, "send email", or "not interested".
4. IN-KIND FALLBACK: Include 2-3 instant pivots if they reject direct monetary spend.
5. NO HALLUCINATIONS: Do not claim the company has sponsored CUSAT before or make up revenue unless supplied in company data.

Format your output strictly as a JSON object matching this exact structure:
{
  "callObjective": ["Secure preliminary interest", "Identify marketing decision-maker"],
  "openingAngle": ["Highlight PRAROHA'26 civil engineering reach", "Reference Kerala presence"],
  "whyThisCompany": ["Direct synergy with student demographic", "Established presence in South India"],
  "keyTalkingPoints": ["Over 5,000 engineering students", "Flagship national civil hackathon", "High-visibility brand integration"],
  "valueToCompany": ["Direct recruitment pipeline", "Campus brand recall"],
  "whatToAsk": ["Who heads campus sponsorship decisions?", "What is your timeframe for student partnerships?"],
  "likelyObjections": [
    { "objection": "We do not have budget for college fests", "howToRespond": "We also have low-friction in-kind sampling and product partnership options." }
  ],
  "alternativeRequests": ["Branded merchandise for participants", "Technical workshop sponsorship"],
  "nextStep": ["Send 1-page overview deck", "Schedule follow-up call in 3 days"]
}`;
}

