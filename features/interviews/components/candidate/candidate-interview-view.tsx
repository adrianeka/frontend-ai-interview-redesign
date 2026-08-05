"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeftIcon, MapPinIcon, TriangleAlert, AlertTriangle, PlayCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useCandidateInterview } from "@/features/interviews/hooks/use-candidate-interview";
import { CandidateProgressStepper } from "@/features/interviews/components/candidate/candidate-progress-stepper";
import { CandidateAlerts } from "@/features/interviews/components/candidate/candidate-alerts";
import { CandidateScoreBreakdown } from "@/features/interviews/components/candidate/candidate-score-breakdown";
import { CandidateAnswerItem } from "@/features/interviews/components/candidate/candidate-answer-item";

/**
 * Main View component for an individual candidate's interview results.
 * Displays overall scoring, detailed question-by-question breakdown,
 * video answers, and handles retry mechanisms for failed pipeline steps.
 */
export function CandidateInterviewView() {
  const {
    interviewId,
    candidateResult,
    interviewDetail,
    stepProgress,
    isLoading,
    error,
    activeStep,
    failedMonitoringItems,
    sortedAnswers,
    isSttError,
    sttCompletedCount,
    totalAnswers,
    validatedCount,
    isGradingError,
    activeColorMap,
    avgTechnical,
    avgProblemSolving,
    avgCommunication,
    sttErrorQuestions,
    editingQuestionId,
    setEditingQuestionId,
    draftTranscript,
    setDraftTranscript,
    isUpdatingTranscript,
    handleSaveTranscript,
    downloadingQuestionId,
    handleDownloadVideo,
    validatingQuestionId,
    handleValidateAnswer,
    retryingQuestionId,
    handleRetryStt,
    isRetryingBulk,
    handleRetrySttBulk,
    router,
    statusColorMap,
    violations
  } = useCandidateInterview();

  const [playRequest, setPlayRequest] = React.useState<{ questionId: string; time: number } | null>(null);

  const getViolationIcon = (type: string) => {
    if (type === "LEAVE_FULLSCREEN") return "↗";
    if (type === "TAB_SWITCH") return "⇋";
    return "⚠";
  };

  const parseRelativeTime = (details: string | null) => {
    if (!details) return null;
    const match = details.match(/\[(\d+)s\]/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return null;
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatTime = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: true }).format(new Date(isoString));
    } catch {
      return "--:-- AM";
    }
  };

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

  return (
    <Card className="bg-[#FAFAFA] p-4 sm:p-6 shadow-none border-none">
      {/* Top Action Bar */}
      <CardHeader className="flex flex-row items-center justify-between w-full p-0 mb-4 sm:mb-6">
        <Button
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => router.push(`/interviews/${interviewId}`)}
        >
          <ArrowLeftIcon />
          Back
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 p-0">
        {/* Candidate Profile Header */}
        {/* List of answers/videos and their specific scores */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#E2E4E6] bg-blue-100 text-[#0076D2] font-bold text-lg flex items-center justify-center uppercase shrink-0">
              {candidateResult.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <h1 className="text-[22px] font-bold text-[#2D2F35] leading-snug flex items-center gap-2">
                {candidateResult.name}
                {candidateResult.isAutoTerminated ? (
                  <Badge
                    variant="outline"
                    style={{ borderColor: "#7F1D1D", color: "#fff", backgroundColor: "#7F1D1D" }}
                    className="text-[9px] uppercase font-bold py-0 px-2 h-5 leading-none"
                  >
                    DISQUALIFIED
                  </Badge>
                ) : violations.length > 0 ? (
                  <Badge
                    variant="outline"
                    style={{ borderColor: "#E84E2C", color: "#E84E2C", backgroundColor: "#FFEEEA" }}
                    className="text-[10px] uppercase font-bold py-0 px-2 h-5"
                  >
                    Violation Detected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-emerald-500 bg-emerald-50 text-emerald-600 font-semibold hover:bg-emerald-50">
                    CLEAN
                  </Badge>
                )}
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
          <CandidateProgressStepper stepProgress={stepProgress} />

          {/* Alerts */}
          <CandidateAlerts
            activeStep={activeStep}
            failedMonitoringItems={failedMonitoringItems}
            sortedAnswers={sortedAnswers}
            isSttError={isSttError}
            sttCompletedCount={sttCompletedCount}
            totalAnswers={totalAnswers}
            validatedCount={validatedCount}
            isGradingError={isGradingError}
            summaryReason={candidateResult?.summaryReason}
            participantId={sortedAnswers[0]?.participantId ?? null}
            isRetryingBulk={isRetryingBulk}
            onRetryBulk={handleRetrySttBulk}
          />

          {/* Integrity Report Accordion */}
          {violations.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="integrity" className="border border-destructive/20 rounded-lg bg-destructive/5 px-4 overflow-hidden">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                    <AlertTriangle className="w-4 h-4" />
                    Integrity Report
                    <span className="ml-2 bg-destructive/10 text-destructive px-2 py-0.5 rounded-full text-xs font-bold">
                      {violations.length} VIOLATION{violations.length > 1 ? "S" : ""}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-3 text-sm text-foreground space-y-3">
                  <div className="flex flex-col gap-3">
                    {violations.map((v) => {
                      const relTime = parseRelativeTime(v.details);
                      return (
                        <div key={v.id} className="flex flex-col gap-1.5 p-3 bg-background rounded-md border border-destructive/10">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-destructive flex items-center gap-2">
                              <span className="text-xs font-bold">{formatTime(v.timestamp)}</span>
                              <span className="text-red-400 font-bold">{getViolationIcon(v.violationType)}</span>
                              <span className="text-destructive font-semibold">
                                {v.violationType === "LEAVE_FULLSCREEN" ? "Left Fullscreen" : 
                                 v.violationType === "TAB_SWITCH" ? "Tab Switch" : v.violationType}
                              </span>
                            </span>
                            {relTime !== null && v.questionId && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setPlayRequest({ questionId: v.questionId!, time: relTime })}
                                className="h-6 text-xs text-primary hover:text-primary/90 hover:bg-primary/10 px-2"
                              >
                                <PlayCircle className="w-3.5 h-3.5 mr-1" /> Play @ {formatSeconds(relTime)}
                              </Button>
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5 mt-1">
                            {v.questionText && (
                              <span className="text-xs text-muted-foreground">
                                <span className="font-semibold">Question:</span> {v.questionText}
                              </span>
                            )}
                            {v.details && (
                              <span className="text-xs text-muted-foreground">
                                <span className="font-semibold">Details:</span> {v.details}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        {/* Score Breakdown Section */}
        <CandidateScoreBreakdown
          totalScore={candidateResult.totalScore}
          recommendation={candidateResult.recommendation}
          activeColorMap={activeColorMap}
          avgTechnical={avgTechnical}
          avgProblemSolving={avgProblemSolving}
          avgCommunication={avgCommunication}
        />

        {/* Candidate's Answers Section */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-6">
            <h2 className="text-[#A9ADB5] text-sm font-medium whitespace-nowrap">Candidate's Answer(s)</h2>
            <div className="h-px bg-[#E2E4E6] w-full" />
          </div>

          {activeStep === 1 && isSttError && failedMonitoringItems.length === 0 && (
            <div className="flex flex-col gap-1.5 p-5 bg-[#FFEEEA] rounded-lg border-l-4 border-[#FF5630]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TriangleAlert className="w-5 h-5" fill="#FF5630" color="#FFEEEA" size={20} />
                  <span className="text-[#43474F] font-bold text-base">
                    Oops! An error occurred
                  </span>
                </div>

                <Badge className="bg-[#FF5630] w-fit h-fit text-[#FFEEEA] text-xs font-semibold">
                  <TriangleAlert fill="#FAFAFA" color="#FF5630" size={14} className="inline mr-1" />
                  Issue with questions: {sttErrorQuestions.join(", ")}
                </Badge>
              </div>
              <p className="text-[#707784] text-sm ml-7">
                An error occurred during transcription. Click ‘retry’ to resolve the issue and finalize the process.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-8 py-4">
            {sortedAnswers.map((a, index) => (
              <React.Fragment key={a.questionId || index}>
                <CandidateAnswerItem
                  answer={a}
                  index={index}
                  statusColorMap={statusColorMap}
                  editingQuestionId={editingQuestionId}
                  setEditingQuestionId={setEditingQuestionId}
                  draftTranscript={draftTranscript}
                  setDraftTranscript={setDraftTranscript}
                  isUpdatingTranscript={isUpdatingTranscript}
                  handleSaveTranscript={handleSaveTranscript}
                  downloadingQuestionId={downloadingQuestionId}
                  handleDownloadVideo={handleDownloadVideo}
                  validatingQuestionId={validatingQuestionId}
                  handleValidateAnswer={handleValidateAnswer}
                  retryingQuestionId={retryingQuestionId}
                  handleRetryStt={handleRetryStt}
                  playRequest={playRequest}
                  violations={violations}
                />

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
