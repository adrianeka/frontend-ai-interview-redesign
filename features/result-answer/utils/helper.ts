export function getRecommendationStyle(recommendation?: string) {
  switch (recommendation?.toLowerCase()) {
    case "strong hire":
    case "ready for promotion":
      return { color: "#23BD33", bg: "#E4F7E7", border: "#C9EBDE" };
    case "hire":
    case "meets current level":
      return { color: "#2563EB", bg: "#EAF1FE", border: "#BFD7F9" };
    case "consider":
    case "needs improvement":
      return { color: "#E08F1D", bg: "#FCF1DE", border: "#F3DDB0" };
    case "reject":
    case "significant improvement required":
      return { color: "#E5484D", bg: "#FDECEC", border: "#F5C2C2" };
    default:
      return { color: "#595F6A", bg: "#FAFAFA", border: "#E2E4E6" };
  }
}

export function getSummaryStyle(recommendation?: string) {
  switch (recommendation?.toLowerCase()) {
    case "strong hire":
    case "ready for promotion":
      return { border: "#1FA34A", bg: "#EFFAF1" };
    case "hire":
    case "meets current level":
      return { border: "#0076D2", bg: "#F1F9FA" };
    case "consider":
    case "needs improvement":
      return { border: "#E08F1D", bg: "#FCF1DE" };
    case "reject":
    case "significant improvement required":
      return { border: "#E5484D", bg: "#FDECEC" };
    default:
      return { border: "#6B7280", bg: "#F4F5F6" };
  }
}
