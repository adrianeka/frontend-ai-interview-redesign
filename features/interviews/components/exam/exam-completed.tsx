"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ExamCompleted() {
  const router = useRouter();

  return (
    <div className="min-h-[75vh] bg-[#F5F6F8] flex items-center justify-center p-6">
      <div className="bg-white rounded-[0.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.08)] w-full max-w-[27.5rem] overflow-hidden">
        <div className="flex flex-col items-center text-center px-8 py-10 gap-3">
          <img
            src="/CheckCircle.svg"
            alt="close"
            className="w-[3.25rem] h-[3.25rem]"
          />
          <h2 className="text-[1.125rem] font-bold text-[#2D2F35]">
            Interview Completed Successfully
          </h2>
          <p className="text-[0.8125rem] text-[#555555] leading-relaxed">
            Responses have been submitted and are being processed.
            <br />
            Visit the Monitoring page to{" "}
            <span className="font-semibold text-[#555555]">
              validate interview
            </span>{" "}
            results.
          </p>
        </div>
        <div className="border-t border-[#F2F2F2] -mx-7"></div>
        <div className="px-8 py-5">
          <Button
            onClick={() => router.push("/result-answer")}
            className="w-full h-[2.75rem] bg-[#0076D2] hover:bg-[#005FA3] text-white rounded-[0.625rem] font-semibold text-[0.875rem]"
          >
            Go to Validate
          </Button>
        </div>
      </div>
    </div>
  );
}
