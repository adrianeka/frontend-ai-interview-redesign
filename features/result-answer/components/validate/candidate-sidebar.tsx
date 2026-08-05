"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnswerDetailItem, ViolationItem } from "../../hooks/use-result-detail";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlayCircle, AlertTriangle, CheckCircle2, MapPin, Loader2 } from "lucide-react";

interface CandidateSidebarProps {
  companyName?: string;
  candidateName: string;
  roleTarget?: string;
  isCompleted: boolean;
  sortedAnswers: AnswerDetailItem[];
  validatedCount: number;
  totalQuestions: number;
  allValidated: boolean;
  isDoneValidating: boolean;
  isGradingInProgress?: boolean;
  onDoneValidate: () => void;
  violations?: ViolationItem[];
  onPlayViolation?: (questionId: string, timeInSeconds: number) => void;
  // edit start — added isAutoTerminated for disqualified banner (2026-07-22)
  isAutoTerminated?: boolean;
  // edit end
}

/*
edit start
by: Zahra Hilyatul J
date: 2026-06-29
description: Added Loader2 and updated text for the validation submission button
*/
export function CandidateSidebar({
  companyName,
  candidateName,
  roleTarget,
  isCompleted,
  sortedAnswers,
  validatedCount,
  totalQuestions,
  allValidated,
  isDoneValidating,
  isGradingInProgress,
  onDoneValidate,
  violations = [],
  onPlayViolation,
  isAutoTerminated = false,
}: CandidateSidebarProps) {
  
/*
edit start
by: Zahra Hilyatul J
date: 2026-07-20
description: Added formatting helpers and Integrity Report accordion for anti-cheat
*/
  const formatTime = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: true }).format(new Date(isoString));
    } catch {
      return "--:-- AM";
    }
  };

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
/*
edit end
*/

  return (
    <div className="sticky top-4 rounded-[1rem] border border-[#E2E4E6] bg-white p-5">
      <div className="rounded-[100px] border border-[#E2E4E6] bg-[#f5f5f5] inline-flex items-center gap-1.5 bg-[#F4F4F5] text-slate-500 text-xs font-medium py-1 rounded-full mb-4 px-3">
        <MapPin className="w-3 h-3" />
        {companyName ?? "—"}
      </div>

      <div className="flex gap-3 mb-1">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0076D2] font-bold text-lg flex items-center justify-center uppercase shrink-0">
          {candidateName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-base font-semibold text-slate-800">
              {candidateName}
            </p>
            {/* edit start — Disqualified badge replaces violation badge when auto-terminated (2026-07-22) */}
            {isAutoTerminated ? (
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
              <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100 border-emerald-200 text-[10px] uppercase font-bold py-0 px-2 h-5">
                Clean
              </Badge>
            )}
            {/* edit end */}
          </div>
          <p className="text-xs text-slate-400 mb-0.5">Interview Role :</p>
          <p className="text-sm text-slate-600 mb-5">{roleTarget ?? "—"}</p>
        </div>
      </div>

      {violations.length > 0 && (
        <Accordion type="single" collapsible className="w-full mb-4">
          <AccordionItem value="integrity" className="border border-destructive/20 rounded-lg bg-destructive/5 px-3 overflow-hidden">
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
              {violations.map((v) => {
                const relTime = parseRelativeTime(v.details);
                return (
                  <div key={v.id} className="flex flex-col gap-1.5 p-2 bg-background rounded-md border border-destructive/10">
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
                          onClick={() => onPlayViolation?.(v.questionId!, relTime)}
                          className="h-6 text-xs text-primary hover:text-primary/90 hover:bg-primary/10 px-2"
                        >
                          <PlayCircle className="w-3.5 h-3.5 mr-1" /> Play @ {formatSeconds(relTime)}
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 mt-1">
                      {v.questionText && (
                        <span className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="font-semibold">Question:</span>
                          <span className="truncate max-w-[150px]">{v.questionText}</span>
                          {v.kpiMapping && (
                            <Badge className="bg-destructive hover:bg-destructive/90 text-[9px] py-0 px-1 rounded-sm">
                              {v.kpiMapping}
                            </Badge>
                          )}
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* edit start — hide validation section entirely if candidate was auto-terminated (2026-07-22) */}
      {isAutoTerminated ? (
        <>
          <div className="py-2 border-t border-[#F2F2F2] -mx-7"></div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm font-bold text-red-800 mb-1">Sesi Dihentikan Otomatis</p>
            <p className="text-xs text-red-600">
              Kandidat ini dinyatakan gugur karena melebihi batas pelanggaran. Tidak ada nilai atau laporan yang dihasilkan.
            </p>
          </div>
        </>
      ) : (
        <>
          {!isCompleted && (
            <>
              <div className="flex items-center gap-6 mb-3">
                <span className="text-base font-semibold text-slate-800">
                  Validate Your Answer
                </span>{" "}
                <Badge
                  style={{ color: "#FAFAFA", background: "#23BD33" }}
                  className="gap-1 font-medium px-2 py-0.5 rounded-full text-[11px]"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {validatedCount}/{totalQuestions}
                </Badge>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 gap-1 sm:gap-2 mb-5">
                {sortedAnswers.map((answer) => (
                  <div
                    key={answer.questionId}
                    style={
                      answer.isValidated
                        ? {
                            backgroundColor: "#E4F7E7",
                            color: "#23BD33",
                            border: "none",
                          }
                        : { color: "#A9ADB5", border: "1px solid #A9ADB5" }
                    }
                    className="aspect-square rounded-[0.5rem] text-[1rem] font-medium transition-colors flex items-center justify-center"
                  >
                    {answer.questionNumber}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="py-2 border-t border-[#F2F2F2] -mx-7"></div>

          {isCompleted ? (
            <p className="text-base font-semibold text-[#A9ADB5] text-center">
              Completed
            </p>
          ) : (
            <Button
              disabled={!allValidated || isDoneValidating || isGradingInProgress}
              onClick={onDoneValidate}
              className="w-full bg-[#0076D2] hover:bg-[#005FA3] text-white rounded-[0.625rem] px-6 disabled:bg-slate-200 disabled:text-slate-400 flex items-center justify-center gap-2"
            >
              {isGradingInProgress ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Dalam Proses...
                </>
              ) : isDoneValidating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Waiting Result...
                </>
              ) : (
                "Done Validate"
              )}
            </Button>
          )}
        </>
      )}
      {/* edit end */}
    </div>
  );
}
/*
edit end
*/
