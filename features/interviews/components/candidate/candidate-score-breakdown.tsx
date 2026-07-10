"use client";

import { Badge } from "@/components/ui/badge";
import { mapRecommendationToStatusKey } from "@/features/interviews/utils/recommendation";

interface ColorConfig {
  color: string;
  bgColor: string;
}

/**
 * Props for the CandidateScoreBreakdown component.
 */
interface CandidateScoreBreakdownProps {
  /** The calculated final score of the candidate */
  totalScore: number | string | null | undefined;
  /** The final string recommendation from AI */
  recommendation: string | null | undefined;
  /** Map of color configurations for the badges */
  activeColorMap: Record<string, ColorConfig>;
  /** The average score for technical skill (weighted 50%) */
  avgTechnical: number | null | undefined;
  /** The average score for problem solving (weighted 30%) */
  avgProblemSolving: number | null | undefined;
  /** The average score for communication (weighted 20%) */
  avgCommunication: number | null | undefined;
}

/**
 * Renders the score breakdown for an individual candidate.
 * Includes the final total score, the recommendation badge, and
 * the individual sub-scores (Technical, Problem Solving, Communication).
 */
/*
edit start
by: Zahra Hilyatul J
date: 2026-06-29
description: Extracted renderSkillRow helper function, fixed formatting and derived type handling for scores
*/
export function CandidateScoreBreakdown({
  totalScore,
  recommendation,
  activeColorMap,
  avgTechnical,
  avgProblemSolving,
  avgCommunication
}: CandidateScoreBreakdownProps) {
  // Utility to format score value
  const formatScore = (score: number | string | null | undefined) => {
    if (score === null || score === undefined || score === "") return "No data yet";
    return `${Number(score).toFixed(1).replace(/\.0$/, "")}%`;
  };

  const renderSkillRow = (label: string, weight: number, value: number | null | undefined) => {
    const hasValue = value !== null && value !== undefined;
    return (
      <div className="flex items-center gap-4 w-full">
        <div className="w-48 text-base shrink-0 flex items-center">
          <span className="text-[#43474F] font-semibold">{label}</span>
          <span className="text-[#A9ADB5] ml-1">({weight}%)</span>
        </div>
        
        {hasValue ? (
          <>
            <div className="flex-1 h-2 bg-[#E2E4E6] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#5BC8D9] rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, Number(value)))}%` }}
              />
            </div>
            <span className="text-[#8C929D] font-medium text-base w-10 text-right shrink-0">
              {Number(value).toFixed(1).replace(/\.0$/, "")}%
            </span>
          </>
        ) : (
          <span className="text-[#8C929D] font-medium text-base">
            No data yet
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex items-center gap-6">
        <h2 className="text-[#A9ADB5] text-sm font-medium whitespace-nowrap">Candidate's Score Breakdown</h2>
        <div className="h-px bg-[#E2E4E6] w-full" />
      </div>

      <div className="flex items-center mb-2">
        <span className="text-[#43474F] font-semibold text-base w-48">Final Score</span>
        <span className="text-[#8C929D] font-semibold text-base">
          {totalScore !== null && totalScore !== undefined ? Number(totalScore).toFixed(1).replace(/\.0$/, "") : "No data yet"}
        </span>
        {totalScore !== null && totalScore !== undefined && recommendation && (() => {
          const rec = recommendation;
          const mappedKey = mapRecommendationToStatusKey(rec);
          const colorCfg = mappedKey && activeColorMap[mappedKey]
            ? activeColorMap[mappedKey]
            : { color: "#595F6A", bgColor: "#F2F2F2" };
          return (
            <div className="ml-4 flex items-center">
              <Badge
                variant="outline"
                style={{ borderColor: colorCfg.color, color: colorCfg.color, backgroundColor: colorCfg.bgColor }}
                className="py-1 px-2 text-sm font-medium whitespace-nowrap"
              >
                {mappedKey || rec}
              </Badge>
            </div>
          );
        })()}
      </div>

      <div className="flex flex-col gap-4 pl-6 border-l-4 border-[#E2E4E6] py-2">
        {renderSkillRow("Technical Skill", 50, avgTechnical)}
        {renderSkillRow("Problem Solving", 30, avgProblemSolving)}
        {renderSkillRow("Communication", 20, avgCommunication)}
      </div>
    </div>
  );
}
/*
edit end
*/
