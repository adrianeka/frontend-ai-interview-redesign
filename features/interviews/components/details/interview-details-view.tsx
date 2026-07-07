"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    ArrowLeftIcon,
    EllipsisVerticalIcon,
    Loader2,
    PencilIcon,
    Trash2Icon,
    CircleXIcon
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { EditInterviewModal } from "@/features/interviews/components/edit-interview-modal";
import { InterviewAlertModal } from "@/features/interviews/components/interview-alert-modal";
import { SearchBar } from "@/components/searchbar";
import { InterviewGeneralInfo } from "@/features/interviews/components/details/interview-general-info";
import { InterviewFilterGroup } from "@/features/interviews/components/details/interview-filter-group";
import { InterviewCandidateList } from "@/features/interviews/components/details/interview-candidate-list";
import { useInterviewDetails } from "@/features/interviews/hooks/use-interview-details";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/**
 * Main View component for the Interview Details page.
 * Displays interview metadata, filtering/search controls, and delegating candidate list rendering
 * to the InterviewCandidateList component.
 * Integrates directly with the `useInterviewDetails` hook for state and action dispatching.
 */
export function InterviewDetailsView() {
    const {
        id,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        entriesPerPage,
        setEntriesPerPage,
        currentPage,
        setCurrentPage,
        interviewDetail,
        allCandidates,
        isLoading,
        error,
        isEditModalOpen,
        setIsEditModalOpen,
        currentEditData,
        deleteAlertType,
        isDeleting,
        activeColorMap,
        getActiveFilterLabel,
        fetchFilteredCandidates,
        currentCandidates,
        totalEntries,
        totalPages,
        startIndex,
        endIndex,
        handlePageChange,
        techStack,
        handleRetry,
        handleEditClick,
        handleDeleteClick,
        handleDeletePrimary,
        handleDeleteSecondary,
        setRetryTrigger,
        router
    } = useInterviewDetails();

    const hasCandidates = allCandidates && allCandidates.length > 0;

    if (error) {
        return (
            <Card className="bg-[#FAFAFA] p-6 text-center border-2 border-red-100 max-w-lg mx-auto mt-10">
                <p className="text-red-500 font-semibold mb-4 text-lg">Error Loading Page</p>
                <p className="text-slate-600 mb-6 text-sm">{error}</p>
                <Button onClick={handleRetry} className="bg-[#0076D2] text-white hover:bg-[#005ba3]">
                    Retry Fetching
                </Button>
            </Card>
        );
    }

    const totalCandidatesCount = allCandidates.length;

    if (isLoading && !interviewDetail) {
        /*
         * Full-Page Skeleton State
         * Shown on initial load before metadata is available to prevent 
         * flashing default fallback values in the header. 
         */
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="w-8 h-8 animate-spin text-[#0076D2]" />
            </div>
        );
    }


    return (
        <Card className="bg-[#FAFAFA] p-4 sm:p-6 shadow-none border-none">
            {/* Top Action Bar: Back Navigation and Link Copy */}
            <CardHeader className="flex flex-row items-center justify-between w-full p-0 mb-4 sm:mb-6">
                <Button
                    variant="ghost"
                    className="text-muted-foreground"
                    onClick={() => router.push("/interviews")}
                >
                    <ArrowLeftIcon />
                    Back
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#707784]"
                        onClick={() => {
                            if (typeof window !== "undefined") {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link copied!");
                            }
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-link-2"
                        >
                            <path d="M9 17H7A5 5 0 0 1 7 7h2" />
                            <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
                            <line x1="8" x2="16" y1="12" y2="12" />
                        </svg>
                    </Button>

                    {interviewDetail ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-[#707784]"
                                >
                                    <EllipsisVerticalIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-[#E2E4E6]">
                                <DropdownMenuItem
                                    className={cn(
                                        "flex items-center gap-2 font-medium py-2 text-[#707784]",
                                        hasCandidates ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                    )}
                                    title={hasCandidates ? "Cannot edit: candidates exist" : ""}
                                    disabled={hasCandidates}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!hasCandidates) handleEditClick();
                                    }}
                                >
                                    <PencilIcon className="w-4 h-4" /> Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    className={cn(
                                        "gap-2 text-destructive font-medium py-2",
                                        hasCandidates ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                    )}
                                    title={hasCandidates ? "Cannot delete: candidates exist" : ""}
                                    disabled={hasCandidates}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!hasCandidates) handleDeleteClick();
                                    }}
                                >
                                    <Trash2Icon className="w-4 h-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#707784]"
                        >
                            <EllipsisVerticalIcon />
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-6 p-0">
                {/* 
                 * General Info Section:
                 * Renders interview description, purpose, required tech stack, 
                 * and the overall candidate count.
                 */}
                <InterviewGeneralInfo
                    interviewDetail={interviewDetail}
                    totalCandidatesCount={totalCandidatesCount}
                    techStack={techStack}
                />

                {/* 
                 * Status Filter Group:
                 * Renders clickable badges for different recommendation statuses (Strong Hire, Reject, etc).
                 */}
                <InterviewFilterGroup
                    activeFilter={activeFilter}
                    activeColorMap={activeColorMap}
                    candidates={allCandidates}
                    isLoading={isLoading}
                    onFilterChange={(newFilter) => {
                        setActiveFilter(newFilter);
                        setCurrentPage(1);
                        fetchFilteredCandidates(newFilter);
                    }}
                />

                {/* List and Pagination Controls Header */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:items-center">
                    <div className="flex items-center gap-2 flex-1 w-full">
                        <h4 className="text-sm text-[#A9ADB5]">List</h4>
                        <Separator orientation="horizontal" className="flex-1" />
                    </div>

                    <div className="flex flex-row gap-2 w-full sm:w-auto items-center justify-between sm:justify-end">
                        {/* Search Bar for Client-Side Filtering */}
                        <div className="w-full sm:w-[280px] shrink-0 flex-1 sm:flex-none">
                            <SearchBar
                                placeholder="Search Candidates..."
                                value={searchQuery}
                                showLabel={false}
                                onChange={(val) => {
                                    setSearchQuery(val);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        {/* Entries per page */}
                        <Select
                            value={entriesPerPage.toString()}
                            onValueChange={(val) => {
                                setEntriesPerPage(parseInt(val));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="ml-4 h-auto p-0 border-none bg-transparent hover:bg-transparent focus:ring-0 w-auto gap-1 text-xs font-medium text-slate-500 shadow-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="10">10 Entries</SelectItem>
                                    <SelectItem value="25">25 Entries</SelectItem>
                                    <SelectItem value="50">50 Entries</SelectItem>
                                    <SelectItem value="100">100 Entries</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* List filter summary */}
                <div className="flex flex-row flex-wrap gap-2">
                    {[
                        activeFilter && {
                            label: getActiveFilterLabel(activeFilter),
                            clear: () => {
                                setActiveFilter("");
                                setCurrentPage(1);
                                fetchFilteredCandidates("");
                            }
                        },
                        searchQuery && { label: searchQuery, clear: () => setSearchQuery("") },
                    ].filter(Boolean).map((item: any, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            onClick={item.clear}
                            className="text-[#595F6A] px-2 py-1.5 w-fit h-fit bg-[#F2F2F2] cursor-pointer"
                        >
                            <span className="text-xs">{item.label}</span>
                            <CircleXIcon className="w-3.5 h-3.5 ml-1 inline-block" />
                        </Badge>
                    ))}
                </div>

                {/* Candidate list & pagination */}
                <InterviewCandidateList
                    isLoading={isLoading}
                    currentCandidates={currentCandidates}
                    activeColorMap={activeColorMap}
                    interviewId={id}
                    totalEntries={totalEntries}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    entriesPerPage={entriesPerPage}
                    onPageChange={handlePageChange}
                />
            </CardContent>

            {/* Modals */}
            <EditInterviewModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                availableLevels={interviewDetail?.levelTarget ? [interviewDetail.levelTarget] : []}
                initialData={currentEditData}
                onSuccess={() => {
                    setIsEditModalOpen(false);
                    setRetryTrigger(prev => prev + 1);
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
        </Card>
    );
}
