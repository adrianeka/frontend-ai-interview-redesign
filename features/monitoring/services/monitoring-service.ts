import api from "@/lib/axios";
import {
  MonitoringTask,
  MonitoringPageResponse,
  MonitoringFilters,
} from "../types/monitoring-types";
import { getRoleName, getUserId } from "@/lib/auth";

export const monitoringService = {
  /**
   * Fetches paginated monitoring tasks from GET /api/monitoring
   */
  getTasks: async (
    filters: MonitoringFilters
  ): Promise<MonitoringPageResponse> => {
    const params: Record<string, unknown> = {
      page: filters.page ?? 0,
      size: filters.size ?? 10,
    };

    if (filters.search) {
      params.search = filters.search;
    }

    // status filter: only send to backend if not "all"
    if (filters.status && filters.status !== "all") {
      params.sortBy = ["status"];
    }

    const role = getRoleName();
    let url = `/monitoring`;
    
    if (role === "Candidate") {
      const userId = getUserId();
      params.userId = userId;
    }

    const response = await api.get<MonitoringPageResponse>(url, {
      params,
    });

    const content = response.data?.content ?? [];

    if (filters.status && filters.status !== "all") {
      const filtered = content.filter(
        (task: MonitoringTask) => task.status === filters.status
      );
      return {
        ...response.data,
        content: filtered,
        numberOfElements: filtered.length,
      };
    }

    return { ...response.data, content };
  },
};
