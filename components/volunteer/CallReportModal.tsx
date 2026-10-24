"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  UserCheck,
  Mic,
  Square,
  Volume2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import {
  QuickCallOutcome,
  InterestLevel,
  LeadStage,
  PriorityLevel,
} from "@/types";
import { LeadStatusBadge } from "@/components/ui/badge";
import { DebriefAnalysisCard } from "@/components/ai";
import { VoiceDebriefExtractionResult } from "@/lib/ai/types";

interface CallReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: {
    _id: Id<"companies">;
    companyName: string;
    industry: string;
    leadStatus: LeadStage;
    primaryContact?: {
      _id?: Id<"contacts">;
      contactName: string;
      designation: string;
    } | null;
  } | null;
  initialOutcome: QuickCallOutcome;
  durationSeconds: number;
  startedAt: number;
  endedAt: number;
  onSuccess?: () => void;
}

export function CallReportModal({
  isOpen,
  onClose,
  lead,
  initialOutcome,
  durationSeconds,
  startedAt,
  endedAt,
  onSuccess,
}: CallReportModalProps) {
  const { user } = useAuthUser();
  const logCallMutation = useMutation(api.calls.logCallAndDebrief);
  const generateDebriefAudioUploadUrl = useMutation(api.calls.generateDebriefAudioUploadUrl);

  const [outcome, setOutcome] = useState<QuickCallOutcome>(initialOutcome);
  const [interestLevel, setInterestLevel] = useState<InterestLevel>("Medium");
  const [decisionMakerStatus, setDecisionMakerStatus] = useState<string>(
    "Spoke directly to decision-maker"
  );
  const [primaryObjection, setPrimaryObjection] = useState<string>("");
  const [discussionSummary, setDiscussionSummary] = useState<string>("");
  const [targetLeadStatus, setTargetLeadStatus] = useState<LeadStage>("CONTACTED");

  // Server-side audio storage & transcription state
  const [debriefAudioStorageId, setDebriefAudioStorageId] = useState<string | undefined>(undefined);
  const [debriefTranscript, setDebriefTranscript] = useState<string | undefined>(undefined);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [aiResultData, setAiResultData] = useState<VoiceDebriefExtractionResult | null>(null);
  const [aiSuggestedFields, setAiSuggestedFields] = useState<{ [field: string]: boolean }>({});

  // Voice Debrief Audio Recording & Live Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Upload to Convex storage & trigger AI transcription and structured extraction
  const handleProcessAudioDebrief = async (audioBlob: Blob, liveTranscript: string) => {
    if (!user?.id || !lead) return;

    setIsTranscribing(true);
    setErrorMessage(null);

    let storageId: string | undefined = undefined;

    // 1. Upload to Convex File Storage
    try {
      const uploadUrl = await generateDebriefAudioUploadUrl({ volunteerClerkId: user.id });
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": audioBlob.type || "audio/webm" },
        body: audioBlob,
      });

      if (uploadRes.ok) {
        const uploadJson = await uploadRes.json();
        storageId = uploadJson.storageId;
        setDebriefAudioStorageId(storageId);
      }
    } catch (uploadErr: any) {
      console.warn("[Debrief Audio Upload Warning]:", uploadErr?.message || uploadErr);
    }

    // 2. Send to Server Transcription & Intelligence Extraction Endpoint
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "debrief.webm");
      formData.append("companyName", lead.companyName);
      formData.append("industry", lead.industry);
      formData.append("leadStatus", targetLeadStatus);
      if (liveTranscript.trim()) {
        formData.append("clientTranscript", liveTranscript.trim());
      }
      formData.append("volunteerId", user.id);

      const aiRes = await fetch("/api/ai/transcribe-debrief", {
        method: "POST",
        body: formData,
      });

      const json = await aiRes.json();

      if (json.success && json.data) {
        const aiData = json.data as VoiceDebriefExtractionResult;
        setAiResultData(aiData);

        if (aiData.transcript) {
          setDebriefTranscript(aiData.transcript);
        }

        // Pre-fill editable fields
        if (aiData.discussionSummary) {
          setDiscussionSummary(aiData.discussionSummary);
        }
        if (aiData.detectedOutcome) {
          setOutcome(aiData.detectedOutcome);
        }
        if (aiData.targetLeadStatus) {
          setTargetLeadStatus(aiData.targetLeadStatus);
        }
        if (aiData.interestLevel) {
          setInterestLevel(aiData.interestLevel);
        }
        if (aiData.decisionMakerStatus) {
          setDecisionMakerStatus(aiData.decisionMakerStatus);
        }
        if (aiData.primaryObjection) {
          setPrimaryObjection(aiData.primaryObjection);
        }

        // Pre-fill follow-up if suggested
        if (aiData.followUpSuggestion) {
          setScheduleFollowUp(true);
          const days = aiData.followUpSuggestion.recommendedDaysFromNow || 2;
          const callbackDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
          callbackDate.setHours(10, 0, 0, 0);
          setFollowUpDate(callbackDate.toISOString().slice(0, 16));
          setFollowUpPriority(aiData.followUpSuggestion.priority || "Medium");
          setFollowUpNotes(aiData.followUpSuggestion.notes || aiData.recommendedNextAction);
        }

        setAiSuggestedFields({
          summary: true,
          outcome: true,
          interest: true,
          decisionMaker: true,
          followUp: Boolean(aiData.followUpSuggestion),
        });
      }
    } catch (aiErr: any) {
      console.warn("[Debrief AI Transcription Warning]:", aiErr?.message || aiErr);
    } finally {
      setIsTranscribing(false);
    }
  };

  const startVoiceRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      let liveSpokenTranscript = "";

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());

        // Process audio via Convex Storage + Server AI Transcription
        await handleProcessAudioDebrief(audioBlob, liveSpokenTranscript);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordDuration(0);

      recordIntervalRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + " ";
          }
          if (currentTranscript.trim()) {
            liveSpokenTranscript = currentTranscript.trim();
            setDiscussionSummary(currentTranscript.trim());
          }
        };

        recognition.onerror = (e: any) => {
          console.warn("[SpeechRecognition error]:", e);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (err: any) {
      setErrorMessage(
        "Microphone access unavailable or denied. You can still type the discussion summary manually."
      );
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (recordIntervalRef.current) {
      clearInterval(recordIntervalRef.current);
      recordIntervalRef.current = null;
    }
    setIsRecording(false);
  };

  // Follow-up scheduling state
  const [scheduleFollowUp, setScheduleFollowUp] = useState<boolean>(false);
  const [followUpDate, setFollowUpDate] = useState<string>("");
  const [followUpPriority, setFollowUpPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [followUpNotes, setFollowUpNotes] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-map suggested lifecycle status from outcome
  useEffect(() => {
    setOutcome(initialOutcome);
    switch (initialOutcome) {
      case "Interested":
      case "Meeting requested":
      case "Non-cash opportunity":
        setTargetLeadStatus("INTERESTED");
        setInterestLevel("High");
        break;
      case "Asked for proposal":
        setTargetLeadStatus("PROPOSAL_REQUESTED");
        setInterestLevel("High");
        break;
      case "Call back":
        setTargetLeadStatus("FOLLOW_UP");
        setScheduleFollowUp(true);
        // Default tomorrow 10am
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        tomorrow.setHours(10, 0, 0, 0);
        setFollowUpDate(tomorrow.toISOString().slice(0, 16));
        setFollowUpNotes("Scheduled callback following outreach call.");
        break;
      case "Rejected":
        setTargetLeadStatus("LOST");
        setInterestLevel("None");
        break;
      default:
        setTargetLeadStatus("CONTACTED");
    }
  }, [initialOutcome, isOpen]);

  if (!isOpen || !lead) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !discussionSummary.trim()) {
      setErrorMessage("Please enter a brief qualitative summary of the discussion.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      let followUpPayload = undefined;
      if (scheduleFollowUp && followUpDate) {
        followUpPayload = {
          dueDate: new Date(followUpDate).getTime(),
          priority: followUpPriority,
          notes: followUpNotes.trim() || `Follow up with ${lead.companyName}`,
        };
      }

      await logCallMutation({
        volunteerClerkId: user.id,
        companyId: lead._id,
        contactId: lead.primaryContact?._id,
        startedAt,
        endedAt,
        durationSeconds,
        quickOutcome: outcome,
        discussionSummary: discussionSummary.trim(),
        interestLevel,
        decisionMakerStatus,
        primaryObjection: primaryObjection.trim() || undefined,
        targetLeadStatus,
        debriefAudioStorageId,
        debriefTranscript,
        scheduleFollowUp: followUpPayload,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save call debrief");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Outreach Call Debrief"
      description={`Record call notes and progress the partnership lifecycle for ${lead.companyName}.`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2 max-h-[75vh] overflow-y-auto pr-1">
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 p-3 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Call Summary Banner */}
        <div className="rounded-xl border border-border-subtle bg-surface-subtle p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-text-muted">
                Logged Outcome
              </span>
              {aiSuggestedFields.outcome && (
                <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded-full border border-teal-500/20">
                  ✨ AI Detected
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-text-primary text-sm">
                {outcome}
              </span>
              <span className="rounded bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-mono font-bold">
                {formatTimer(durationSeconds)}
              </span>
            </div>
          </div>

          {/* Stage Progression Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-text-secondary font-medium">Progress to Stage:</span>
              {aiSuggestedFields.status && (
                <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded-full border border-teal-500/20">
                  ✨ AI
                </span>
              )}
            </div>
            <select
              value={targetLeadStatus}
              onChange={(e) => setTargetLeadStatus(e.target.value as LeadStage)}
              className="h-8 rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="CONTACTED">CONTACTED (First Reach)</option>
              <option value="INTERESTED">INTERESTED (Positive Lead)</option>
              <option value="FOLLOW_UP">FOLLOW_UP (Callback Queued)</option>
              <option value="PROPOSAL_REQUESTED">PROPOSAL_REQUESTED</option>
              <option value="PROPOSAL_SENT">PROPOSAL_SENT</option>
              <option value="NEGOTIATION">NEGOTIATION</option>
              <option value="WON">WON (Confirmed Partner)</option>
              <option value="LOST">LOST (Closed / Rejected)</option>
            </select>
          </div>
        </div>

        {/* 2. Structured Intelligence Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Interest Level */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-text-primary">
                Interest Level <span className="text-rose-500">*</span>
              </label>
              {aiSuggestedFields.interest && (
                <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded-full border border-teal-500/20">
                  ✨ AI Suggested
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(["High", "Medium", "Low", "None"] as InterestLevel[]).map(
                (lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setInterestLevel(lvl)}
                    className={`rounded-lg py-1.5 text-xs font-bold transition-all border cursor-pointer ${
                      interestLevel === lvl
                        ? lvl === "High"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : lvl === "Medium"
                          ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                          : lvl === "Low"
                          ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                          : "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-surface text-text-secondary border-border hover:bg-surface-subtle"
                    }`}
                  >
                    {lvl}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Decision-Maker Status */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-text-primary">
                Decision-Maker Status <span className="text-rose-500">*</span>
              </label>
              {aiSuggestedFields.decisionMaker && (
                <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded-full border border-teal-500/20">
                  ✨ AI Inferred
                </span>
              )}
            </div>
            <select
              value={decisionMakerStatus}
              onChange={(e) => setDecisionMakerStatus(e.target.value)}
              className="w-full h-8 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="Spoke directly to decision-maker">
                Spoke directly to decision-maker
              </option>
              <option value="Gatekeeper redirected to marketing">
                Gatekeeper redirected to marketing
              </option>
              <option value="Left message with front office">
                Left message with front office
              </option>
              <option value="Requested official email briefing">
                Requested official email briefing
              </option>
              <option value="Wrong number / Employee left company">
                Wrong number / Employee left company
              </option>
              <option value="Call not answered / Switched off">
                Call not answered / Switched off
              </option>
            </select>
          </div>
        </div>

        {/* 3. Primary Objection (Optional) */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-text-primary">
            Primary Objection Encountered (Optional)
          </label>
          <select
            value={primaryObjection}
            onChange={(e) => setPrimaryObjection(e.target.value)}
            className="w-full h-8 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="">None / Positive Discussion</option>
            <option value="Sponsorship budget exhausted for FY26">
              Sponsorship budget exhausted for FY26
            </option>
            <option value="Does not sponsor student or collegiate events">
              Does not sponsor student or collegiate events
            </option>
            <option value="Only participates in tier-1 national conferences">
              Only participates in tier-1 national conferences
            </option>
            <option value="Decision made strictly at Mumbai / Delhi HQ">
              Decision made strictly at Mumbai / Delhi HQ
            </option>
            <option value="Prefers non-cash product/merchandise support only">
              Prefers non-cash product/merchandise support only
            </option>
            <option value="Send proposal deck for internal committee review">
              Send proposal deck for internal committee review
            </option>
          </select>
        </div>

        {/* 4. Qualitative Discussion Summary & Voice Debrief */}
        <div className="space-y-2 text-xs">
          {/* Voice Debrief Audio Recorder Box */}
          <div className="rounded-xl border border-teal-500/25 bg-teal-500/5 p-3 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 text-primary">
                  <Mic className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-text-primary block">
                    Voice Debrief Recorder
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Record your natural spoken debrief; audio is saved to Convex storage and transcribed with AI.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isRecording ? (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={stopVoiceRecording}
                    className="h-7 text-xs flex items-center gap-1.5 animate-pulse"
                  >
                    <Square className="h-3 w-3 fill-current" />
                    Stop Recording ({formatTimer(recordDuration)})
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={startVoiceRecording}
                    disabled={isTranscribing}
                    className="h-7 text-xs text-primary border-primary/30 hover:bg-teal-500/10 flex items-center gap-1.5"
                  >
                    <Mic className="h-3.5 w-3.5 text-primary" />
                    {audioUrl ? "Record Again" : "Record Voice Debrief"}
                  </Button>
                )}
              </div>
            </div>

            {/* In-Flight Transcription Progress Banner */}
            {isTranscribing && (
              <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-2.5 flex items-center gap-2.5 text-xs animate-pulse">
                <Loader2 className="h-4 w-4 text-teal-600 dark:text-teal-400 animate-spin shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-bold text-text-primary block flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                    Uploading & Transcribing Debrief Audio...
                  </span>
                  <span className="text-[11px] text-text-muted block">
                    Synthesizing notes, detecting outcomes, and extracting follow-up directives with AI.
                  </span>
                </div>
              </div>
            )}

            {audioUrl && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-teal-500/15">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-text-secondary">Debrief Audio:</span>
                  <audio controls src={audioUrl} className="h-7 w-full max-w-xs text-xs" />
                </div>
                {debriefAudioStorageId && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Saved to Storage
                  </span>
                )}
              </div>
            )}

            {/* Verbatim Voice Transcript Accordion */}
            {debriefTranscript && (
              <div className="rounded-lg border border-teal-500/20 bg-surface/80 p-2.5 space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setShowTranscript((prev) => !prev)}
                  className="w-full flex items-center justify-between font-semibold text-text-primary text-xs cursor-pointer hover:text-primary transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    Verbatim Spoken Transcript ({debriefTranscript.length} chars)
                  </span>
                  <span className="text-[10px] text-text-muted flex items-center gap-1">
                    {showTranscript ? "Hide" : "Review"}
                    {showTranscript ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </span>
                </button>
                {showTranscript && (
                  <p className="text-[11px] text-text-secondary italic bg-surface p-2 rounded border border-border-subtle leading-relaxed whitespace-pre-wrap">
                    &ldquo;{debriefTranscript}&rdquo;
                  </p>
                )}
              </div>
            )}

            {/* Spoken AI Signals & Next Action Preview */}
            {aiResultData && !isTranscribing && (
              <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-2.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary text-[10px] uppercase flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                    Spoken Signals Extracted
                  </span>
                  <span className="text-[10px] text-teal-700 dark:text-teal-300 font-medium">
                    Editable Below
                  </span>
                </div>

                {aiResultData.positiveSignals?.length > 0 && (
                  <div className="space-y-0.5">
                    {aiResultData.positiveSignals.map((sig, i) => (
                      <div key={i} className="text-[11px] text-text-secondary flex items-start gap-1">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{sig}</span>
                      </div>
                    ))}
                  </div>
                )}

                {aiResultData.recommendedNextAction && (
                  <div className="pt-1 border-t border-teal-500/15">
                    <span className="text-[10px] font-bold text-text-primary">Recommended Action: </span>
                    <span className="text-[11px] text-text-secondary font-medium">
                      {aiResultData.recommendedNextAction}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="font-semibold text-text-primary block">
              Discussion Summary & Key Facts (Editable) <span className="text-rose-500">*</span>
            </label>
            {aiSuggestedFields.summary && (
              <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded-full border border-teal-500/20">
                ✨ AI Extracted
              </span>
            )}
          </div>
          <textarea
            rows={3}
            required
            value={discussionSummary}
            onChange={(e) => setDiscussionSummary(e.target.value)}
            placeholder="E.g., Spoke with Mr. Suresh (Regional Head). Very positive about civil engineering talent. Asked for Tier 2 proposal deck by Friday. Next action: send brochure."
            className="w-full rounded-lg border border-border bg-surface p-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />

          {/* AI Debrief Analysis Card */}
          <DebriefAnalysisCard
            companyName={lead.companyName}
            industry={lead.industry}
            leadStatus={targetLeadStatus}
            discussionSummary={discussionSummary}
            debriefTranscript={debriefTranscript}
            primaryObjection={primaryObjection}
            onApplySuggestions={(aiResult) => {
              if (aiResult.detectedOutcome === "PROPOSAL_REQUESTED") {
                setOutcome("Asked for proposal");
                setTargetLeadStatus("PROPOSAL_REQUESTED");
              } else if (aiResult.detectedOutcome === "INTERESTED") {
                setOutcome("Interested");
                setTargetLeadStatus("INTERESTED");
              } else if (aiResult.detectedOutcome === "CALL_BACK" || aiResult.detectedOutcome === "FOLLOW_UP") {
                setOutcome("Call back");
                setTargetLeadStatus("FOLLOW_UP");
              } else if (aiResult.detectedOutcome === "REJECTED") {
                setOutcome("Rejected");
                setTargetLeadStatus("LOST");
              } else if (aiResult.detectedOutcome === "WRONG_CONTACT") {
                setOutcome("Wrong person");
              }

              if (aiResult.interestLevel) {
                setInterestLevel(aiResult.interestLevel);
              }

              if (aiResult.followUpSuggestion) {
                setScheduleFollowUp(true);
                const days = aiResult.followUpSuggestion.recommendedDaysFromNow || 2;
                const callbackDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
                callbackDate.setHours(10, 0, 0, 0);
                setFollowUpDate(callbackDate.toISOString().slice(0, 16));
                setFollowUpPriority(aiResult.followUpSuggestion.priority || "Medium");
                setFollowUpNotes(aiResult.followUpSuggestion.notes || aiResult.recommendedNextAction);
              }
            }}
          />
        </div>

        {/* 5. Schedule Callback Section */}
        <div className="rounded-xl border border-border-subtle bg-surface-subtle/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-text-primary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={scheduleFollowUp}
                onChange={(e) => setScheduleFollowUp(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                Schedule Next Follow-Up Callback
              </span>
            </label>
            {scheduleFollowUp && (
              <span className="rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold">
                Callback Queued
              </span>
            )}
          </div>

          {scheduleFollowUp && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs animate-in fade-in">
              <div className="space-y-1">
                <label className="font-medium text-text-secondary">
                  Callback Date & Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required={scheduleFollowUp}
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full h-8 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-text-secondary">
                  Follow-Up Priority
                </label>
                <select
                  value={followUpPriority}
                  onChange={(e) =>
                    setFollowUpPriority(e.target.value as "High" | "Medium" | "Low")
                  }
                  className="w-full h-8 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
                >
                  <option value="High">High (Urgent Callback)</option>
                  <option value="Medium">Medium (Standard)</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-medium text-text-secondary">
                  Callback Action Notes
                </label>
                <input
                  type="text"
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="E.g., Call back to confirm if marketing committee reviewed brochure."
                  className="w-full h-8 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !discussionSummary.trim()}
            className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1.5">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Saving Debrief...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Save Debrief & Progress Lead</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
