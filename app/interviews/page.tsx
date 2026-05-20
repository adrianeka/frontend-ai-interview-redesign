"use client";

import * as React from "react";
import { Plus, ChevronDown, Loader2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { FilterSection } from "@/features/interviews/components/filter-section";
import { InterviewCard } from "@/features/interviews/components/interview-card";
import { CreateInterviewModal } from "@/features/interviews/components/create-interview-modal";
import { SidePanel } from "@/features/interviews/components/side-panel";
import { cn } from "@/lib/utils";
import { interviewService } from "@/features/interviews/services/interview-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApiResponse {
  content: any[];
  totalPages: number;
  totalElements: number;
  size: number;
  pageable: {
    pageNumber: number;
  };
}

export default function InterviewsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedInterview, setSelectedInterview] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState<ApiResponse | null>(null);

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1); // API is 0-indexed
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className={cn(
            "rounded-2xl border border-[#E2E4E6] bg-white p-6 transition-all duration-500 ease-in-out overflow-hidden",
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
                      title={item.name}
                      company={{
                        companyNamePartner: item.companyNamePartner,
                        logo: "/Location.svg" // Fallback logo
                      }}
                      progress={{
                        current: item.isAnswered ? 10 : 0, // Mocked progress
                        total: 10
                      }}
                      type={item.purpose === "HIRING" ? "Hiring" : "Internal Assessment"}
                      level={item.levelTarget}
                      description={item.description}
                      isCompact={!!selectedInterview}
                      onClick={() => setSelectedInterview(item)}
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
              interview={{
                title: selectedInterview.name,
                type: selectedInterview.purpose === "HIRING" ? "Hiring" : "Internal Assessment",
                level: selectedInterview.levelTarget,
                description: selectedInterview.description,
                sessionName: selectedInterview.name,
                techStack: selectedInterview.technology,
                context: selectedInterview.context,
                objective: selectedInterview.objective,
                questions: [] // Questions are not in the list response
              }}
              onClose={() => setSelectedInterview(null)}
            />
          )}
        </div>
      </main>

      <Footer />

      <CreateInterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
