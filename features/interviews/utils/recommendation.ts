import { CheckIcon, PlusIcon, ClockIcon, XIcon } from "lucide-react";
import React from "react";

/**

* Configuration schema for recommendation status badges and their styling.
 */
export interface ColorMapConfig {
  color: string;
  bgColor: string;
  iconBg: string;
  icon: React.ElementType;
  value: string;
}

/**
 * Color and styling map for 'Hiring' type interviews.
 */
export const hiringColorMap: Record<string, ColorMapConfig> = {
  "Strong Hire": { color: "#4BAC87", bgColor: "#EEF8F4", iconBg: "#C9EBDE", icon: CheckIcon, value: "Strong Hire" },
  "Hire": { color: "#0076D2", bgColor: "#F1F9FA", iconBg: "#DBF2F3", icon: PlusIcon, value: "Hire" },
  "Consider": { color: "#E8A01D", bgColor: "#FFF7E9", iconBg: "#FFE7BA", icon: ClockIcon, value: "Consider" },
  "Reject": { color: "#E84E2C", bgColor: "#FFEEEA", iconBg: "#FFCBBF", icon: XIcon, value: "Reject" },
};

/**
 * Color and styling map for 'Internal Assessment' type interviews.
 */
export const internalAssessmentColorMap: Record<string, ColorMapConfig> = {
  "Ready for Promotion": { color: "#4BAC87", bgColor: "#EEF8F4", iconBg: "#C9EBDE", icon: CheckIcon, value: "Ready for Promotion" },
  "Meets Current Level": { color: "#0076D2", bgColor: "#F1F9FA", iconBg: "#DBF2F3", icon: PlusIcon, value: "Meets Current Level" },
  "Needs Improvement": { color: "#E8A01D", bgColor: "#FFF7E9", iconBg: "#FFE7BA", icon: ClockIcon, value: "Needs Improvement" },
  "Significant Improvement Required": { color: "#E84E2C", bgColor: "#FFEEEA", iconBg: "#FFCBBF", icon: XIcon, value: "Significant Improvement Required" },
};

/**
 * Normalizes recommendation strings returned from the backend into 
 * standard keys that match the keys in our color maps.
 * 
 * @param rec The raw recommendation string from the API
 * @returns The normalized status string or null if unknown
 */
export const mapRecommendationToStatusKey = (rec: string | null | undefined): string | null => {
  if (!rec) return null;

  const lower = rec.toLowerCase();

  if (lower === "strong hire" || lower === "strong-hire") return "Strong Hire";
  if (lower === "hire") return "Hire";
  if (lower === "consider") return "Consider";
  if (lower === "reject") return "Reject";

  if (lower === "ready for promotion" || lower === "ready-for-promotion") return "Ready for Promotion";
  if (lower === "meets current level" || lower === "meets-current-level") return "Meets Current Level";
  if (lower === "needs improvement" || lower === "needs-improvement") return "Needs Improvement";
  if (lower === "significant improvement required" || lower === "significant-improvement-required") return "Significant Improvement Required";

  return null;
};
