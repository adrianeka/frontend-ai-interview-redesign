"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";

type Props = {
  phase: "break" | "answer";
  breakTime: number;
  answerTime: number;
  activeIndex: number;
  questionText?: string;
  isSubmitting: boolean;
  /*
  edit start
  by: Zahra
  date: 2026-07-17
  description: Added uploadError and retryUpload props so the card can show
               a retry banner when the video upload fails, instead of silently
               losing the recording.
  */
  uploadError: string | null;
  retryUpload: () => void;
  /*
  edit end
  */
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
  uploadError,
  retryUpload,
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
            <p className="text-[1rem] sm:text-[1.25rem] font-normal text-[#43474F] mb-2 select-none">
              {questionText}
            </p>
          </div>

          {/*
          edit start
          by: Zahra
          date: 2026-07-17
          description: Upload failure banner with retry button. Shown instead of the normal
                       submit button area when an upload error is detected, so candidates
                       can re-send their recording without having to re-record.
          */}
          {uploadError ? (
            <div className="mt-6 rounded-[0.75rem] border border-[#FCA5A5] bg-[#FEF2F2] p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#DC2626] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[0.875rem] font-semibold text-[#991B1B]">
                    Upload Failed — Your Recording is Still Saved
                  </p>
                  <p className="text-[0.8125rem] text-[#B91C1C] mt-0.5">
                    Your answer was recorded but could not be sent due to a
                    connection issue. Please check your internet and tap
                    &quot;Retry Upload&quot; to send it.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
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
                  onClick={retryUpload}
                  disabled={isSubmitting}
                  className="h-[2.375rem] px-5 rounded-[0.625rem] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium text-[0.875rem] min-w-[9rem]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Retry Upload
                    </span>
                  )}
                </Button>
              </div>
            </div>
          ) : (
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
          )}
          {/*
          edit end
          */}
        </>
      )}
    </div>
  );
}
