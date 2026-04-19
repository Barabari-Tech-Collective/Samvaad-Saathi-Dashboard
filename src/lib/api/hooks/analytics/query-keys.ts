import type { QueryKey } from "@tanstack/react-query"

/**
 * TanStack query key: endpoint path first, then serializable params that affect the response.
 */
export function analyticsKey(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): QueryKey {
  if (!params) return [path]
  const cleaned: Record<string, string | number | boolean> = {}
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      cleaned[k] = v
    }
  }
  return Object.keys(cleaned).length > 0 ? [path, cleaned] : [path]
}
