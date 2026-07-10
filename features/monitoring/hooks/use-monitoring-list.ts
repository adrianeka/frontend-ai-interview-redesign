/*
edit start
by: Zahra Hilyatul J
date: 2026-06-29
description: Created hook for monitoring list data fetching
*/
import { useState, useEffect, useCallback } from "react";
import { monitoringService } from "../services/monitoring-service";
import { MonitoringTask, MonitoringFilters } from "../types/monitoring-types";

export function useMonitoringList() {
  const [tasks, setTasks] = useState<MonitoringTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MonitoringFilters>({
    search: "",
    status: "all",
    page: 0,
    size: 10,
  });

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await monitoringService.getTasks(filters);
      setTasks(data.content ?? []);
      setTotalElements(data.totalElements ?? 0);
      setTotalPages(data.totalPages ?? 0);
    } catch (err: any) {
      console.error("Failed to fetch monitoring tasks", err);
      setError(err.message ?? "Failed to fetch monitoring tasks");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const removeFilter = (key: keyof MonitoringFilters) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === "search" ? "" : key === "page" ? 0 : "all",
    }));
  };

  return {
    tasks,
    isLoading,
    error,
    filters,
    setFilters,
    removeFilter,
    refetch: fetchTasks,
    totalElements,
    totalPages,
  };
}
/*
edit end
*/
