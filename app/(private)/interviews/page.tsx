"use client";

import * as React from "react";
import { Plus, Loader2, X } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { FilterSection } from "@/features/interviews/components/filter-section";
import { InterviewCard } from "@/features/interviews/components/interview-card";
import { CreateInterviewModal } from "@/features/interviews/components/create-interview-modal";
import { EditInterviewModal } from "@/features/interviews/components/edit-interview-modal";
import { InterviewAlertModal, AlertType } from "@/features/interviews/components/interview-alert-modal";
import { SidePanel } from "@/features/interviews/components/side-panel";
import { cn } from "@/lib/utils";
import { interviewService } from "@/features/interviews/services/interview-service";
import { Interview, PaginatedResponse, InterviewFilters, EditInterviewData } from "@/features/interviews/types/interview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InterviewsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [currentEditData, setCurrentEditData] = React.useState<EditInterviewData | null>(null);

  const [currentDeleteId, setCurrentDeleteId] = React.useState<string | null>(null);
  const [deleteAlertType, setDeleteAlertType] = React.useState<AlertType | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [selectedInterview, setSelectedInterview] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState<PaginatedResponse<Interview> | null>(null);

  const [filters, setFilters] = React.useState({
    search: "",
    company: "all",
    type: "all",
    level: "all",
    status: "all",
  });

  const [appliedFilters, setAppliedFilters] = React.useState({
    search: "",
    company: "all",
    type: "all",
    level: "all",
    status: "all",
  });

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [availableLevels, setAvailableLevels] = React.useState<string[]>([]);

  const fetchInterviews = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await interviewService.getInterviews({
        ...appliedFilters,
        page,
        size: pageSize
      });
      setData(result);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, appliedFilters, pageSize]);


  React.useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  React.useEffect(() => {
    if (data?.content) {
      const newLevels = Array.from(new Set(data.content.map(item => item.levelTarget).filter(Boolean)));
      setAvailableLevels(prev => {
        const combined = Array.from(new Set([...prev, ...newLevels]));
        return combined as string[];
      });
    }
  }, [data]);

  const handleSearch = () => {
    setAppliedFilters(filters);
    setPage(0); // Reset to first page on new search
  };

  const handleEditClick = async (interview: any) => {
    try {
      const detailedInterview = await interviewService.getInterviewById(interview.id);
      setCurrentEditData({
        id: detailedInterview.id,
        name: detailedInterview.name,
        companyNamePartner: detailedInterview.companyNamePartner || "",
        description: detailedInterview.description,
        context: detailedInterview.context,
        objective: detailedInterview.objective,
        purpose: detailedInterview.purpose,
        roleTarget: detailedInterview.roleTarget,
        levelTarget: detailedInterview.levelTarget,
        technology: detailedInterview.technology,
        number: Array.isArray(detailedInterview.questions) ? detailedInterview.questions.length : (parseInt(detailedInterview.number as any, 10) || 0),
        language: detailedInterview.language || "EN",
        isEditable: (detailedInterview as any).isEditable ?? true,
      });
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch interview details for edit:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setCurrentDeleteId(id);
    setDeleteAlertType("confirmation");
  };

  const executeDelete = async () => {
    if (!currentDeleteId) return;
    setIsDeleting(true);
    try {
      await interviewService.deleteInterview(currentDeleteId);
      setDeleteAlertType("success");
    } catch (error) {
      console.error(error);
      setDeleteAlertType("error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeletePrimary = () => {
    if (deleteAlertType === "confirmation") {
      executeDelete();
    } else if (deleteAlertType === "success" || deleteAlertType === "error") {
      setDeleteAlertType(null);
      setCurrentDeleteId(null);
      if (deleteAlertType === "success") fetchInterviews();
    }
  };

  const handleDeleteSecondary = () => {
    if (deleteAlertType === "confirmation") {
      setDeleteAlertType(null);
      setCurrentDeleteId(null);
    } else if (deleteAlertType === "success") {
      setDeleteAlertType(null);
      setCurrentDeleteId(null);
      fetchInterviews();
    } else if (deleteAlertType === "error") {
      executeDelete();
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1); // API is 0-indexed
  };

  const removeFilter = (key: keyof typeof appliedFilters) => {
    const defaultVal = key === "search" ? "" : "all";
    const newFilters = { ...filters, [key]: defaultVal };
    setFilters(newFilters);
    setAppliedFilters(newFilters);
    setPage(0);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className={cn(
          "rounded-2xl border border-[#E2E4E6] bg-[#FAFAFA] p-6 transition-all duration-500 ease-in-out overflow-hidden",
          selectedInterview ? "lg:flex-1 w-full" : "w-full"
        )}>

          {/* Title and Action */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Interviews Management Board
              </h1>

              <p className="text-slate-500 text-sm mt-1">
                View and manage all your interview.
              </p>
            </div>

            <Button
              className="h-[44px] bg-[#0070c9] hover:bg-blue-700 text-white rounded-lg font-bold gap-2 px-6"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} />
              New Interview
            </Button>
          </div>

          {/* Filters */}
          <FilterSection
            isSidePanelOpen={!!selectedInterview}
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
            availableLevels={availableLevels}
          />

          {/* List Meta */}
          <div className="flex items-center justify-between mb-6 pb-2">
            <div className="flex items-center w-full">
              <span className="text-xs font-bold text-slate-400 tracking-wider pr-4">
                List
              </span>
              <div className="h-px flex-1 bg-[#E2E4E6]" />
            </div>

            <Select value={pageSize.toString()} onValueChange={(val) => {
              setPageSize(parseInt(val));
              setPage(0);
            }}>
              <SelectTrigger className="ml-4 h-auto p-0 border-none bg-transparent hover:bg-transparent focus:ring-0 w-auto gap-1 text-xs font-medium text-slate-500 shadow-none">
                <SelectValue placeholder={`${pageSize} Entries`} />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl border-[#E2E4E6] p-1 shadow-lg">
                <SelectItem value="10" className="rounded-lg py-2 cursor-pointer text-xs">10 Entries</SelectItem>
                <SelectItem value="25" className="rounded-lg py-2 cursor-pointer text-xs">25 Entries</SelectItem>
                <SelectItem value="50" className="rounded-lg py-2 cursor-pointer text-xs">50 Entries</SelectItem>
                <SelectItem value="100" className="rounded-lg py-2 cursor-pointer text-xs">100 Entries</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            {Object.entries(appliedFilters).map(([key, value]) => {
              if (key === "search" ? value === "" : value === "all") return null;

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
                    onClick={() => removeFilter(key as keyof typeof appliedFilters)}
                    className="rounded-full hover:bg-[#E5E7EB]"
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
              <div className={cn(
                "grid gap-6 transition-all duration-500 ease-in-out",
                selectedInterview
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              )}>
                {data?.content.map((item, index) => (
                  <InterviewCard
                    key={item.id || index}
                    id={item.id}
                    title={item.name}
                    company={{
                      companyNamePartner: item.companyNamePartner,
                      logo: "/Location.svg" // Fallback logo
                    }}
                    topCandidate={item.topCandidate || "0/0"}
                    type={item.purpose === "HIRING" ? "Hiring" : "Internal Assessment"}
                    level={item.levelTarget}
                    description={item.description}
                    isCompact={!!selectedInterview}
                    isEditable={(item as any).isEditable ?? true}
                    onClick={() => setSelectedInterview(item)}
                    onEdit={() => handleEditClick(item)}
                    onDelete={() => handleDeleteClick(item.id)}
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
    </>
  );
}
