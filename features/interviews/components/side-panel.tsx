"use client";

import * as React from "react";
import { ChevronLeft, ChevronDown, Minus, ArrowLeftIcon, DotIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SidePanelProps {
  interview: {
    title: string;
    type: string;
    level: string;
    description: string;
    // Additional fields for the panel
    sessionName?: string;
    techStack?: string;
    context?: string;
    objective?: string;
    questions?: string[];
  } | null;
  onClose: () => void;
}

export function SidePanel({ interview, onClose }: SidePanelProps) {
  const [expandedSections, setExpandedSections] = React.useState({
    context: true,
    objective: true,
    questions: true,
  });

  if (!interview) return null;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside className="w-full lg:w-[450px] bg-[#FAFAFA] border border-slate-200 rounded-2xl p-6 sticky top-24 shadow-sm animate-in slide-in-from-right duration-300 h-[calc(100vh-140px)] flex flex-col">
      <div className="overflow-y-auto pr-2 flex-grow custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          <Button variant="ghost" className="text-muted-foreground" onClick={onClose}>
            <ArrowLeftIcon />
            Back
          </Button>

          <Badge className="bg-[#EEF8F4] border-[#C9EBDE] font-medium text-[#4BAC87] text-xs py-1 px-2 h-fit w-fit">
            <DotIcon strokeWidth={8} data-icon="inline-start" />
            Active
          </Badge>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">
            {interview.title}
          </h2>

          <div className="grid grid-cols-2 gap-y-6 mt-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Session Name
              </p>
              <p className="text-xs font-semibold text-slate-700">
                {interview.sessionName || `${interview.title} Project Based`}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Type
              </p>
              <p className="text-xs font-semibold text-slate-700">
                {interview.type}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1" title={interview.techStack}>
                Technology Stack
              </p>
              <p className="text-xs font-semibold text-slate-700 line-clamp-2">
                {interview.techStack || "React, Typescript, Javascript"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Level Target
              </p>
              <p className="text-xs font-semibold text-slate-700">
                {interview.level}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Context */}
          <div className="border-t border-slate-100 pt-5">
            <button
              className="w-full flex items-center justify-between text-left group"
              onClick={() => toggleSection("context")}
            >
              <span className="text-xs font-bold text-slate-400 uppercase">Context</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-transform",
                  !expandedSections.context && "-rotate-90"
                )}
              />
            </button>
            {expandedSections.context && (
              <div className="mt-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {interview.context || "This interview focuses on assessing the candidate's understanding of cloud computing concepts and their ability to design scalable systems."}
                </p>
              </div>
            )}
          </div>

          {/* Objective */}
          <div className="border-t border-slate-100 pt-5">
            <button
              className="w-full flex items-center justify-between text-left group"
              onClick={() => toggleSection("objective")}
            >
              <span className="text-xs font-bold text-slate-400 uppercase">Objective</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-transform",
                  !expandedSections.objective && "-rotate-90"
                )}
              />
            </button>
            {expandedSections.objective && (
              <div className="mt-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {interview.objective || "Evaluate candidate's proficiency in designing and implementing cloud-based solutions, assessing their knowledge of architectural patterns."}
                </p>
              </div>
            )}
          </div>

          {/* Questions */}
          <div className="border-t border-slate-100 pt-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase">Questions</span>
              <button onClick={() => toggleSection("questions")}>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-slate-300 hover:text-slate-500 transition-transform",
                    !expandedSections.questions && "-rotate-90"
                  )}
                />
              </button>
            </div>

            {expandedSections.questions && (
              <div className="space-y-3 pb-4">
                {(interview.questions || [
                  "Evaluate candidate's proficiency in designing and implementing cloud-based solutions?",
                  "Evaluate candidate's proficiency in designing and implementing cloud-based solutions?",
                  "Evaluate candidate's proficiency in designing and implementing cloud-based solutions?",
                ]).map((q, i) => (
                  <div
                    key={i}
                    className="bg-[#f0f9ff]/50 rounded-xl p-4 border border-[#e0f2fe] relative overflow-hidden group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-blue-600">Question {i + 1}</p>
                      <button className="text-blue-300 hover:text-blue-500 transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {q}
                    </p>
                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-full opacity-50"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
