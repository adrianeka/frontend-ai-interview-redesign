"use client";

import { CandidateInterviewView } from "@/features/interviews/components/candidate/candidate-interview-view";

/**
 * Next.js page route for viewing a specific candidate's interview results.
 * Path: /interviews/[interviewId]/candidates/[candidateId]
 */
export default function CandidatePage() {
  return <CandidateInterviewView />;
}
