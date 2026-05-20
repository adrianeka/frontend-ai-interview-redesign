export interface Question {
  id: string;
  questionText: string;
  orderNumber: number;
  isAnswered: boolean | null;
}

export interface Interview {
  id: string;
  name: string;
  description: string;
  companyNamePartner: string | null;
  context: string;
  objective: string;
  roleTarget: string;
  levelTarget: string;
  technology: string;
  purpose: "HIRING" | "INTERNAL_ASSESSMENT" | string;
  status: "DRAFT" | "PUBLISHED" | string;
  isAnswered: boolean | null;
  createdAt: string;
}

export interface InterviewDetail extends Interview {
  questions: Question[];
}

export interface InterviewFilters {
  search?: string;
  company?: string;
  type?: string;
  level?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  pageable: {
    pageNumber: number;
  };
}
