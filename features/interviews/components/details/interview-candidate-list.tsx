"use client";

import { Pagination } from "@/components/pagination";
import { Loader2 } from "lucide-react";
import { Candidate } from "@/features/interviews/types/interview";
import { ColorMapConfig } from "@/features/interviews/utils/recommendation";
import { CandidateCard } from "./candidate-card";

/**
 * Props for the InterviewCandidateList component.
 */
interface InterviewCandidateListProps {
  /** Indicates if candidate data is currently being fetched */
  isLoading: boolean;
  /** The slice of candidates to display for the current page */
  currentCandidates: Candidate[];
  /** Styling configuration for candidate status badges */
  activeColorMap: Record<string, ColorMapConfig>;
  /** The parent interview ID used for routing */
  interviewId: string;
  /** Total number of candidates across all pages */
  totalEntries: number;
  /** 0-based index of the first candidate on the current page */
  startIndex: number;
  /** 0-based index of the last candidate on the current page */
  endIndex: number;
  /** Total number of pages available */
  totalPages: number;
  /** Currently active page number (1-indexed) */
  currentPage: number;
  /** Number of entries displayed per page */
  entriesPerPage: number;
  /** Callback fired when the user attempts to change the page */
  onPageChange: (page: number) => void;
}

/**
 * Renders the paginated list of candidates for a specific interview.
 * Integrates the CandidateCard for individual rows and the global Pagination component.
 */
export function InterviewCandidateList({
  isLoading,
  currentCandidates,
  activeColorMap,
  interviewId,
  totalEntries,
  startIndex,
  endIndex,
  totalPages,
  currentPage,
  entriesPerPage,
  onPageChange
}: InterviewCandidateListProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Candidate list */}
      <div className="flex flex-col divide-y divide-[#E2E4E6] gap-6">
        {isLoading ? (
          /* Loading State */
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#0076D2]" />
            <span className="ml-2 text-[#707784] font-medium">Filtering candidates...</span>
          </div>
        ) : currentCandidates.length > 0 ? (
          /* Candidate Cards Render */
          currentCandidates.map((candidate, index) => (
            <CandidateCard
              key={candidate.participantId || index}
              candidate={candidate}
              interviewId={interviewId}
              activeColorMap={activeColorMap}
            />
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-20 text-[#A9ADB5] font-medium">
            No candidates found for the current filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          entriesPerPage={entriesPerPage}
          onPageChange={onPageChange}
          className="mt-6 w-full"
        />
      )}
    </div>
  );
}
