"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    ArrowLeftIcon,
    EllipsisVerticalIcon,
    LinkIcon,
    PencilIcon,
    Trash2Icon,
    MapPinIcon,
    UserPlusIcon,
    CircleUserIcon,
    DotIcon,
    CircleIcon,
    CheckIcon,
    PlusIcon,
    XIcon,
    ClockIcon,
    SearchIcon,
    CircleXIcon,
    ChevronRightIcon,
    Loader2,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { interviewService } from "@/features/interviews/services/interview-service";
import { InterviewDetail, Candidate } from "@/features/interviews/types/interview";
import { EditInterviewModal, EditInterviewData } from "@/features/interviews/components/edit-interview-modal";
import { InterviewAlertModal, AlertType } from "@/features/interviews/components/interview-alert-modal";

// Color map for hire decision statuses — keyed by status string
const hiringColorMap: Record<string, { color: string; bgColor: string; iconBg: string; icon: React.ElementType; value: string }> = {
    "Strong Hire": { color: "#4BAC87", bgColor: "#EEF8F4", iconBg: "#C9EBDE", icon: CheckIcon, value: "strong-hire" },
    "Hire": { color: "#0076D2", bgColor: "#F1F9FA", iconBg: "#DBF2F3", icon: PlusIcon, value: "hire" },
    "Consider": { color: "#E8A01D", bgColor: "#FFF7E9", iconBg: "#FFE7BA", icon: ClockIcon, value: "consider" },
    "Reject": { color: "#E84E2C", bgColor: "#FFEEEA", iconBg: "#FFCBBF", icon: XIcon, value: "reject" },
};

const internalAssessmentColorMap: Record<string, { color: string; bgColor: string; iconBg: string; icon: React.ElementType; value: string }> = {
    "Ready for Promotion": { color: "#4BAC87", bgColor: "#EEF8F4", iconBg: "#C9EBDE", icon: CheckIcon, value: "ready-for-promotion" },
    "Meets Current Level": { color: "#0076D2", bgColor: "#F1F9FA", iconBg: "#DBF2F3", icon: PlusIcon, value: "meets-current-level" },
    "Needs Improvement": { color: "#E8A01D", bgColor: "#FFF7E9", iconBg: "#FFE7BA", icon: ClockIcon, value: "needs-improvement" },
    "Significant Improvement Required": { color: "#E84E2C", bgColor: "#FFEEEA", iconBg: "#FFCBBF", icon: XIcon, value: "significant-improvement-required" },
};

export default function InterviewDetailsPage() {
    const params = useParams();
    const id = params?.interviewId as string;

    const [mounted, setMounted] = useState(false);
    const [activeFilter, setActiveFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [interviewDetail, setInterviewDetail] = useState<InterviewDetail | null>(null);
    const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [retryTrigger, setRetryTrigger] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentEditData, setCurrentEditData] = useState<EditInterviewData | null>(null);
    const [deleteAlertType, setDeleteAlertType] = useState<AlertType | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const isInternal = interviewDetail?.purpose === "INTERNAL_ASSESSMENT" || interviewDetail?.purpose === "INTERNAL_ASSESMENT";
    const activeColorMap = isInternal ? internalAssessmentColorMap : hiringColorMap;

    // Helper to translate filter slug back to display label
    const getActiveFilterLabel = (filter: string) => {
        const found = Object.entries(activeColorMap).find(([_, cfg]) => cfg.value === filter);
        return found ? found[0] : filter;
    };

    // Helper to map backend recommendation string strictly to one of our UI status keys
    const mapRecommendationToStatusKey = (rec: string | null | undefined): string | null => {
        if (!rec) return null;
        
        const lower = rec.toLowerCase();
        
        if (lower === "strong hire" || lower === "strong-hire") return "Strong Hire";
        if (lower === "hire") return "Hire";
        if (lower === "consider") return "Consider";
        if (lower === "reject") return "Reject";
        
        if (lower === "ready for promotion" || lower === "ready-for-promotion") return "Ready for Promotion";
        if (lower === "meets current level" || lower === "meets-current-level") return "Meets Current Level";
        if (lower === "needs improvement" || lower === "needs-improvement") return "Needs Improvement";
        if (lower === "significant improvement required" || lower === "significant-improvement-required") return "Significant Improvement Required";
        
        return null;
    };

    // Helper to format startedAt ISO date string to standard format: "HH:MM | DD/MM/YYYY"
    const formatInterviewTime = (isoString: string) => {
        try {
            const date = new Date(isoString);
            const pad = (n: number) => n.toString().padStart(2, '0');
            const hours = pad(date.getHours());
            const minutes = pad(date.getMinutes());
            const day = pad(date.getDate());
            const month = pad(date.getMonth() + 1);
            const year = date.getFullYear();
            return `${hours}:${minutes} | ${day}/${month}/${year}`;
        } catch {
            return isoString;
        }
    };

    // Helper to format average score nicely (renders "-" instead of empty when null)
    const formatScore = (score: number | null | undefined) => {
        if (score === null || score === undefined) return "-";
        return Number(score).toFixed(1).replace(/\.0$/, "");
    };

    // Fetch initial details and candidates list once
    useEffect(() => {
        if (!id) return;
        
        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const detail = await interviewService.getInterviewById(id);
                setInterviewDetail(detail);

                const fullList = await interviewService.getCandidates(id);
                setAllCandidates(fullList);
                setCandidates(fullList);
            } catch (err: any) {
                console.error("Error fetching initial data:", err);
                setError(err.message || "Failed to load data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [id, retryTrigger]);

    // Calculate dynamic status counts based on full candidates list
    const statusCounts = React.useMemo(() => {
        const counts: Record<string, number> = {};
        Object.keys(activeColorMap).forEach(key => counts[key] = 0);
        
        allCandidates.forEach(c => {
            const statusKey = mapRecommendationToStatusKey(c.recommendation);
            if (statusKey && counts[statusKey] !== undefined) {
                counts[statusKey]++;
            }
        });
        return counts;
    }, [allCandidates, activeColorMap]);

    const totalCandidatesCount = allCandidates.length;

    // Fetch filtered candidates
    const fetchFilteredCandidates = async (filterValue: string) => {
        setIsLoading(true);
        try {
            const list = await interviewService.getCandidates(id, filterValue || undefined);
            setCandidates(list);
        } catch (err: any) {
            console.error("Error fetching filtered candidates:", err);
            toast.error("Failed to fetch filtered candidates.");
        } finally {
            setIsLoading(false);
        }
    };

    // Filter candidates by search query client-side
    // (Status filter is applied via backend hit)
    const filteredCandidates = React.useMemo(() => {
        return candidates.filter(c => {
            // 1. Search Query Filter
            if (searchQuery) {
                return c.name.toLowerCase().includes(searchQuery.toLowerCase());
            }
            
            return true;
        });
    }, [candidates, searchQuery]);

    // Pagination calculations
    const totalEntries = filteredCandidates.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage) || 1;
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
    const currentCandidates = React.useMemo(() => {
        return filteredCandidates.slice(startIndex, endIndex);
    }, [filteredCandidates, startIndex, endIndex]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Smart pagination range builder
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("ellipsis-1");
            
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            
            if (currentPage < totalPages - 2) pages.push("ellipsis-2");
            pages.push(totalPages);
        }
        return pages;
    };

    // Required tech stack parsing
    const techStack = React.useMemo(() => {
        if (!interviewDetail?.technology) return [];
        return interviewDetail.technology.split(",").map(t => t.trim()).filter(Boolean);
    }, [interviewDetail?.technology]);

    if (isLoading && !interviewDetail) {
        return (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center bg-[#FAFAFA]">
                <Loader2 className="w-8 h-8 animate-spin text-[#0076D2]" />
            </div>
        );
    }

    const handleRetry = () => {
        setRetryTrigger(prev => prev + 1);
    };

    const handleEditClick = () => {
        if (!interviewDetail) return;
        setCurrentEditData({
            id: interviewDetail.id,
            name: interviewDetail.name,
            companyNamePartner: interviewDetail.companyNamePartner || "",
            description: interviewDetail.description,
            context: interviewDetail.context,
            objective: interviewDetail.objective,
            purpose: interviewDetail.purpose,
            roleTarget: interviewDetail.roleTarget,
            levelTarget: interviewDetail.levelTarget,
            technology: interviewDetail.technology,
            number: (interviewDetail as any).number || 0,
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = () => {
        setDeleteAlertType("confirmation");
    };

    const executeDelete = async () => {
        setIsDeleting(true);
        try {
            await interviewService.deleteInterview(id);
            setDeleteAlertType("success");
        } catch (err) {
            console.error(err);
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
            if (deleteAlertType === "success") router.push("/interviews");
        }
    };

    const handleDeleteSecondary = () => {
        if (deleteAlertType === "confirmation") {
            setDeleteAlertType(null);
        } else if (deleteAlertType === "success") {
            setDeleteAlertType(null);
            router.push("/interviews");
        } else if (deleteAlertType === "error") {
            executeDelete();
        }
    };

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

    return (
        <Card className="bg-[#FAFAFA] p-4 sm:p-6">
            {/* Top Action Bar */}
            <CardHeader className="flex flex-row items-center justify-between w-full ">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="text-muted-foreground"
                    onClick={() => router.push("/interviews")}
                >
                    <ArrowLeftIcon />
                    Back
                </Button>

                <div className="flex items-center gap-2">
                    {/* Copy Link */}
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
                        <LinkIcon />
                    </Button>

                    {/* More Options */}
                    {mounted ? (
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
                            <DropdownMenuContent>
                                {/* Edit */}
                                <DropdownMenuItem 
                                    className="gap-2 font-medium py-2 cursor-pointer text-[#707784]" 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        handleEditClick();
                                    }}
                                >
                                    <PencilIcon className="w-4 h-4" /> Edit
                                </DropdownMenuItem>

                                {/* Delete */}
                                <DropdownMenuItem 
                                    className="gap-2 text-destructive font-medium py-2 cursor-pointer"
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        handleDeleteClick();
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

            {/* Content */}
            <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">

                    {/* Location and Status Badge */}
                    <div className="flex flex-row flex-wrap gap-2 h-fit items-center">
                        {interviewDetail?.companyNamePartner && (
                            <Badge variant="outline" className="px-2 py-1.25 rounded-sm h-fit w-fit bg-[#F5F5F5] border border-[#E2E4E6]">
                                <MapPinIcon color="#3366FF" data-icon="inline-start" />
                                <span className="text-sm font-medium text-[#43474F]">
                                    {interviewDetail.companyNamePartner}
                                </span>
                            </Badge>
                        )}

                        <Badge className="bg-[#3366FF] text-[#FAFAFA] px-2 py-1.25 h-fit w-fit">
                            <UserPlusIcon color="#FAFAFA" data-icon="inline-start" />
                            <span className="text-xs font-medium">
                                {interviewDetail?.purpose === "HIRING" ? "Hiring" : "Internal Assessment"}
                            </span>
                        </Badge>

                        <Badge className="text-[#3366FF] border-[#3366FF] bg-[#F1F9FA] border px-2 py-1.25 h-fit w-fit">
                            <CircleUserIcon color="#3366FF" data-icon="inline-start" />
                            <span className="text-xs font-medium">
                                {interviewDetail?.levelTarget || "Junior"}
                            </span>
                        </Badge>

                        <Separator orientation="vertical" className="hidden sm:block h-4" />

                        <p className="text-[#A9ADB5] text-sm">{totalCandidatesCount} Candidates</p>
                    </div>

                    <div className="space-y-1">
                        {/* Title */}
                        <h1 className="text-[#2D2F35] text-2xl sm:text-3xl font-bold">
                            {interviewDetail?.name || "Position Details"}
                        </h1>

                        {/* Description */}
                        <p className="text-[#707784] text-base sm:text-lg font-normal">
                            {interviewDetail?.description || "No description provided."}
                        </p>
                    </div>

                    {/* Requirement section */}
                    <Accordion type="single" collapsible defaultValue="item-1">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="justify-start gap-1.5 text-[#A9ADB5] text-sm [&_svg]:ml-0!">
                                Required Tech Stack(s)
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-wrap gap-1.5 py-3 px-4 border-l-4 border-[#E2E4E6]">
                                {techStack.length > 0 ? (
                                    techStack.map((item, index) => (
                                        <Badge key={index} className="bg-[#F2F2F2] font-medium text-[#595F6A] text-xs py-1 px-2 h-fit w-fit">
                                            <DotIcon strokeWidth={8} data-icon="inline-start" />
                                            {item}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-xs text-[#8C929D] italic">No technical stack specified</span>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Filter section */}
                <div className="grid grid-cols-2 md:flex md:flex-row gap-3 md:gap-4 w-full">
                    {Object.entries(activeColorMap).map(([label, cfg], index) => {
                        const isActive = activeFilter === cfg.value;
                        return (
                            <Button
                                key={index}
                                variant="outline"
                                disabled={isLoading}
                                onClick={() => {
                                    if (isLoading) return;
                                    const newFilter = activeFilter === cfg.value ? "" : cfg.value;
                                    setActiveFilter(newFilter);
                                    setCurrentPage(1);
                                    fetchFilteredCandidates(newFilter);
                                }}
                                style={isActive ? { borderColor: cfg.color, backgroundColor: cfg.bgColor } : {}}
                                className="flex-1 w-full h-fit bg-[#FAFAFA] flex flex-col items-start gap-2 border-2 border-[#E2E4E6] px-4 py-3 rounded-lg cursor-pointer"
                            >
                                <p className="text-sm text-[#595F6A] font-semibold">{label}</p>

                                <div className="w-full flex flex-row gap-2 items-center">
                                    <div
                                        style={{ backgroundColor: cfg.iconBg }}
                                        className="h-11 w-11 aspect-square border border-[#F1F9FA] flex justify-center items-center rounded-lg"
                                    >
                                        <CircleIcon size={48} fill={cfg.color} color={cfg.color}>
                                            <cfg.icon
                                                color={cfg.iconBg}
                                                size={16}
                                                strokeWidth={5}
                                                x={4}
                                                y={4}
                                            />
                                        </CircleIcon>
                                    </div>
                                    <p className="text-3xl font-bold min-w-[4ch] text-start text-[#43474F]">
                                        {statusCounts[label as keyof typeof statusCounts] || 0}
                                    </p>
                                </div>
                            </Button>
                        );
                    })}
                </div>

                {/* List section */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:items-center">
                    <div className="flex items-center gap-2 flex-1 w-full">
                        <h4 className="text-sm text-[#A9ADB5]">List</h4>
                        <Separator orientation="horizontal" className="flex-1" />
                    </div>

                    <div className="flex flex-row gap-2 w-full sm:w-auto items-center justify-between sm:justify-end">
                        {/* Search input */}
                        <InputGroup className="w-full sm:w-auto shrink-0 flex-1 sm:flex-none">
                            <InputGroupInput
                                placeholder="Search Candidates..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                        </InputGroup>

                        {/* Entries per page */}
                        <Select
                            value={entriesPerPage.toString()}
                            onValueChange={(val) => {
                                setEntriesPerPage(parseInt(val));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-fit min-w-16 border-0 shadow-none">
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
                            <CircleXIcon data-icon="inline-end" />
                        </Badge>
                    ))}
                </div>

                {/* Candidate list */}
                <div className="flex flex-col divide-y divide-[#E2E4E6] gap-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-[#0076D2]" />
                            <span className="ml-2 text-[#707784] font-medium">Filtering candidates...</span>
                        </div>
                    ) : currentCandidates.length > 0 ? (
                        currentCandidates.map((candidate, index) => {
                            const rec = candidate.recommendation;
                            const mappedKey = mapRecommendationToStatusKey(rec);
                            const colorCfg = mappedKey && activeColorMap[mappedKey]
                                ? activeColorMap[mappedKey]
                                : { color: "#595F6A", bgColor: "#F2F2F2" }; // sleek neutral gray for custom recommendations
                            return (
                                <Card key={candidate.participantId || index} className="flex flex-row p-4 sm:px-1.25 sm:py-2 ring-0 items-center justify-between w-full">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center flex-1 gap-3 sm:gap-6 w-full">
                                        {rec && (
                                            <div className="min-w-0 sm:min-w-32 shrink-0 max-w-full sm:max-w-64">
                                                <Badge
                                                    variant="outline"
                                                    style={{ borderColor: colorCfg.color, color: colorCfg.color, backgroundColor: colorCfg.bgColor }}
                                                    className="py-1 px-2 text-sm font-medium whitespace-normal wrap-break-word text-left"
                                                >
                                                    {mappedKey || rec}
                                                </Badge>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-0 items-start sm:items-center justify-between pr-4">
                                            <div className="flex flex-col gap-1 sm:gap-2 justify-center flex-1">
                                                <p className="text-[#43474F] font-semibold text-lg">{candidate.name}</p>
                                                <p className="text-sm">
                                                    <span className="text-[#8C929D]">
                                                        Technical ({formatScore(candidate.avgTechnicalFundamentalScore)}%)  •  Problem Solving ({formatScore(candidate.avgProblemSolvingScore)}%)  •  Communication ({formatScore(candidate.avgCommunicationScore)}%)
                                                    </span>{" "}
                                                    <span className="text-[#707784] font-medium whitespace-nowrap">Total Score ({formatScore(candidate.totalScore)}%)</span>
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-0.5 sm:gap-2 justify-center shrink-0">
                                                <p className="text-[#A9ADB5] text-xs sm:text-sm font-medium">
                                                    Interview Time:
                                                </p>
                                                <p className="text-[#707784] text-sm font-medium">
                                                    {formatInterviewTime(candidate.startedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button 
                                        variant="ghost" 
                                        size="icon-lg" 
                                        className="shrink-0"
                                        onClick={() => router.push(`/interviews/${id}/${candidate.candidateId}`)}
                                    >
                                        <ChevronRightIcon color="#0076D2" />
                                    </Button>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 text-[#A9ADB5] font-medium">
                            No candidates found for the current filters.
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="flex w-full items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
                    {/* Showing entries */}
                    <p className="text-[#A9ADB5] italic text-sm text-center sm:text-left">
                        {totalEntries > 0 
                            ? `Showing ${startIndex + 1} to ${endIndex} of ${totalEntries} entries`
                            : "Showing 0 to 0 of 0 entries"}
                    </p>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination className="w-fit mx-0">
                            <PaginationContent className="[&_a[data-active='true']]:bg-[#DBF2F3] [&_a[data-active='true']]:text-[#0076D2]">
                                <PaginationItem>
                                    <PaginationFirst href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }} />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationPrevious text="" href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} />
                                </PaginationItem>
                                
                                {getPageNumbers().map((p, index) => {
                                    if (p === "ellipsis-1" || p === "ellipsis-2") {
                                        return (
                                            <PaginationItem key={`ellipsis-${index}`}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }
                                    const pageNum = p as number;
                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink 
                                                href="#" 
                                                onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                                                isActive={currentPage === pageNum}
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext text="" href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLast href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </CardContent>

            {/* Modals */}
            <EditInterviewModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                availableLevels={interviewDetail?.levelTarget ? [interviewDetail.levelTarget] : []}
                initialData={currentEditData}
                onSuccess={() => {
                    setIsEditModalOpen(false);
                    // trigger re-fetch to reflect updated detail
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