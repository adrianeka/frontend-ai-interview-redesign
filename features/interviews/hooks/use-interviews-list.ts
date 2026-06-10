"use client";

import { useState, useEffect, useCallback } from "react";
import { interviewService } from "@/features/interviews/services/interview-service";
import { Interview, PaginatedResponse, EditInterviewData } from "@/features/interviews/types/interview";
import { AlertType } from "@/features/interviews/components/interview-alert-modal";

/**
 * Custom hook to manage state and logic for the Interviews List View.
 * Handles server-side pagination, fetching interview lists, local storage filtering,
 * and state management for editing/deleting interviews.
 */
export function useInterviewsList() {
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditData, setCurrentEditData] = useState<EditInterviewData | null>(null);

  // Delete Confirmation States
  const [currentDeleteId, setCurrentDeleteId] = useState<string | null>(null);
  const [deleteAlertType, setDeleteAlertType] = useState<AlertType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Data & Loading States
  const [selectedInterview, setSelectedInterview] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<PaginatedResponse<Interview> | null>(null);

  // Pagination & Filter States
  const [filters, setFilters] = useState(() => {
    if (typeof window === "undefined") return { company: "all", type: "all", level: "all", status: "all" };
    try {
      const saved = localStorage.getItem("interviewFilters");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          company: parsed.company || "all",
          type: parsed.type || "all",
          level: parsed.level || "all",
          status: parsed.status || "all",
        };
      }
    } catch (e) { }
    return { company: "all", type: "all", level: "all", status: "all" };
  });

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);

  /**
   * Fetches the paginated list of interviews from the backend based on current filters.
   */
  const fetchInterviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await interviewService.getInterviews({
        ...filters,
        page,
        size: pageSize
      });
      setData(result);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, filters, pageSize]);

  // Persist filters to localStorage
  useEffect(() => {
    localStorage.setItem("interviewFilters", JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  useEffect(() => {
    if (data?.content) {
      const newLevels = Array.from(new Set(data.content.map(item => item.levelTarget).filter(Boolean)));
      setAvailableLevels(prev => {
        const combined = Array.from(new Set([...prev, ...newLevels]));
        return combined as string[];
      });
    }
  }, [data]);

  /**
   * Opens the edit modal and populates it with detailed interview data.
   */
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

  /**
   * Prepares the deletion flow for a specific interview ID.
   */
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

  /**
   * Removes a specific active filter and resets pagination.
   */
  const removeFilter = (key: keyof typeof filters) => {
    const newFilters = { ...filters, [key]: "all" };
    setFilters(newFilters);
    setPage(0);
  };

  return {
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
    fetchInterviews,
    handleEditClick,
    handleDeleteClick,
    handleDeletePrimary,
    handleDeleteSecondary,
    handlePageChange,
    removeFilter
  };
}
