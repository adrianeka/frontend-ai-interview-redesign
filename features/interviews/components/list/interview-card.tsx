"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InterviewCardProps } from "@/features/interviews/types/interview";
import { cn } from "@/lib/utils";
import { MoreVertical, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/**
 * Renders a summary card for an individual interview session.
 * Used primarily in the Interviews List View. Displays key metrics like
 * company, top candidate score, type, and level.
 */
export function InterviewCard({
  title,
  company,
  topCandidate,
  type,
  level,
  description,
  isCompact,
  id,
  isEditable,
  isDeletable,
  onClick,
  onEdit,
  onDelete,
  role,
  isAnswered,
}: InterviewCardProps) {
  const router = useRouter();

  return (
    <Card
      className={cn(
        "bg-white border border-[#E2E4E6] rounded-[12px] p-5 shadow-none flex flex-col w-full font-inter cursor-pointer transition-all hover:shadow-md overflow-hidden h-[100%] gap-3",
      )}
      onClick={onClick}
    >
      {/* Main Content (Flexible weight to push footer down) */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Top row */}
        <div className="flex justify-between items-center">
          <div className="flex h-[36px] items-center gap-2 rounded-[100px] border border-[#E2E4E6] bg-[#f5f5f5] px-3">
            <img
              src="/Location.svg"
              alt="location"
              className="h-[16px] w-[16px] object-contain"
            />
            <span className="text-[13px] font-medium text-[#374151]">
              {company.companyNamePartner || "No Company"}
            </span>
          </div>

          {role !== "Candidate" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1 text-[#0076D2] hover:text-[#4B5563] transition-colors"
                >
                  <MoreVertical size={20} className="text-[#43474F]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="rounded-xl border-[#E2E4E6]"
              >
                <DropdownMenuItem
                  disabled={!isEditable}
                  className="flex items-center gap-2 font-medium py-2 cursor-pointer text-[#707784]"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isEditable) return;
                    onEdit?.();
                  }}
                >
                  <Image src="/Pencil.svg" alt="Edit" width={16} height={16} />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!isDeletable}
                  className="gap-2 text-destructive font-medium py-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                  }}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Heading & Link Badge Row */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-bold text-[#1F2937] text-[18px] leading-[1.2] flex-1 line-clamp-2">
              {title}
            </h3>
          </div>

          <p className="text-[13px] text-[#6B7280] leading-normal line-clamp-3 h-[60px]">
            {description}
          </p>
        </div>
      </div>

      {/* Footer / Actions - Separated by line */}
      <div className="pt-2 mt-auto border-t border-[#F2F2F2] flex items-center justify-between -mx-5"></div>
      <div>
        {/* Badges row */}
        <div
          className={cn(
            "flex flex-wrap transition-all duration-300",
            isCompact ? "gap-1.5" : "gap-2",
          )}
        >
          {/* Hiring Badge */}
          <div
            className={cn(
              "flex h-[28px] items-center gap-1.5 rounded-full px-3 shrink-0 transition-all",
              type === "Hiring" ? "bg-[#3B5BFF]" : "bg-[#10B981]",
              isCompact ? "max-w-[140px]" : "max-w-[100px]",
            )}
          >
            <img
              src="/User.svg"
              alt="user"
              className="h-[12px] w-[12px] invert brightness-0 shrink-0"
            />
            <span className="text-[11px] font-medium text-white truncate">
              {type}
            </span>
          </div>

          {/* Level Badge (Profile) */}
          <div
            className={cn(
              "flex h-[28px] items-center gap-1.5 rounded-full border px-3 transition-all",
              "border-[#7DD3FC] bg-[#F0F9FF]",
              isCompact
                ? "max-w-[100px] h-[24px] px-2 shadow-sm"
                : "max-w-[120px]",
            )}
          >
            <img
              src="/Profile.svg"
              alt="profile"
              className="h-[12px] w-[12px] shrink-0"
            />
            <span
              className={cn(
                "font-medium text-[#0284C7] truncate",
                isCompact ? "text-[10px]" : "text-[12px]",
              )}
            >
              {level}
            </span>
          </div>

          {role !== "Candidate" && (
            <div className="flex items-center gap-1.5">
              <img
                src="/Check.svg"
                alt="check"
                className="h-4 w-4 object-contain"
              />
              <span className="text-[12px] font-medium text-[#A1A1AA]">
                <span className="text-[#4BAC87]">
                  {topCandidate?.split("/")[0] || "0"}
                </span>
                /{topCandidate?.split("/")[1] || "0"}
              </span>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={(e) => {
          e.stopPropagation();

          if (id) router.push(`/interviews/${id}`);
        }}
        disabled={role === "Candidate" && !!isAnswered}
        className="h-[44px] font-semibold bg-[#0076D2] text-[#FAFAFA] pl-5 pr-4 py-2 rounded-[8px] text-[14px] hover:bg-[#005FA3] transition-all flex items-center group"
      >
        {role === "Candidate" ? "Start Interview" : "View Result"}
        <img
          src="/ExternalLink.svg"
          alt="external"
          className="ml-2 object-contain"
          style={{
            width: "11.75px",
            height: "11.75px",
          }}
        />
      </Button>
    </Card>
  );
}
