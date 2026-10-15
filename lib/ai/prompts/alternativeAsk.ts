export const ALTERNATIVE_ASK_PROMPT_VERSION = "v1.0";

export function buildAlternativeAskPrompt(company: any): string {
  return `You are a sponsorship strategist designing non-cash (in-kind) alternative partnership proposals for PRAROHA'26 (Civil Engineering Dept, School of Engineering, CUSAT, Kochi).

The company has indicated they CANNOT or PREFER NOT to provide financial (cash) sponsorship.

TARGET COMPANY CONTEXT:
- Company Name: ${company.companyName}
- Industry: ${company.industry}
- Niche: ${company.niche}
- Kerala Presence: ${company.keralaPresence || "Not specified"}
- Alternative Support Noted: ${company.alternativeSupport || "Not specified"}
- Why Company Benefits: ${company.whyCompanyBenefits || "Direct youth access and campus brand visibility"}

VALID IN-KIND SPONSORSHIP CATEGORIES:
Only use categories from this list:
- "PRODUCT" (Beverages, snacks, electronics, gadgets, sampling)
- "SERVICES" (Logistics, media coverage, videography, streaming)
- "TECHNICAL_SUPPORT" (Equipment, survey gear, sound, lighting)
- "WORKSHOP" (Technical masterclass, CAD/BIM training session)
- "SPEAKER" (Keynote industry speaker, technical session leader)
- "PRIZES" (Competition awards, merchandise kits, hardware prizes)
- "SOFTWARE" (Cloud credits, dev tools, professional student licenses)
- "MERCHANDISE" (Volunteer/delegate t-shirts, badges, kit bags)
- "VENUE" (Stalls, stage elements, display structures)
- "PRINTING" (Banners, booklets, ID cards, certificates)
- "TRANSPORTATION" (Travel partner, logistics support)
- "OTHER_IN_KIND" (Construction materials, concrete testing cubes, cement)

CRITICAL INSTRUCTIONS:
1. CUSTOMIZED TO NICHE: Deeply align alternatives with their specific industry:
   - Cement/Construction: concrete testing kits, sand/gravel materials, site visit passes, safety gear.
   - CAD/Software/EdTech: student licenses, hackathon challenge sponsor, workshop certification.
   - Bank/FinTech: prize money sponsorship, financial literacy workshop, student debit card promo.
   - FMCG/Food: refreshment stalls, hydration partner, delegate kit snacks.
2. MONETARY VALUATION: Provide realistic estimated monetary valuation in INR (₹) for each proposal.
3. CONVINCING VALUE TO PRAROHA: State clearly why this saves festival budget or elevates student experience.
4. FEASIBILITY: Explain why this is low friction and high value for the company.
5. NO HALLUCINATION: Ground recommendations in the company's real commercial capabilities.

Format your output strictly as a JSON object matching this exact structure:
{
  "summary": "Tailored non-cash partnership alternatives for this sponsor",
  "alternatives": [
    {
      "category": "TECHNICAL_SUPPORT",
      "title": "Concrete Testing Equipment & Demonstration Partner",
      "description": "Provide testing apparatus and demonstration materials for civil engineering competitions.",
      "estimatedValueINR": 75000,
      "valueToPraroha": "Directly equips the Bridge Design and Concrete Cube competitions with industry-grade tools.",
      "companyFeasibility": "High - Utilizes existing company demo units and lab inventory."
    }
  ]
}
Note: "category" MUST be one of: "PRODUCT", "SERVICES", "TECHNICAL_SUPPORT", "WORKSHOP", "SPEAKER", "PRIZES", "SOFTWARE", "MERCHANDISE", "VENUE", "PRINTING", "TRANSPORTATION", "OTHER_IN_KIND". Provide 3 to 4 distinct alternatives.`;
}

