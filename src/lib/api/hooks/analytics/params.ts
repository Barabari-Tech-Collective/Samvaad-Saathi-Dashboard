/** Values allowed in OpenAPI query strings for these GET endpoints. */
export type QueryParamInput = Record<string, string | number | boolean | undefined | null>

/** Strip undefined/null/empty-string so axios omits them from the query string. */
export function compactParams(obj: QueryParamInput | undefined): Record<string, string | number | boolean> | undefined {
  if (!obj) return undefined
  const out: Record<string, string | number | boolean> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== "") {
      out[k] = v
    }
  }
  return Object.keys(out).length > 0 ? out : undefined
}
