/*
edit start
by: Zahra Hilyatul J
date: 2026-06-29
description: Created service for fetching monitoring tasks
*/
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

    /*
    edit start
    by: Zahra
    date: 2026-07-17
    description: Fixed status filter — previously the status was NOT sent to the
                 backend and was instead filtered client-side on only the current
                 page's data, causing incorrect results and wrong pagination counts.
                 Backend already supports ?status=FAILED etc., so we send it directly.
    */
    if (filters.status && filters.status !== "all") {
      params.status = filters.status;
    }
    /*
    edit end
    */

    const role = getRoleName();
    let url = `/monitoring`;
    
    if (role === "Candidate") {
      const userId = getUserId();
      params.userId = userId;
    }

    const response = await api.get<MonitoringPageResponse>(url, {
      params,
    });

    return {
      ...response.data,
      content: response.data?.content ?? [],
    };
  },
};

/*
edit end
*/
