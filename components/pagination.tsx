"use client";

import * as React from "react";
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalEntries,
  entriesPerPage,
  onPageChange,
  className,
}: PaginationProps) {
  const startEntry = Math.max((currentPage - 1) * entriesPerPage + 1, 0);
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  if (totalEntries === 0) return null;

  return (
    <div className={cn("mt-12 flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
      <p className="text-xs text-muted-foreground font-medium italic">
        Showing {startEntry} to {endEntry} of {totalEntries} entries
      </p>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[#A1A1AA] transition-colors hover:bg-[#F4F4F5] disabled:opacity-30"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[#A1A1AA] transition-colors hover:bg-[#F4F4F5] disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-1 text-[13px] text-[#A1A1AA]">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-[10px] text-[13px] font-medium transition-colors",
                  currentPage === page 
                    ? "bg-[#DDF4F7] text-[#0284C7]" 
                    : "text-[#71717A] hover:bg-[#F4F4F5]"
                )}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[#A1A1AA] transition-colors hover:bg-[#F4F4F5] disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button 
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[#A1A1AA] transition-colors hover:bg-[#F4F4F5] disabled:opacity-30"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
