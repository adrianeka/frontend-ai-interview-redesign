"use client";

import React from "react";
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
export function CandidateScoreBreakdown({
  totalScore,
  recommendation,
  activeColorMap,
  avgTechnical,
  avgProblemSolving,
  avgCommunication
}: CandidateScoreBreakdownProps) {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex items-center gap-6">
        <h2 className="text-[#A9ADB5] text-sm font-medium whitespace-nowrap">Candidate's Score Breakdown</h2>
        <div className="h-px bg-[#E2E4E6] w-full" />
      </div>

      <div className="flex items-center mb-2">
        <span className="text-[#43474F] font-semibold text-base w-48">Final Score</span>
        <span className="text-[#8C929D] font-semibold text-base">
          {totalScore ? `${Number(totalScore).toFixed(1)}%` : "No data yet"}
        </span>
        {recommendation && (() => {
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
        <div className="flex items-center">
          <div className="w-48 text-base">
            <span className="text-[#43474F] font-medium">Technical Skill </span>
            <span className="text-[#A9ADB5]">(50%)</span>
          </div>
          <span className="text-[#8C929D] font-medium text-base">
            {avgTechnical ? `${avgTechnical.toFixed(1)}%` : "No data yet"}
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-48 text-base">
            <span className="text-[#43474F] font-medium">Problem Solving </span>
            <span className="text-[#A9ADB5]">(30%)</span>
          </div>
          <span className="text-[#8C929D] font-medium text-base">
            {avgProblemSolving ? `${avgProblemSolving.toFixed(1)}%` : "No data yet"}
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-48 text-base">
            <span className="text-[#43474F] font-medium">Communication </span>
            <span className="text-[#A9ADB5]">(20%)</span>
          </div>
          <span className="text-[#8C929D] font-medium text-base">
            {avgCommunication ? `${avgCommunication.toFixed(1)}%` : "No data yet"}
          </span>
        </div>
      </div>
    </div>
  );
}
