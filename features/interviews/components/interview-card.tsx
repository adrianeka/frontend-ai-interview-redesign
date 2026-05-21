"use client";

import * as React from "react";
import { MoreVertical, ExternalLink, Link as LinkIcon, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";


interface InterviewCardProps {
  title: string;
  company: {
    companyNamePartner: string | null;
    logo: string;
  };
  progress: {
    current: number;
    total: number;
  };
  type: "Hiring" | "Internal Assessment";
  level: string;
  description: string;
  isCompact?: boolean;
  id?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function InterviewCard({
  title,
  company,
  progress,
  type,
  level,
  description,
  isCompact,
  id,
  onClick,
  onEdit,
  onDelete,
}: InterviewCardProps) {
  const router = useRouter();

  return (
    <Card
      className={cn(
        "bg-white border border-[#E2E4E6] rounded-[15px] p-5 shadow-none flex flex-col w-full font-inter cursor-pointer transition-all hover:shadow-md overflow-hidden",
        isCompact ? "h-[330px]" : "h-[320px]"
      )}
      onClick={onClick}
    >
      {/* Main Content (Flexible weight to push footer down) */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Top row */}
        <div className="flex justify-between items-center">
          <div className="flex h-[36px] items-center gap-2 rounded-[10px] border border-[#F2F2F2] bg-[#F9FAFB] px-3">
            <img
              src="/Location.svg"
              alt="location"
              className="h-[16px] w-[16px] object-contain"
            />
            <span className="text-[13px] font-medium text-[#374151]">
              {company.companyNamePartner || "No Company"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <img
              src="/Check.svg"
              alt="check"
              className="h-4 w-4 object-contain"
            />
            <span className="text-[12px] font-medium text-[#A1A1AA]">
              <span className="text-[#4BAC87]">
                {progress.current}
              </span>
              /{progress.total}
            </span>
          </div>
        </div>

        {/* Badges row */}
        <div className={cn(
          "flex overflow-hidden transition-all duration-300",
          isCompact ? "flex-col gap-1.5 items-start" : "flex-row gap-2 items-center"
        )}>
          {/* Hiring Badge */}
          <div className={cn(
            "flex h-[28px] items-center gap-1.5 rounded-full px-3 shrink-0 transition-all",
            type === "Hiring" ? "bg-[#3B5BFF]" : "bg-[#10B981]",
            isCompact ? "max-w-[140px]" : "max-w-[100px]"
          )}>
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
          <div className={cn(
            "flex h-[28px] items-center gap-1.5 rounded-full border px-3 transition-all",
            "border-[#7DD3FC] bg-[#F0F9FF]",
            isCompact ? "max-w-[100px] h-[24px] px-2 shadow-sm" : "max-w-[120px]"
          )}>
            <img
              src="/Profile.svg"
              alt="profile"
              className="h-[12px] w-[12px] shrink-0"
            />
            <span className={cn(
              "font-medium text-[#0284C7] truncate",
              isCompact ? "text-[10px]" : "text-[12px]"
            )}>
              {level}
            </span>
          </div>
        </div>

        {/* Heading & Link Badge Row */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4 h-[44px]">
            <h3 className="font-bold text-[#1F2937] text-[18px] leading-[1.2] flex-1 line-clamp-2">
              {title}
            </h3>

            {/* Link Badge */}
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] bg-[#EEF2FF] shrink-0 mt-0.5">
              <LinkIcon size={14} className="text-[#3366FF] font-bold" />
            </div>
          </div>

          <p className="text-[13px] text-[#6B7280] leading-normal line-clamp-3 h-[60px]">
            {description}
          </p>
        </div>
      </div>

      {/* Footer / Actions - Separated by line */}
      <div className="pt-2 mt-auto border-t border-[#F2F2F2] flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-[#0076D2] hover:text-[#4B5563] transition-colors p-1">
              <MoreVertical size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="rounded-xl border-[#E2E4E6]">
            <DropdownMenuItem 
              className="gap-2 font-medium py-2 cursor-pointer" 
              onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
            >
              <Edit className="w-4 h-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="gap-2 text-destructive font-medium py-2 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            >
              <Trash2 className="w-4 h-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (id) router.push(`/interviews/${id}`);
          }}
          className="font-semibold bg-[#E0F2FE] text-[#0369A1] pl-5 pr-4 py-2 rounded-[12px] text-[14px] hover:bg-[#BAE6FD] transition-all flex items-center group"
        >
          View Result
          <img
            src="/ExternalLink.svg"
            alt="external"
            className="ml-2 object-contain"
            style={{
              width: "11.75px",
              height: "11.75px",
            }}
          />
        </button>
      </div>

    </Card>
  );
}
