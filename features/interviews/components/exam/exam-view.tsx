"use client";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useExamSession } from "../../hooks/use-exam-interview";
import { ExamCompleted } from "./exam-completed";
import { ExamQuestionCard } from "./exam-question-card";
import { ExamSidebar } from "./exam-sidebar";
import { AntiCheatPreparationScreen } from "./anti-cheat-preparation-screen";
import { AntiCheatWarningOverlay } from "./anti-cheat-warning-overlay";

/*
edit start
by: Zahra Hilyatul J
date: 2026-06-29
description: Added localSubmittedIds to correctly evaluate allAnswered status immediately after submitting
*/
export function ExamSessionView() {
  const params = useParams();
  const interviewId = params?.interviewId as string;

  const {
    interviewDetail,
    isLoading,
    activeQuestionId,
    phase,
    isSubmitting,
    uploadError,
    retryUpload,
    breakTime,
    answerTime,
    handleStart,
    submitAnswer,
    videoRef,
    cancelSubmit,
    answeredIds,
    audioLevel,
    candidateId,
    isPreparationPhase,
    isWarningVisible,
    strikeCount,
    isTerminated,
    startExamSequence,
    acknowledgeWarning,
  } = useExamSession();

  const activeQuestion = interviewDetail?.questions?.find(
    (q) => q.id === activeQuestionId,
  );
  const activeIndex =
    interviewDetail?.questions?.findIndex((q) => q.id === activeQuestionId) ??
    0;

  /*
  edit start
  by: Zahra Hilyatul J
  date: 2026-07-20
  description: Add holistic anti-cheat keydown listeners to prevent opening Developer Tools and view source
  */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      // Prevent Ctrl+Shift+I/J/C
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key.toLowerCase() === "i" ||
          e.key.toLowerCase() === "j" ||
          e.key.toLowerCase() === "c")
      ) {
        e.preventDefault();
      }
      // Prevent Ctrl+U
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, []);
  /*
  edit end
  */

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

  if (allAnswered) {
    return (
      <ExamCompleted interviewId={interviewId} candidateId={candidateId} />
    );
  }

  /*
  edit start
  by: Zahra Hilyatul J
  date: 2026-07-20
  description: Apply context menu, copy/paste, and text selection prevention on the entire exam screen
  */
  return (
    <div 
      className="select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
    >
      {isPreparationPhase && (
        <AntiCheatPreparationScreen 
          onStart={startExamSequence} 
          onCancel={() => window.location.href = "/interviews"} 
        />
      )}
      
      {isWarningVisible && (
        <AntiCheatWarningOverlay
          onAcknowledge={acknowledgeWarning}
          strikeCount={strikeCount}
          isTerminated={isTerminated}
        />
      )}

      <div className="min-h-[75vh] bg-[#F5F6F8] flex items-center justify-center p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-[90vw] lg:w-[80vw] xl:w-[70vw] items-stretch">
          <ExamQuestionCard
            phase={phase}
            breakTime={breakTime}
            answerTime={answerTime}
            activeIndex={activeIndex}
            questionText={activeQuestion?.questionText}
            isSubmitting={isSubmitting}
            uploadError={uploadError}
            handleStart={handleStart}
            submitAnswer={submitAnswer}
            retryUpload={retryUpload}
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
    </div>
  );
  /*
  edit end
  */
}
/*
edit end
*/
