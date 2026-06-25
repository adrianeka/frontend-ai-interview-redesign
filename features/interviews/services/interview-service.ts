import api from "@/lib/axios";
import {
  Candidate,
  CandidateResult,
  Interview,
  InterviewDetail,
  InterviewFilters,
  PaginatedResponse,
} from "../types/interview";

const createServiceError = (error: any, fallbackMessage: string): Error => {
  return new Error(
    error.response?.data?.message || `${fallbackMessage}: ${error.message}`,
  );
};

/**
 * API service for managing interview entities and candidate operations.
 * Handles fetching, creating, updating, deleting interviews,
 * as well as candidate result fetching and AI pipeline retries.
 */
export const interviewService = {
  /**
   * Fetches a paginated list of interviews based on provided filters.
   */
  getInterviews: async (
    filters: InterviewFilters,
  ): Promise<PaginatedResponse<Interview>> => {
    const params: Record<string, string | number> = {
      page: filters.page || 0,
      size: filters.size || 10,
    };

    if (filters.search) params.search = filters.search;
    if (filters.company && filters.company !== "all")
      params.company = filters.company;
    if (filters.type && filters.type !== "all") params.type = filters.type;
    if (filters.level && filters.level !== "all") params.level = filters.level;
    if (filters.status && filters.status !== "all")
      params.status = filters.status;

    try {
      const response = await api.get("/interviews", {
        params,
      });
      return response.data;
    } catch (error: any) {
      throw createServiceError(error, "Failed to fetch interviews");
    }
  },

  getInterviewById: async (id: string): Promise<InterviewDetail> => {
    try {
      const response = await api.get(`/interviews/${id}`);
      return response.data;
    } catch (error: any) {
      throw createServiceError(error, `Failed to fetch interview details`);
    }
  },

  createInterview: async (data: any) => {
    try {
      const response = await api.post("/interviews", data);
      return response.data;
    } catch (error: any) {
      throw createServiceError(error, "Failed to create interview");
    }
  },

  updateInterview: async (id: string, data: any) => {
    try {
      const response = await api.put(`/interviews/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw createServiceError(error, "Failed to update interview");
    }
  },

  deleteInterview: async (id: string) => {
    try {
      const response = await api.delete(`/interviews/${id}`);
      return response.data;
    } catch (error: any) {
      throw createServiceError(error, "Failed to delete interview");
    }
  },

  getCandidates: async (
    interviewId: string,
    recommendation?: string,
  ): Promise<Candidate[]> => {
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
      throw createServiceError(error, "Failed to fetch candidates");
    }
  },

  getCandidateResult: async (
    interviewId: string,
    candidateId: string,
  ): Promise<CandidateResult> => {
    try {
      const response = await api.get(
        `/answers/candidate-result/${interviewId}/${candidateId}`,
      );
      return response.data;
    } catch (error: any) {
      throw createServiceError(error, "Failed to fetch candidate results");
    }
  },

  updateAnswerTranscript: async (
    participantId: string,
    questionId: string,
    answerTranscript: string,
  ) => {
    try {
      const response = await api.put(
        `/answers/update-result/${participantId}/${questionId}`,
        {
          answerTranscript,
        },
      );
      return response.data;
    } catch (error: any) {
      throw createServiceError(error, "Failed to update answer transcript");
    }
  },

  validateAnswer: async (participantId: string, questionId: string) => {
    try {
      const response = await api.put(
        `/answers/validate/${participantId}/${questionId}`,
        {
          isValidated: true,
          validated: true,
        },
      );
      return response.data;
    } catch (error: any) {
      throw createServiceError(error, "Failed to validate answer");
    }
  },

  downloadVideo: async (fileName: string) => {
    try {
      const response = await api.get(`/answers/download/${fileName}`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error: any) {
      throw createServiceError(error, "Failed to download video");
    }
  },

  getStepProgress: async (interviewId: string, candidateId: string) => {
    try {
      const response = await api.get(
        `/answers/step-progress/${interviewId}/${candidateId}`,
      );
      return response.data;
    } catch (error: any) {
      throw createServiceError(error, "Failed to fetch step progress");
    }
  },

  retryStt: async (participantId: string, questionId: string) => {
    try {
      const response = await api.put(
        `/answers/reprocess-stt/${participantId}/${questionId}`,
      );
      return response.data;
    } catch (error: any) {
      throw createServiceError(error, "Failed to retry STT");
    }
  },

  retrySttBulk: async (participantId: string) => {
    try {
      const response = await api.put(
        `/answers/reprocess-stt/bulk/${participantId}`,
      );
      return response.data;
    } catch (error: any) {
      throw createServiceError(error, "Failed to bulk retry STT");
    }
  },

  getMonitoring: async (participantId: string) => {
    try {
      const response = await api.get(`/monitoring/${participantId}`);
      return response.data;
    } catch (error: any) {
      throw createServiceError(error, "Failed to fetch monitoring");
    }
  },

  uploadAnswer: async (
    questionId: string,
    breakTime: number,
    answerTime: number,
    videoFile: File,
    signal?: AbortSignal,
  ) => {
    try {
      const formData = new FormData();
      formData.append("video", videoFile);

      const response = await api.post("/answers/upload", formData, {
        params: { questionId, breakTime, answerTime },
        headers: { "Content-Type": "multipart/form-data" },
        signal,
      });
      return response.data;
    } catch (error: any) {
      throw createServiceError(error, "Failed to upload answer");
    }
  },

  getAnsweredList: async (userId: string, interviewId: string) => {
    try {
      const response = await api.get(
        `/answers/list-answered/${userId}/${interviewId}`,
      );
      return response.data;
    } catch (error: any) {
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        throw error;
      }
      throw createServiceError(error, "Failed to fetch answered list");
    }
  },
};
