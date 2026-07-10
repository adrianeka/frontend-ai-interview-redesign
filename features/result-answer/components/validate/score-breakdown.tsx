"use client";

import { getRecommendationStyle } from "../../utils/helper";
import { ScoreBar } from "./score-bar";

interface ScoreBreakdownProps {
  totalScore: number;
  recommendation?: string;
  technicalScore: number | null | undefined;
  problemSolvingScore: number | null | undefined;
  communicationScore: number | null | undefined;
}

/*
edit start
by: Zahra Hilyatul J
date: 2026-06-29
description: Handled nullable scores in ScoreBreakdownProps and updated weight percentages
*/
export function ScoreBreakdown({
  totalScore,
  recommendation,
  technicalScore,
  problemSolvingScore,
  communicationScore,
}: ScoreBreakdownProps) {
  const recommendationStyle = getRecommendationStyle(recommendation);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[12px] text-slate-400 shrink-0">
          Candidate&apos;s Score Breakdown
        </span>
        <div className="h-px flex-1 bg-[#E2E4E6]" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-slate-500 font-medium">Final Score</span>{" "}
        <span className="text-sm text-slate-500 font-bold">
          {Number(totalScore).toFixed(1).replace(/\.0$/, "")}%
        </span>
        {recommendation && (
          <span
            style={{
              color: recommendationStyle.color,
              backgroundColor: recommendationStyle.bg,
              border: `1px solid ${recommendationStyle.border}`,
              fontSize: 11,
              fontWeight: 500,
              padding: "2px 12px",
              borderRadius: 9999,
              display: "inline-block",
            }}
          >
            {recommendation}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <ScoreBar
          label="Technical Skill"
          weight={50}
          value={technicalScore}
        />
        <ScoreBar
          label="Problem Solving"
          weight={30}
          value={problemSolvingScore}
        />
        <ScoreBar
          label="Communication"
          weight={20}
          value={communicationScore}
        />
      </div>
    </div>
  );
}
/*
edit end
*/
