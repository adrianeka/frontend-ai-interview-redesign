"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { interviewService } from "@/features/interviews/services/interview-service";
import { InterviewDetail, Candidate, EditInterviewData } from "@/features/interviews/types/interview";
import { AlertType } from "@/features/interviews/components/interview-alert-modal";
import { hiringColorMap, internalAssessmentColorMap } from "@/features/interviews/utils/recommendation";

export function useInterviewDetails() {
    const params = useParams();
    const id = params?.interviewId as string;
    const router = useRouter();

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

    // Fetch initial details and candidates list once
    useEffect(() => {
        if (!id) return;

        const initLoad = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [detail, list] = await Promise.all([
                    interviewService.getInterviewById(id),
                    interviewService.getCandidates(id),
                ]);
                setInterviewDetail(detail);
                setAllCandidates(list);
                setCandidates(list);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load interview details.");
            } finally {
                setIsLoading(false);
            }
        };

        initLoad();
    }, [id, retryTrigger]);

    // Fetch filtered candidates
    const fetchFilteredCandidates = async (filterValue: string) => {
        setIsLoading(true);
        try {
            const list = await interviewService.getCandidates(id, filterValue || undefined);
            setCandidates(list);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to apply filter.");
        } finally {
            setIsLoading(false);
        }
    };

    // Multi-criteria client-side searching
    const filteredCandidates = useMemo(() => {
        if (!searchQuery) return candidates;
        const q = searchQuery.toLowerCase();
        return candidates.filter((c) => {
            if (c.name?.toLowerCase().includes(q)) return true;
            if (c.recommendation?.toLowerCase().includes(q)) return true;
            if (c.totalScore?.toString().includes(q)) return true;
            return false;
        });
    }, [candidates, searchQuery]);

    // Pagination calculations
    const totalEntries = filteredCandidates.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage) || 1;
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
    const currentCandidates = useMemo(() => {
        return filteredCandidates.slice(startIndex, endIndex);
    }, [filteredCandidates, startIndex, endIndex]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Required tech stack parsing
    const techStack = useMemo(() => {
        if (!interviewDetail?.technology) return [];
        return interviewDetail.technology.split(",").map(t => t.trim()).filter(Boolean);
    }, [interviewDetail?.technology]);

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

    return {
        id,
        mounted,
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
        candidates,
        isLoading,
        error,
        isEditModalOpen,
        setIsEditModalOpen,
        currentEditData,
        deleteAlertType,
        setDeleteAlertType,
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
    };
}
