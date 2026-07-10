"use client";

import { Info } from "lucide-react";
import { getSummaryStyle } from "../../utils/helper";
import { ScoreBreakdown } from "./score-breakdown";

interface AnalysisSummaryProps {
  recommendation?: string;
  totalScore?: number;
  summaryReason?: string;
  technicalScore: number | null | undefined;
  problemSolvingScore: number | null | undefined;
  communicationScore: number | null | undefined;
}

/*
edit start
by: Zahra Hilyatul J
date: 2026-06-29
description: Made score props nullable and updated condition to handle null scores correctly
*/
export function AnalysisSummary({
  recommendation,
  totalScore,
  summaryReason,
  technicalScore,
  problemSolvingScore,
  communicationScore,
}: AnalysisSummaryProps) {
  if (recommendation && totalScore !== undefined && totalScore !== null) {
    const summaryStyle = getSummaryStyle(recommendation);

    return (
      <>
        <ScoreBreakdown
          totalScore={totalScore}
          recommendation={recommendation}
          technicalScore={technicalScore}
          problemSolvingScore={problemSolvingScore}
          communicationScore={communicationScore}
        />

        <div
          className="flex flex-col gap-1.5 p-5 rounded-lg border-l-4 mb-6"
          style={{
            backgroundColor: summaryStyle.bg,
            borderLeftColor: summaryStyle.border,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[#43474F] font-bold text-base">
              AI Analysis Result
            </span>
          </div>
          <p className="text-[#707784] text-sm">{summaryReason}</p>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 p-5 bg-[#F1F9FA] rounded-lg border-l-4 border-[#0076D2] mb-6">
      <div className="flex items-center gap-2">
        <Info className="w-5 h-5" fill="#0076D2" color="#F1F9FA" />
        <span className="text-[#43474F] font-bold text-base">
          Validate Your Answers
        </span>
      </div>
      <p className="text-[#707784] text-sm">
        Review your answers before proceeding. Edit any incorrect information,
        then validate to view your results.
      </p>
    </div>
  );
}
