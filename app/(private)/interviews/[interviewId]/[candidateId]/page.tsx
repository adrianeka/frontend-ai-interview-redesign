"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChevronLeft,
  Building2,
  Info,
  CheckCircle2,
  Clock,
  Quote,
  Loader2,
  CornerDownRightIcon,
  MapPinIcon,
  ArrowLeftIcon
} from "lucide-react";
import { interviewService } from "@/features/interviews/services/interview-service";
import { CandidateResult, InterviewDetail } from "@/features/interviews/types/interview";
import { Badge } from "@/components/ui/badge";

export default function CandidateInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params?.interviewId as string;
  const candidateId = params?.candidateId as string;

  const [candidateResult, setCandidateResult] = useState<CandidateResult | null>(null);
  const [interviewDetail, setInterviewDetail] = useState<InterviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!interviewId || !candidateId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [resultData, interviewData] = await Promise.all([
          interviewService.getCandidateResult(interviewId, candidateId),
          interviewService.getInterviewById(interviewId)
        ]);
        setCandidateResult(resultData);
        setInterviewDetail(interviewData);
      } catch (err: any) {
        console.error("Error loading candidate results:", err);
        setError(err.message || "Failed to load candidate results.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [interviewId, candidateId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F5F5F5] py-4 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0076D2]" />
      </main>
    );
  }

  if (error || !candidateResult) {
    return (
      <main className="min-h-screen bg-[#F5F5F5] py-10 px-4 flex justify-center items-center">
        <Card className="bg-[#FAFAFA] p-6 text-center border-2 border-red-100 max-w-lg w-full">
          <p className="text-red-500 font-semibold mb-4 text-lg">Error Loading Candidate Results</p>
          <p className="text-slate-600 mb-6 text-sm">{error || "Candidate data not found."}</p>
          <Button onClick={() => router.back()} className="bg-[#0076D2] text-white hover:bg-[#005ba3]">
            Go Back
          </Button>
        </Card>
      </main>
    );
  }

  // Derived Stepper and Score stats
  const sortedAnswers = [...candidateResult.answers].sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));
  const totalAnswers = sortedAnswers.length;
  const validatedCount = sortedAnswers.filter((a) => a.isValidated).length;
  const isFullyValidated = totalAnswers > 0 && validatedCount === totalAnswers;

  const avgTechnical = totalAnswers
    ? sortedAnswers.reduce((acc, a) => acc + (a.technicalFundamentalScore || 0), 0) / totalAnswers
    : 0;

  const avgProblemSolving = totalAnswers
    ? sortedAnswers.reduce((acc, a) => acc + (a.problemSolvingScore || 0), 0) / totalAnswers
    : 0;

  const avgCommunication = totalAnswers
    ? sortedAnswers.reduce((acc, a) => acc + (a.communicationScore || 0), 0) / totalAnswers
    : 0;

  // Step 1: Transcription and Answer Integration (always done once we fetch answers)
  const step1Status = "completed";

  // Step 2: Candidate Validation (completed if all answers are validated)
  const step2Status = isFullyValidated ? "completed" : "active";

  // Step 3: Grading Answer by AI (completed if there are scores, active if validated but no scores yet, disabled otherwise)
  const hasScores = totalAnswers > 0 && sortedAnswers.some(a =>
    a.technicalFundamentalScore > 0 ||
    a.problemSolvingScore > 0 ||
    a.communicationScore > 0
  );
  const step3Status = hasScores && isFullyValidated
    ? "completed"
    : isFullyValidated
      ? "active"
      : "disabled";

  // Step 4: Result (completed if candidate recommendation exists)
  const hasResult = !!candidateResult.recommendation;
  const step4Status = hasResult && hasScores && isFullyValidated
    ? "completed"
    : step3Status === "completed"
      ? "active"
      : "disabled";

  // Stepper visual styles helper
  const getStepStyles = (status: "completed" | "active" | "disabled") => {
    switch (status) {
      case "completed":
        return {
          circle: "bg-[#0076D2] text-[#FAFAFA] border-none",
          text: "text-[#595F6A] font-medium"
        };
      case "active":
        return {
          circle: "bg-white border-2 border-[#0076D2] text-[#0076D2]",
          text: "text-[#0076D2] font-semibold"
        };
      case "disabled":
      default:
        return {
          circle: "bg-[#E2E4E6] text-[#8C929D] border-none",
          text: "text-[#A9ADB5] font-medium"
        };
    }
  };

  const step1 = getStepStyles(step1Status);
  const step2 = getStepStyles(step2Status);
  const step3 = getStepStyles(step3Status);
  const step4 = getStepStyles(step4Status);

  return (

    <Card className="bg-[#FAFAFA] p-4 sm:p-6">
      {/* Top Action Bar */}
      <CardHeader className="flex flex-row items-center justify-between w-full ">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => router.push(`/interviews/${interviewId}`)}
        >
          <ArrowLeftIcon />
          Back
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* Candidate Profile Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#E2E4E6] bg-blue-100 text-[#0076D2] font-bold text-lg flex items-center justify-center uppercase shrink-0">
              {candidateResult.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <h1 className="text-[22px] font-bold text-[#2D2F35] leading-snug">
                {candidateResult.name}
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 text-base">
                <span className="text-[#A9ADB5] font-medium">Interview Role</span>
                <span className="text-[#8C929D]">:</span>
                <span className="text-[#43474F] font-medium">
                  {interviewDetail?.roleTarget || "Position"} ({interviewDetail?.levelTarget || "Junior"})
                </span>
              </div>
            </div>
            {/* Company Badge */}
            {interviewDetail?.companyNamePartner && (
              <div className="flex items-center gap-2 px-2.5 py-1 bg-[#F5F5F5] border border-[#E2E4E6] rounded-md h-fit">
                <MapPinIcon className="w-4 h-4 text-[#3366FF]" />
                <span className="text-[#43474F] text-sm font-medium">{interviewDetail.companyNamePartner}</span>
              </div>
            )}
          </div>

          {/* Progress Stepper */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full gap-6 py-6 mt-2">

            {/* Step 1 */}
            <div className="relative flex flex-col items-center w-[134px]">
              <div className="hidden md:block absolute top-[13px] left-[50%] w-[calc(100%+1.5rem)] h-[2px] bg-[#0076D2] z-0" />
              <div className={`relative z-10 w-7 h-7 shrink-0 font-bold rounded-full flex items-center justify-center text-sm ${step1.circle}`}>1</div>
              <span className={`text-center text-sm leading-tight mt-2 ${step1.text}`}>
                Transcription and Answer Integration
              </span>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center w-[134px]">
              <div className={`hidden md:block absolute top-[13px] left-[50%] w-[calc(100%+1.5rem)] z-0 ${step3Status !== "disabled" ? "h-[2px] bg-[#0076D2]" : "h-[1px] bg-[#E2E4E6]"}`} />
              <div className={`relative z-10 w-7 h-7 shrink-0 font-bold rounded-full flex items-center justify-center text-sm ${step2.circle}`}>
                2
              </div>
              <span className={`text-center text-sm leading-tight mt-2 ${step2.text}`}>
                Candidate Validation
              </span>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center w-[134px]">
              <div className={`hidden md:block absolute top-[13px] left-[50%] w-[calc(100%+1.5rem)] z-0 ${step4Status !== "disabled" ? "h-[2px] bg-[#0076D2]" : "h-[1px] bg-[#E2E4E6]"}`} />
              <div className={`relative z-10 w-7 h-7 shrink-0 font-bold rounded-full flex items-center justify-center text-sm ${step3.circle}`}>3</div>
              <span className={`text-center text-sm leading-tight mt-2 ${step3.text}`}>
                Grading Answer by AI
              </span>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col items-center w-[134px]">
              <div className={`relative z-10 w-7 h-7 shrink-0 font-bold rounded-full flex items-center justify-center text-sm ${step4.circle}`}>4</div>
              <span className={`text-center text-sm leading-tight mt-2 ${step4.text}`}>
                Result
              </span>
            </div>
          </div>

          {/* Validation Alert Banner */}
          <div className="flex flex-col gap-1.5 p-5 bg-[#F1F9FA] rounded-lg border-l-4 border-[#0076D2]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#0076D2]" />
                <span className="text-[#43474F] font-bold text-base">
                  {isFullyValidated ? "All answers have been validated by candidate" : "Candidate is validating the interview data"}
                </span>
              </div>
              <div className="bg-[#0076D2] text-[#FAFAFA] text-xs font-semibold px-2.5 py-1 rounded-full">
                {validatedCount}/{totalAnswers} Validated
              </div>
            </div>
            <p className="text-[#707784] text-sm ml-7">
              {isFullyValidated
                ? "The candidate has completed the review process. The validated data and AI scores are fully complete."
                : "The candidate is currently reviewing their answers. Please wait to see the final validated data."}
            </p>
          </div>
        </div>

        {/* AI Evaluation Summary */}
        {candidateResult.summaryReason && (
          <div className="flex flex-col gap-3 p-5 bg-[#F8FAFC] rounded-xl border border-[#E2E4E6]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[#43474F] font-bold text-lg">AI Recommendation Summary</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${candidateResult.recommendation === "Strong Hire" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                candidateResult.recommendation === "Hire" ? "bg-blue-50 text-blue-600 border border-blue-200" :
                  candidateResult.recommendation === "Consider" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                    "bg-rose-50 text-rose-600 border border-rose-200"
                }`}>
                {candidateResult.recommendation}
              </span>
            </div>
            <p className="text-[#595F6A] text-sm leading-relaxed">
              {candidateResult.summaryReason}
            </p>
          </div>
        )}

        {/* Score Breakdown Section */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-6">
            <h2 className="text-[#A9ADB5] text-sm font-medium whitespace-nowrap">Candidate's Score Breakdown</h2>
            <div className="h-px bg-[#E2E4E6] w-full" />
          </div>

          <div className="flex items-center mb-2">
            <span className="text-[#43474F] font-semibold text-base w-48">Final Score</span>
            <span className="text-[#8C929D] font-semibold text-base">
              {candidateResult.totalScore ? `${Number(candidateResult.totalScore).toFixed(1)}%` : "No data yet"}
            </span>
          </div>

          <div className="flex flex-col gap-4 pl-6 border-l-4 border-[#E2E4E6] py-2">
            <div className="flex items-center">
              <div className="w-48 text-base">
                <span className="text-[#43474F] font-medium">Technical Skill </span>
                <span className="text-[#A9ADB5]">(50%)</span>
              </div>
              <span className="text-[#8C929D] font-medium text-base">
                {avgTechnical ? `${avgTechnical.toFixed(1)}%` : "No data yet"}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-48 text-base">
                <span className="text-[#43474F] font-medium">Problem Solving </span>
                <span className="text-[#A9ADB5]">(30%)</span>
              </div>
              <span className="text-[#8C929D] font-medium text-base">
                {avgProblemSolving ? `${avgProblemSolving.toFixed(1)}%` : "No data yet"}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-48 text-base">
                <span className="text-[#43474F] font-medium">Communication </span>
                <span className="text-[#A9ADB5]">(20%)</span>
              </div>
              <span className="text-[#8C929D] font-medium text-base">
                {avgCommunication ? `${avgCommunication.toFixed(1)}%` : "No data yet"}
              </span>
            </div>
          </div>
        </div>

        {/* Candidate's Answers Section */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-6">
            <h2 className="text-[#A9ADB5] text-sm font-medium whitespace-nowrap">Candidate's Answer(s)</h2>
            <div className="h-px bg-[#E2E4E6] w-full" />
          </div>

          <div className="flex flex-col gap-8 py-4">
            {sortedAnswers.map((a, index) => (
              <React.Fragment key={a.questionId || index}>
                <div className="flex flex-col lg:flex-row gap-6 px-3">

                  {/* Video Player or Placeholder */}
                  {a.videoUrl ? (
                    <video
                      src={a.videoUrl}
                      controls
                      className="w-full lg:w-[501px] h-[320px] rounded-lg object-cover shrink-0 bg-black shadow-sm"
                      poster="https://placehold.co/501x320?text=Interview+Recording"
                    />
                  ) : (
                    <div
                      className="w-full lg:w-[501px] h-[320px] rounded-lg relative overflow-hidden flex flex-col justify-end p-6 shrink-0 bg-gray-200"
                      style={{ backgroundImage: 'url(https://placehold.co/501x320?text=No+Video+Available)', backgroundSize: 'cover' }}
                    >
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                      <div className="relative z-10 flex items-center justify-center h-full text-white font-medium">
                        No Video Recording Available
                      </div>
                    </div>
                  )}

                  {/* Question & Answer Details */}
                  <div className="flex flex-col gap-6 flex-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-[#43474F] font-bold text-base">Question {a.questionNumber || index + 1}</h3>

                        {/* Status Badge */}
                        {a.isValidated ? (
                          <div className="bg-[#EEF8F4] border border-[#C9EBDE] px-2 py-0.5 rounded-full flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#52BD94]" />
                            <span className="text-[#4BAC87] text-xs font-medium">Validated</span>
                          </div>
                        ) : (
                          <div className="bg-[#FAFAFA] border border-[#E2E4E6] px-2 py-0.5 rounded-full flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#595F6A]" />
                            <span className="text-[#595F6A] text-xs font-medium">Pending</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[#8C929D] font-medium text-sm">
                        {a.questionText}
                      </p>

                      {a.answerTranscript ? (
                        <div className="bg-[#F1F9FA] border-l-2 border-l-[#0076D2] p-3 flex items-start gap-3 mt-1">
                          <CornerDownRightIcon className="w-4 h-4 text-[#0076D2] shrink-0 mt-0.5" />
                          <p className="text-[#43474F] text-sm leading-relaxed whitespace-pre-wrap">
                            {a.answerTranscript}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[#A9ADB5] text-xs italic">No transcript recorded</p>
                      )}
                    </div>

                    {/* Individual Question AI Scoring */}
                    <div className="flex flex-col gap-3">
                      <h4 className="text-[#8C929D] font-semibold text-sm">AI Score Breakdown</h4>

                      <div className="flex flex-row gap-2 flex-wrap">
                        {[
                          a.technicalFundamentalScore,
                          a.problemSolvingScore,
                          a.communicationScore
                        ].every((score) => score === null || score === undefined) ? (
                          <p className="text-sm text-[#8C929D]">
                            The score will be available after AI grading is complete.
                          </p>
                        ) : (
                          [
                            { label: "Technical Skill", score: a.technicalFundamentalScore },
                            { label: "Problem Solving", score: a.problemSolvingScore },
                            { label: "Communication", score: a.communicationScore }
                          ].map((item, idx) =>
                            item.score !== null && item.score !== undefined ? (
                              <Badge
                                key={idx}
                                variant={"outline"}
                                className="w-fit h-fit bg-[#F5F5F5] border border-[#E2E4E6] text-[#595F6A] text-sm"
                              >
                                {item.label}: {item.score}%
                              </Badge>
                            ) : null
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider between items except the last one */}
                {index < sortedAnswers.length - 1 && (
                  <div className="h-px bg-[#E2E4E6] w-full" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}