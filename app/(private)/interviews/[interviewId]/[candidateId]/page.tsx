"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChevronLeft,
  Building2,
  Info,
  CheckCircle2,
  Clock,
  Quote,
  Loader2,
  CornerDownRightIcon,
  MapPinIcon,
  ArrowLeftIcon,
  EditIcon,
  PencilIcon,
  DownloadIcon,
  CircleIcon,
  CheckIcon,
  PlusIcon,
  ClockIcon,
  XIcon,
  TriangleAlert,
  CircleCheck
} from "lucide-react";
import { interviewService } from "@/features/interviews/services/interview-service";
import { CandidateResult, InterviewDetail } from "@/features/interviews/types/interview";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const statusColorMap: Record<string, { color: string; bgColor: string; outline: string; icon: React.ElementType }> = {
  "success": { color: "#4BAC87", bgColor: "#EEF8F4", outline: "#C9EBDE", icon: CheckIcon },
  "danger": { color: "#E84E2C", bgColor: "#FFEEEA", outline: "#FFCBBF", icon: XIcon },
  "muted": { color: "#595F6A", bgColor: "#FAFAFA", outline: "#E2E4E6", icon: ClockIcon }
};

const hiringColorMap: Record<string, { color: string; bgColor: string; iconBg: string; icon: React.ElementType; value: string }> = {
    "Strong Hire": { color: "#4BAC87", bgColor: "#EEF8F4", iconBg: "#C9EBDE", icon: CheckIcon, value: "strong-hire" },
    "Hire": { color: "#0076D2", bgColor: "#F1F9FA", iconBg: "#DBF2F3", icon: PlusIcon, value: "hire" },
    "Consider": { color: "#E8A01D", bgColor: "#FFF7E9", iconBg: "#FFE7BA", icon: ClockIcon, value: "consider" },
    "Reject": { color: "#E84E2C", bgColor: "#FFEEEA", iconBg: "#FFCBBF", icon: XIcon, value: "reject" },
};

const internalAssessmentColorMap: Record<string, { color: string; bgColor: string; iconBg: string; icon: React.ElementType; value: string }> = {
    "Ready for Promotion": { color: "#4BAC87", bgColor: "#EEF8F4", iconBg: "#C9EBDE", icon: CheckIcon, value: "ready-for-promotion" },
    "Meets Current Level": { color: "#0076D2", bgColor: "#F1F9FA", iconBg: "#DBF2F3", icon: PlusIcon, value: "meets-current-level" },
    "Needs Improvement": { color: "#E8A01D", bgColor: "#FFF7E9", iconBg: "#FFE7BA", icon: ClockIcon, value: "needs-improvement" },
    "Significant Improvement Required": { color: "#E84E2C", bgColor: "#FFEEEA", iconBg: "#FFCBBF", icon: XIcon, value: "significant-improvement-required" },
};

export default function CandidateInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params?.interviewId as string;
  const candidateId = params?.candidateId as string;

  const [candidateResult, setCandidateResult] = useState<CandidateResult | null>(null);
  const [interviewDetail, setInterviewDetail] = useState<InterviewDetail | null>(null);
  const [stepProgress, setStepProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [draftTranscript, setDraftTranscript] = useState<string>("");
  const [isUpdatingTranscript, setIsUpdatingTranscript] = useState(false);
  const [validatingQuestionId, setValidatingQuestionId] = useState<string | null>(null);
  const [downloadingQuestionId, setDownloadingQuestionId] = useState<string | null>(null);
  const [retryingQuestionId, setRetryingQuestionId] = useState<string | null>(null);

  const silentReload = async () => {
    try {
      const [resultData, interviewData, progressData] = await Promise.all([
        interviewService.getCandidateResult(interviewId, candidateId),
        interviewService.getInterviewById(interviewId),
        interviewService.getStepProgress(interviewId, candidateId)
      ]);
      setCandidateResult(resultData);
      setInterviewDetail(interviewData);
      setStepProgress(progressData);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleRetryStt = async (participantId: string, questionId: string) => {
    setRetryingQuestionId(questionId);
    try {
      await interviewService.retryStt(participantId, questionId);
      toast.success("Retry requested successfully");
      await silentReload();
    } catch (error: any) {
      toast.error(error.message || "Failed to retry STT");
    } finally {
      setRetryingQuestionId(null);
    }
  };

  const handleDownloadVideo = async (fileName: string | null, questionId: string) => {
    if (!fileName) {
      toast.error("Video file not found for this answer.");
      return;
    }
    setDownloadingQuestionId(questionId);
    try {
      const blob = await interviewService.downloadVideo(fileName);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error(error.message || "Failed to download video");
    } finally {
      setDownloadingQuestionId(null);
    }
  };

  const handleValidateAnswer = async (questionId: string, participantId: string) => {
    setValidatingQuestionId(questionId);
    try {
      await interviewService.validateAnswer(participantId, questionId);
      toast.success("Answer validated successfully");

      if (candidateResult) {
        const updatedAnswers = candidateResult.answers.map(a =>
          a.questionId === questionId ? { ...a, isValidated: true } : a
        );
        setCandidateResult({ ...candidateResult, answers: updatedAnswers });
      }
      if (editingQuestionId === questionId) {
        setEditingQuestionId(null); // Close edit mode if open
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to validate answer");
    } finally {
      setValidatingQuestionId(null);
    }
  };

  const handleSaveTranscript = async (questionId: string, participantId: string) => {
    setIsUpdatingTranscript(true);
    try {
      await interviewService.updateAnswerTranscript(participantId, questionId, draftTranscript);
      toast.success("Transcript updated successfully");

      if (candidateResult) {
        const updatedAnswers = candidateResult.answers.map(a =>
          a.questionId === questionId ? { ...a, answerTranscript: draftTranscript } : a
        );
        setCandidateResult({ ...candidateResult, answers: updatedAnswers });
      }
      setEditingQuestionId(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update transcript");
    } finally {
      setIsUpdatingTranscript(false);
    }
  };

  useEffect(() => {
    if (!interviewId || !candidateId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [resultData, interviewData, progressData] = await Promise.all([
          interviewService.getCandidateResult(interviewId, candidateId),
          interviewService.getInterviewById(interviewId),
          interviewService.getStepProgress(interviewId, candidateId)
        ]);
        setCandidateResult(resultData);
        setInterviewDetail(interviewData);
        setStepProgress(progressData);
      } catch (err: any) {
        console.error("Error loading candidate results:", err);
        setError(err.message || "Failed to load candidate results.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [interviewId, candidateId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F5F5F5] py-4 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0076D2]" />
      </main>
    );
  }

  if (error || !candidateResult) {
    return (
      <main className="min-h-screen bg-[#F5F5F5] py-10 px-4 flex justify-center items-center">
        <Card className="bg-[#FAFAFA] p-6 text-center border-2 border-red-100 max-w-lg w-full">
          <p className="text-red-500 font-semibold mb-4 text-lg">Error Loading Candidate Results</p>
          <p className="text-slate-600 mb-6 text-sm">{error || "Candidate data not found."}</p>
          <Button onClick={() => router.back()} className="bg-[#0076D2] text-white hover:bg-[#005ba3]">
            Go Back
          </Button>
        </Card>
      </main>
    );
  }

  // Derived Stepper and Score stats
  const isInternal = interviewDetail?.purpose === "INTERNAL_ASSESSMENT" || interviewDetail?.purpose === "INTERNAL_ASSESMENT";
  const activeColorMap = isInternal ? internalAssessmentColorMap : hiringColorMap;

  const mapRecommendationToStatusKey = (rec: string | null | undefined): string | null => {
      if (!rec) return null;
      const lower = rec.toLowerCase();
      if (lower === "strong hire" || lower === "strong-hire") return "Strong Hire";
      if (lower === "hire") return "Hire";
      if (lower === "consider") return "Consider";
      if (lower === "reject") return "Reject";
      if (lower === "ready for promotion" || lower === "ready-for-promotion") return "Ready for Promotion";
      if (lower === "meets current level" || lower === "meets-current-level") return "Meets Current Level";
      if (lower === "needs improvement" || lower === "needs-improvement") return "Needs Improvement";
      if (lower === "significant improvement required" || lower === "significant-improvement-required") return "Significant Improvement Required";
      return null;
  };

  const sortedAnswers = [...candidateResult.answers].sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));
  const totalAnswers = sortedAnswers.length;
  const validatedCount = sortedAnswers.filter((a) => a.isValidated).length;
  const isFullyValidated = totalAnswers > 0 && validatedCount === totalAnswers;

  const avgTechnical = totalAnswers
    ? sortedAnswers.reduce((acc, a) => acc + (a.technicalFundamentalScore || 0), 0) / totalAnswers
    : 0;

  const avgProblemSolving = totalAnswers
    ? sortedAnswers.reduce((acc, a) => acc + (a.problemSolvingScore || 0), 0) / totalAnswers
    : 0;

  const avgCommunication = totalAnswers
    ? sortedAnswers.reduce((acc, a) => acc + (a.communicationScore || 0), 0) / totalAnswers
    : 0;

  // Step 1: Transcription and Answer Integration
  const step1Status = stepProgress?.transcribeAndIntegrationAnswer ? "completed" : "active";

  // Step 2: Candidate Validation
  const step2Status = stepProgress?.validateAnswer ? "completed" : (step1Status === "completed" ? "active" : "disabled");

  // Step 3: Grading Answer by AI
  const step3Status = stepProgress?.gradingAnswer ? "completed" : (step2Status === "completed" ? "active" : "disabled");

  // Step 4: Result
  const step4Status = stepProgress?.resultMappingAnswer ? "completed" : (step3Status === "completed" ? "active" : "disabled");

  let activeStep = 1;
  if (stepProgress?.resultMappingAnswer) activeStep = 5;
  else if (step4Status === "active") activeStep = 4;
  else if (step3Status === "active") activeStep = 3;
  else if (step2Status === "active") activeStep = 2;

  const sttCompletedCount = sortedAnswers.filter(a => a.monitorings?.every((m: any) => m.status === "SUCCESS")).length;
  const sttErrorQuestions = sortedAnswers.filter(a => a.monitorings?.some((m: any) => m.status === "ERROR")).map(a => a.questionNumber || 0);
  const isSttError = sttErrorQuestions.length > 0;

  const isGradingError = sortedAnswers.some(a => a.monitorings?.some((m: any) => m.status === "ERROR" && m.taskName?.toLowerCase().includes("grading")));

  // Stepper visual styles helper
  const getStepStyles = (status: "completed" | "active" | "disabled") => {
    switch (status) {
      case "completed":
        return {
          circle: "bg-[#0076D2] text-[#FAFAFA] border-none",
          text: "text-[#595F6A] font-medium"
        };
      case "active":
        return {
          circle: "bg-white border-2 border-[#0076D2] text-[#0076D2]",
          text: "text-[#0076D2] font-semibold"
        };
      case "disabled":
      default:
        return {
          circle: "bg-[#E2E4E6] text-[#8C929D] border-none",
          text: "text-[#A9ADB5] font-medium"
        };
    }
  };

  const step1 = getStepStyles(step1Status);
  const step2 = getStepStyles(step2Status);
  const step3 = getStepStyles(step3Status);
  const step4 = getStepStyles(step4Status);

  return (

    <Card className="bg-[#FAFAFA] p-4 sm:p-6">
      {/* Top Action Bar */}
      <CardHeader className="flex flex-row items-center justify-between w-full ">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => router.push(`/interviews/${interviewId}`)}
        >
          <ArrowLeftIcon />
          Back
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* Candidate Profile Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#E2E4E6] bg-blue-100 text-[#0076D2] font-bold text-lg flex items-center justify-center uppercase shrink-0">
              {candidateResult.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <h1 className="text-[22px] font-bold text-[#2D2F35] leading-snug">
                {candidateResult.name}
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 text-base">
                <span className="text-[#A9ADB5] font-medium">Interview Role</span>
                <span className="text-[#8C929D]">:</span>
                <span className="text-[#43474F] font-medium">
                  {interviewDetail?.roleTarget || "Position"} ({interviewDetail?.levelTarget || "Junior"})
                </span>
              </div>
            </div>
            {/* Company Badge */}
            {interviewDetail?.companyNamePartner && (
              <div className="flex items-center gap-2 px-2.5 py-1 bg-[#F5F5F5] border border-[#E2E4E6] rounded-md h-fit">
                <MapPinIcon className="w-4 h-4 text-[#3366FF]" />
                <span className="text-[#43474F] text-sm font-medium">{interviewDetail.companyNamePartner}</span>
              </div>
            )}
          </div>

          {/* Progress Stepper */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full gap-6 py-6 mt-2">

            {/* Step 1 */}
            <div className="relative flex flex-col items-center w-[134px]">
              <div className="hidden md:block absolute top-[13px] left-[50%] w-[calc(100%+1.5rem)] h-[2px] bg-[#0076D2] z-0" />
              <div className={`relative z-10 w-7 h-7 shrink-0 font-bold rounded-full flex items-center justify-center text-sm ${step1.circle}`}>1</div>
              <span className={`text-center text-sm leading-tight mt-2 ${step1.text}`}>
                Transcription and Answer Integration
              </span>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center w-[134px]">
              <div className={`hidden md:block absolute top-[13px] left-[50%] w-[calc(100%+1.5rem)] z-0 ${step3Status !== "disabled" ? "h-[2px] bg-[#0076D2]" : "h-px bg-[#E2E4E6]"}`} />
              <div className={`relative z-10 w-7 h-7 shrink-0 font-bold rounded-full flex items-center justify-center text-sm ${step2.circle}`}>
                2
              </div>
              <span className={`text-center text-sm leading-tight mt-2 ${step2.text}`}>
                Candidate Validation
              </span>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center w-[134px]">
              <div className={`hidden md:block absolute top-[13px] left-[50%] w-[calc(100%+1.5rem)] z-0 ${step4Status !== "disabled" ? "h-[2px] bg-[#0076D2]" : "h-px bg-[#E2E4E6]"}`} />
              <div className={`relative z-10 w-7 h-7 shrink-0 font-bold rounded-full flex items-center justify-center text-sm ${step3.circle}`}>3</div>
              <span className={`text-center text-sm leading-tight mt-2 ${step3.text}`}>
                Grading Answer by AI
              </span>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col items-center w-[134px]">
              <div className={`relative z-10 w-7 h-7 shrink-0 font-bold rounded-full flex items-center justify-center text-sm ${step4.circle}`}>4</div>
              <span className={`text-center text-sm leading-tight mt-2 ${step4.text}`}>
                Result
              </span>
            </div>
          </div>

          {/* Area 1 Alert */}
          {activeStep === 1 && !isSttError && (
            <div className="flex flex-col gap-1.5 p-5 bg-[#F1F9FA] rounded-lg border-l-4 border-[#0076D2]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5" fill="#0076D2" color="#F1F9FA" size={48} />
                  <span className="text-[#43474F] font-bold text-base">Interview transcriptions are being processed</span>
                </div>
                <Badge className="bg-[#0076D2] w-fit h-fit text-[#FAFAFA] text-xs font-semibold">
                  <CircleCheck fill="#FAFAFA" color="#0076D2" data-icon="inline-start" size={48} />
                  {sttCompletedCount}/{totalAnswers} completed
                </Badge>
              </div>
              <p className="text-[#707784] text-sm ml-7">The speech from the interview is being converted to text and queued for insertion into the answer table.</p>
            </div>
          )}

          {activeStep === 2 && (
            <div className="flex flex-col gap-1.5 p-5 bg-[#F1F9FA] rounded-lg border-l-4 border-[#0076D2]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5" fill="#0076D2" color="#F1F9FA" size={48} />
                  <span className="text-[#43474F] font-bold text-base">Candidate is validating the interview data</span>
                </div>
                <Badge className="bg-[#0076D2] w-fit h-fit text-[#FAFAFA] text-xs font-semibold">
                  <CircleCheck fill="#FAFAFA" color="#0076D2" data-icon="inline-start" size={48} />
                  {validatedCount}/{totalAnswers} Validated
                </Badge>
              </div>
              <p className="text-[#707784] text-sm ml-7">The candidate is reviewing their answers. Please wait to see the validated data.</p>
            </div>
          )}

          {activeStep === 3 && !isGradingError && (
            <div className="flex flex-col gap-1.5 p-5 bg-[#F1F9FA] rounded-lg border-l-4 border-[#0076D2]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5" fill="#0076D2" color="#F1F9FA" size={48} />
                  <span className="text-[#43474F] font-bold text-base">AI is Analyzing Candidate Responses</span>
                </div>
              </div>
              <p className="text-[#707784] text-sm ml-7">The AI is comprehensively assessing the candidate's answers.</p>
            </div>
          )}

          {activeStep === 3 && isGradingError && (
            <div className="flex flex-col gap-1.5 p-5 bg-[#FFEEEA] rounded-lg border-l-4 border-[#FF5630]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TriangleAlert className="w-5 h-5" fill="#FF5630" color="#FFEEEA" size={48} />
                  <span className="text-[#43474F] font-bold text-base">Oops! An error occurred</span>
                </div>
              </div>
              <p className="text-[#707784] text-sm ml-7">We encountered an error while grading. The system is analyzing the issue. Data will be available once grading is complete.</p>
            </div>
          )}

          {activeStep >= 4 && candidateResult?.summaryReason && (
            <div className="flex flex-col gap-1.5 p-5 bg-[#F1F9FA] rounded-lg border-l-4 border-[#0076D2]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5" fill="#0076D2" color="#F1F9FA" size={48} />
                  <span className="text-[#43474F] font-bold text-base">AI Analysis Result</span>
                </div>
              </div>
              <p className="text-[#707784] text-sm ml-7 whitespace-pre-wrap">{candidateResult.summaryReason}</p>
            </div>
          )}
        </div>

        {/* Score Breakdown Section */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-6">
            <h2 className="text-[#A9ADB5] text-sm font-medium whitespace-nowrap">Candidate's Score Breakdown</h2>
            <div className="h-px bg-[#E2E4E6] w-full" />
          </div>

          <div className="flex items-center mb-2">
            <span className="text-[#43474F] font-semibold text-base w-48">Final Score</span>
            <span className="text-[#8C929D] font-semibold text-base">
              {candidateResult.totalScore ? `${Number(candidateResult.totalScore).toFixed(1)}%` : "No data yet"}
            </span>
            {candidateResult.recommendation && (() => {
                const rec = candidateResult.recommendation;
                const mappedKey = mapRecommendationToStatusKey(rec);
                const colorCfg = mappedKey && activeColorMap[mappedKey]
                    ? activeColorMap[mappedKey]
                    : { color: "#595F6A", bgColor: "#F2F2F2" };
                return (
                    <div className="ml-4 flex items-center">
                        <Badge
                            variant="outline"
                            style={{ borderColor: colorCfg.color, color: colorCfg.color, backgroundColor: colorCfg.bgColor }}
                            className="py-1 px-2 text-sm font-medium whitespace-nowrap"
                        >
                            {mappedKey || rec}
                        </Badge>
                    </div>
                );
            })()}
          </div>

          <div className="flex flex-col gap-4 pl-6 border-l-4 border-[#E2E4E6] py-2">
            <div className="flex items-center">
              <div className="w-48 text-base">
                <span className="text-[#43474F] font-medium">Technical Skill </span>
                <span className="text-[#A9ADB5]">(50%)</span>
              </div>
              <span className="text-[#8C929D] font-medium text-base">
                {avgTechnical ? `${avgTechnical.toFixed(1)}%` : "No data yet"}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-48 text-base">
                <span className="text-[#43474F] font-medium">Problem Solving </span>
                <span className="text-[#A9ADB5]">(30%)</span>
              </div>
              <span className="text-[#8C929D] font-medium text-base">
                {avgProblemSolving ? `${avgProblemSolving.toFixed(1)}%` : "No data yet"}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-48 text-base">
                <span className="text-[#43474F] font-medium">Communication </span>
                <span className="text-[#A9ADB5]">(20%)</span>
              </div>
              <span className="text-[#8C929D] font-medium text-base">
                {avgCommunication ? `${avgCommunication.toFixed(1)}%` : "No data yet"}
              </span>
            </div>
          </div>
        </div>

        {/* Candidate's Answers Section */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-6">
            <h2 className="text-[#A9ADB5] text-sm font-medium whitespace-nowrap">Candidate's Answer(s)</h2>
            <div className="h-px bg-[#E2E4E6] w-full" />
          </div>

          {activeStep === 1 && isSttError && (
            <div className="flex flex-col gap-1.5 p-5 bg-[#FFEEEA] rounded-lg border-l-4 border-[#FF5630]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TriangleAlert className="w-5 h-5" fill="#FF5630" color="#FFEEEA" size={48} />
                  <span className="text-[#43474F] font-bold text-base">
                    Oops! An error occurred
                  </span>
                </div>

                <Badge className="bg-[#FF5630] w-fit h-fit text-[#FFEEEA] text-xs font-semibold">
                  <TriangleAlert fill="#FAFAFA" color="#FF5630" data-icon="inline-start" size={14} />
                  Issue with questions: {sttErrorQuestions.join(", ")}
                </Badge>
              </div>
              <p className="text-[#707784] text-sm ml-7">
                An error occurred during transcription. Click ‘retry’ to resolve the issue and finalize the process.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-8 py-4">
            {sortedAnswers.map((a, index) => (
              <React.Fragment key={a.questionId || index}>
                <div className="flex flex-col lg:flex-row gap-6 px-3">

                  {/* Video Player or Placeholder */}
                  {a.videoUrl ? (
                    <video
                      src={a.videoUrl}
                      controls
                      className="w-full lg:w-[501px] h-[320px] rounded-lg object-cover shrink-0 bg-black shadow-sm"
                      poster="https://placehold.co/501x320?text=Interview+Recording"
                    />
                  ) : (
                    <div
                      className="w-full lg:w-[501px] h-[320px] rounded-lg relative overflow-hidden flex flex-col justify-end p-6 shrink-0 bg-gray-200"
                      style={{ backgroundImage: 'url(https://placehold.co/501x320?text=No+Video+Available)', backgroundSize: 'cover' }}
                    >
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                      <div className="relative z-10 flex items-center justify-center h-full text-white font-medium">
                        No Video Recording Available
                      </div>
                    </div>
                  )}

                  {/* Question & Answer Details */}
                  <div className="flex flex-col gap-6 flex-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-3">

                        <div className="flex items-center gap-3">
                          <h3 className="text-[#43474F] font-bold text-base">Question {a.questionNumber || index + 1}</h3>

                          {(() => {
                            const monStatus = (() => {
                              if (a.isValidated) return { type: "success", label: "Validated" };
                              if (!a.monitorings || a.monitorings.length === 0) return { type: "muted", label: "Pending" };
                              const err = a.monitorings.find((m: any) => m.status === "ERROR" || m.messageError);
                              if (err) return { type: "danger", label: err.messageError || "Error" };
                              const allSuccess = a.monitorings.every((m: any) => m.status === "SUCCESS");
                              if (allSuccess) return { type: "success", label: "Success" };
                              return { type: "muted", label: "Pending" };
                            })();
                            const badgeCfg = statusColorMap[monStatus.type] || statusColorMap["muted"];
                            const BadgeIcon = badgeCfg.icon;

                            return (
                              <Badge
                                style={{
                                  color: badgeCfg.color,
                                  backgroundColor: badgeCfg.bgColor,
                                  borderColor: badgeCfg.outline
                                }}
                                className="border px-1.5 py-1 h-fit w-fit gap-1.5 flex items-center"
                              >
                                <CircleIcon size={48} fill={badgeCfg.color} color={badgeCfg.color}>
                                  <BadgeIcon
                                    color={badgeCfg.bgColor}
                                    size={12}
                                    x={6}
                                    y={6}
                                    absoluteStrokeWidth
                                  />
                                </CircleIcon>
                                <span className="text-xs font-medium whitespace-nowrap">
                                  {monStatus.label}
                                </span>
                              </Badge>
                            );
                          })()}
                        </div>

                        <div className="flex items-center gap-3">
                          {!a.isValidated && (
                            <Button
                              variant="ghost"
                              className="text-muted-foreground"
                              size="icon"
                              disabled={a.isValidated}
                              onClick={() => {
                                if (editingQuestionId === a.questionId) {
                                  setEditingQuestionId(null);
                                } else {
                                  setEditingQuestionId(a.questionId);
                                  setDraftTranscript(a.answerTranscript || "");
                                }
                              }}
                            >
                              <PencilIcon />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            className="text-muted-foreground"
                            size="icon"
                            disabled={!a.fileName || downloadingQuestionId === a.questionId}
                            onClick={() => handleDownloadVideo(a.fileName, a.questionId)}
                          >
                            {downloadingQuestionId === a.questionId ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <DownloadIcon />
                            )}
                          </Button>

                          {!a.isValidated && (
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`validate-status-${a.questionId}`}
                                checked={a.isValidated}
                                disabled={a.isValidated || validatingQuestionId === a.questionId}
                                onCheckedChange={(checked) => {
                                  if (checked && !a.isValidated) {
                                    handleValidateAnswer(a.questionId, a.participantId);
                                  }
                                }}
                              />
                              <Label htmlFor={`validate-status-${a.questionId}`} className="text-muted-foreground">
                                {validatingQuestionId === a.questionId ? "Validating..." : a.isValidated ? "Validated" : "Not Validated"}
                              </Label>
                            </div>
                          )}

                          {a.monitorings?.some((m: any) => m.status === "ERROR" && m.taskName?.toLowerCase().includes("stt")) && (
                            <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50" disabled={retryingQuestionId === a.questionId} onClick={() => handleRetryStt(a.participantId, a.questionId)}>
                              {retryingQuestionId === a.questionId ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                              Retry
                            </Button>
                          )}
                        </div>
                      </div>

                      <p className="text-[#8C929D] font-medium text-sm">
                        {a.questionText}
                      </p>

                      {editingQuestionId === a.questionId ? (
                        <div className="flex flex-col gap-2 mt-1">
                          <Textarea
                            value={draftTranscript}
                            onChange={(e) => setDraftTranscript(e.target.value)}
                            disabled={isUpdatingTranscript}
                            className="min-h-[100px]"
                            placeholder="Enter the transcript manually..."
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isUpdatingTranscript}
                              onClick={() => setEditingQuestionId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#0076D2] text-white hover:bg-[#005ba3]"
                              disabled={isUpdatingTranscript}
                              onClick={() => handleSaveTranscript(a.questionId, a.participantId)}
                            >
                              {isUpdatingTranscript ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : a.answerTranscript ? (
                        <div className="bg-[#F1F9FA] border-l-2 border-l-[#0076D2] p-3 flex items-start gap-3 mt-1">
                          <CornerDownRightIcon className="w-4 h-4 text-[#0076D2] shrink-0 mt-0.5" />
                          <p className="text-[#43474F] text-sm leading-relaxed whitespace-pre-wrap">
                            {a.answerTranscript}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[#A9ADB5] text-xs italic mt-1">No transcript recorded</p>
                      )}
                    </div>

                    {/* Individual Question AI Scoring */}
                    <div className="flex flex-col gap-3">
                      <h4 className="text-[#8C929D] font-semibold text-sm">AI Score Breakdown</h4>

                      <div className="flex flex-row gap-2 flex-wrap">
                        {[
                          a.technicalFundamentalScore,
                          a.problemSolvingScore,
                          a.communicationScore
                        ].every((score) => score === null || score === undefined) ? (
                          <p className="text-sm text-[#8C929D]">
                            The score will be available after AI grading is complete.
                          </p>
                        ) : (
                          [
                            { label: "Technical Skill", score: a.technicalFundamentalScore },
                            { label: "Problem Solving", score: a.problemSolvingScore },
                            { label: "Communication", score: a.communicationScore }
                          ].map((item, idx) =>
                            item.score !== null && item.score !== undefined ? (
                              <Badge
                                key={idx}
                                variant={"outline"}
                                className="w-fit h-fit bg-[#F5F5F5] border border-[#E2E4E6] text-[#595F6A] text-sm"
                              >
                                {item.label}: {item.score}%
                              </Badge>
                            ) : null
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider between items except the last one */}
                {index < sortedAnswers.length - 1 && (
                  <div className="h-px bg-[#E2E4E6] w-full" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}