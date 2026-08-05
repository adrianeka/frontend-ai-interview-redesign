import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Candidate } from "@/features/interviews/types/interview";
import { ColorMapConfig, mapRecommendationToStatusKey } from "@/features/interviews/utils/recommendation";
import { formatInterviewTime } from "@/lib/time";

/**
 * Props for the CandidateCard component.
 */
interface CandidateCardProps {
  /** The candidate data object */
  candidate: Candidate;
  /** The ID of the parent interview */
  interviewId: string;
  /** Configuration map for recommendation colors and labels */
  activeColorMap: Record<string, ColorMapConfig>;
}

/**
 * Renders an individual candidate card showing their name, scores, and status.
 * Used within the candidate list view of an interview details page.
 */
export function CandidateCard({ candidate, interviewId, activeColorMap }: CandidateCardProps) {
  const router = useRouter();

  // Utility to format scores gracefully (e.g. 85.0 -> 85)
  const formatScore = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "-";
    return Number(score).toFixed(1).replace(/\.0$/, "");
  };

  // Map the backend recommendation string to the appropriate UI status configuration
  const rec = candidate.recommendation;
  const mappedKey = mapRecommendationToStatusKey(rec);
  const colorCfg = mappedKey && activeColorMap[mappedKey]
    ? activeColorMap[mappedKey]
    : { color: "#595F6A", bgColor: "#F2F2F2" }; // Fallback gray if unknown

  return (
    <Card
      onClick={() => router.push(`/interviews/${interviewId}/candidates/${candidate.candidateId}`)}
      className="flex flex-row p-4 sm:px-1.25 sm:py-2 ring-0 items-center justify-between w-full cursor-pointer bg-[#ffff] shadow-sm active:scale-[0.995] transition-all duration-200 border-none"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center flex-1 gap-3 sm:gap-6 w-full">
        {/* Recommendation Status Badge */}
        {rec && (
          <div className="min-w-0 sm:min-w-32 shrink-0 max-w-full sm:max-w-64">
            <Badge
              variant="outline"
              style={{ borderColor: colorCfg.color, color: colorCfg.color, backgroundColor: colorCfg.bgColor }}
              className="py-1 px-2 text-sm font-medium whitespace-normal wrap-break-word text-left"
            >
              {mappedKey || rec}
            </Badge>
          </div>
        )}

        <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-0 items-start sm:items-center justify-between pr-4">
          {/* Candidate Name & Score Breakdown */}
          <div className="flex flex-col gap-1 sm:gap-2 justify-center flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[#43474F] font-semibold text-lg">{candidate.name}</p>
              {candidate.isAutoTerminated ? (
                <Badge
                  variant="outline"
                  style={{ borderColor: "#7F1D1D", color: "#fff", backgroundColor: "#7F1D1D" }}
                  className="text-[9px] uppercase font-bold py-0 px-2 h-5 leading-none"
                >
                  DISQUALIFIED
                </Badge>
              ) : candidate.isFlagged ? (
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
            </div>
            <p className="text-sm">
              <span className="text-[#8C929D]">
                Technical ({formatScore(candidate.avgTechnicalFundamentalScore)}%)  •  Problem Solving ({formatScore(candidate.avgProblemSolvingScore)}%)  •  Communication ({formatScore(candidate.avgCommunicationScore)}%)
              </span>{" "}
              <span className="text-[#707784] font-medium whitespace-nowrap">Total Score ({formatScore(candidate.totalScore)}%)</span>
            </p>
          </div>

          {/* Timestamp Info */}
          <div className="flex flex-col gap-0.5 sm:gap-2 justify-center shrink-0">
            <p className="text-[#A9ADB5] text-xs sm:text-sm font-medium">
              Interview Time:
            </p>
            <p className="text-[#707784] text-sm font-medium">
              {formatInterviewTime(candidate.startedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Arrow */}
      <Button
        variant="ghost"
        className="shrink-0 pointer-events-none p-0 w-10 h-10 flex items-center justify-center"
        asChild
      >
        <div>
          <ChevronRightIcon color="#0076D2" className="w-5 h-5" />
        </div>
      </Button>
    </Card>
  );
}
