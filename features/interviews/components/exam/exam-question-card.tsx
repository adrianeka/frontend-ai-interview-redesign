"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  phase: "break" | "answer";
  breakTime: number;
  answerTime: number;
  activeIndex: number;
  questionText?: string;
  isSubmitting: boolean;
  handleStart: () => void;
  submitAnswer: () => void;
  cancelSubmit: () => void;
};

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export function ExamQuestionCard({
  phase,
  breakTime,
  answerTime,
  activeIndex,
  questionText,
  isSubmitting,
  handleStart,
  submitAnswer,
  cancelSubmit,
}: Props) {
  return (
    <div className="col-span-1 sm:col-span-2 bg-white rounded-[1rem] p-8 flex flex-col justify-between shadow-none">
      {phase === "break" ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <p className="text-[0.8125rem] text-[#6B7280]">Prepare yourself...</p>
          <span className="text-[2rem] font-bold text-[#1F2937]">
            {formatTime(breakTime)}
          </span>
          <Button
            onClick={handleStart}
            className="bg-[#0076D2] hover:bg-[#005FA3] text-white rounded-[0.625rem] px-6"
          >
            Start
          </Button>
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-[1.5rem] font-bold text-[#2D2F35] leading-[1.5]">
              Question {activeIndex + 1}
            </h2>
            <p className="text-[1rem] sm:text-[1.25rem] font-normal text-[#43474F] mb-2">
              {questionText}
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 mt-10">
            {isSubmitting && (
              <Button
                variant="outline"
                onClick={cancelSubmit}
                className="h-[2.375rem] px-5 rounded-[0.625rem] border-[#E24B4A] text-[#E24B4A] hover:bg-[#FCEBEB] hover:text-[#E24B4A] font-medium text-[0.875rem]"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={submitAnswer}
              disabled={isSubmitting}
              className="h-[2.375rem] px-5 rounded-[0.625rem] bg-[#0076D2] hover:bg-[#005FA3] text-white font-medium text-[0.875rem] min-w-[8.75rem]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Done Answering"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
