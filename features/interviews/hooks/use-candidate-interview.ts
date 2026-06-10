"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckIcon, XIcon, ClockIcon } from "lucide-react";
import { interviewService } from "@/features/interviews/services/interview-service";
import { CandidateResult, InterviewDetail } from "@/features/interviews/types/interview";
import { hiringColorMap, internalAssessmentColorMap } from "@/features/interviews/utils/recommendation";

const statusColorMap: Record<string, { color: string; bgColor: string; outline: string; icon: React.ElementType }> = {
  "success": { color: "#4BAC87", bgColor: "#EEF8F4", outline: "#C9EBDE", icon: CheckIcon },
  "danger": { color: "#E84E2C", bgColor: "#FFEEEA", outline: "#FFCBBF", icon: XIcon },
  "muted": { color: "#595F6A", bgColor: "#FAFAFA", outline: "#E2E4E6", icon: ClockIcon }
};

export function useCandidateInterview() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params?.interviewId as string;
  const candidateId = params?.candidateId as string;

  const [candidateResult, setCandidateResult] = useState<CandidateResult | null>(null);
  const [interviewDetail, setInterviewDetail] = useState<InterviewDetail | null>(null);
  const [stepProgress, setStepProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monitoringData, setMonitoringData] = useState<any[]>([]);

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [draftTranscript, setDraftTranscript] = useState<string>("");
  const [isUpdatingTranscript, setIsUpdatingTranscript] = useState(false);
  const [validatingQuestionId, setValidatingQuestionId] = useState<string | null>(null);
  const [isRetryingBulk, setIsRetryingBulk] = useState(false);
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

      let participantId: string | undefined = resultData.answers?.[0]?.participantId;
      if (!participantId) {
        try {
          const candidatesList = await interviewService.getCandidates(interviewId);
          const currentCandidateObj = candidatesList.find(c => c.candidateId === candidateId);
          participantId = currentCandidateObj?.participantId;
        } catch (cErr) {
          console.error("Failed to fetch candidate list for participantId", cErr);
        }
      }
      if (participantId) {
        const monitoring = await interviewService.getMonitoring(participantId);
        setMonitoringData(monitoring);
      }
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

  const handleRetrySttBulk = async (participantId: string) => {
    setIsRetryingBulk(true);
    try {
      await interviewService.retrySttBulk(participantId);
      toast.success("Bulk reprocess requested. The pipeline will restart shortly.");
      await silentReload();
    } catch (error: any) {
      toast.error(error.message || "Failed to bulk retry process");
    } finally {
      setIsRetryingBulk(false);
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
        setEditingQuestionId(null);
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

        let participantId: string | undefined = resultData.answers?.[0]?.participantId;
        if (!participantId) {
          try {
            const candidatesList = await interviewService.getCandidates(interviewId);
            const currentCandidateObj = candidatesList.find(c => c.candidateId === candidateId);
            participantId = currentCandidateObj?.participantId;
          } catch (cErr) {
            console.error("Failed to fetch candidate list for participantId", cErr);
          }
        }
        if (participantId) {
          const monitoring = await interviewService.getMonitoring(participantId);
          setMonitoringData(monitoring);
        }
      } catch (err: any) {
        console.error("Error loading candidate results:", err);
        setError(err.message || "Failed to load candidate results.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [interviewId, candidateId]);

  // Derived stats
  const isInternal = interviewDetail?.purpose === "INTERNAL_ASSESSMENT" || interviewDetail?.purpose === "INTERNAL_ASSESMENT";
  const activeColorMap = isInternal ? internalAssessmentColorMap : hiringColorMap;

  const sortedAnswers = candidateResult
    ? [...candidateResult.answers]
        .map(a => {
          const answerMonitorings = (monitoringData || []).filter((m: any) => m.questionId === a.questionId);
          return {
            ...a,
            monitorings: answerMonitorings.length > 0 ? answerMonitorings : a.monitorings
          };
        })
        .sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0))
    : [];

  const totalAnswers = sortedAnswers.length;
  const validatedCount = sortedAnswers.filter((a) => a.isValidated).length;

  const avgTechnical = totalAnswers
    ? sortedAnswers.reduce((acc, a) => acc + (a.technicalFundamentalScore || 0), 0) / totalAnswers
    : 0;

  const avgProblemSolving = totalAnswers
    ? sortedAnswers.reduce((acc, a) => acc + (a.problemSolvingScore || 0), 0) / totalAnswers
    : 0;

  const avgCommunication = totalAnswers
    ? sortedAnswers.reduce((acc, a) => acc + (a.communicationScore || 0), 0) / totalAnswers
    : 0;

  const step1Status = stepProgress?.transcribeAndIntegrationAnswer ? "completed" : "active";
  const step2Status = stepProgress?.validateAnswer ? "completed" : (step1Status === "completed" ? "active" : "disabled");
  const step3Status = stepProgress?.gradingAnswer ? "completed" : (step2Status === "completed" ? "active" : "disabled");
  const step4Status = stepProgress?.resultMappingAnswer ? "completed" : (step3Status === "completed" ? "active" : "disabled");

  let activeStep = 1;
  if (stepProgress?.resultMappingAnswer) activeStep = 5;
  else if (step4Status === "active") activeStep = 4;
  else if (step3Status === "active") activeStep = 3;
  else if (step2Status === "active") activeStep = 2;

  const sttCompletedCount = sortedAnswers.filter(a => a.monitorings?.every((m: any) => m.status === "SUCCESS")).length;
  const sttErrorQuestions = sortedAnswers.filter(a => a.monitorings?.some((m: any) => m.status === "ERROR" || m.status === "FAILED")).map(a => a.questionNumber || 0);
  const isSttError = sttErrorQuestions.length > 0;

  const isGradingError = 
    sortedAnswers.some(a => a.monitorings?.some((m: any) => (m.status === "ERROR" || m.status === "FAILED") && m.taskName?.toLowerCase().includes("grading"))) ||
    (monitoringData || []).some((m: any) => (m.status === "ERROR" || m.status === "FAILED") && m.taskName?.toLowerCase().includes("grading"));

  const failedMonitoringItems = (monitoringData || []).filter(
    (m: any) => m.status === "FAILED" || m.status === "ERROR" || m.messageError
  );

  return {
    interviewId,
    candidateId,
    candidateResult,
    interviewDetail,
    stepProgress,
    isLoading,
    error,
    activeStep,
    failedMonitoringItems,
    sortedAnswers,
    isSttError,
    sttCompletedCount,
    totalAnswers,
    validatedCount,
    isGradingError,
    activeColorMap,
    avgTechnical,
    avgProblemSolving,
    avgCommunication,
    sttErrorQuestions,
    editingQuestionId,
    setEditingQuestionId,
    draftTranscript,
    setDraftTranscript,
    isUpdatingTranscript,
    handleSaveTranscript,
    downloadingQuestionId,
    handleDownloadVideo,
    validatingQuestionId,
    handleValidateAnswer,
    retryingQuestionId,
    handleRetryStt,
    isRetryingBulk,
    handleRetrySttBulk,
    router,
    statusColorMap
  };
}
