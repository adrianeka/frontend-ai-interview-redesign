/**
 * Represents a single question in an interview session.
 */
export interface Question {
  id: string;
  questionText: string;
  orderNumber: number;
  isAnswered: boolean | null;
}

/**
 * Represents the core data model of an Interview session.
 */
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
  number?: number;
  language?: string;
  topCandidate?: string;
}

export interface EditInterviewData {
  id: string;
  name: string;
  companyNamePartner: string;
  description: string;
  context: string;
  objective: string;
  purpose: string;
  roleTarget: string;
  levelTarget: string;
  technology: string;
  number: number;
  language?: string;
  isEditable?: boolean;
}

export interface InterviewCardProps {
  title: string;
  company: {
    companyNamePartner: string | null;
    logo: string;
  };
  topCandidate: string;
  type: "Hiring" | "Internal Assessment" | string;
  level: string;
  description: string;
  isCompact?: boolean;
  id?: string;
  isEditable?: boolean;
  isDeletable?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  role: string;
  isAnswered: boolean;
}

export interface CreateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableLevels?: string[];
  onSuccess?: () => void;
}

export interface EditInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableLevels?: string[];
  initialData: EditInterviewData | null;
  onSuccess?: () => void;
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

export interface Candidate {
  name: string;
  summaryReason: string;
  recommendation: string;
  participantId: string;
  interviewId: string;
  totalScore: number;
  startedAt: string;
  candidateId: string;
  avgTechnicalFundamentalScore: number;
  avgCommunicationScore: number;
  avgProblemSolvingScore: number;
}

export interface CandidateMonitoring {
  taskName: string;
  status: string;
  messageError: string | null;
}

export interface CandidateAnswer {
  questionId: string;
  participantId: string;
  questionText: string;
  questionNumber: number;
  answerTranscript: string;
  videoUrl: string;
  fileName: string;
  technicalFundamentalScore: number;
  problemSolvingScore: number;
  communicationScore: number;
  breakTime: string;
  answerTime: string;
  isValidated: boolean;
  status: string;
  monitorings: CandidateMonitoring[];
}

export interface CandidateResult {
  interviewId: string;
  name: string;
  totalScore: number;
  recommendation: string;
  summaryReason: string;
  answers: CandidateAnswer[];
}
