"use client";

import { Pagination } from "@/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Recommendation,
  ResultAnswerItem,
  useResultAnswer,
} from "@/features/result-answer/hooks/use-result-answer";
import { getRoleName, getUserId } from "@/lib/auth";
import { ChevronRight, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BASE_BADGE =
  "rounded-full px-3 py-0.5 text-xs font-medium whitespace-nowrap";

const LEVEL_STYLES: Record<"green" | "blue" | "yellow" | "red", string> = {
  green: `${BASE_BADGE} text-[#4BAC87] border border-[#4BAC87]`,
  blue: `${BASE_BADGE} text-[#0076D2] border border-[#0076D2]`,
  yellow: `${BASE_BADGE} text-[#E8A01D] border border-[#E8A01D]`,
  red: `${BASE_BADGE} text-[#E84E2C] border border-[#E84E2C]`,
};

const BADGE_LEVEL: Record<
  NonNullable<Recommendation>,
  "green" | "blue" | "yellow" | "red"
> = {
  "Strong Hire": "green",
  Hire: "blue",
  Consider: "yellow",
  Reject: "red",
  "Ready for Promotion": "green",
  "Meets Current Level": "blue",
  "Needs Improvement": "yellow",
  "Significant Improvement Required": "red",
};

function RecommendationBadge({ item }: { item: ResultAnswerItem }) {
  const rec = item?.recommendation;
  if (!rec) return <span className="text-sm text-slate-400">-</span>;
  return <span className={LEVEL_STYLES[BADGE_LEVEL[rec]]}>{rec}</span>;
}

function MobileCard({
  item,
  onClick,
}: {
  item: ResultAnswerItem;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="p-4 border-b border-[#E2E4E6] last:border-0 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <RecommendationBadge item={item} />
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      <p className="text-sm font-semibold text-slate-800 mb-1">
        {item.interviewName}
      </p>

      <p className="text-xs text-slate-400 leading-relaxed">
        Technical ({item.technicalFundamental ?? 0}%)
        {" • "}
        Problem Solving ({item.problemSolve ?? 0}%)
        {" • "}
        Communication ({item.communication ?? 0}%)
      </p>

      <div className="flex items-center justify-between mt-2">
        {item.totalScore != null ? (
          <span className="text-xs font-semibold text-slate-700">
            Total Score ({item.totalScore}%)
          </span>
        ) : (
          <span className="text-xs text-slate-400">-</span>
        )}

        <div className="text-right">
          <p className="text-[10px] text-slate-400">Interview Time</p>
          <p className="text-xs font-medium text-slate-700">
            {item.timeInterview ?? "00:00"} |{" "}
            {item.dateInterview ?? "DD/MM/YYYY"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ResultAnswerView() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [_role, setRole] = useState("");

  useEffect(() => {
    setUserId(getUserId());
    setRole(getRoleName());
  }, []);

  const {
    data,
    isLoading,
    error,
    filters,
    pageSize,
    setPageSize,
    handlePageChange,
    handleFilterChange,
  } = useResultAnswer(userId);

  const handleRowClick = (_item: ResultAnswerItem) => {
    router.push(`/result-answer/${_item.interviewId}/${_item.candidateId}`);
  };

  return (
    <div className="flex flex-col gap-6 overflow-x-clip">
      <div className="w-full rounded-2xl border border-[#E2E4E6] bg-[#FAFAFA] p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-6 sm:mb-8">
          Result Answer
        </h1>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex items-center flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-400 tracking-wider pr-4 shrink-0">
              List
            </span>
            <div className="h-px flex-1 bg-[#E2E4E6]" />
          </div>

          <div className="flex items-center gap-2 border border-[#E2E4E6] rounded-lg px-3 py-1.5 bg-white">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Interview Title..."
              value={filters.interviewTitle}
              onChange={(e) =>
                handleFilterChange("interviewTitle", e.target.value)
              }
              className="text-xs outline-none bg-transparent text-slate-700 placeholder:text-slate-400 w-28 sm:w-36"
            />
          </div>

          <Select
            value={pageSize.toString()}
            onValueChange={(val) => setPageSize(parseInt(val))}
          >
            <SelectTrigger className="h-auto p-0 border-none bg-transparent hover:bg-transparent focus:ring-0 w-auto gap-1 text-xs font-medium text-slate-500 shadow-none">
              <SelectValue placeholder={`${pageSize} Entries`} />
            </SelectTrigger>
            <SelectContent
              align="end"
              className="rounded-xl border-[#E2E4E6] p-1 shadow-lg"
            >
              {[10, 25, 50, 100].map((n) => (
                <SelectItem
                  key={n}
                  value={String(n)}
                  className="rounded-lg py-2 cursor-pointer text-xs"
                >
                  {n} Entries
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-slate-500 font-medium text-sm">
            Gagal memuat data hasil wawancara. Silakan coba lagi nanti.
          </div>
        ) : !data || data.content.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium text-sm">
            {filters.interviewTitle
              ? "Hasil wawancara tidak ditemukan."
              : "Belum ada riwayat hasil wawancara."}
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-[#E2E4E6] overflow-hidden bg-white">
              <div className="sm:hidden">
                {data.content.map((item, index) => (
                  <MobileCard
                    key={item.interviewId ?? index}
                    item={item}
                    onClick={() => handleRowClick(item)}
                  />
                ))}
              </div>

              <div className="hidden sm:block">
                <Table>
                  <TableBody>
                    {data.content.map((item, index) => (
                      <TableRow
                        key={item.interviewId ?? index}
                        className="border-b border-[#E2E4E6] hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => handleRowClick(item)}
                      >
                        <TableCell className="pl-5 py-4 w-[160px] align-middle">
                          <RecommendationBadge item={item} />
                        </TableCell>

                        <TableCell className="py-4">
                          <p className="text-sm font-semibold text-slate-800 mb-1">
                            {item.interviewName}
                          </p>
                          <div className="flex items-center gap-3">
                            <p className="text-xs text-slate-400">
                              Technical ({item.technicalFundamental ?? 0}%)
                              {" • "}
                              Problem Solving ({item.problemSolve ?? 0}%)
                              {" • "}
                              Communication ({item.communication ?? 0}%)
                            </p>
                            {item.totalScore != null ? (
                              <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                                Total Score ({item.totalScore}%)
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">-</span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="py-4 text-right pr-5 whitespace-nowrap">
                          <p className="text-xs text-slate-400 mb-0.5">
                            Interview Time
                          </p>
                          <p className="text-sm font-medium text-slate-700">
                            {item.timeInterview ?? "00:00"} |{" "}
                            {item.dateInterview ?? "DD/MM/YYYY"}
                          </p>
                        </TableCell>

                        <TableCell className="py-4 pr-4 w-8 align-middle">
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {data.totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={data.pageable.pageNumber + 1}
                  totalPages={data.totalPages}
                  totalEntries={data.totalElements}
                  entriesPerPage={data.size}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
