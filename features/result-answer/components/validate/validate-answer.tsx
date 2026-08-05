"use client";

import { useState, useEffect, useRef } from "react";
import {
  AnswerDetailItem,
  useResultAnswerDetail,
} from "../../hooks/use-result-detail";
import { AnalysisSummary } from "./analysis-summary";
import { CandidateSidebar } from "./candidate-sidebar";
import { QuestionCard } from "./question-card";

interface ValidateAnswerProps {
  interviewId: string;
  candidateId: string;
}

/*
edit start
by: Zahra Hilyatul J
date: 2026-06-29
description: Changed async grading completion flow, translated messages to Indonesian, and fetched average scores directly from the API response
*/
export function ValidateAnswer({
  interviewId,
  candidateId,
}: ValidateAnswerProps) {
  const {
    data,
    violations,
    isLoading,
    error,
    interviewInfo,
    validateAnswer,
    updateTranscript,
    refetch,
  } = useResultAnswerDetail(interviewId, candidateId);

  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [isDoneValidating, setIsDoneValidating] = useState(false);
  const [playRequest, setPlayRequest] = useState<{questionId: string, time: number} | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // If result not yet available, poll every 10s until it is
  const resultReady = Boolean(data?.recommendation != null && data?.totalScore != null);
  useEffect(() => {
    if (!resultReady && !isLoading && !error) {
      pollingRef.current = setInterval(() => {
        refetch();
      }, 60_000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [resultReady, isLoading, error, refetch]);

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center text-slate-400 text-sm">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-slate-500 font-medium text-sm">
        Gagal memuat data jawaban kandidat. Silakan coba lagi nanti.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <span className="text-4xl">⏳</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">Hasil Sedang Diproses</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Jawaban Anda sedang dalam proses penilaian oleh HR. Halaman ini akan diperbarui secara otomatis saat hasil sudah tersedia.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping" />
            Memeriksa status setiap 10 detik...
          </div>
        </div>
      </div>
    );
  }

  // Removed blocking pending screen because HR needs to see this page to validate the answers.

  const sortedAnswers = [...data.answers].sort(
    (a, b) => a.questionNumber - b.questionNumber,
  );
  const totalQuestions = sortedAnswers.length;
  const validatedCount = sortedAnswers.filter((a) => a.isValidated).length;
  const allValidated = totalQuestions > 0 && validatedCount === totalQuestions;
  const isCompleted = Boolean(data.recommendation != null && data.totalScore != null);

  const avgTechnicalScore =
    totalQuestions > 0
      ? sortedAnswers.reduce(
          (acc, a) => acc + (a.technicalFundamentalScore ?? 0),
          0,
        ) / totalQuestions
      : 0;
  const avgProblemSolvingScore =
    totalQuestions > 0
      ? sortedAnswers.reduce(
          (acc, a) => acc + (a.problemSolvingScore ?? 0),
          0,
        ) / totalQuestions
      : 0;
  const avgCommunicationScore =
    totalQuestions > 0
      ? sortedAnswers.reduce((acc, a) => acc + (a.communicationScore ?? 0), 0) /
        totalQuestions
      : 0;

  const handleValidate = async (answer: AnswerDetailItem) => {
    setValidatingId(answer.questionId);
    await validateAnswer(answer.participantId, answer.questionId);
    setValidatingId(null);
  };

  const handleSaveTranscript = async (
    answer: AnswerDetailItem,
    text: string,
  ) => {
    setSavingId(answer.questionId);
    await updateTranscript(answer.participantId, answer.questionId, text);
    setSavingId(null);
  };

  const handleDoneValidate = async () => {
    setIsDoneValidating(true);
    await refetch();
    setIsDoneValidating(false);
  };

  return (
    <div className="min-h-[75vh] bg-[#F5F6F8] flex items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-[90vw] lg:w-[80vw] xl:w-[70vw] items-stretch">
        <div className="col-span-1 sm:col-span-2 rounded-[1rem] border border-[#E2E4E6] bg-[#FAFAFA] p-4 sm:p-6">
          <AnalysisSummary
            recommendation={data?.recommendation ?? ""}
            totalScore={data?.totalScore ?? 0}
            summaryReason={data?.summaryReason ?? ""}
            technicalScore={avgTechnicalScore}
            problemSolvingScore={avgProblemSolvingScore}
            communicationScore={avgCommunicationScore}
          />

          <div className="flex items-center gap-3 mb-2">
            <span className="text-[12px] text-slate-400 shrink-0">
              Candidate&apos;s Answer(s)
            </span>
            <div className="h-px flex-1 bg-[#E2E4E6]" />
          </div>

          <div>
            {sortedAnswers.map((answer) => (
              <QuestionCard
                key={answer.questionId}
                answer={answer}
                onValidate={() => handleValidate(answer)}
                onSaveTranscript={(text) => handleSaveTranscript(answer, text)}
                isValidating={validatingId === answer.questionId}
                isSaving={savingId === answer.questionId}
                playRequest={playRequest}
              />
            ))}
          </div>
        </div>

        <div className="col-span-1 max-w-[350px]">
          <CandidateSidebar
            companyName={interviewInfo?.companyNamePartner}
            candidateName={data.name}
            roleTarget={interviewInfo?.roleTarget}
            isCompleted={isCompleted}
            sortedAnswers={sortedAnswers}
            validatedCount={validatedCount}
            totalQuestions={totalQuestions}
            allValidated={allValidated}
            isDoneValidating={isDoneValidating}
            isGradingInProgress={allValidated && !isCompleted}
            onDoneValidate={handleDoneValidate}
            violations={violations}
            isAutoTerminated={data.isAutoTerminated ?? false}
            onPlayViolation={(qId, time) => setPlayRequest({ questionId: qId, time })}
          />
        </div>
      </div>
    </div>
  );
}
/*
edit end
*/
