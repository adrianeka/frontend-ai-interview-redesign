"use client";

import React from "react";

interface CandidateProgressStepperProps {
  stepProgress: {
    transcribeAndIntegrationAnswer?: boolean;
    validateAnswer?: boolean;
    gradingAnswer?: boolean;
    resultMappingAnswer?: boolean;
  } | null | undefined;
}

export function CandidateProgressStepper({ stepProgress }: CandidateProgressStepperProps) {
  // Step 1: Transcription and Answer Integration
  const step1Status = stepProgress?.transcribeAndIntegrationAnswer ? "completed" : "active";

  // Step 2: Candidate Validation
  const step2Status = stepProgress?.validateAnswer ? "completed" : (step1Status === "completed" ? "active" : "disabled");

  // Step 3: Grading Answer by AI
  const step3Status = stepProgress?.gradingAnswer ? "completed" : (step2Status === "completed" ? "active" : "disabled");

  // Step 4: Result
  const step4Status = stepProgress?.resultMappingAnswer ? "completed" : (step3Status === "completed" ? "active" : "disabled");

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
        <div className={`hidden md:block absolute top-[13px] left-[50%] w-[calc(100%+1.5rem)] z-0 ${step3Status !== "disabled" ? "h-[2px] bg-[#0076D2]" : "h-px bg-[#E2E4E6]"}`} />
        <div className={`relative z-10 w-7 h-7 shrink-0 font-bold rounded-full flex items-center justify-center text-sm ${step2.circle}`}>
          2
        </div>
        <span className={`text-center text-sm leading-tight mt-2 ${step2.text}`}>
          Candidate Validation
        </span>
      </div>

      {/* Step 3 */}
      <div className="relative flex flex-col items-center w-[134px]">
        <div className={`hidden md:block absolute top-[13px] left-[50%] w-[calc(100%+1.5rem)] z-0 ${step4Status !== "disabled" ? "h-[2px] bg-[#0076D2]" : "h-px bg-[#E2E4E6]"}`} />
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
  );
}
