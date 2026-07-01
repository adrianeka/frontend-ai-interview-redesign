"use client";

import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateInterviewModal } from "@/features/interviews/components/create-interview-modal";
import { EditInterviewModal } from "@/features/interviews/components/edit-interview-modal";
import { InterviewAlertModal } from "@/features/interviews/components/interview-alert-modal";
import { FilterSection } from "@/features/interviews/components/list/filter-section";
import { InterviewCard } from "@/features/interviews/components/list/interview-card";
import { SidePanel } from "@/features/interviews/components/list/side-panel";
import { useInterviewsList } from "@/features/interviews/hooks/use-interviews-list";
import { getRoleName } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Loader2, Plus, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * Main View component for the Interviews List page.
 * Renders the dashboard showing all interviews, including search/filter capabilities,
 * a list of interview cards, and server-side pagination.
 */
export function InterviewsListView() {
  const {
    isModalOpen,
    setIsModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    currentEditData,
    deleteAlertType,
    isDeleting,
    selectedInterview,
    setSelectedInterview,
    isLoading,
    data,
    filters,
    setFilters,
    setPage,
    pageSize,
    setPageSize,
    availableLevels,
    availableCompanies,
    fetchInterviews,
    handleEditClick,
    handleDeleteClick,
    handleDeletePrimary,
    handleDeleteSecondary,
    handlePageChange,
    removeFilter,
  } = useInterviewsList();

  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(getRoleName());
  }, []);

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== "all" && value !== "" && value !== undefined
  ).length;

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start overflow-x-clip">
      <div
        className={cn(
          "shrink-0 rounded-2xl border border-[#E2E4E6] bg-[#FAFAFA] p-6 transition-all duration-500 ease-in-out overflow-hidden",
          selectedInterview ? "lg:w-[calc(100%-474px)] w-full" : "w-full",
        )}
      >
        {/* Title and Action */}
        <div className="flex flex-col sm:flex-row gap-4 items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Interviews Management Board
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              View and manage all your interview.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-[44px] rounded-[10px] font-medium text-[#43474F] gap-2.5 px-4 w-full sm:w-auto bg-white hover:bg-slate-50 border-[#E2E4E6]"
                >
                  {activeFiltersCount > 0 ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0076D2] text-[13px] text-white font-semibold">
                      {activeFiltersCount}
                    </span>
                  ) : (
                    <SlidersHorizontal size={18} className="text-[#8B939E] -ml-0.5" />
                  )}
                  <span className="text-[15px]">Filter</span>
                  <ChevronDown size={20} className="text-[#8B939E] ml-1" strokeWidth={2.5} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[300px] sm:w-[400px] p-5 rounded-2xl border-[#E2E4E6] shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E4E6]">
                    <h4 className="font-semibold text-slate-800">Filter Interviews</h4>
                  </div>
                  <div className="pt-2">
                    <FilterSection
                      isSidePanelOpen={true} /* Force stacking inside the narrow popover */
                      filters={filters}
                      onFiltersChange={(newFilters) => {
                        setFilters(newFilters);
                        setPage(0);
                      }}
                      availableLevels={availableLevels}
                      availableCompanies={availableCompanies}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {role !== "Candidate" && (
              <Button
                className="h-[44px] bg-[#0076D2] hover:bg-[#005FA3] text-white rounded-lg font-bold gap-2 px-6 w-full sm:w-auto"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={18} />
                New Interview
              </Button>
            )}
          </div>
        </div>

        {/* List Meta */}
        <div className="flex items-center justify-between mb-6 pb-2">
          <div className="flex items-center w-full">
            <span className="text-xs font-bold text-slate-400 tracking-wider pr-4">
              List
            </span>
            <div className="h-px flex-1 bg-[#E2E4E6]" />
          </div>

          <Select
            value={pageSize.toString()}
            onValueChange={(val) => {
              setPageSize(parseInt(val));
              setPage(0);
            }}
          >
            <SelectTrigger className="ml-4 h-auto p-0 border-none bg-transparent hover:bg-transparent focus:ring-0 w-auto gap-1 text-xs font-medium text-slate-500 shadow-none">
              <SelectValue placeholder={`${pageSize} Entries`} />
            </SelectTrigger>
            <SelectContent
              align="end"
              className="rounded-xl border-[#E2E4E6] p-1 shadow-lg"
            >
              <SelectItem
                value="10"
                className="rounded-lg py-2 cursor-pointer text-xs"
              >
                10 Entries
              </SelectItem>
              <SelectItem
                value="25"
                className="rounded-lg py-2 cursor-pointer text-xs"
              >
                25 Entries
              </SelectItem>
              <SelectItem
                value="50"
                className="rounded-lg py-2 cursor-pointer text-xs"
              >
                50 Entries
              </SelectItem>
              <SelectItem
                value="100"
                className="rounded-lg py-2 cursor-pointer text-xs"
              >
                100 Entries
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          {Object.entries(filters).map(([key, value]) => {
            if (value === "all") return null;

            return (
              <div
                key={key}
                className="flex h-[24px] items-center gap-1 rounded-[12px] bg-[#F2F2F2] pl-2 pr-2 py-1 animate-in zoom-in-95 duration-200"
              >
                <span className="text-[12px] leading-[14px] font-medium text-[#595F6A] whitespace-nowrap">
                  {value}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFilter(key as keyof typeof filters)}
                  className="rounded-full hover:bg-[#E5E7EB] p-0 w-6 h-6 flex items-center justify-center"
                >
                  <img
                    src="/x-circle.svg"
                    alt="close"
                    className="h-[16px] w-[16px]"
                  />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {/* Grid */}
            <div
              className={cn(
                "grid gap-6 transition-all duration-500 ease-in-out",
                selectedInterview
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
              )}
            >
              {data?.content.map((item, index) => (
                <InterviewCard
                  key={item.id || index}
                  id={item.id}
                  title={item.name}
                  company={{
                    companyNamePartner: item.companyNamePartner,
                    logo: "/Location.svg",
                  }}
                  topCandidate={item.topCandidate || "0/0"}
                  type={
                    item.purpose === "HIRING" ? "Hiring" : "Internal Assessment"
                  }
                  level={item.levelTarget}
                  description={item.description}
                  isCompact={!!selectedInterview}
                  isEditable={(item as any).isEditable ?? true}
                  isDeletable={(item as any).isDeletable ?? true}
                  onClick={() => setSelectedInterview(item)}
                  onEdit={() => handleEditClick(item)}
                  onDelete={() => handleDeleteClick(item.id)}
                  role={role}
                  isAnswered={!!item.isAnswered}
                />
              ))}
            </div>

            {/* Empty State */}
            {data?.content.length === 0 && (
              <div className="text-center py-20 text-slate-400 font-medium">
                No interviews found.
              </div>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <Pagination
                currentPage={data.pageable.pageNumber + 1}
                totalPages={data.totalPages}
                totalEntries={data.totalElements}
                entriesPerPage={data.size}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      {selectedInterview && (
        <SidePanel
          interviewId={selectedInterview.id}
          onClose={() => setSelectedInterview(null)}
        />
      )}

      <CreateInterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableLevels={availableLevels}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchInterviews();
        }}
      />

      <EditInterviewModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        availableLevels={availableLevels}
        initialData={currentEditData}
        onSuccess={() => {
          setIsEditModalOpen(false);
          fetchInterviews();
        }}
      />

      <InterviewAlertModal
        isOpen={!!deleteAlertType}
        mode="delete"
        type={deleteAlertType || "confirmation"}
        isLoading={isDeleting}
        onPrimaryAction={handleDeletePrimary}
        onSecondaryAction={handleDeleteSecondary}
      />
    </div>
  );
}
