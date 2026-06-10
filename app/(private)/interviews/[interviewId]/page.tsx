"use client";

import { InterviewDetailsView } from "@/features/interviews/components/details/interview-details-view";

/**
 * Next.js page route for viewing an interview's overall details and its candidate list.
 * Path: /interviews/[interviewId]
 */
export default function InterviewDetailsPage() {
    return <InterviewDetailsView />;
}