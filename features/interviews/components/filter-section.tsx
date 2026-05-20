"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/searchbar";
import { cn } from "@/lib/utils";

interface FilterSectionProps {
  isSidePanelOpen?: boolean;
  filters: {
    search: string;
    company: string;
    type: string;
    level: string;
    status: string;
  };
  onFiltersChange: (filters: any) => void;
  onSearch: () => void;
  availableLevels?: string[];
}

export function FilterSection({ 
  isSidePanelOpen, 
  filters, 
  onFiltersChange,
  onSearch,
  availableLevels = []
}: FilterSectionProps) {
  const selectTriggerClass =
    "w-[180px] !h-[48px] bg-slate-50/50 rounded-[6px] border border-[#E2E4E6] px-3 flex items-center gap-2 text-[#43474F] font-medium hover:bg-white hover:border-[#D5D9DD] transition-all focus:ring-0 focus:ring-offset-0";

  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const renderFiltersBody = (isCompact: boolean) => {
    if (isCompact) {
      return (
        <div className="flex flex-col mb-10 w-full gap-4 font-inter relative z-30 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 truncate items-end">
            <div className="lg:col-span-1">
              <SearchBar 
                value={filters.search} 
                onChange={(val) => updateFilter("search", val)} 
                placeholder="Search Title..."
              />
            </div>

            <div className="w-full">
              <label className="block text-[13px] font-medium text-[#43474F] mb-[6px] ml-1">
                Company
              </label>
              <Select value={filters.company} onValueChange={(val) => updateFilter("company", val)}>
                <SelectTrigger className={cn(selectTriggerClass, "w-full")}>
                  <SlidersHorizontal className="h-4 w-4 text-[#43474F] flex-shrink-0" />
                  <SelectValue placeholder="Show All" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={6} className="rounded-[15px] border-[#E2E4E6] p-1.5 shadow-xl min-w-[200px]">
                  <SelectItem value="all" className="rounded-[10px] py-2.5 cursor-pointer">Show All</SelectItem>
                  <SelectItem value="Hitopia" className="rounded-[10px] py-2.5 cursor-pointer">Hitopia</SelectItem>
                  <SelectItem value="IZENO" className="rounded-[10px] py-2.5 cursor-pointer">IZENO</SelectItem>
                  <SelectItem value="OCBC" className="rounded-[10px] py-2.5 cursor-pointer">OCBC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label className="block text-[13px] font-medium text-[#43474F] mb-[6px] ml-1">
                Type
              </label>
              <Select value={filters.type} onValueChange={(val) => updateFilter("type", val)}>
                <SelectTrigger className={cn(selectTriggerClass, "w-full")}>
                  <SlidersHorizontal className="h-4 w-4 text-[#43474F] flex-shrink-0" />
                  <SelectValue placeholder="Show All" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={6} className="rounded-[15px] border-[#E2E4E6] p-1.5 shadow-xl min-w-[200px]">
                  <SelectItem value="all" className="rounded-[10px] py-2.5 cursor-pointer">Show All</SelectItem>
                  <SelectItem value="HIRING" className="rounded-[10px] py-2.5 cursor-pointer">Hiring</SelectItem>
                  <SelectItem value="INTERNAL_ASSESSMENT" className="rounded-[10px] py-2.5 cursor-pointer">Internal Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="w-full md:w-[180px]">
              <label className="block text-[13px] font-medium text-[#43474F] mb-[6px] ml-1">
                Level
              </label>
              <Select value={filters.level} onValueChange={(val) => updateFilter("level", val)}>
                <SelectTrigger className={cn(selectTriggerClass, "w-full")}>
                  <SlidersHorizontal className="h-4 w-4 text-[#43474F] flex-shrink-0" />
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

            <div className="w-full md:w-[180px]">
              <label className="block text-[13px] font-medium text-[#43474F] mb-[6px] ml-1">
                Status
              </label>
              <Select value={filters.status} onValueChange={(val) => updateFilter("status", val)}>
                <SelectTrigger className={cn(selectTriggerClass, "w-full")}>
                  <SlidersHorizontal className="h-4 w-4 text-[#43474F] flex-shrink-0" />
                  <SelectValue placeholder="Show All" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={6} className="rounded-[15px] border-[#E2E4E6] p-1.5 shadow-xl min-w-[180px]">
                  <SelectItem value="all" className="rounded-[10px] py-2.5 cursor-pointer">Show All</SelectItem>
                  <SelectItem value="DRAFT" className="rounded-[10px] py-2.5 cursor-pointer">Draft</SelectItem>
                  <SelectItem value="PUBLISHED" className="rounded-[10px] py-2.5 cursor-pointer">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-auto">
              <Button 
                onClick={onSearch}
                className="h-[48px] w-full md:w-[120px] border bg-[#e0f7f9] text-[#0076D2] hover:bg-[#d0f0f2] shadow-none rounded-[10px] text-[15px] font-bold transition-colors"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col md:flex-row items-stretch md:items-end mb-10 w-full gap-4 font-inter relative z-30">
        <div className="flex-grow w-full md:min-w-[320px]">
          <SearchBar 
            value={filters.search} 
            onChange={(val) => updateFilter("search", val)} 
            placeholder="Search Title..."
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-shrink-0 min-w-[140px]">
            <label className="block text-[13px] font-medium text-[#43474F] mb-[6px] ml-1">
              Company
            </label>
            <Select value={filters.company} onValueChange={(val) => updateFilter("company", val)}>
              <SelectTrigger className={cn(selectTriggerClass, "w-full md:w-[180px]")}>
                <SlidersHorizontal className="h-4 w-4 text-[#43474F] flex-shrink-0" />
                <SelectValue placeholder="Show All" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={6} className="rounded-[15px] border-[#E2E4E6] p-1.5 shadow-xl min-w-[200px]">
                <SelectItem value="all" className="rounded-[10px] py-2.5 cursor-pointer">Show All</SelectItem>
                <SelectItem value="Hitopia" className="rounded-[10px] py-2.5 cursor-pointer">Hitopia</SelectItem>
                <SelectItem value="IZENO" className="rounded-[10px] py-2.5 cursor-pointer">IZENO</SelectItem>
                <SelectItem value="OCBC" className="rounded-[10px] py-2.5 cursor-pointer">OCBC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 md:flex-shrink-0 min-w-[140px]">
            <label className="block text-[13px] font-medium text-[#43474F] mb-[6px] ml-1">
              Type
            </label>
            <Select value={filters.type} onValueChange={(val) => updateFilter("type", val)}>
              <SelectTrigger className={cn(selectTriggerClass, "w-full md:w-[180px]")}>
                <SlidersHorizontal className="h-4 w-4 text-[#43474F] flex-shrink-0" />
                <SelectValue placeholder="Show All" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={6} className="rounded-[15px] border-[#E2E4E6] p-1.5 shadow-xl min-w-[200px]">
                <SelectItem value="all" className="rounded-[10px] py-2.5 cursor-pointer">Show All</SelectItem>
                <SelectItem value="HIRING" className="rounded-[10px] py-2.5 cursor-pointer">Hiring</SelectItem>
                <SelectItem value="INTERNAL_ASSESSMENT" className="rounded-[10px] py-2.5 cursor-pointer">Internal Assessment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 md:flex-shrink-0 min-w-[140px]">
            <label className="block text-[13px] font-medium text-[#43474F] mb-[6px] ml-1">
              Level
            </label>
            <Select value={filters.level} onValueChange={(val) => updateFilter("level", val)}>
              <SelectTrigger className={cn(selectTriggerClass, "w-full md:w-[180px]")}>
                <SlidersHorizontal className="h-4 w-4 text-[#43474F] flex-shrink-0" />
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

          <div className="flex-1 md:flex-shrink-0 min-w-[140px]">
            <label className="block text-[13px] font-medium text-[#43474F] mb-[6px] ml-1">
              Status
            </label>
            <Select value={filters.status} onValueChange={(val) => updateFilter("status", val)}>
              <SelectTrigger className={cn(selectTriggerClass, "w-full md:w-[180px]")}>
                <SlidersHorizontal className="h-4 w-4 text-[#43474F] flex-shrink-0" />
                <SelectValue placeholder="Show All" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={6} className="rounded-[15px] border-[#E2E4E6] p-1.5 shadow-xl min-w-[180px]">
                <SelectItem value="all" className="rounded-[10px] py-2.5 cursor-pointer">Show All</SelectItem>
                <SelectItem value="DRAFT" className="rounded-[10px] py-2.5 cursor-pointer">Draft</SelectItem>
                <SelectItem value="PUBLISHED" className="rounded-[10px] py-2.5 cursor-pointer">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto">
            <div className="hidden md:block h-[25px]" />
            <Button 
              onClick={onSearch}
              className="h-[48px] w-full md:w-[80px] border bg-[#e0f7f9] text-[#0076D2] hover:bg-[#d0f0f2] shadow-none rounded-[12px] text-sm transition-colors"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return renderFiltersBody(!!isSidePanelOpen);
}