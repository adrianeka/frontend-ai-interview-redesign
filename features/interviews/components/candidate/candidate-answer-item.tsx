import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  CornerDownRightIcon,
  PencilIcon,
  DownloadIcon,
  Clock,
  VideoOff
} from "lucide-react";

/**
 * Props for the CandidateAnswerItem component.
 */
interface CandidateAnswerItemProps {
  /** Complex object containing all answer details */
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
  playRequest?: { questionId: string; time: number } | null;
  violations?: any[];
}

/**
 * Derives a specific human-readable error label from the monitoring taskName.
 */
function getErrorLabel(taskName?: string, messageError?: string): string {
  if (messageError) {
    const msgLower = messageError.toLowerCase();
    if (msgLower.includes("object does not exist") || msgLower.includes("minio") || msgLower.includes("download file")) {
      return "Video File Missing (Storage 404)";
    }
  }
  if (!taskName) return "Processing Error";
  const lower = taskName.toLowerCase();
  if (lower.includes("speech") || lower.includes("stt") || lower.includes("convert")) {
    return "Speech-to-Text Conversion Error";
  }
  if (lower.includes("insert") || lower.includes("save") || lower.includes("answer")) {
    return "Answer Table Insertion Error";
  }
  if (lower.includes("grading")) return "Grading Error";
  if (lower.includes("validation")) return "Validation Error";
  return taskName;
}

/**
 * Renders an individual candidate answer including the question text, video recording,
 * STT transcript, and individual AI grading scores (Technical, Problem Solving, Communication).
 * Also provides controls for editing the transcript, downloading the video, and toggling validation.
 */
/*
edit start
by: Zahra Hilyatul J
date: 2026-06-29
description: Added error states for video missing, retry STT button in UI, and awaiting transcription placeholder
*/
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
  handleRetryStt,
  playRequest,
  violations = []
}: CandidateAnswerItemProps) {
  const [videoError, setVideoError] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (playRequest?.questionId === answer.questionId && videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      videoRef.current.currentTime = playRequest.time;
      videoRef.current.play().catch(e => console.error("Playback failed", e));
    }
  }, [playRequest, answer.questionId]);

  const hasQuestionViolation = violations.some(v => v.questionId === answer.questionId);

  const monStatus = (() => {
    if (answer.isValidated) return { type: "success", label: "Validated" };
    if (!answer.monitorings || answer.monitorings.length === 0) return { type: "muted", label: "Pending" };
    const err = answer.monitorings.find((m: any) => m.status === "ERROR" || m.status === "FAILED" || m.messageError);
    if (err) {
      // Tampilkan label error yang spesifik berdasarkan taskName proses yang gagal
      const errorLabel = getErrorLabel(err.taskName, err.messageError);
      return { type: "danger", label: errorLabel };
    }
    const allSuccess = answer.monitorings.every((m: any) => m.status === "SUCCESS");
    if (allSuccess) return { type: "success", label: "Success" };
    return { type: "muted", label: "Pending" };
  })();

  // Apakah ada proses yang sedang berjalan (in-progress atau belum dimulai)
  const isAwaitingTranscription = !answer.isValidated && !answer.answerTranscript;

  // Apakah ada error monitoring untuk tombol Retry (semua tipe error, bukan hanya STT)
  const hasAnyError = answer.monitorings?.some(
    (m: any) => m.status === "ERROR" || m.status === "FAILED"
  );

  const badgeCfg = statusColorMap[monStatus.type] || statusColorMap["muted"];
  const BadgeIcon = badgeCfg.icon;

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-3">
      {/* Video Player or Placeholder */}
      {answer.videoUrl && !videoError ? (
        <video
          ref={videoRef}
          src={answer.videoUrl}
          controls
          preload="none"
          className="w-full lg:w-[501px] h-[320px] rounded-lg object-cover shrink-0 bg-black shadow-sm"
          poster="https://placehold.co/501x320?text=Interview+Recording"
          onError={() => setVideoError(true)}
        />
      ) : (
        <div
          className="w-full lg:w-[501px] h-[320px] rounded-lg relative overflow-hidden flex flex-col items-center justify-center p-6 shrink-0 bg-gray-200 border-2 border-dashed border-[#E2E4E6]"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm font-medium">
            <VideoOff className="w-8 h-8 text-red-400" />
            <span>Video file is missing or corrupted on storage server</span>
          </div>
        </div>
      )}

      {/* Question & Answer Details */}
      <div className="flex flex-col gap-6 flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
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

              {hasQuestionViolation && (
                <Badge
                  variant="outline"
                  style={{ borderColor: "#E84E2C", color: "#E84E2C", backgroundColor: "#FFEEEA" }}
                  className="text-[12px] uppercase font-bold py-0 px-2 h-5"
                >
                  Violation Detected
                </Badge>
              )}

              {/* Tombol Retry — muncul untuk SEMUA tipe error monitoring */}
              {hasAnyError && !answer.isValidated && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-400 text-red-500 hover:bg-red-50 h-7 px-2.5 text-xs gap-1.5"
                  disabled={retryingQuestionId === answer.questionId}
                  onClick={() => handleRetryStt(answer.participantId, answer.questionId)}
                >
                  {retryingQuestionId === answer.questionId
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : null}
                  Retry
                </Button>
              )}
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
          ) : isAwaitingTranscription ? (
            /* Placeholder saat menunggu transkripsi — lebih informatif dari sekadar teks kecil */
            <div className="bg-[#F8FAFB] border border-dashed border-[#CBD5E1] rounded-md p-3 flex items-center gap-2 mt-1">
              <Clock className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
              <span className="text-[#94A3B8] text-sm italic">Awaiting transcription</span>
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
/*
edit end
*/

