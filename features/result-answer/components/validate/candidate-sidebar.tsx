"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin } from "lucide-react";
import { AnswerDetailItem } from "../../hooks/use-result-detail";

interface CandidateSidebarProps {
  companyName?: string;
  candidateName: string;
  roleTarget?: string;
  isCompleted: boolean;
  sortedAnswers: AnswerDetailItem[];
  validatedCount: number;
  totalQuestions: number;
  allValidated: boolean;
  isDoneValidating: boolean;
  onDoneValidate: () => void;
}

export function CandidateSidebar({
  companyName,
  candidateName,
  roleTarget,
  isCompleted,
  sortedAnswers,
  validatedCount,
  totalQuestions,
  allValidated,
  isDoneValidating,
  onDoneValidate,
}: CandidateSidebarProps) {
  return (
    <div className="sticky top-4 rounded-[1rem] border border-[#E2E4E6] bg-white p-5">
      <div className="rounded-[100px] border border-[#E2E4E6] bg-[#f5f5f5] inline-flex items-center gap-1.5 bg-[#F4F4F5] text-slate-500 text-xs font-medium py-1 rounded-full mb-4 px-3">
        <MapPin className="w-3 h-3" />
        {companyName ?? "—"}
      </div>

      <div className="flex gap-3 mb-1">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0076D2] font-bold text-lg flex items-center justify-center uppercase shrink-0">
          {candidateName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <p className="text-base font-semibold text-slate-800">
            {candidateName}
          </p>
          <p className="text-xs text-slate-400 mb-0.5">Interview Role :</p>
          <p className="text-sm text-slate-600 mb-5">{roleTarget ?? "—"}</p>
        </div>
      </div>

      {!isCompleted && (
        <>
          <div className="flex items-center gap-6 mb-3">
            <span className="text-base font-semibold text-slate-800">
              Validate Your Answer
            </span>{" "}
            <Badge
              style={{ color: "#FAFAFA", background: "#23BD33" }}
              className="gap-1 font-medium px-2 py-0.5 rounded-full text-[11px]"
            >
              <CheckCircle2 className="w-3 h-3" />
              {validatedCount}/{totalQuestions}
            </Badge>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 gap-1 sm:gap-2 mb-5">
            {sortedAnswers.map((answer) => (
              <div
                key={answer.questionId}
                style={
                  answer.isValidated
                    ? {
                        backgroundColor: "#E4F7E7",
                        color: "#23BD33",
                        border: "none",
                      }
                    : { color: "#A9ADB5", border: "1px solid #A9ADB5" }
                }
                className="aspect-square rounded-[0.5rem] text-[1rem] font-medium transition-colors flex items-center justify-center"
              >
                {answer.questionNumber}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="py-2 border-t border-[#F2F2F2] -mx-7"></div>

      {isCompleted ? (
        <p className="text-base font-semibold text-[#A9ADB5] text-center">
          Completed
        </p>
      ) : (
        <Button
          disabled={!allValidated || isDoneValidating}
          onClick={onDoneValidate}
          className="w-full bg-[#0076D2] hover:bg-[#005FA3] text-white rounded-[0.625rem] px-6 disabled:bg-slate-200 disabled:text-slate-400"
        >
          {isDoneValidating ? "Waiting Result..." : "Done Validate"}
        </Button>
      )}
    </div>
  );
}
