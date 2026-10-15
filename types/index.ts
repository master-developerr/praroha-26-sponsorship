import { Id } from "@/convex/_generated/dataModel";

export type UserRole = "admin" | "volunteer";

export type VolunteerVerificationStatus = "pending" | "approved" | "rejected" | "suspended";

export type Semester = "S1" | "S2" | "S3" | "S4" | "S5" | "S6" | "S7" | "S8";

export type Department =
  | "Civil Engineering"
  | "Computer Science & Engineering"
  | "Information Technology"
  | "Electronics & Communication"
  | "Electrical & Electronics"
  | "Mechanical Engineering"
  | "Safety & Fire Engineering";

export type LeadStage =
  | "UNASSIGNED"
  | "ASSIGNED"
  | "CONTACTED"
  | "INTERESTED"
  | "FOLLOW_UP"
  | "PROPOSAL_REQUESTED"
  | "PROPOSAL_SENT"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export type PhoneType =
  | "direct_official"
  | "office"
  | "regional_office"
  | "department"
  | "switchboard"
  | "unknown";

export type ContactVerificationLevel =
  | "VERIFIED_DECISION_MAKER"
  | "VERIFIED_COMPANY_REPRESENTATIVE"
  | "OFFICIAL_COMPANY_CONTACT"
  | "UNVERIFIED";

export type PriorityLevel = "High" | "Medium" | "Normal" | "Low";

export type SponsorshipCategory =
  | "CASH"
  | "PRODUCT"
  | "SERVICES"
  | "TECHNICAL_SUPPORT"
  | "WORKSHOP"
  | "SPEAKER"
  | "PRIZES"
  | "SOFTWARE"
  | "MERCHANDISE"
  | "VENUE"
  | "PRINTING"
  | "TRANSPORTATION"
  | "OTHER_IN_KIND";

export interface CompanyLead {
  _id: Id<"companies">;
  companyName: string;
  normalizedName: string;
  deduplicationHash: string;
  industry: string;
  niche: string;
  priority: PriorityLevel;
  leadScore?: number;
  website?: string;
  linkedin?: string;
  location?: string;
  companySize?: string;
  annualRevenue?: string;
  keralaPresence?: string;
  sponsorshipHistory?: string;
  sponsorshipEvidence?: string;
  whyGoodLead?: string;
  whyCompanyBenefits?: string;
  recommendedSponsorshipType?: string;
  recommendedAskMin?: number;
  recommendedAskMax?: number;
  alternativeSupport?: string;
  source?: string;
  sourceUrl?: string;
  leadStatus: LeadStage;
  notes?: string;
  lastContactedAt?: number;
  createdAt: number;
  updatedAt?: number;
  primaryContact?: CompanyContact | null;
  totalContacts?: number;
}

export interface CompanyContact {
  _id: Id<"contacts">;
  companyId: Id<"companies">;
  contactName: string;
  designation: string;
  phone: string;
  phoneType: PhoneType;
  email?: string;
  linkedin?: string;
  contactVerification: ContactVerificationLevel;
  contactSource?: string;
  isPrimary: boolean;
  createdAt: number;
  updatedAt?: number;
}

export interface UserProfile {
  _id?: string;
  clerkId: string;
  email: string;
  name: string;
  phone: string;
  semester: Semester;
  department: Department;
  role: UserRole;
  verificationStatus: VolunteerVerificationStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: number;
  createdAt: number;
  updatedAt?: number;
}

export interface AuditLog {
  _id?: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: string;
  timestamp: number;
}

export interface LeadAssignment {
  _id: Id<"leadAssignments">;
  companyId: Id<"companies">;
  volunteerId: Id<"users">;
  assignedBy: Id<"users">;
  status: "active" | "reassigned" | "released";
  reassignReason?: string;
  assignedAt: number;
  updatedAt?: number;
}

export interface VolunteerWorkload {
  _id: Id<"users">;
  clerkId: string;
  name: string;
  email: string;
  phone: string;
  semester: Semester;
  department: Department;
  activeLeadsCount: number;
  capacityStatus: "Available" | "Moderate" | "Near Capacity";
  createdAt: number;
}

export type QuickCallOutcome =
  | "Interested"
  | "Asked for proposal"
  | "Asked for budget"
  | "Wrong person"
  | "Call back"
  | "Rejected"
  | "Non-cash opportunity"
  | "Meeting requested"
  | "Other";

export type InterestLevel = "High" | "Medium" | "Low" | "None";

export interface CallSession {
  _id: Id<"calls">;
  companyId: Id<"companies">;
  contactId?: Id<"contacts">;
  volunteerId: Id<"users">;
  quickOutcome: QuickCallOutcome;
  startedAt: number;
  endedAt: number;
  durationSeconds: number;
  createdAt: number;
}

export interface CallDebrief {
  _id: Id<"callDebriefs">;
  callId: Id<"calls">;
  companyId: Id<"companies">;
  volunteerId: Id<"users">;
  discussionSummary: string;
  interestLevel: InterestLevel;
  decisionMakerStatus: string;
  primaryObjection?: string;
  importantInfoLearned?: string;
  requestedAction?: string;
  nextAction?: string;
  isVerifiedByAdmin: boolean;
  createdAt: number;
}

export interface FollowUpItem {
  _id: Id<"followUps">;
  companyId: Id<"companies">;
  volunteerId: Id<"users">;
  callId?: Id<"calls">;
  dueDate: number;
  priority: "High" | "Medium" | "Low";
  notes: string;
  status: "pending" | "completed" | "cancelled";
  completedAt?: number;
  createdAt: number;
  companyName?: string;
  companyIndustry?: string;
  companyNiche?: string;
  companyPriority?: PriorityLevel;
  primaryContact?: CompanyContact | null;
}

export type SponsorshipTier =
  | "Title"
  | "Powered By"
  | "Associate"
  | "Custom"
  | "In-Kind";

export type ProposalStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "superseded";

export interface ProposalItem {
  _id: Id<"proposals">;
  companyId: Id<"companies">;
  volunteerId: Id<"users">;
  packageTier: SponsorshipTier;
  cashAmount: number;
  inKindCategory?: SponsorshipCategory;
  inKindDescription?: string;
  inKindEstimatedValue?: number;
  totalValuation: number;
  deliverables: string[];
  customDeliverables?: string;
  status: ProposalStatus;
  sentAt?: number;
  notes?: string;
  createdAt: number;
  updatedAt?: number;
  companyName?: string;
  volunteerName?: string;
}

export interface SponsorshipCommitment {
  _id: Id<"sponsorshipCommitments">;
  companyId: Id<"companies">;
  proposalId?: Id<"proposals">;
  volunteerId: Id<"users">;
  authorizedBy: Id<"users">;
  packageTier: string;
  cashAmount: number;
  inKindEstimatedValue: number;
  totalValuation: number;
  inKindCategory?: string;
  inKindDescription?: string;
  deliverablesCommitment: string[];
  mouReference?: string;
  notes?: string;
  authorizedAt: number;
  createdAt: number;
  companyName?: string;
  volunteerName?: string;
  authorizedByName?: string;
}

export interface PipelineKPIs {
  totalLeads: number;
  activeOpportunities: number;
  pipelinePotentialValue: number;
  confirmedCash: number;
  confirmedInKind: number;
  totalConfirmedRevenue: number;
}

export interface RelationshipTimelineEvent {
  id: string;
  type: "call" | "debrief" | "follow_up" | "proposal" | "commitment" | "stage_change";
  title: string;
  description: string;
  timestamp: number;
  actorName?: string;
  badgeLabel?: string;
  badgeClass?: string;
  metadata?: Record<string, any>;
}


