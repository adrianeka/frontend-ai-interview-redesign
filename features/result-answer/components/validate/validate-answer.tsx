"use client";

import { useEffect, useRef, useState } from "react";
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

export function ValidateAnswer({
  interviewId,
  candidateId,
}: ValidateAnswerProps) {
  const {
    data,
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
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup polling interval saat komponen di-unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center text-slate-400 text-sm">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-400 font-medium text-sm">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-slate-400 font-medium text-sm">
        Data not found.
      </div>
    );
  }

  const sortedAnswers = [...data.answers].sort(
    (a, b) => a.questionNumber - b.questionNumber,
  );
  const totalQuestions = sortedAnswers.length;
  const validatedCount = sortedAnswers.filter((a) => a.isValidated).length;
  const allValidated = totalQuestions > 0 && validatedCount === totalQuestions;
  const isCompleted = Boolean(data.recommendation && data.totalScore);

  const avgTechnicalScore = data.avgTechnicalFundamentalScore;
  const avgProblemSolvingScore = data.avgProblemSolvingScore;
  const avgCommunicationScore = data.avgCommunicationScore;

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

    try {
      // Ambil data pertama kali setelah tombol diklik
      const initialResult = await refetch();

      // Jika grading sudah selesai dari awal, tidak perlu polling
      if (initialResult?.recommendation && initialResult?.totalScore) {
        setIsDoneValidating(false);
        return;
      }

      // Setup Polling Loop: cek status setiap 3 detik, max 60 detik
      let attempts = 0;
      const maxAttempts = 20;

      pollingIntervalRef.current = setInterval(async () => {
        attempts++;
        const currentResult = await refetch();

        const isFinished = Boolean(currentResult?.recommendation && currentResult?.totalScore);

        // Cek apakah ada error grading dari data monitoring
        const hasGradingError = currentResult?.answers.some((a: any) =>
          a.monitorings?.some((m: any) =>
            (m.status === "ERROR" || m.status === "FAILED") && m.taskName?.toLowerCase().includes("grading")
          )
        );

        if (isFinished || hasGradingError || attempts >= maxAttempts) {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          setIsDoneValidating(false);

          if (hasGradingError) {
            alert("AI Grading failed. Please check the error message in the monitoring section.");
          } else if (attempts >= maxAttempts && !isFinished) {
            alert("AI Grading is taking longer than expected. Please wait a moment and refresh the page manually.");
          }
        }
      }, 3000);

    } catch (err) {
      setIsDoneValidating(false);
    }
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
            onDoneValidate={handleDoneValidate}
          />
        </div>
      </div>
    </div>
  );
}
