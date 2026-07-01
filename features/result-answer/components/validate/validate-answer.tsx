"use client";

import { useState } from "react";
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
    <div className="min-h-[75vh] bg-[#F5F6F8] flex items-center justify-center p-6">
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
