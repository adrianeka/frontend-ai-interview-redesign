"use client";

import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Props for the FilterSection component.
 */
interface FilterSectionProps {
  /** Indicates if the side panel is currently open (adjusts layout) */
  isSidePanelOpen?: boolean;
  /** Active filter values */
  filters: {
    company: string;
    type: string;
    level: string;
    status: string;
  };
  /** Callback fired when any filter value changes */
  onFiltersChange: (filters: any) => void;
  /** List of dynamically available level targets */
  availableLevels?: string[];
  /** List of dynamically available companies */
  availableCompanies?: string[];
}

/**
 * Renders the filter controls (Company, Type, Level, Status) for the interview list.
 */
/*
edit start
by: Zahra Hilyatul J
date: 2026-06-29
description: Restructured FilterSection to support usage inside a Popover
*/
export function FilterSection({
  isSidePanelOpen,
  filters,
  onFiltersChange,
  availableLevels = [],
  availableCompanies = []
}: FilterSectionProps) {
  const baseTriggerClass =
    "!h-[48px] bg-slate-50/50 rounded-[6px] border border-[#E2E4E6] px-3 flex items-center gap-2 text-[#43474F] font-medium hover:bg-white hover:border-[#D5D9DD] transition-all focus:ring-0 focus:ring-offset-0";

  const getTriggerClass = () => cn("w-full", baseTriggerClass);

  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className={cn(
      "w-full gap-4 font-inter relative z-30 animate-in fade-in duration-300 mb-10",
      isSidePanelOpen ? "grid grid-cols-1 sm:grid-cols-2" : "flex flex-col md:flex-row"
    )}>

      <div className={cn("w-full", !isSidePanelOpen && "flex-[1.5]")}>
        <label className="block text-[13px] font-medium text-[#43474F] mb-[6px] ml-1">
          Company
        </label>
        <Select value={filters.company} onValueChange={(val) => updateFilter("company", val)}>
          <SelectTrigger className={getTriggerClass()}>
            <SlidersHorizontal className="h-4 w-4 text-[#43474F] shrink-0" />
            <SelectValue placeholder="Show All" />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={6} className="rounded-[15px] border-[#E2E4E6] p-1.5 shadow-xl min-w-[200px]">
            <SelectItem value="all" className="rounded-[10px] py-2.5 cursor-pointer">Show All</SelectItem>
            {availableCompanies.map(company => (
              <SelectItem key={company} value={company} className="rounded-[10px] py-2.5 cursor-pointer">
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={cn("w-full", !isSidePanelOpen && "flex-1")}>
        <label className="block text-[13px] font-medium text-[#43474F] mb-[6px] ml-1">
          Type
        </label>
        <Select value={filters.type} onValueChange={(val) => updateFilter("type", val)}>
          <SelectTrigger className={getTriggerClass()}>
            <SlidersHorizontal className="h-4 w-4 text-[#43474F] shrink-0" />
            <SelectValue placeholder="Show All" />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={6} className="rounded-[15px] border-[#E2E4E6] p-1.5 shadow-xl min-w-[200px]">
            <SelectItem value="all" className="rounded-[10px] py-2.5 cursor-pointer">Show All</SelectItem>
            <SelectItem value="HIRING" className="rounded-[10px] py-2.5 cursor-pointer">Hiring</SelectItem>
            <SelectItem value="INTERNAL_ASSESSMENT" className="rounded-[10px] py-2.5 cursor-pointer">Internal Assessment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={cn("w-full", !isSidePanelOpen && "flex-1")}>
        <label className="block text-[13px] font-medium text-[#43474F] mb-[6px] ml-1">
          Level
        </label>
        <Select value={filters.level} onValueChange={(val) => updateFilter("level", val)}>
          <SelectTrigger className={getTriggerClass()}>
            <SlidersHorizontal className="h-4 w-4 text-[#43474F] shrink-0" />
            <SelectValue placeholder="Show All" />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={6} className="rounded-[15px] border-[#E2E4E6] p-1.5 shadow-xl min-w-[200px]">
            <SelectItem value="all" className="rounded-[10px] py-2.5 cursor-pointer">Show All</SelectItem>
            {availableLevels.map(lvl => (
              <SelectItem key={lvl} value={lvl} className="rounded-[10px] py-2.5 cursor-pointer">
                {lvl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    </div>
  );
}
/*
edit end
*/
