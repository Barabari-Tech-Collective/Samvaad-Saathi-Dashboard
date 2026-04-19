import dayjs from "dayjs"

export function formatChartAxisDate(iso: string): string {
  const d = dayjs(iso)
  return d.isValid() ? d.format("DD MMM") : "—"
}

const METRIC_LABELS: Readonly<Record<string, string>> = {
  wpm: "Words per minute",
  pause_score: "Pause score",
  filler_density: "Filler density",
  energy: "Energy",
  consistency: "Consistency",
  technical_accuracy: "Technical accuracy",
  structure_quality: "Structure quality",
  relevance: "Relevance",
  examples_given: "Examples given",
  poor_structure: "Poor structure",
}

export function skillMetricLabel(metric: string): string {
  return METRIC_LABELS[metric] ?? metric.replace(/_/g, " ")
}
