/**
 * PRAROHA'26 — Authoritative Single Source of Truth for Event Information
 * 
 * Sourced strictly from the official PRAROHA'26 festival brochure.
 * Any public-facing event page, modal, dashboard header, AI prompt, or pitch
 * collateral must consume this centralized configuration.
 * 
 * DO NOT hardcode or duplicate event strings elsewhere.
 */

export interface SponsorshipBenefit {
  text: string;
}

export interface SponsorshipPackageConfig {
  tier: string;
  name: string;
  amount: number;
  formattedAmount: string;
  displayBadge: string;
  badge: string;
  benefits: string[];
  footnote?: string;
  color?: {
    border: string;
    bg: string;
    text: string;
    badge: string;
  };
}

export interface OfficialContact {
  name: string;
  role: "Convenor" | "Sponsorship Head";
  phone: string;
}

export const eventConfig = {
  name: "PRAROHA'26",
  edition: "2026",
  organizer: "Division of Civil Engineering",
  institution: "Cochin University of Science and Technology (CUSAT)",
  institutionShort: "CUSAT",
  campus: "School of Engineering (SOE), CUSAT",
  venue: "SOE CUSAT",
  eventType: "Intercollegiate Civil Engineering Fest",
  tagline: "An odyssey where everything begins",
  dates: "December 04–05",
  datesCompact: "DEC 04–05",
  attendanceClaim: "1000+ students from colleges across Kerala",
  
  about: {
    heading: "About PRAROHA",
    concept:
      "PRAROHA is an Intercollegiate Civil Engineering Fest organized by the Division of Civil Engineering at Cochin University of Science and Technology (CUSAT), SOE CUSAT.",
    purpose:
      "The purpose is to connect the next generation of engineers, innovators, and industry leaders through technical exploration, competitions, and hands-on workshops.",
    targetAudience:
      "Students, faculty members, researchers, and industry professionals from engineering institutions across Kerala.",
  },

  sustainability: {
    motto: "OUR EARTH, OUR RESPONSIBILITY",
    description:
      "PRAROHA explicitly emphasizes sustainability. The event commits to conducting workshops and events sustainably while following Green Protocol practices to minimize waste, reduce environmental impact, and promote responsible resource utilization.",
    principles: [
      "Strict Green Protocol enforcement across all festival grounds",
      "Minimizing single-use plastics and festival waste",
      "Sustainable construction and circular material showcases",
      "Promoting responsible resource utilization in all technical events",
    ],
  },

  valueProposition: {
    title: "Why Sponsor PRAROHA'26?",
    coreOpportunities: [
      "Set up physical exhibition stalls on campus",
      "Demonstrate engineering products, technology, and materials",
      "Distribute corporate and promotional materials directly to attendees",
      "Interact face-to-face with future civil engineers and innovators",
      "Generate qualified student and institutional leads",
      "Strengthen corporate presence and long-term customer relationships",
    ],
    audienceReach:
      "Direct access to 1000+ students from colleges across Kerala for recruitment, graduate hiring, internships, and deep brand engagement.",
    communityTouchpoints: [
      "Specialized technical workshops",
      "Expert panel discussions",
      "Technical competitions and project exhibitions",
      "Innovation challenges and hackathons",
    ],
    stakeholders: [
      "Undergraduate and postgraduate engineering students",
      "Faculty members and academic department heads",
      "Researchers and doctoral scholars",
      "Industry professionals and corporate leaders",
    ],
  },

  brandVisibilityBenefits: [
    "Prominent event banners across SOE CUSAT campus",
    "Digital stage backdrops during inaugural ceremony and flagship sessions",
    "Dedicated social media promotions, announcements, and digital campaigns",
    "Corporate logo placement on the official event website",
    "Branding in official brochures and digital delegate collateral",
    "Verbal sponsor announcements during major sessions and panel discussions",
    "Sponsor recognition during competitive events and prize distribution",
  ],
} as const;

export const mainEvents = [
  {
    id: "waste-to-wear",
    title: "Fashion Show - Waste to Wear",
    description:
      "A flagship sustainable creative runway showcasing wearable innovation and fashion crafted exclusively from upcycled materials and post-consumer waste.",
  },
  {
    id: "waste-to-art",
    title: "Waste-To-Art Exhibition",
    description:
      "An artistic exhibition where discarded materials, construction waste, and scraps are transformed into thought-provoking architectural and aesthetic installations.",
  },
  {
    id: "panel-discussion",
    title: "Panel Discussion with Industry Experts",
    description:
      "Distinguished dialogues bringing together civil engineering leaders, researchers, and practitioners to address pressing infrastructure and geotechnical frontiers.",
  },
  {
    id: "sustainable-construction",
    title: "Sustainable Construction Workshop",
    description:
      "An intensive technical session focused on eco-friendly building methodologies, green building certifications, low-carbon materials, and circular construction.",
  },
  {
    id: "project-expo",
    title: "Project Expo",
    description:
      "A competitive national showcase platform for cutting-edge civil engineering capstone projects, working prototypes, and structural innovations.",
  },
  {
    id: "innovation-challenge",
    title: "Innovation Challenge - Ideathon & Hackathon",
    description:
      "A high-velocity innovation hackathon where multidisciplinary student teams solve real-world urban, infrastructural, and environmental problem statements.",
  },
  {
    id: "hands-on-workshop",
    title: "Hands on Workshop",
    description:
      "Practical, tool-driven workshops delivering real-world engineering proficiency with modern testing instruments, analysis tools, and methodologies.",
  },
] as const;

export const panelDiscussions = [
  {
    id: "tunnelling-future",
    title: "Tunnelling into the Future",
    description:
      "Underground infrastructure, mechanized excavation technologies, and deep urban metro tunneling engineering.",
  },
  {
    id: "building-weak-soils",
    title: "Building on Weak Soils: Ground Improvement & Deep Foundations",
    description:
      "Advanced geotechnical solutions, pile foundation methodologies, and ground stabilization techniques in challenging soil conditions.",
  },
  {
    id: "rising-sea-climate",
    title: "Engineering for a Rising Sea: Climate-Resilient Coastal Infrastructure",
    description:
      "Sea-level rise mitigation, coastal protection structures, resilient port engineering, and climate adaptation strategies.",
  },
  {
    id: "sustainable-materials-marine",
    title: "Sustainable Materials in Marine Construction",
    description:
      "Corrosion-resistant composites, eco-concrete formulations, and sustainable structural materials designed for harsh saltwater environments.",
  },
] as const;

export const workshops = [
  {
    id: "concrete-without-cement",
    title: "Concrete Without Cement",
    description:
      "Geopolymer concretes, alkali-activated binders, and zero-clinker formulations driving the net-zero carbon concrete revolution.",
  },
  {
    id: "bim-ai-construction",
    title: "BIM + AI: The Next Generation of Construction Management",
    description:
      "Integrating Building Information Modeling with machine learning workflows, 4D/5D site scheduling, and automated clash detection.",
  },
  {
    id: "peak-performance-blueprint",
    title: "The Peak Performance Blueprint",
    description:
      "Personal leadership, project agility, and high-impact operational methodologies for engineering professionals.",
  },
  {
    id: "ai-machine-learning",
    title: "AI & Machine Learning",
    description:
      "Foundational and applied machine learning tools solving structural health monitoring, traffic prediction, and spatial engineering challenges.",
  },
  {
    id: "drone-surveying",
    title: "Drone Surveying",
    description:
      "UAV flight planning, photogrammetry, aerial LiDAR scanning, and 3D terrain reconstruction for modern civil surveying.",
  },
  {
    id: "quantity-surveying",
    title: "Quantity Surveying",
    description:
      "Cost estimation, bill of quantities (BOQ) preparation, specification analysis, and commercial project governance.",
  },
] as const;

export const preEvents = [
  {
    id: "photography-contest",
    title: "Photography Contest",
    description: "Capturing architectural geometry, infrastructural textures, and urban environments.",
  },
  {
    id: "reel-making-contest",
    title: "Reel Making Contest",
    description: "Short-form video storytelling highlighting engineering creativity, fest hype, and sustainability.",
  },
  {
    id: "logo-design-competition",
    title: "Logo Design Competition",
    description: "Visual identity design competition for festival themes and sustainability initiatives.",
  },
  {
    id: "treasure-hunt",
    title: "Treasure Hunt",
    description: "Campus-wide technical riddle and clue-solving sprint across SOE CUSAT.",
  },
  {
    id: "gaming-tournament",
    title: "Gaming Tournament",
    description: "Competitive e-sports tournament engaging collegiate gaming enthusiasts.",
  },
  {
    id: "open-mic",
    title: "Open Mic",
    description: "Live stage for student spoken word, stand-up, acoustics, and creative performances.",
  },
  {
    id: "food-fest",
    title: "Food Fest",
    description: "Curated culinary stalls and local student food ventures adhering to Green Protocol.",
  },
  {
    id: "flash-mob",
    title: "Flash Mob",
    description: "High-energy synchronized dance performance announcing PRAROHA'26 across campus hubs.",
  },
] as const;

export const sponsorshipPackages: SponsorshipPackageConfig[] = [
  {
    tier: "Title",
    name: "Title Sponsor",
    amount: 400000,
    formattedAmount: "₹4 LAKHS",
    displayBadge: "₹4 LAKHS",
    badge: "Title Sponsor (₹4 Lakhs)",
    benefits: [
      "Event named/presented as \"Civil Fest powered by [Sponsor]\"",
      "Prominent logo placement on all major posters, banners and creatives",
      "Large flex branding at the venue",
      "Dedicated social media promotion",
      "Sponsor mentions during major events and announcements",
      "Branding on stage/backdrop and prize distribution",
      "Space for promotional materials/stall",
      "Priority access to event attendees for lead generation and product demos",
      "Complimentary booth staff passes and VIP access for sponsor representatives",
      "Post-event report with attendee engagement metrics and brand visibility insights",
      "Option to host a keynote session, workshop, or product launch activation",
    ],
    color: {
      border: "border-emerald-300 dark:border-emerald-800/60",
      bg: "bg-emerald-50/70 dark:bg-emerald-950/20",
      text: "text-emerald-950 dark:text-emerald-200",
      badge: "bg-emerald-600 dark:bg-emerald-500 text-white",
    },
  },
  {
    tier: "Co-Sponsor",
    name: "Co-Sponsor",
    amount: 200000,
    formattedAmount: "₹2 LAKHS",
    displayBadge: "₹2 LAKHS",
    badge: "Co-Sponsor (₹2 Lakhs)",
    benefits: [
      "Prominent logo placement on posters and event creatives",
      "Medium-sized flex branding at the venue",
      "Social media promotion and stories",
      "Sponsor mentions during the event",
      "Branding during prize distribution",
      "Space for standee/promotional materials",
      "Complimentary event passes for your team",
      "Post-event photo and video coverage",
    ],
    color: {
      border: "border-sky-300 dark:border-sky-800/60",
      bg: "bg-sky-50/70 dark:bg-sky-950/20",
      text: "text-sky-950 dark:text-sky-200",
      badge: "bg-sky-600 dark:bg-sky-500 text-white",
    },
  },
  {
    tier: "Associate",
    name: "Associate Sponsor",
    amount: 100000,
    formattedAmount: "₹1 LAKH",
    displayBadge: "₹1 LAKH",
    badge: "Associate Sponsor (₹1 Lakh)",
    benefits: [
      "Logo placement on event posters and selected creatives",
      "Flex branding at the venue",
      "Social media mention",
      "Sponsor announcement during the event",
      "Branding on selected event materials",
    ],
    color: {
      border: "border-indigo-300 dark:border-indigo-800/60",
      bg: "bg-indigo-50/70 dark:bg-indigo-950/20",
      text: "text-indigo-950 dark:text-indigo-200",
      badge: "bg-indigo-600 dark:bg-indigo-500 text-white",
    },
  },
  {
    tier: "Supporting",
    name: "Supporting Sponsor",
    amount: 50000,
    formattedAmount: "₹50K",
    displayBadge: "₹50K",
    badge: "Supporting Sponsor (₹50K)",
    benefits: [
      "Logo placement on selected event posters and creatives",
      "Social media promotion and stories",
      "Sponsor announcement during the event",
      "Brand mention in event email updates",
      "Digital sponsor badge for partner use",
    ],
    color: {
      border: "border-amber-300 dark:border-amber-800/60",
      bg: "bg-amber-50/70 dark:bg-amber-950/20",
      text: "text-amber-950 dark:text-amber-200",
      badge: "bg-amber-600 dark:bg-amber-500 text-white",
    },
  },
  {
    tier: "Community",
    name: "Community Sponsor",
    amount: 25000,
    formattedAmount: "₹25K",
    displayBadge: "₹25K",
    badge: "Community Sponsor (₹25K)",
    benefits: [
      "Logo placement on selected promotional materials",
      "Social media acknowledgement",
      "Sponsor acknowledgement during the event",
      "Logo inclusion on the sponsor thank-you display",
    ],
    color: {
      border: "border-purple-300 dark:border-purple-800/60",
      bg: "bg-purple-50/70 dark:bg-purple-950/20",
      text: "text-purple-950 dark:text-purple-200",
      badge: "bg-purple-600 dark:bg-purple-500 text-white",
    },
  },
  {
    tier: "Event Sponsor",
    name: "Event Sponsor*",
    amount: 10000,
    formattedAmount: "₹10K+",
    displayBadge: "₹10K+",
    badge: "Event Sponsor* (₹10K+)",
    footnote: "*Varies depending on the amount contributed",
    benefits: [
      "Logo/name placement on selected promotional materials",
      "Social media acknowledgement",
      "Sponsor acknowledgement during the sponsored event",
    ],
    color: {
      border: "border-stone-300 dark:border-stone-700/60",
      bg: "bg-stone-50/70 dark:bg-stone-900/30",
      text: "text-stone-900 dark:text-stone-200",
      badge: "bg-stone-600 dark:bg-stone-500 text-white",
    },
  },
];

export const officialContacts = {
  convenors: [
    {
      name: "Sravan",
      role: "Convenor" as const,
      phone: "6238631015",
    },
    {
      name: "Abhinav",
      role: "Convenor" as const,
      phone: "8304936509",
    },
    {
      name: "Vishnupriya",
      role: "Convenor" as const,
      phone: "9947834206",
    },
  ],
  sponsorshipHeads: [
    {
      name: "Nadhim",
      role: "Sponsorship Head" as const,
      phone: "9446853300",
    },
    {
      name: "Sunisha",
      role: "Sponsorship Head" as const,
      phone: "8330818187",
    },
    {
      name: "Gaganjith",
      role: "Sponsorship Head" as const,
      phone: "9400565693",
    },
  ],
};

/**
 * Quick telephone pitch guidelines for volunteer SDRs
 */
export const quickPitchGuidelines = {
  who: `${eventConfig.organizer}, ${eventConfig.institutionShort}`,
  what: eventConfig.eventType,
  when: eventConfig.dates,
  where: eventConfig.venue,
  audience: eventConfig.attendanceClaim,
  whySponsor:
    "Brand visibility, product demonstration, lead generation, recruitment, internships, networking, and engineering-community engagement.",
  conciseHook: `PRAROHA'26 is the Intercollegiate Civil Engineering Fest organized by the Division of Civil Engineering at CUSAT (SOE CUSAT, Dec 04–05), connecting over 1000+ students from colleges across Kerala with leading infrastructure and engineering companies.`,
};
