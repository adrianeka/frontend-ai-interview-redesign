"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColorMapConfig, mapRecommendationToStatusKey } from "@/features/interviews/utils/recommendation";

/**
 * Minimal candidate interface required to calculate recommendation counts.
 */
interface CandidateCountable {
  recommendation?: string | null;
}

/**
 * Props for the InterviewFilterGroup component.
 */
interface InterviewFilterGroupProps {
  /** The currently active filter string (value) */
  activeFilter: string;
  /** Configuration object containing labels, colors, and icons */
  activeColorMap: Record<string, ColorMapConfig>;
  /** Array of candidates to calculate counts for each category */
  candidates: CandidateCountable[];
  /** Whether the list is currently loading (disables buttons) */
  isLoading: boolean;
  /** Callback fired when a filter is clicked */
  onFilterChange: (newFilter: string) => void;
}

/**
 * Renders a grid of clickable filter cards for candidate recommendations
 * (e.g., "Strong Hire", "Reject"). Displays counts based on current candidate data.
 */
export function InterviewFilterGroup({
  activeFilter,
  activeColorMap,
  candidates,
  isLoading,
  onFilterChange
}: InterviewFilterGroupProps) {
  return (
    <div className="grid grid-cols-2 md:flex md:flex-row gap-3 md:gap-4 w-full">
      {Object.entries(activeColorMap).map(([label, cfg], index) => {
        const isActive = activeFilter === cfg.value;
        const count = candidates.filter(
          c => mapRecommendationToStatusKey(c.recommendation) === label
        ).length;

        return (
          <Button
            key={index}
            variant="outline"
            disabled={isLoading}
            onClick={() => {
              if (isLoading) return;
              const newFilter = activeFilter === cfg.value ? "" : cfg.value;
              onFilterChange(newFilter);
            }}
            style={isActive ? { borderColor: cfg.color, backgroundColor: cfg.bgColor } : {}}
            className="flex-1 w-full h-fit bg-[#FAFAFA] flex flex-col items-start gap-2 border-2 border-[#E2E4E6] px-4 py-3 rounded-lg cursor-pointer"
          >
            <p className="text-sm text-[#595F6A] font-semibold">{label}</p>
            <div className="flex flex-row items-center gap-2">
              <div
                style={{ backgroundColor: cfg.iconBg }}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              >
                <cfg.icon
                  style={{ color: cfg.color }}
                  className="w-4 h-4 stroke-3"
                />
              </div>
              <span
                style={{ color: cfg.color }}
                className="text-base sm:text-lg font-bold"
              >
                {count}
              </span>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
