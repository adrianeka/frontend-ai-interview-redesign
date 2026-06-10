"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { MapPinIcon, UserPlusIcon, CircleUserIcon, DotIcon } from "lucide-react";
import { InterviewDetail } from "@/features/interviews/types/interview";

/**
 * Props for the InterviewGeneralInfo component.
 */
interface InterviewGeneralInfoProps {
  /** The core interview details object retrieved from the API */
  interviewDetail: InterviewDetail | null;
  /** Total number of candidates in this interview */
  totalCandidatesCount: number;
  /** Array of required technologies/skills */
  techStack: string[];
}

/**
 * Renders the top-level metadata for an interview in the details view.
 * Includes the company location, purpose (Hiring/Internal), target level,
 * title, description, and an expandable tech stack list.
 */
export function InterviewGeneralInfo({
  interviewDetail,
  totalCandidatesCount,
  techStack
}: InterviewGeneralInfoProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Location and Status Badge */}
      <div className="flex flex-row flex-wrap gap-2 h-fit items-center">
        {interviewDetail?.companyNamePartner && (
          <Badge variant="outline" className="px-2 py-1.25 rounded-sm h-fit w-fit bg-[#F5F5F5] border border-[#E2E4E6]">
            <MapPinIcon className="w-3.5 h-3.5 text-[#3366FF] mr-1 inline-block" />
            <span className="text-sm font-medium text-[#43474F]">
              {interviewDetail.companyNamePartner}
            </span>
          </Badge>
        )}

        <Badge className="bg-[#3366FF] text-[#FAFAFA] px-2 py-1.25 h-fit w-fit">
          <UserPlusIcon className="w-3.5 h-3.5 text-[#FAFAFA] mr-1 inline-block" />
          <span className="text-xs font-medium">
            {interviewDetail?.purpose === "HIRING" ? "Hiring" : "Internal Assessment"}
          </span>
        </Badge>

        <Badge className="text-[#3366FF] border-[#3366FF] bg-[#F1F9FA] border px-2 py-1.25 h-fit w-fit">
          <CircleUserIcon className="w-3.5 h-3.5 text-[#3366FF] mr-1 inline-block" />
          <span className="text-xs font-medium">
            {interviewDetail?.levelTarget || "Junior"}
          </span>
        </Badge>

        <Separator orientation="vertical" className="hidden sm:block h-4" />

        <p className="text-[#A9ADB5] text-sm">{totalCandidatesCount} Candidates</p>
      </div>

      <div className="space-y-1">
        {/* Title */}
        <h1 className="text-[#2D2F35] text-2xl sm:text-3xl font-bold">
          {interviewDetail?.name || "Position Details"}
        </h1>

        {/* Description */}
        <p className="text-[#707784] text-base sm:text-lg font-normal">
          {interviewDetail?.description || "No description provided."}
        </p>
      </div>

      {/* Requirement section */}
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="justify-start gap-1.5 text-[#A9ADB5] text-sm [&_svg]:ml-0!">
            Required Tech Stack(s)
          </AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-1.5 py-3 px-4 border-l-4 border-[#E2E4E6]">
            {techStack.length > 0 ? (
              techStack.map((item, index) => (
                <Badge key={index} className="bg-[#F2F2F2] font-medium text-[#595F6A] text-xs py-1 px-2 h-fit w-fit">
                  <DotIcon className="w-3.5 h-3.5 mr-0.5 inline-block" strokeWidth={8} />
                  {item}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-[#8C929D] italic">No technical stack specified</span>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
