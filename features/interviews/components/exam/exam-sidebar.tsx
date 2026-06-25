"use client";

import { cn } from "@/lib/utils";
import { Disc2, Video, Volume2 } from "lucide-react";
import { RefObject } from "react";
import { InterviewDetail } from "../../types/interview";

type Props = {
  phase: "break" | "answer";
  answerTime: number;
  audioLevel: number;
  videoRef: RefObject<HTMLVideoElement | null>;
  interviewDetail: InterviewDetail | null;
  activeQuestionId: string | null;
  answeredIds: Set<string>;
};

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export function ExamSidebar({
  phase,
  answerTime,
  audioLevel,
  videoRef,
  interviewDetail,
  activeQuestionId,
  answeredIds,
}: Props) {
  return (
    <div className="col-span-1 bg-white rounded-[1rem] p-8 flex flex-col gap-3">
      <div>
        <div className="aspect-[8/5] bg-[#F3F4F6] relative flex items-center justify-center">
          {phase === "answer" ? (
            <video
              ref={videoRef}
              muted
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-[0.5rem] overflow-hidden"
            />
          ) : (
            <Video className="w-8 h-8 text-[#9CA3AF]" />
          )}
        </div>
        <div className="py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Disc2
              className={cn(
                "w-4 h-4",
                phase === "answer" ? "text-[#E24B4A]" : "text-[#ABADB2]",
              )}
            />
            <span
              className={cn(
                "text-[0.75rem]",
                phase === "answer" ? "text-[#43474F]" : "text-[#ABADB2]",
              )}
            >
              {phase === "answer"
                ? `Recording ${formatTime(answerTime)}`
                : "Record"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Volume2
              className={cn(
                "w-4 h-4",
                phase === "answer" ? "text-[#43474F]" : "text-[#ABADB2]",
              )}
            />
            <div className="w-[5rem] h-[0.5rem] bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4ECA5B] rounded-full transition-all duration-75"
                style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="py-2 border-t border-[#F2F2F2] -mx-7"></div>

      <div>
        <p className="text-[0.875rem] font-semibold text-[#1F2937] mb-3">
          Total Question
        </p>
        <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 gap-1 sm:gap-2">
          {interviewDetail?.questions?.map((q, i) => {
            const answered = answeredIds.has(q.id);
            const isActive = q.id === activeQuestionId && !answered;
            return (
              <button
                key={q.id}
                disabled={answered}
                className={cn(
                  "aspect-square rounded-[0.5rem] text-[1rem] font-medium transition-colors",
                  answered
                    ? "bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] cursor-not-allowed"
                    : isActive
                      ? "bg-[#EFF6FF] text-[#0076D2] border-2 border-[#0076D2]"
                      : "bg-[#F9FAFB] text-[#9CA3AF] border border-[#E5E7EB] hover:bg-[#F3F4F6]",
                )}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
