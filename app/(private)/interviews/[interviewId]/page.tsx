"use client";

import { InterviewDetailsView } from "@/features/interviews/components/details/interview-details-view";
import { ExamSessionView } from "@/features/interviews/components/exam/exam-view";
import { getRoleName } from "@/lib/auth";
import { useEffect, useState } from "react";

/**
 * Next.js page route for viewing an interview's overall details and its candidate list.
 * Path: /interviews/[interviewId]
 */
export default function InterviewDetailsPage() {
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(getRoleName());
  }, []);

  if (!role) return null;

  return role === "Candidate" ? <ExamSessionView /> : <InterviewDetailsView />;
}
