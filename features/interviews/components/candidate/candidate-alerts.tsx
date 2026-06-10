"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TriangleAlert, Info, CircleCheck, RefreshCwIcon, Loader2 } from "lucide-react";

/**
 * Props for the CandidateAlerts component.
 */
interface CandidateAlertsProps {
  /** The current active step in the interview pipeline (1-5) */
  activeStep: number;
  failedMonitoringItems: any[];
  sortedAnswers: any[];
  isSttError: boolean;
  sttCompletedCount: number;
  totalAnswers: number;
  validatedCount: number;
  isGradingError: boolean;
  summaryReason?: string | null;
  participantId?: string | null;
  isRetryingBulk?: boolean;
  /** Callback to trigger bulk retry */
  onRetryBulk?: (participantId: string) => void;
}

/**
 * Renders contextual alert banners at the top of the candidate details page.
 * Displays information about pending AI grading pipelines or errors requiring intervention.
 */
export function CandidateAlerts({
  activeStep,
  failedMonitoringItems,
  sortedAnswers,
  isSttError,
  sttCompletedCount,
  totalAnswers,
  validatedCount,
  isGradingError,
  summaryReason,
  participantId,
  isRetryingBulk = false,
  onRetryBulk,
}: CandidateAlertsProps) {
  const retryButton = participantId && onRetryBulk ? (
    <Button
      size="sm"
      variant="outline"
      className="border-[#FF5630] text-[#FF5630] hover:bg-[#FFEEEA] w-fit mt-1"
      disabled={isRetryingBulk}
      onClick={() => onRetryBulk(participantId)}
    >
      {isRetryingBulk ? (
        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
      ) : (
        <RefreshCwIcon className="w-3.5 h-3.5 mr-1.5" />
      )}
      {isRetryingBulk ? "Retrying..." : "Retry"}
    </Button>
  ) : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Failed Monitoring Alert */}
      {failedMonitoringItems.length > 0 && (
        <div className="flex flex-col gap-1.5 p-5 bg-[#FFEEEA] rounded-lg border-l-4 border-[#FF5630]">
          <div className="flex items-center gap-2">
            <TriangleAlert className="w-5 h-5" fill="#FF5630" color="#FFEEEA" size={20} />
            <span className="text-[#43474F] font-bold text-base">Oops! An error occurred</span>
          </div>
          <div className="flex flex-col gap-1.5 ml-7 text-[#707784] text-sm">
            {failedMonitoringItems.map((m: any, idx: number) => {
              const matchedAns = sortedAnswers.find(ans => ans.questionId === m.questionId);
              const displayTarget = matchedAns
                ? `Question ${matchedAns.questionNumber || (sortedAnswers.indexOf(matchedAns) + 1)} (${m.taskName})`
                : m.taskName;
              return (
                <p key={m.id || idx} className="leading-relaxed">
                  <span className="font-semibold text-[#43474F]">{displayTarget}: </span>
                  {m.messageError || "Unknown processing error occurred."}
                </p>
              );
            })}
            {retryButton}
          </div>
        </div>
      )}

      {/* Area 1 Alert (STT In Progress) */}
      {activeStep === 1 && !isSttError && (
        <div className="flex flex-col gap-1.5 p-5 bg-[#F1F9FA] rounded-lg border-l-4 border-[#0076D2]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" fill="#0076D2" color="#F1F9FA" size={20} />
              <span className="text-[#43474F] font-bold text-base">Interview transcriptions are being processed</span>
            </div>
            <Badge className="bg-[#0076D2] w-fit h-fit text-[#FAFAFA] text-xs font-semibold">
              <CircleCheck fill="#FAFAFA" color="#0076D2" className="inline mr-1" size={14} />
              {sttCompletedCount}/{totalAnswers} completed
            </Badge>
          </div>
          <p className="text-[#707784] text-sm ml-7">The speech from the interview is being converted to text and queued for insertion into the answer table.</p>
        </div>
      )}

      {/* Validation In Progress */}
      {activeStep === 2 && (
        <div className="flex flex-col gap-1.5 p-5 bg-[#F1F9FA] rounded-lg border-l-4 border-[#0076D2]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" fill="#0076D2" color="#F1F9FA" size={20} />
              <span className="text-[#43474F] font-bold text-base">Candidate is validating the interview data</span>
            </div>
            <Badge className="bg-[#0076D2] w-fit h-fit text-[#FAFAFA] text-xs font-semibold">
              <CircleCheck fill="#FAFAFA" color="#0076D2" className="inline mr-1" size={14} />
              {validatedCount}/{totalAnswers} Validated
            </Badge>
          </div>
          <p className="text-[#707784] text-sm ml-7">The candidate is reviewing their answers. Please wait to see the validated data.</p>
        </div>
      )}

      {/* AI Analyzing Responses */}
      {activeStep === 3 && !isGradingError && (
        <div className="flex flex-col gap-1.5 p-5 bg-[#F1F9FA] rounded-lg border-l-4 border-[#0076D2]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" fill="#0076D2" color="#F1F9FA" size={20} />
              <span className="text-[#43474F] font-bold text-base">AI is Analyzing Candidate Responses</span>
            </div>
          </div>
          <p className="text-[#707784] text-sm ml-7">The AI is comprehensively assessing the candidate's answers.</p>
        </div>
      )}

      {/* AI Grading Error Alert */}
      {activeStep === 3 && isGradingError && failedMonitoringItems.length === 0 && (
        <div className="flex flex-col gap-1.5 p-5 bg-[#FFEEEA] rounded-lg border-l-4 border-[#FF5630]">
          <div className="flex items-center gap-2">
            <TriangleAlert className="w-5 h-5" fill="#FF5630" color="#FFEEEA" size={20} />
            <span className="text-[#43474F] font-bold text-base">AI Grading Error</span>
          </div>
          <div className="ml-7 flex flex-col gap-2">
            <p className="text-[#707784] text-sm">An error occurred during AI grading. Retrying will reprocess from the transcription step &mdash; this may take a while.</p>
            {retryButton}
          </div>
        </div>
      )}

      {/* AI Analysis Result */}
      {activeStep >= 4 && summaryReason && (
        <div className="flex flex-col gap-1.5 p-5 bg-[#F1F9FA] rounded-lg border-l-4 border-[#0076D2]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" fill="#0076D2" color="#F1F9FA" size={20} />
              <span className="text-[#43474F] font-bold text-base">AI Analysis Result</span>
            </div>
          </div>
          <p className="text-[#707784] text-sm ml-7 whitespace-pre-wrap">{summaryReason}</p>
        </div>
      )}
    </div>
  );
}


