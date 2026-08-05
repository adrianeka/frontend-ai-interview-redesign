"use client";

import { interviewService } from "@/features/interviews/services/interview-service";
import { useCallback, useEffect, useRef, useState } from "react";
import { resultAnswerService } from "../service/result-answer-service";

export interface AnswerMonitoring {
  taskName: string;
  status: string;
  messageError: string | null;
}

export interface ViolationItem {
  id: string;
  participantId: string;
  questionId: string | null;
  questionText: string | null;
  violationType: string;
  timestamp: string;
  details: string | null;
  kpiMapping: string | null;
}

export interface AnswerDetailItem {
  questionId: string;
  participantId: string;
  questionText: string;
  questionNumber: number;
  answerTranscript: string;
  videoUrl: string;
  fileName: string;
  technicalFundamentalScore: number | null;
  problemSolvingScore: number | null;
  communicationScore: number | null;
  breakTime: string;
  answerTime: string;
  isValidated: boolean;
  status: string;
  monitorings: AnswerMonitoring[];
}

export interface ResultAnswerDetail {
  interviewId: string;
  name: string;
  totalScore: number | null;
  recommendation: string | null;
  summaryReason: string | null;
  // edit start — added isAutoTerminated from backend for HR dashboard disqualified badge (2026-07-22)
  isAutoTerminated: boolean | null;
  // edit end
  answers: AnswerDetailItem[];
}

export interface InterviewInfo {
  companyNamePartner: string;
  roleTarget: string;
}

/*
edit start
by: Zahra Hilyatul J
date: 2026-06-29
description: Added average scores to ResultAnswerDetail interface and modified fetch logic to return data directly
*/
export function useResultAnswerDetail(
  interviewId: string,
  candidateId: string,
) {
  const [data, setData] = useState<ResultAnswerDetail | null>(null);
  const [violations, setViolations] = useState<ViolationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [interviewInfo, setInterviewInfo] = useState<InterviewInfo | null>(
    null,
  );
  const [isLoadingInterview, setIsLoadingInterview] = useState(false);

  const [isUpdatingTranscript, setIsUpdatingTranscript] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isRetrySttBulk, setIsRetrySttBulk] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!interviewId) return;
    setIsLoadingInterview(true);
    interviewService
      .getInterviewById(interviewId)
      .then((res) => {
        setInterviewInfo({
          companyNamePartner: res?.companyNamePartner ?? "",
          roleTarget: res?.roleTarget ?? "",
        });
      })
      .catch(() => {})
      .finally(() => setIsLoadingInterview(false));
  }, [interviewId]);

  const fetchDetail = useCallback(async () => {
    if (!interviewId || !candidateId) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const result = await resultAnswerService.getAnsweredDetail(interviewId, candidateId);
      
      let violationsData = [];
      if (result?.answers?.length > 0) {
        const participantId = result.answers[0].participantId;
        violationsData = await resultAnswerService.getViolations(participantId).catch(() => []);
      }

      setData(result);
      setViolations(violationsData || []);
    } catch (err: any) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
      setError(err.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [interviewId, candidateId]);

  const updateTranscript = useCallback(
    async (
      participantId: string,
      questionId: string,
      answerTranscript: string,
    ) => {
      setIsUpdatingTranscript(true);
      try {
        await interviewService.updateAnswerTranscript(
          participantId,
          questionId,
          answerTranscript,
        );
        await fetchDetail();
      } catch (err: any) {
        setError(err.message ?? "Failed to update transcript");
      } finally {
        setIsUpdatingTranscript(false);
      }
    },
    [fetchDetail],
  );

  const validateAnswer = useCallback(
    async (participantId: string, questionId: string) => {
      setIsValidating(true);
      try {
        await interviewService.validateAnswer(participantId, questionId);
        await fetchDetail();
      } catch (err: any) {
        setError(err.message ?? "Failed to validate answer");
      } finally {
        setIsValidating(false);
      }
    },
    [fetchDetail],
  );

  const retrySttBulk = useCallback(
    async (participantId: string) => {
      setIsRetrySttBulk(true);
      try {
        await interviewService.retrySttBulk(participantId);
        await fetchDetail();
      } catch (err: any) {
        setError(err.message ?? "Failed to bulk retry STT");
      } finally {
        setIsRetrySttBulk(false);
      }
    },
    [fetchDetail],
  );

  useEffect(() => {
    fetchDetail();
    return () => abortRef.current?.abort();
  }, [fetchDetail]);

  return {
    data,
    violations,
    isLoading,
    error,
    refetch: fetchDetail,
    interviewInfo,
    isLoadingInterview,
    updateTranscript,
    isUpdatingTranscript,
    validateAnswer,
    isValidating,
    retrySttBulk,
    isRetrySttBulk,
  };
}
/*
edit end
*/
