export function statusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  const s = status.toLowerCase()
  if (s === "completed") return "outline"
  if (s === "active") return "default"
  if (s === "incomplete" || s === "in_progress" || s === "started") return "secondary"
  if (s === "failed" || s === "cancelled" || s === "error") return "destructive"
  return "outline"
}
