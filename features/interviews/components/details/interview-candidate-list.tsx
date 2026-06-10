"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationFirst,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationLast
} from "@/components/ui/pagination";
import { Loader2, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Candidate } from "@/features/interviews/types/interview";
import { ColorMapConfig, mapRecommendationToStatusKey } from "@/features/interviews/utils/recommendation";
import { formatInterviewTime } from "@/lib/time";

interface InterviewCandidateListProps {
  isLoading: boolean;
  currentCandidates: Candidate[];
  activeColorMap: Record<string, ColorMapConfig>;
  interviewId: string;
  totalEntries: number;
  startIndex: number;
  endIndex: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

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
  onPageChange
}: InterviewCandidateListProps) {
  const router = useRouter();

  const formatScore = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "-";
    return Number(score).toFixed(1).replace(/\.0$/, "");
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis-1");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("ellipsis-2");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Candidate list */}
      <div className="flex flex-col divide-y divide-[#E2E4E6] gap-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#0076D2]" />
            <span className="ml-2 text-[#707784] font-medium">Filtering candidates...</span>
          </div>
        ) : currentCandidates.length > 0 ? (
          currentCandidates.map((candidate, index) => {
            const rec = candidate.recommendation;
            const mappedKey = mapRecommendationToStatusKey(rec);
            const colorCfg = mappedKey && activeColorMap[mappedKey]
              ? activeColorMap[mappedKey]
              : { color: "#595F6A", bgColor: "#F2F2F2" };

            return (
              <Card
                key={candidate.participantId || index}
                onClick={() => router.push(`/interviews/${interviewId}/candidates/${candidate.candidateId}`)}
                className="flex flex-row p-4 sm:px-1.25 sm:py-2 ring-0 items-center justify-between w-full cursor-pointer hover:bg-slate-50/50 active:scale-[0.995] transition-all duration-200 shadow-none border-none bg-transparent"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center flex-1 gap-3 sm:gap-6 w-full">
                  {rec && (
                    <div className="min-w-0 sm:min-w-32 shrink-0 max-w-full sm:max-w-64">
                      <Badge
                        variant="outline"
                        style={{ borderColor: colorCfg.color, color: colorCfg.color, backgroundColor: colorCfg.bgColor }}
                        className="py-1 px-2 text-sm font-medium whitespace-normal wrap-break-word text-left"
                      >
                        {mappedKey || rec}
                      </Badge>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-0 items-start sm:items-center justify-between pr-4">
                    <div className="flex flex-col gap-1 sm:gap-2 justify-center flex-1">
                      <p className="text-[#43474F] font-semibold text-lg">{candidate.name}</p>
                      <p className="text-sm">
                        <span className="text-[#8C929D]">
                          Technical ({formatScore(candidate.avgTechnicalFundamentalScore)}%)  •  Problem Solving ({formatScore(candidate.avgProblemSolvingScore)}%)  •  Communication ({formatScore(candidate.avgCommunicationScore)}%)
                        </span>{" "}
                        <span className="text-[#707784] font-medium whitespace-nowrap">Total Score ({formatScore(candidate.totalScore)}%)</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-0.5 sm:gap-2 justify-center shrink-0">
                      <p className="text-[#A9ADB5] text-xs sm:text-sm font-medium">
                        Interview Time:
                      </p>
                      <p className="text-[#707784] text-sm font-medium">
                        {formatInterviewTime(candidate.startedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="shrink-0 pointer-events-none p-0 w-10 h-10 flex items-center justify-center"
                  asChild
                >
                  <div>
                    <ChevronRightIcon color="#0076D2" className="w-5 h-5" />
                  </div>
                </Button>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-20 text-[#A9ADB5] font-medium">
            No candidates found for the current filters.
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="flex w-full items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
        <p className="text-[#A9ADB5] italic text-sm text-center sm:text-left">
          {totalEntries > 0
            ? `Showing ${startIndex + 1} to ${endIndex} of ${totalEntries} entries`
            : "Showing 0 to 0 of 0 entries"}
        </p>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="w-fit mx-0">
            <PaginationContent className="[&_a[data-active='true']]:bg-[#DBF2F3] [&_a[data-active='true']]:text-[#0076D2]">
              <PaginationItem>
                <PaginationFirst href="#" onClick={(e) => { e.preventDefault(); onPageChange(1); }} />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious text="" href="#" onClick={(e) => { e.preventDefault(); onPageChange(currentPage - 1); }} />
              </PaginationItem>

              {getPageNumbers().map((p, index) => {
                if (p === "ellipsis-1" || p === "ellipsis-2") {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                const pageNum = p as number;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => { e.preventDefault(); onPageChange(pageNum); }}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext text="" href="#" onClick={(e) => { e.preventDefault(); onPageChange(currentPage + 1); }} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast href="#" onClick={(e) => { e.preventDefault(); onPageChange(totalPages); }} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
