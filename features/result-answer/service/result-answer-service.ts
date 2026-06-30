import api from "@/lib/axios";

const createServiceError = (error: any, fallbackMessage: string): Error => {
  return new Error(
    error.response?.data?.message || `${fallbackMessage}: ${error.message}`,
  );
};

export const resultAnswerService = {
  getAnsweredList: async (userId: string, InterviewTitle: string | null) => {
    try {
      const params: Record<string, string | null> = {
        keyword: InterviewTitle,
      };

      const response = await api.get(
        `/answers/list-candidate-answer/${userId}`,
        {
          params,
        },
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
