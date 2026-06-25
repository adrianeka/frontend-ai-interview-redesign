"use client";

import { Loader2 } from "lucide-react";
import { useExamSession } from "../../hooks/use-exam-interview";
import { ExamCompleted } from "./exam-completed";
import { ExamQuestionCard } from "./exam-question-card";
import { ExamSidebar } from "./exam-sidebar";

export function ExamSessionView() {
  const {
    interviewDetail,
    isLoading,
    activeQuestionId,
    phase,
    isSubmitting,
    breakTime,
    answerTime,
    handleStart,
    submitAnswer,
    videoRef,
    cancelSubmit,
    answeredIds,
    audioLevel,
  } = useExamSession();

  const activeQuestion = interviewDetail?.questions?.find(
    (q) => q.id === activeQuestionId,
  );
  const activeIndex =
    interviewDetail?.questions?.findIndex((q) => q.id === activeQuestionId) ??
    0;

  if (isLoading) {
    return (
      <div className="min-h-[75vh] bg-[#F5F6F8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const allAnswered =
    (interviewDetail?.questions?.length ?? 0) > 0 &&
    interviewDetail?.questions?.every((q) => answeredIds.has(q.id));

  if (allAnswered) return <ExamCompleted />;

  return (
    <div className="min-h-[75vh] bg-[#F5F6F8] flex items-center justify-center p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-[90vw] lg:w-[80vw] xl:w-[70vw] items-stretch">
        <ExamQuestionCard
          phase={phase}
          breakTime={breakTime}
          answerTime={answerTime}
          activeIndex={activeIndex}
          questionText={activeQuestion?.questionText}
          isSubmitting={isSubmitting}
          handleStart={handleStart}
          submitAnswer={submitAnswer}
          cancelSubmit={cancelSubmit}
        />
        <ExamSidebar
          phase={phase}
          answerTime={answerTime}
          audioLevel={audioLevel}
          videoRef={videoRef}
          interviewDetail={interviewDetail}
          activeQuestionId={activeQuestionId}
          answeredIds={answeredIds}
        />
      </div>
    </div>
  );
}
