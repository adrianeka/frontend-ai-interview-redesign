import api from "@/lib/axios";

export interface InterviewFilters {
  search?: string;
  company?: string;
  type?: string;
  level?: string;
  status?: string;
  page?: number;
  size?: number;
}

export const interviewService = {
  getInterviews: async (filters: InterviewFilters) => {
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
};
