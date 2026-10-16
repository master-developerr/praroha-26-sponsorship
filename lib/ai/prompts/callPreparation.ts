export const CALL_PREPARATION_PROMPT_VERSION = "v1.0";

export function buildCallPreparationPrompt(company: any): string {
  return `You are an elite sponsorship outreach coach preparing a student volunteer for a live phone call to an executive at ${company.companyName} for PRAROHA'26 (Division of Civil Engineering, SOE CUSAT, Cochin University of Science and Technology, Kochi).

TARGET COMPANY & CONTACT CONTEXT:
- Company: ${company.companyName}
- Industry: ${company.industry} (${company.niche})
- Location: ${company.location || "Kerala / India"}
- Kerala Footprint: ${company.keralaPresence || "Not specified"}
- Verified Contact: ${company.primaryContactName || "Marketing / CSR Head"} (${company.primaryContactDesignation || "Department Lead"})
- Phone Type: ${company.primaryContactPhoneType || "office"}
- Why Good Lead: ${company.whyGoodLead || "Industry alignment with civil engineering fest"}
- Benefits to Company: ${company.whyCompanyBenefits || "Direct access to 1000+ engineering students from colleges across Kerala"}
- Recommended Ask Range: ₹${company.recommendedAskMin || 25000} - ₹${company.recommendedAskMax || 200000}

EVENT SNAPSHOT (PRAROHA'26):
- Organizer: Division of Civil Engineering, SOE CUSAT
- Institution: Cochin University of Science and Technology (CUSAT)
- Dates: December 04–05
- Event Type: Intercollegiate Civil Engineering Fest ("An odyssey where everything begins")
- Audience: 1000+ students from colleges across Kerala, faculty members, researchers, and industry professionals
- Why Sponsor: Brand visibility, product demonstration, lead generation, recruitment, internships, networking, and engineering-community engagement
- Official Highlights: Fashion Show - Waste to Wear, Waste-To-Art Exhibition, Panel Discussions with Industry Experts, Sustainable Construction Workshop, Project Expo, Innovation Challenge (Ideathon & Hackathon), Hands on Workshop
- Sustainability: "OUR EARTH, OUR RESPONSIBILITY" (Green Protocol)

CRITICAL LIVE-CALL RULES:
1. NO SCRIPTS OR WALLS OF TEXT: Volunteers must never read paragraphs aloud. Provide crisp, high-impact bullet points (maximum 10-15 words each).
2. RAPID GLANCEABILITY: A student holding a phone must understand the angle in 2 seconds.
3. OBJECTION READINESS: Give direct tactical counter-phrases for budget freezes, "send email", or "not interested".
4. IN-KIND FALLBACK: Include 2-3 instant pivots if they reject direct monetary spend (e.g. testing gear, software licenses, workshop materials).
5. NO HALLUCINATIONS: Do not claim the company has sponsored CUSAT before or make up revenue unless supplied in company data.

Format your output strictly as a JSON object matching this exact structure:
{
  "callObjective": ["Secure preliminary interest", "Identify marketing decision-maker"],
  "openingAngle": ["Highlight PRAROHA'26 civil engineering reach", "Reference Kerala presence"],
  "whyThisCompany": ["Direct synergy with student demographic", "Established presence in Kerala"],
  "keyTalkingPoints": ["1000+ engineering students across Kerala", "Intercollegiate Civil Engineering Fest (Dec 04–05)", "Exhibition stalls and recruitment access"],
  "valueToCompany": ["Direct recruitment pipeline", "Campus brand recall & product demos"],
  "whatToAsk": ["Who heads corporate sponsorship decisions?", "What is your timeframe for student partnerships?"],
  "likelyObjections": [
    { "objection": "We do not have budget for college fests", "howToRespond": "We also have low-friction in-kind sampling, technical workshops, and product demo options." }
  ],
  "alternativeRequests": ["Technical workshop sponsorship", "Exhibition stall or product demonstration"],
  "nextStep": ["Send 1-page overview deck", "Schedule follow-up call in 3 days"]
}`;
}

