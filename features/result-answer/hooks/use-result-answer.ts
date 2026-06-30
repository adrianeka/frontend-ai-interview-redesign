"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { resultAnswerService } from "../service/result-answer-service";

export type HiringRecommendation =
  | "Strong Hire"
  | "Hire"
  | "Consider"
  | "Reject";
export type AssessmentRecommendation =
  | "Ready for Promotion"
  | "Meets Current Level"
  | "Needs Improvement"
  | "Significant Improvement Required";

export type Recommendation =
  | HiringRecommendation
  | AssessmentRecommendation
  | null;

export interface ResultAnswerItem {
  interviewId: string;
  candidateId: string;
  interviewName: string;
  name: string;
  totalScore: number | null;
  recommendation: Recommendation;
  summaryReason: string | null;
  progress: string;
  validated: string;
  avgBreakTime: number;
  avgAnswerTime: number;
  purpose?: "HIRING" | "INTERNAL_ASSESSMENT";
  technicalFundamental?: number | null;
  problemSolve?: number | null;
  communication?: number | null;
  timeInterview?: string | null;
  dateInterview?: string | null;
}

interface PaginatedResult {
  content: ResultAnswerItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  pageable: { pageNumber: number; pageSize: number };
}

interface Filters {
  interviewTitle: string;
}

export function useResultAnswer(userId: string) {
  const [data, setData] = useState<PaginatedResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({ interviewTitle: "" });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!userId) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const raw = await resultAnswerService.getAnsweredList(
        userId,
        filters.interviewTitle || null,
      );

      const allItems: ResultAnswerItem[] = Array.isArray(raw)
        ? raw
        : (raw.content ?? []);
      const start = page * pageSize;
      const content = allItems.slice(start, start + pageSize);

      setData({
        content,
        totalElements: allItems.length,
        totalPages: Math.ceil(allItems.length / pageSize),
        size: pageSize,
        pageable: { pageNumber: page, pageSize },
      });
    } catch (err: any) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
      setError(err.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [userId, filters, page, pageSize]);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  const handlePageChange = (newPage: number) => setPage(newPage - 1);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const resetFilters = () => {
    setFilters({ interviewTitle: "" });
    setPage(0);
  };

  return {
    data,
    isLoading,
    error,
    filters,
    page,
    pageSize,
    setPage,
    setPageSize: (size: number) => {
      setPageSize(size);
      setPage(0);
    },
    handlePageChange,
    handleFilterChange,
    resetFilters,
  };
}
