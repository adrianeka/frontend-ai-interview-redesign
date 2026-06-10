"use client";

import * as React from "react";
import { ChevronLeft, ChevronDown, Minus, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { interviewService } from "@/features/interviews/services/interview-service";
import { InterviewDetail } from "@/features/interviews/types/interview";
import { Button } from "@/components/ui/button";

/**
 * Props for the SidePanel component.
 */
interface SidePanelProps {
  /** ID of the interview to display details for */
  interviewId: string | null;
  /** Callback to close the side panel */
  onClose: () => void;
}

/**
 * Slide-out panel for displaying quick details about a specific interview.
 * Fetches and shows context, objective, and a list of questions without leaving the list view.
 */
export function SidePanel({ interviewId, onClose }: SidePanelProps) {
  const [data, setData] = React.useState<InterviewDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const [expandedSections, setExpandedSections] = React.useState({
    context: true,
    objective: true,
    questions: true,
  });

  const [expandedQuestions, setExpandedQuestions] = React.useState<
    Record<string, boolean>
  >({});

  const fetchDetail = React.useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const result = await interviewService.getInterviewById(id);
      setData(result);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (interviewId) {
      fetchDetail(interviewId);
    } else {
      setData(null);
    }
  }, [interviewId, fetchDetail]);

  if (!interviewId) return null;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: prev[id] === false ? true : false,
    }));
  };

  return (
    <aside className="w-full lg:w-[450px] shrink-0 bg-white border border-slate-200 rounded-2xl p-6 sticky top-24 shadow-sm animate-in slide-in-from-right duration-500 h-[calc(100vh-120px)] flex flex-col">
      <div className="overflow-y-auto pr-2 grow custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-medium transition-colors p-0"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded flex items-center gap-1 border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Active
          </span>
        </div>

        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : data ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                {data.name}
              </h2>

              <div className="grid grid-cols-2 gap-y-6 mt-6">
                <div>
                  <p className="text-[11px] text-[#A9ADB5] tracking-wider mb-1">
                    Session Name
                  </p>
                  <p className="text-xs text-[#43474F] font-semibold">
                    {data.name}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[#A9ADB5] tracking-wider mb-1">
                    Type
                  </p>
                  <p className="text-xs text-[#43474F] font-semibold">
                    {data.purpose === "HIRING" ? "Hiring" : "Internal Assessment"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[#A9ADB5] tracking-wider mb-1">
                    Language
                  </p>
                  <p className="text-xs text-[#43474F] font-semibold line-clamp-2">
                    {data.language === "IN" ? "Indonesia" : data.language === "EN" ? "English" : data.language || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[#A9ADB5] tracking-wider mb-1">
                    Level Target
                  </p>
                  <p className="text-xs text-[#43474F] font-semibold">
                    {data.levelTarget}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] text-[#A9ADB5] tracking-wider mb-1">
                    Technology(s)
                  </p>
                  <p className="text-xs text-[#43474F] font-semibold leading-relaxed">
                    {data.technology}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Context */}
              <div className="border-t border-slate-100 pt-5">
                <Button
                  variant="ghost"
                  onClick={() => toggleSection("context")}
                  className="w-full flex items-center gap-3 text-left group p-0 hover:bg-transparent"
                >
                  <span className="text-xs text-[#A9ADB5] whitespace-nowrap">
                    Context
                  </span>

                  <div className="flex-1 h-px bg-slate-200" />

                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-transform",
                      !expandedSections.context && "-rotate-90"
                    )}
                  />
                </Button>

                {expandedSections.context && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {data.context}
                    </p>
                  </div>
                )}
              </div>

              {/* Objective */}
              <div className="border-t border-slate-100 pt-5">
                <Button
                  variant="ghost"
                  onClick={() => toggleSection("objective")}
                  className="w-full flex items-center gap-3 text-left group p-0 hover:bg-transparent"
                >
                  <span className="text-xs text-[#A9ADB5] whitespace-nowrap">
                    Objective
                  </span>

                  <div className="flex-1 h-px bg-slate-200" />

                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-transform",
                      !expandedSections.objective && "-rotate-90"
                    )}
                  />
                </Button>

                {expandedSections.objective && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {data.objective}
                    </p>
                  </div>
                )}
              </div>

              {/* Questions */}
              <div className="border-t border-slate-100 pt-5 mb-4">
                <Button
                  variant="ghost"
                  onClick={() => toggleSection("questions")}
                  className="w-full flex items-center gap-3 text-left group mb-4 p-0 hover:bg-transparent"
                >
                  <span className="text-xs text-[#A9ADB5] whitespace-nowrap">
                    Questions
                  </span>

                  <div className="flex-1 h-px bg-slate-200" />

                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-transform",
                      !expandedSections.questions && "-rotate-90"
                    )}
                  />
                </Button>
                {expandedSections.questions && (
                  <div className="space-y-3 pb-4">
                    {data.questions.map((q, i) => {
                       const isExpanded = expandedQuestions[q.id] !== false;
                       return (
                         <div
                           key={q.id || i}
                           className="relative overflow-hidden border border-[#D0E7FF] bg-white flex flex-col transition-all duration-300"
                         >
                           {/* Header Section */}
                           <div
                             className="relative bg-[#EBF5FF] px-4 py-3 cursor-pointer flex items-center justify-between"
                             onClick={() => toggleQuestion(q.id)}
                           >
                             {/* Garis kiri Biru */}
                             <div className="absolute left-0 top-0 h-full w-[4px] bg-[#0076D2]" />

                             <p className="text-[13px] font-bold text-[#0076D2] ml-2">
                               Question {q.orderNumber || i + 1}
                             </p>
                             <Button
                               variant="ghost"
                               size="icon"
                               className="text-[#8FD3FF] hover:text-[#0076D2] transition-colors p-0"
                             >
                               {isExpanded ? (
                                 <Minus className="h-4 w-4" strokeWidth={3} />
                               ) : (
                                 <Plus className="h-4 w-4" strokeWidth={3} />
                               )}
                             </Button>
                           </div>

                           {/* Content Section */}
                           {isExpanded && (
                             <div className="relative bg-[#F8FAFC] px-4 py-3.5 border-t border-[#D0E7FF] animate-in slide-in-from-top-2 duration-300">
                               {/* Garis kiri Abu-abu */}
                               <div className="absolute left-0 top-0 h-full w-[4px] bg-[#E2E4E6]" />

                               <p className="text-[13px] leading-[20px] text-[#4B5563] font-medium ml-2">
                                 {q.questionText}
                               </p>
                             </div>
                           )}
                         </div>
                       );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-slate-400">
            Failed to load details.
          </div>
        )}
      </div>
    </aside>
  );
}
