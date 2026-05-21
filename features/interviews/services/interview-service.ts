import api from "@/lib/axios";
import { InterviewFilters, Interview, InterviewDetail, PaginatedResponse, Candidate, CandidateResult } from "../types/interview";

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

  getInterviewById: async (id: string): Promise<InterviewDetail> => {
    try {
      const response = await api.get(`/interviews/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Failed to fetch interview details: ${error.message}`
      );
    }
  },

  createInterview: async (data: any) => {
    try {
      const response = await api.post('/interviews', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Failed to create interview: ${error.message}`
      );
    }
  },

  updateInterview: async (id: string, data: any) => {
    try {
      const response = await api.put(`/interviews/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Failed to update interview: ${error.message}`
      );
    }
  },

  deleteInterview: async (id: string) => {
    try {
      const response = await api.delete(`/interviews/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Failed to delete interview: ${error.message}`
      );
    }
  },

  getCandidates: async (interviewId: string, recommendation?: string): Promise<Candidate[]> => {
    try {
      const params: Record<string, string> = {};
      if (recommendation) {
        params.recommendation = recommendation;
      }
      const response = await api.get(`/answers/list-candidate/${interviewId}`, {
        params,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Failed to fetch candidates: ${error.message}`
      );
    }
  },

  getCandidateResult: async (interviewId: string, candidateId: string): Promise<CandidateResult> => {
    try {
      const response = await api.get(`/answers/candidate-result/${interviewId}/${candidateId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Failed to fetch candidate results: ${error.message}`
      );
    }
  },
};

