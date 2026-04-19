import dayjs from "dayjs"

/** Dashboard-wide datetime: `DD/MMM/YYYY, hh:mm A` (e.g. `19/Apr/2026, 02:30 PM`). */
export function formatDashboardDateTime(input: string | number | Date | null | undefined): string {
  if (input === null || input === undefined || input === "") return "—"
  const d = dayjs(input)
  if (!d.isValid()) return "—"
  return d.format("DD/MMM/YYYY, hh:mm A")
}
