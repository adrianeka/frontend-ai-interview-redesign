import { ValidateAnswer } from "@/features/result-answer/components/validate/validate-answer";

interface PageProps {
  params: Promise<{
    interviewId: string;
    candidateId: string;
  }>;
}

export default async function ResultDetail({ params }: PageProps) {
  const { interviewId, candidateId } = await params;

  return <ValidateAnswer interviewId={interviewId} candidateId={candidateId} />;
}
