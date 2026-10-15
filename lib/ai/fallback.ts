import {
  CompanyAnalysisResult,
  CallPreparationResult,
  AlternativeAskResult,
  CallDebriefAnalysisResult,
  LeadPriorityResult,
} from "./types";
import { DebriefAnalysisInput } from "./prompts/callDebrief";
import { SponsorshipCategory, SponsorshipTier } from "@/types";

/**
 * Deterministic Operations-First Fallback Engine for PRAROHA'26.
 * Guarantees zero downtime: student SDRs and admins get instant, accurate, domain-tailored
 * sponsorship intelligence even when external LLM APIs are offline or unconfigured.
 */

export function getFallbackCompanyAnalysis(company: any): CompanyAnalysisResult {
  const industry = (company.industry || "").toLowerCase();
  const niche = (company.niche || "").toLowerCase();
  const kerala = (company.keralaPresence || "").toLowerCase();

  const isCivil =
    industry.includes("construction") ||
    industry.includes("cement") ||
    industry.includes("infrastructure") ||
    industry.includes("steel") ||
    niche.includes("civil") ||
    niche.includes("structural") ||
    niche.includes("builder") ||
    niche.includes("developer");

  const isTech =
    industry.includes("software") ||
    industry.includes("tech") ||
    industry.includes("it") ||
    niche.includes("cad") ||
    niche.includes("bim") ||
    niche.includes("ai");

  const isFinance = industry.includes("bank") || industry.includes("finance") || industry.includes("fintech");
  const isFMCG = industry.includes("fmcg") || industry.includes("food") || industry.includes("beverage");

  const hasKerala = kerala.includes("kochi") || kerala.includes("kerala") || kerala.includes("active") || kerala.includes("regional");

  const fitScore = isCivil ? 92 : isTech ? 86 : isFinance ? 80 : hasKerala ? 78 : 70;
  const priority = fitScore >= 85 ? "HIGH" : fitScore >= 75 ? "MEDIUM" : "NORMAL";

  let civilRelevance = "General engineering audience alignment at CUSAT.";
  if (isCivil) {
    civilRelevance = "Direct core synergy with Civil Engineering Dept; ideal for Bridge Design and Site Innovation showcases.";
  } else if (isTech) {
    civilRelevance = "Synergy with digital engineering tools (BIM, CAD, Project Management Software) used by civil students.";
  }

  const whyCompany: string[] = [
    `Established brand in ${company.industry || "engineering and technology sector"}.`,
    company.whyGoodLead || "High alignment with 5,000+ collegiate engineers across South India.",
  ];
  if (hasKerala) whyCompany.push("Demonstrated regional operational footprint in Kerala.");

  const benefits: string[] = [
    company.whyCompanyBenefits || "Direct brand visibility across campus delegates, competition banners, and festival media.",
    "Targeted recruitment & brand equity among graduating CUSAT engineering cohorts.",
    "Exclusive on-stage and social media acknowledgments during PRAROHA'26.",
  ];

  const approaches: string[] = [
    "Pitch PRAROHA'26 as South India's premier civil-tech symposium hosted by CUSAT School of Engineering.",
    "Propose tailored brand integration tied to their core domain rather than generic display banners.",
    "Offer post-fest impact report and high-resolution media collateral.",
  ];

  const minAmt = company.recommendedAskMin || 50000;
  const maxAmt = company.recommendedAskMax || 150000;
  let tier: SponsorshipTier = "Associate";
  if (minAmt >= 300000) tier = "Title";
  else if (minAmt >= 150000) tier = "Powered By";
  else if (minAmt < 50000) tier = "Custom";

  return {
    companyFitScore: fitScore,
    priority,
    industryRelevance: `Strong alignment with the ${company.industry || "corporate"} market and campus demographic.`,
    keralaRelevance: hasKerala ? "Verified Kerala operations, facilitating regional brand decisions." : "National footprint; potential for Kerala campus penetration.",
    studentAudienceFit: "5,000+ engineering and technology students with high disposable engagement and tech-savviness.",
    civilEngineeringRelevance: civilRelevance,
    sponsorshipPotential: `High potential for ₹${minAmt.toLocaleString("en-IN")} - ₹${maxAmt.toLocaleString("en-IN")} package tier.`,
    whyThisCompany: whyCompany,
    potentialBenefitsToCompany: benefits,
    recommendedApproach: approaches,
    recommendedContactDepartment: ["Marketing & Brand Relations", "Corporate Social Responsibility (CSR)", "Campus Recruitment"],
    recommendedAsk: {
      tier,
      minAmount: minAmt,
      maxAmount: maxAmt,
      rationale: `Aligned with company stature in ${company.industry} and PRAROHA'26 deliverable package.`,
    },
    alternativeAsks: [
      "Technical workshop or masterclass for competition participants",
      "Hackathon challenge prize partner with corporate branding",
      "Official merchandise/kit co-branding",
    ],
    likelyObjections: [
      "Annual marketing budgets already locked for this quarter",
      "Preference for national university hubs rather than regional summits",
      "Prior negative experience with collegiate event ROI",
    ],
    confidence: 0.88,
  };
}

export function getFallbackCallPreparation(company: any): CallPreparationResult {
  const contactName = company.primaryContactName || "Sir/Madam";
  const industry = (company.industry || "").toLowerCase();

  return {
    callObjective: [
      `Introduce PRAROHA'26 to ${contactName} or obtain direct regional marketing lead.`,
      "Establish CUSAT School of Engineering flagship stature and 5,000+ delegate reach.",
      "Secure interest to dispatch official formal sponsorship proposal deck.",
    ],
    openingAngle: [
      `"Good morning ${contactName}, I am reaching out from PRAROHA'26 at CUSAT School of Engineering."`,
      `"We are curating select industry partners in ${company.industry || "engineering"} for our flagship symposium this February."`,
      "Highlight campus footfall: 5,000+ high-caliber student engineers across South India.",
    ],
    whyThisCompany: [
      `${company.companyName} is recognized as an industry standard in ${company.niche || company.industry}.`,
      "Students actively seek exposure to their products, methodologies, and leadership.",
    ],
    keyTalkingPoints: [
      "3-day national symposium hosted by Civil Engineering Department, SOE CUSAT.",
      "Event includes National Civil Hackathon, Bridge Design, and 20+ specialized technical tracks.",
      "Custom branding: workshop naming rights, exhibition stalls, and student hackathon problem statements.",
    ],
    valueToCompany: [
      "Direct brand impressions across 5,000+ high-intent future engineers and technical leaders.",
      "Recruitment branding and resume collection pipeline opportunities.",
      "Social media and campus flex presence across Cochin University campus.",
    ],
    whatToAsk: [
      `"Are you currently allocating sponsorship or campus outreach funds for Q1 2026?"`,
      `"May we send our 2-page executive festival deck directly to your marketing inbox?"`,
      `"Who would be the ideal executive to review our specific partnership deliverable proposal?"`,
    ],
    likelyObjections: [
      {
        objection: "We don't do college sponsorships.",
        howToRespond: "Understood. Rather than a donation, we offer high-ROI technical workshops and direct talent engagement that serves your regional talent pipeline.",
      },
      {
        objection: "Our budget is locked for this fiscal year.",
        howToRespond: "Completely understand. We also have non-financial in-kind partnership categories like technical sessions, student prizes, and product displays.",
      },
      {
        objection: "Send details on email.",
        howToRespond: "Certainly! I will send the executive deck right now. Could I confirm your direct email address and arrange a brief 5-minute callback on Thursday?",
      },
    ],
    alternativeRequests: [
      "Industry Speaker for keynote or panel session",
      "Competition prize awards or licensed technical tool distribution",
      "Official merchandise/t-shirt partner",
    ],
    nextStep: [
      "Confirm decision-maker's direct email and mobile number.",
      "Log detailed debrief outcome into PRAROHA workspace immediately.",
      "Schedule follow-up callback within 48 to 72 hours.",
    ],
  };
}

export function getFallbackAlternativeAsk(company: any): AlternativeAskResult {
  const industry = (company.industry || "").toLowerCase();
  const niche = (company.niche || "").toLowerCase();

  let alternatives: Array<{
    category: SponsorshipCategory;
    title: string;
    description: string;
    estimatedValueINR: number;
    valueToPraroha: string;
    companyFeasibility: string;
  }> = [];

  if (industry.includes("construction") || industry.includes("cement") || niche.includes("civil")) {
    alternatives = [
      {
        category: "TECHNICAL_SUPPORT",
        title: "Materials & Concrete Testing Partner",
        description: "Supply concrete cube moulds, test specimens, or safety gear for the National Bridge & Structural Competition.",
        estimatedValueINR: 45000,
        valueToPraroha: "Reduces competition procurement costs and provides authentic field materials for student builders.",
        companyFeasibility: "Extremely high; leverages existing manufacturing inventory with negligible cash outlay.",
      },
      {
        category: "WORKSHOP",
        title: "Technical Masterclass / Site Innovation Session",
        description: "Conduct a 2-hour accredited masterclass on modern structural design or sustainable construction practices.",
        estimatedValueINR: 30000,
        valueToPraroha: "Enriches the academic credibility of PRAROHA'26 and draws delegates across Kerala colleges.",
        companyFeasibility: "Requires only staff engineer hours; builds direct employer brand awareness among top final-year students.",
      },
      {
        category: "PRIZES",
        title: "Excellence in Civil Engineering Award",
        description: "Sponsor branded prize trophies, toolkits, and cash voucher packages for hackathon winners.",
        estimatedValueINR: 25000,
        valueToPraroha: "Increases hackathon prize pool attractiveness without requiring festival reserve funds.",
        companyFeasibility: "Clear marketing deliverable with high stage visibility during the grand valedictory ceremony.",
      },
    ];
  } else if (industry.includes("software") || industry.includes("tech") || niche.includes("cad") || niche.includes("bim")) {
    alternatives = [
      {
        category: "SOFTWARE",
        title: "Student CAD / BIM Licenses & Cloud Credits",
        description: "Provide 1-year complimentary software access or computational cloud credits for all competition finalists.",
        estimatedValueINR: 75000,
        valueToPraroha: "High student perceived value that empowers participants to build sophisticated architectural models.",
        companyFeasibility: "Virtually zero marginal cost for software vendors; expands user base and future professional adoption.",
      },
      {
        category: "WORKSHOP",
        title: "Certified Digital Engineering Workshop",
        description: "Host hands-on software certification lab for 100+ registered engineering participants.",
        estimatedValueINR: 35000,
        valueToPraroha: "Guarantees packed seminar halls and offers recognized skill credentials for students.",
        companyFeasibility: "Positions the company as the gold standard tooling partner for graduating engineers.",
      },
      {
        category: "PRIZES",
        title: "Hackathon Track Title Sponsor",
        description: "Provide track problem statement and proprietary hardware/software dev kits for hackathon winners.",
        estimatedValueINR: 30000,
        valueToPraroha: "Injects real-world industrial relevance into our technical competitive tracks.",
        companyFeasibility: "Allows company to test-drive innovative student prototypes at minimal cost.",
      },
    ];
  } else if (industry.includes("food") || industry.includes("fmcg") || industry.includes("beverage")) {
    alternatives = [
      {
        category: "PRODUCT",
        title: "Official Hydration / Refreshment Partner",
        description: "Supply beverages, energy drinks, or snack hampers for 5,000+ festival attendees and VIP guests.",
        estimatedValueINR: 60000,
        valueToPraroha: "Eliminates major recurring festival hospitality and volunteer refreshment expenses.",
        companyFeasibility: "Direct sampling opportunity targeting 18-24 youth demographic at wholesale production cost.",
      },
      {
        category: "MERCHANDISE",
        title: "Co-Branded Delegate Kit Snacks",
        description: "Include packaged sampling units inside 1,000+ delegate welcome kit bags.",
        estimatedValueINR: 25000,
        valueToPraroha: "Enriches delegate experience and welcome kit prestige.",
        companyFeasibility: "High tactile engagement and guaranteed 100% distribution to target consumers.",
      },
    ];
  } else {
    alternatives = [
      {
        category: "MERCHANDISE",
        title: "Official Volunteer & Delegate T-Shirt Partner",
        description: "Sponsor branded apparel featuring prominent corporate logo alongside PRAROHA'26 iconography.",
        estimatedValueINR: 50000,
        valueToPraroha: "Offsets major uniform printing overhead for 200+ student organizers and staff.",
        companyFeasibility: "High-visibility walking billboards worn throughout the 3-day event and across campus for months.",
      },
      {
        category: "PRINTING",
        title: "Print & Collateral Partner",
        description: "Provide event flex banners, stage backdrops, delegate badges, and certificate printing.",
        estimatedValueINR: 35000,
        valueToPraroha: "Critical operational asset directly lowering the festival cash expenditure budget.",
        companyFeasibility: "Commercial trade-off with prominent logo placement on all festival credential badges.",
      },
      {
        category: "SPEAKER",
        title: "Keynote Leadership & Industry Dialogue",
        description: "Depute a senior executive for a keynote address on industry evolution and student career paths.",
        estimatedValueINR: 20000,
        valueToPraroha: "Adds high-profile executive star power to the inaugural ceremony.",
        companyFeasibility: "Strengthens corporate PR and academic relations with CUSAT.",
      },
    ];
  }

  return {
    summary: `Tailored non-cash sponsorship pathways for ${company.companyName} based on their ${company.industry || "market"} capabilities.`,
    alternatives,
  };
}

export function getFallbackCallDebrief(input: DebriefAnalysisInput): CallDebriefAnalysisResult {
  const text = ((input.discussionSummary || "") + " " + (input.debriefTranscript || "")).toLowerCase();

  let detectedOutcome = "FOLLOW_UP";
  let interestLevel: "High" | "Medium" | "Low" | "None" = "Medium";

  if (text.includes("proposal") || text.includes("send deck") || text.includes("send details")) {
    detectedOutcome = "PROPOSAL_REQUESTED";
    interestLevel = "High";
  } else if (text.includes("interested") || text.includes("meeting") || text.includes("meet")) {
    detectedOutcome = "INTERESTED";
    interestLevel = "High";
  } else if (text.includes("not interested") || text.includes("no budget") || text.includes("decline") || text.includes("rejected")) {
    detectedOutcome = "REJECTED";
    interestLevel = "Low";
  } else if (text.includes("wrong number") || text.includes("wrong person") || text.includes("not working here")) {
    detectedOutcome = "WRONG_CONTACT";
    interestLevel = "None";
  } else if (text.includes("busy") || text.includes("call back") || text.includes("later") || text.includes("tomorrow")) {
    detectedOutcome = "CALL_BACK";
    interestLevel = "Medium";
  }

  const positiveSignals: string[] = [];
  if (text.includes("send") || text.includes("email") || text.includes("deck")) positiveSignals.push("Executive receptive to receiving festival documentation.");
  if (text.includes("budget") || text.includes("amount") || text.includes("cost")) positiveSignals.push("Commercial and package parameters were actively discussed.");
  if (positiveSignals.length === 0) positiveSignals.push("Reached active contact line and engaged representative.");

  const negativeSignals: string[] = [];
  if (text.includes("tight") || text.includes("freeze") || text.includes("no budget")) negativeSignals.push("Fiscal constraints or budget exhaustion noted.");
  if (text.includes("busy") || text.includes("rushed")) negativeSignals.push("Limited executive bandwidth during initial touchpoint.");

  return {
    detectedOutcome,
    interestLevel,
    rejectionReason: text.includes("budget") ? "Fiscal budget constraints" : undefined,
    objectionAnalysis: input.primaryObjection || "Timing or budget prioritization.",
    positiveSignals,
    negativeSignals,
    whatVolunteerDidWell: [
      "Successfully initiated dialogue and navigated company reception/direct line.",
      "Clear articulation of PRAROHA'26 host institution (CUSAT School of Engineering).",
    ],
    whatCouldImprove: [
      "Pinpoint exact executive timeline before concluding the call.",
      "Immediately confirm preferred email address and direct extension for proposal delivery.",
    ],
    recommendedNextAction:
      detectedOutcome === "PROPOSAL_REQUESTED"
        ? "Prepare and dispatch official PRAROHA'26 proposal deck within 4 hours."
        : detectedOutcome === "CALL_BACK"
        ? "Log callback date in PRAROHA follow-up schedule and set reminder."
        : "Evaluate alternative non-cash sponsor pitch or identify secondary decision-maker.",
    followUpSuggestion: {
      recommendedDaysFromNow: detectedOutcome === "PROPOSAL_REQUESTED" ? 2 : 3,
      priority: interestLevel === "High" ? "High" : "Medium",
      notes: "Follow up to confirm review of event materials and discuss package deliverables.",
    },
  };
}

export function getFallbackLeadPrioritization(company: any): LeadPriorityResult {
  const industry = (company.industry || "").toLowerCase();
  const kerala = (company.keralaPresence || "").toLowerCase();

  const isCivil = industry.includes("construction") || industry.includes("cement") || industry.includes("steel");
  const isTech = industry.includes("software") || industry.includes("cad") || industry.includes("tech");
  const hasKerala = kerala.includes("kochi") || kerala.includes("kerala") || kerala.includes("regional");

  const indFactor = isCivil ? 28 : isTech ? 24 : 18;
  const civFactor = isCivil ? 25 : isTech ? 18 : 12;
  const kerFactor = hasKerala ? 23 : 15;
  const stuFactor = 16;

  const totalScore = indFactor + civFactor + kerFactor + stuFactor;
  const level: "HIGH" | "MEDIUM" | "NORMAL" | "LOW" =
    totalScore >= 85 ? "HIGH" : totalScore >= 70 ? "MEDIUM" : "NORMAL";

  const reasons = [
    `Industry relevance factor rated ${indFactor}/30 based on corporate positioning in ${company.industry || "sector"}.`,
    `Civil engineering alignment rated ${civFactor}/25 for direct technical relevance to CUSAT SOE festival tracks.`,
    `Kerala presence rated ${kerFactor}/25 (${hasKerala ? "Verified regional presence" : "National coverage"}).`,
    "High student audience affinity for career recruitment and technical workshops.",
  ];

  return {
    priorityScore: totalScore,
    priorityLevel: level,
    reasons,
    nextRecommendedAction: `Initiate outreach to ${company.primaryContactName || "Marketing Department"} to introduce PRAROHA'26 sponsorship deck.`,
    deterministicFactors: {
      industryRelevance: indFactor,
      civilEngineeringFit: civFactor,
      keralaPresence: kerFactor,
      studentAudienceFit: stuFactor,
    },
  };
}
