/*
edit start
by: Zahra Hilyatul J
date: 2026-06-29
description: Created types for monitoring features
*/
// Matches MonitoringResponse schema from backend
export interface MonitoringTask {
  id: string;
  processId: string;
  interviewName: string;
  candidateName: string;
  taskName: string;
  startDate: string | null;
  endDate: string | null;
  status: "SUCCESS" | "FAILED" | "IN_PROGRESS" | "PENDING";
  messageError: string | null;
}

// Matches PageMonitoringResponse from backend
export interface MonitoringPageResponse {
  content: MonitoringTask[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface MonitoringFilters {
  search?: string;
  status?: string;
  page?: number;
  size?: number;
}
/*
edit end
*/
