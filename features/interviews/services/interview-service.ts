import api from "@/lib/axios";
import { InterviewFilters, Interview, InterviewDetail, PaginatedResponse } from "../types/interview";

export const interviewService = {
  getInterviews: async (filters: InterviewFilters): Promise<PaginatedResponse<Interview>> => {
    const params: Record<string, string | number> = {
      page: filters.page || 0,
      size: filters.size || 10,
    };

    if (filters.search) params.search = filters.search;
    if (filters.company && filters.company !== "all") params.company = filters.company;
    if (filters.type && filters.type !== "all") params.type = filters.type;
    if (filters.level && filters.level !== "all") params.level = filters.level;
    if (filters.status && filters.status !== "all") params.status = filters.status;

    try {
      const response = await api.get("/interviews", {
        params,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Failed to fetch interviews: ${error.message}`
      );
    }
  },

  getInterviewById: async (id: string) => {
    try {
      const response = await api.get(`/interviews/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Failed to fetch interview details: ${error.message}`
      );
    }
  },
};
