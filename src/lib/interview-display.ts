/** True when the API status represents a fully completed batch interview. */
export function isCompletedBatchInterviewStatus(status: string | undefined | null): boolean {
  if (status == null || status === "") return false
  const s = status.replace(/_/g, " ")
  return /\bcompleted batch\b/i.test(s)
}
