"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  CornerDownRightIcon,
  PencilIcon,
  DownloadIcon
} from "lucide-react";

interface CandidateAnswerItemProps {
  answer: {
    questionId: string;
    questionNumber?: number;
    questionText?: string;
    videoUrl?: string | null;
    fileName?: string | null;
    participantId: string;
    answerTranscript?: string | null;
    isValidated: boolean;
    technicalFundamentalScore?: number | null;
    problemSolvingScore?: number | null;
    communicationScore?: number | null;
    monitorings?: any[];
  };
  index: number;
  statusColorMap: Record<string, { color: string; bgColor: string; outline: string; icon: React.ElementType }>;
  editingQuestionId: string | null;
  setEditingQuestionId: (id: string | null) => void;
  draftTranscript: string;
  setDraftTranscript: (text: string) => void;
  isUpdatingTranscript: boolean;
  handleSaveTranscript: (questionId: string, participantId: string) => Promise<void>;
  downloadingQuestionId: string | null;
  handleDownloadVideo: (fileName: string | null, questionId: string) => Promise<void>;
  validatingQuestionId: string | null;
  handleValidateAnswer: (questionId: string, participantId: string) => Promise<void>;
  retryingQuestionId: string | null;
  handleRetryStt: (participantId: string, questionId: string) => Promise<void>;
}

export function CandidateAnswerItem({
  answer,
  index,
  statusColorMap,
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
  handleRetryStt
}: CandidateAnswerItemProps) {
  const monStatus = (() => {
    if (answer.isValidated) return { type: "success", label: "Validated" };
    if (!answer.monitorings || answer.monitorings.length === 0) return { type: "muted", label: "Pending" };
    const err = answer.monitorings.find((m: any) => m.status === "ERROR" || m.status === "FAILED" || m.messageError);
    if (err) return { type: "danger", label: "Error" };
    const allSuccess = answer.monitorings.every((m: any) => m.status === "SUCCESS");
    if (allSuccess) return { type: "success", label: "Success" };
    return { type: "muted", label: "Pending" };
  })();

  const badgeCfg = statusColorMap[monStatus.type] || statusColorMap["muted"];
  const BadgeIcon = badgeCfg.icon;

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-3">
      {/* Video Player or Placeholder */}
      {answer.videoUrl ? (
        <video
          src={answer.videoUrl}
          controls
          preload="none"
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
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="text-[#43474F] font-bold text-base">Question {answer.questionNumber || index + 1}</h3>
              <Badge
                style={{
                  color: badgeCfg.color,
                  backgroundColor: badgeCfg.bgColor,
                  borderColor: badgeCfg.outline
                }}
                className="border px-2 py-1 h-fit w-fit gap-1.5 flex items-center rounded-full"
              >
                <div
                  style={{
                    backgroundColor: badgeCfg.color,
                  }}
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                >
                  <BadgeIcon
                    style={{ color: badgeCfg.bgColor }}
                    className="w-2.5 h-2.5"
                    strokeWidth={3}
                  />
                </div>
                <span className="text-xs font-semibold whitespace-nowrap">
                  {monStatus.label}
                </span>
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              {!answer.isValidated && (
                <Button
                  variant="ghost"
                  className="text-muted-foreground"
                  size="icon"
                  disabled={answer.isValidated}
                  onClick={() => {
                    if (editingQuestionId === answer.questionId) {
                      setEditingQuestionId(null);
                    } else {
                      setEditingQuestionId(answer.questionId);
                      setDraftTranscript(answer.answerTranscript || "");
                    }
                  }}
                >
                  <PencilIcon />
                </Button>
              )}

              <Button
                variant="ghost"
                className="text-muted-foreground"
                size="icon"
                disabled={!answer.fileName || downloadingQuestionId === answer.questionId}
                onClick={() => handleDownloadVideo(answer.fileName || null, answer.questionId)}
              >
                {downloadingQuestionId === answer.questionId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <DownloadIcon />
                )}
              </Button>

              {!answer.isValidated && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`validate-status-${answer.questionId}`}
                    checked={answer.isValidated}
                    disabled={answer.isValidated || validatingQuestionId === answer.questionId}
                    onCheckedChange={(checked) => {
                      if (checked && !answer.isValidated) {
                        handleValidateAnswer(answer.questionId, answer.participantId);
                      }
                    }}
                  />
                  <Label htmlFor={`validate-status-${answer.questionId}`} className="text-muted-foreground">
                    {validatingQuestionId === answer.questionId ? "Validating..." : answer.isValidated ? "Validated" : "Not Validated"}
                  </Label>
                </div>
              )}

              {answer.monitorings?.some((m: any) => (m.status === "ERROR" || m.status === "FAILED") && m.taskName?.toLowerCase().includes("stt")) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  disabled={retryingQuestionId === answer.questionId}
                  onClick={() => handleRetryStt(answer.participantId, answer.questionId)}
                >
                  {retryingQuestionId === answer.questionId ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  Retry
                </Button>
              )}
            </div>
          </div>

          <p className="text-[#8C929D] font-medium text-sm">
            {answer.questionText}
          </p>

          {editingQuestionId === answer.questionId ? (
            <div className="flex flex-col gap-2 mt-1">
              <Textarea
                value={draftTranscript}
                onChange={(e) => setDraftTranscript(e.target.value)}
                disabled={isUpdatingTranscript}
                className="min-h-[100px]"
                placeholder="Enter the transcript manually..."
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdatingTranscript}
                  onClick={() => setEditingQuestionId(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-[#0076D2] text-white hover:bg-[#005ba3]"
                  disabled={isUpdatingTranscript}
                  onClick={() => handleSaveTranscript(answer.questionId, answer.participantId)}
                >
                  {isUpdatingTranscript ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  Save
                </Button>
              </div>
            </div>
          ) : answer.answerTranscript ? (
            <div className="bg-[#F1F9FA] border-l-2 border-l-[#0076D2] p-3 flex items-start gap-3 mt-1">
              <CornerDownRightIcon className="w-4 h-4 text-[#0076D2] shrink-0 mt-0.5" />
              <p className="text-[#43474F] text-sm leading-relaxed whitespace-pre-wrap">
                {answer.answerTranscript}
              </p>
            </div>
          ) : (
            <p className="text-[#A9ADB5] text-xs italic mt-1">No transcript recorded</p>
          )}
        </div>

        {/* Individual Question AI Scoring */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[#8C929D] font-semibold text-sm">AI Score Breakdown</h4>

          <div className="flex flex-row gap-2 flex-wrap">
            {[
              answer.technicalFundamentalScore,
              answer.problemSolvingScore,
              answer.communicationScore
            ].every((score) => score === null || score === undefined) ? (
              <p className="text-sm text-[#8C929D]">
                The score will be available after AI grading is complete.
              </p>
            ) : (
              [
                { label: "Technical Skill", score: answer.technicalFundamentalScore },
                { label: "Problem Solving", score: answer.problemSolvingScore },
                { label: "Communication", score: answer.communicationScore }
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
  );
}
