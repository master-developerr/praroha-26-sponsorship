export const CALL_DEBRIEF_PROMPT_VERSION = "v1.0";

export interface DebriefAnalysisInput {
  companyName: string;
  industry: string;
  leadStatus: string;
  discussionSummary: string;
  debriefTranscript?: string;
  volunteerSelectedOutcome?: string;
  decisionMakerStatus?: string;
  primaryObjection?: string;
  importantInfoLearned?: string;
}

export function buildCallDebriefPrompt(input: DebriefAnalysisInput): string {
  return `You are a sponsorship outreach auditor and deal coach for PRAROHA'26 (Civil Engineering Dept, School of Engineering, CUSAT, Kochi).

Analyze the debrief report submitted by a student volunteer after a live outreach call.

COMPANY INFO:
- Company: ${input.companyName}
- Industry: ${input.industry}
- Lead Status: ${input.leadStatus}

DEBRIEF EVIDENCE:
- Volunteer Notes / Summary: "${input.discussionSummary}"
${input.debriefTranscript ? `- Voice Audio Transcript: "${input.debriefTranscript}"` : ""}
${input.volunteerSelectedOutcome ? `- Volunteer Logged Outcome: ${input.volunteerSelectedOutcome}` : ""}
${input.decisionMakerStatus ? `- Decision Maker Status: ${input.decisionMakerStatus}` : ""}
${input.primaryObjection ? `- Primary Objection Noted: ${input.primaryObjection}` : ""}
${input.importantInfoLearned ? `- Key Information Learned: ${input.importantInfoLearned}` : ""}

TASKS:
1. DETECT OUTCOME: Select one of: "INTERESTED", "FOLLOW_UP", "REJECTED", "NOT_RELEVANT", "NO_RESPONSE", "WRONG_CONTACT", "CALL_BACK", "CONVERTED".
2. INTEREST LEVEL: Categorize as "High", "Medium", "Low", or "None".
3. SIGNALS: Extract true positive signals (interest, proposal requested, meeting set) and negative signals (skepticism, budget freeze, delays).
4. COACHING: What did the volunteer do well? What could be improved for next time?
5. NEXT ACTION: Concrete tactical recommendation for PRAROHA'26 sponsorship team.
6. FOLLOW-UP: If a callback is warranted, suggest realistic timing (e.g., 2, 3, or 5 days) and priority.

Format your output strictly as a JSON object matching this exact structure:
{
  "detectedOutcome": "FOLLOW_UP",
  "interestLevel": "Medium",
  "rejectionReason": "Budget discussion postponed to Q1",
  "objectionAnalysis": "Decision maker was receptive to college fest demographic but requested a follow-up after monthly review.",
  "positiveSignals": ["Asked for sponsorship deck via email", "Expressed interest in civil tech track"],
  "negativeSignals": ["Current quarter marketing budget frozen"],
  "whatVolunteerDidWell": ["Polite introduction and clear event framing"],
  "whatCouldImprove": ["Could have offered non-cash alternative immediately"],
  "recommendedNextAction": "Dispatch proposal deck and set reminder for callback in 4 days",
  "followUpSuggestion": {
    "recommendedDaysFromNow": 4,
    "priority": "Medium",
    "notes": "Follow up after marketing committee review"
  }
}
Note: "interestLevel" MUST be one of "High", "Medium", "Low", "None". "priority" MUST be one of "High", "Medium", "Low".`;
}

