import { useState, useEffect, useCallback } from "react";
import { monitoringService } from "../services/monitoring-service";
import { MonitoringTask, MonitoringFilters } from "../types/monitoring-types";

export function useMonitoringList() {
  const [tasks, setTasks] = useState<MonitoringTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<MonitoringFilters>({
    search: "",
    status: "all",
    page: 0,
    size: 10,
  });

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await monitoringService.getTasks(filters);
      setTasks(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch monitoring tasks", error);
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
    filters,
    setFilters,
    removeFilter,
    refetch: fetchTasks,
    totalElements,
    totalPages,
  };
}
