"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  CheckCircle2,
  Clock,
  CornerDownRightIcon,
  X,
  AlertTriangle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AnswerDetailItem } from "../../hooks/use-result-detail";
import { ConfirmValidateModal } from "./confirm-validate-modal";

interface QuestionCardProps {
  answer: AnswerDetailItem;
  onValidate: () => void;
  onSaveTranscript: (text: string) => Promise<void>;
  isValidating: boolean;
  isSaving: boolean;
  playRequest?: { questionId: string; time: number } | null;
}

export function QuestionCard({
  answer,
  onValidate,
  onSaveTranscript,
  isValidating,
  isSaving,
  playRequest,
}: QuestionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(answer.answerTranscript);
  const [showConfirm, setShowConfirm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (playRequest?.questionId === answer.questionId && videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      videoRef.current.currentTime = playRequest.time;
      videoRef.current.play().catch(e => console.error("Playback failed", e));
    }
  }, [playRequest, answer.questionId]);

  const handleSave = async () => {
    await onSaveTranscript(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(answer.answerTranscript);
    setIsEditing(false);
  };

  const handleConfirmValidate = () => {
    setShowConfirm(false);
    onValidate();
  };

  return (
    <>
      <ConfirmValidateModal
        open={showConfirm}
        questionNumber={answer.questionNumber}
        onConfirm={handleConfirmValidate}
        onCancel={() => setShowConfirm(false)}
        isLoading={isValidating}
      />

      <div className="py-5 border-b border-[#E2E4E6] last:border-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="col-span-1 rounded-xl">
            <video
              ref={videoRef}
              src={answer.videoUrl}
              className="max-w-[320px] aspect-[320/204] object-cover rounded-xl w-full bg-slate-900"
              controls
              preload="metadata"
            />
          </div>

          <div className="col-span-1 sm:col-span-2 flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-slate-800">
                Question {answer.questionNumber}
              </h3>
              {answer.isValidated ? (
                <Badge
                  style={{ color: "#52BD94" }}
                  className="bg-[#EEF8F4] border-[#C9EBDE] gap-1 font-medium px-2 py-0.5 rounded-full text-[11px]"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Success
                </Badge>
              ) : (
                <Badge
                  style={{ color: "#595F6A" }}
                  className="bg-[#FAFAFA] border-[#E2E4E6] gap-1 font-medium px-2 py-0.5 rounded-full text-[11px]"
                >
                  <Clock className="w-3 h-3" />
                  Pending
                </Badge>
              )}
            </div>

            <p className="text-sm text-slate-500 mb-2">{answer.questionText}</p>

            {/* Assume there's an isFlagged or hasViolation flag for the question answer */}
            {/* For demonstration, we'll conditionally render this based on some mocked logic or just a boolean if backend provides it */}
            {(answer as any).hasViolation && (
              <Badge className="bg-red-50 text-red-600 border-red-200 text-xs py-0.5 px-2 w-fit mb-3 flex items-center gap-1.5 font-semibold hover:bg-red-100 transition-colors">
                <AlertTriangle className="w-3.5 h-3.5" />
                Cheating Detected
              </Badge>
            )}

            {isEditing ? (
              <div className="mb-4">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={4}
                  className="text-sm text-slate-700 border-[#0076D2] focus-visible:ring-[#0076D2] resize-none"
                />
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#0076D2] hover:bg-[#005FA3] text-white rounded-[0.625rem] px-5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="rounded-[0.625rem] px-5 border-[#E2E4E6] text-slate-500 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-[#F1F9FA] border-l-2 border-l-[#0076D2] p-3 flex items-start gap-3 mt-1">
                <CornerDownRightIcon className="w-4 h-4 text-[#0076D2] shrink-0 mt-0.5" />
                <p className="text-[#43474F] text-sm leading-relaxed whitespace-pre-wrap">
                  {answer.answerTranscript}
                </p>
              </div>
            )}

            {!answer.isValidated && !isEditing && (
              <div className="flex items-center gap-2 mt-6">
                <Button
                  onClick={() => setShowConfirm(true)}
                  disabled={isValidating}
                  className="bg-[#0076D2] hover:bg-[#005FA3] text-white rounded-[0.625rem] px-6"
                >
                  {isValidating ? "Validating..." : "Validate"}
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDraft(answer.answerTranscript);
                    setIsEditing(true);
                  }}
                  className="bg-white text-[#0076D2] border-[#0076D2] hover:bg-[#F1F9FA] hover:text-[#005FA3] rounded-[0.625rem] px-6"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
