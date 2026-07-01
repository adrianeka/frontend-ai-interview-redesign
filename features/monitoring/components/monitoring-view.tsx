"use client";

import { useMonitoringList } from "../hooks/use-monitoring-list";
import { MonitoringTask } from "../types/monitoring-types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, SlidersHorizontal, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Reusable shared components
import { Pagination } from "@/components/pagination";
import { Search } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "SUCCESS":
      return (
        <Badge className="bg-[#E7F7ED] text-[#0F9943] hover:bg-[#E7F7ED] border-[#0F9943] px-3 py-1 font-semibold rounded-[20px] whitespace-nowrap">
          SUCCESS
        </Badge>
      );
    case "FAILED":
      return (
        <Badge className="bg-[#FEEBEB] text-[#D32F2F] hover:bg-[#FEEBEB] border-[#D32F2F] px-3 py-1 font-semibold rounded-[20px] whitespace-nowrap">
          FAILED
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge className="bg-[#FFF4E5] text-[#ED6C02] hover:bg-[#FFF4E5] border-[#ED6C02] px-3 py-1 font-semibold rounded-[20px] whitespace-nowrap">
          IN PROGRESS
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

// ─── Mobile Card (same pattern as result-answer MobileCard) ──────────────────

function MonitoringMobileCard({ task }: { task: MonitoringTask }) {
  return (
    <div className="p-4 border-b border-[#E2E4E6] last:border-0 bg-white hover:bg-slate-50 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <StatusBadge status={task.status} />
      </div>

      <p className="text-sm font-semibold text-slate-800 mb-0.5 line-clamp-1">
        {task.taskName}
      </p>

      <p className="text-xs text-slate-500 mb-2 line-clamp-1">
        {task.interviewName}
      </p>

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400">
          Candidate: <span className="text-slate-600 font-medium">{task.candidateName}</span>
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 mt-1.5">
        <div>
          <p className="text-[10px] text-slate-400">Start</p>
          <p className="text-xs font-medium text-slate-600">{formatDateTime(task.startDate)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400">End</p>
          <p className="text-xs font-medium text-slate-600">{formatDateTime(task.endDate)}</p>
        </div>
      </div>

      {task.processId && (
        <p className="mt-2 font-mono text-[10px] text-slate-300 truncate">
          {task.processId}
        </p>
      )}
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function MonitoringView() {
  const {
    tasks,
    isLoading,
    filters,
    setFilters,
    totalElements,
    totalPages,
  } = useMonitoringList();

  // Pagination component is 1-indexed; hook uses 0-indexed
  const currentPage1Based = (filters.page ?? 0) + 1;
  const pageSize = filters.size ?? 10;

  const activeFiltersCount = [
    filters.search ? 1 : 0,
    filters.status && filters.status !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 0 }));
  };

  const handleStatusFilterChange = (val: string) => {
    setFilters((prev) => ({ ...prev, status: val, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  };

  return (
    <div className="flex flex-col gap-6 overflow-x-clip">
      <div className="w-full rounded-2xl border border-[#E2E4E6] bg-[#FAFAFA] p-4 sm:p-6">

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-6 sm:mb-8">
          Monitoring Process
        </h1>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Search (Left) */}
          <div className="flex items-center gap-2 border border-[#E2E4E6] rounded-lg px-3 py-2 bg-white w-full sm:w-[380px]">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search monitoring..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="text-sm outline-none bg-transparent text-slate-700 placeholder:text-slate-400 w-full"
            />
          </div>

          {/* Filter popover (Right) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-[40px] rounded-[10px] font-medium text-[#43474F] gap-2 px-4 bg-white hover:bg-slate-50 border-[#E2E4E6] text-sm"
              >
                {activeFiltersCount > 0 ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0076D2] text-[12px] text-white font-semibold">
                    {activeFiltersCount}
                  </span>
                ) : (
                  <SlidersHorizontal size={16} className="text-[#8B939E]" />
                )}
                <span>Filter</span>
                <ChevronDown size={16} className="text-[#8B939E]" strokeWidth={2.5} />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[280px] p-5 rounded-2xl border-[#E2E4E6] shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E4E6]">
                  <h4 className="font-semibold text-slate-800 text-sm">Filter Tasks</h4>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#43474F] mb-1.5">
                    Status
                  </label>
                  <Select value={filters.status} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className="w-full h-[44px] bg-slate-50/50 rounded-[6px] border border-[#E2E4E6]">
                      <SelectValue placeholder="Show All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Show All</SelectItem>
                      <SelectItem value="SUCCESS">Success</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Content area */}
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium">
            No tasks found matching your filter.
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-[#E2E4E6] overflow-hidden bg-white">
              {/* Mobile: Card list (same as result-answer pattern) */}
              <div className="sm:hidden">
                {tasks.map((task) => (
                  <MonitoringMobileCard key={task.id} task={task} />
                ))}
              </div>

              {/* Desktop: Table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader className="bg-[#FAFAFA]">
                    <TableRow className="hover:bg-transparent border-b border-[#E2E4E6]">
                      <TableHead className="font-bold text-[#43474F] py-3.5 h-auto text-xs uppercase tracking-wide">
                        Process ID
                      </TableHead>
                      <TableHead className="font-bold text-[#43474F] py-3.5 h-auto text-xs uppercase tracking-wide">
                        Interview Name
                      </TableHead>
                      <TableHead className="font-bold text-[#43474F] py-3.5 h-auto text-xs uppercase tracking-wide">
                        Candidate
                      </TableHead>
                      <TableHead className="font-bold text-[#43474F] py-3.5 h-auto text-xs uppercase tracking-wide">
                        Task Name
                      </TableHead>
                      <TableHead className="font-bold text-[#43474F] py-3.5 h-auto text-xs uppercase tracking-wide">
                        Start Date
                      </TableHead>
                      <TableHead className="font-bold text-[#43474F] py-3.5 h-auto text-xs uppercase tracking-wide">
                        End Date
                      </TableHead>
                      <TableHead className="font-bold text-[#43474F] py-3.5 h-auto text-xs uppercase tracking-wide text-center">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow
                        key={task.id}
                        className="hover:bg-slate-50 border-b border-b-[#E2E4E6] transition-colors"
                      >
                        <TableCell className="font-mono text-[11px] text-[#43474F] py-3.5 max-w-[160px] truncate">
                          {task.processId}
                        </TableCell>
                        <TableCell className="text-sm text-[#43474F] py-3.5 max-w-[200px]">
                          <span className="line-clamp-2">{task.interviewName}</span>
                        </TableCell>
                        <TableCell className="text-sm text-[#43474F] py-3.5 whitespace-nowrap">
                          {task.candidateName}
                        </TableCell>
                        <TableCell className="text-sm text-[#43474F] py-3.5 max-w-[200px]">
                          <span className="line-clamp-2">{task.taskName}</span>
                        </TableCell>
                        <TableCell className="text-sm text-[#43474F] py-3.5 whitespace-nowrap">
                          {formatDateTime(task.startDate)}
                        </TableCell>
                        <TableCell className="text-sm text-[#43474F] py-3.5 whitespace-nowrap">
                          {formatDateTime(task.endDate)}
                        </TableCell>
                        <TableCell className="py-3.5 text-center">
                          <StatusBadge status={task.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination — same condition as result-answer (only show if > 1 page) */}
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage1Based}
                  totalPages={totalPages}
                  totalEntries={totalElements}
                  entriesPerPage={pageSize}
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
