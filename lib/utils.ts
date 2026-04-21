type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, boolean | null | undefined>
  | ClassValue[]

function flatten(value: ClassValue): string[] {
  if (value == null || value === false) return []
  if (typeof value === "string" || typeof value === "number") return [String(value)]
  if (Array.isArray(value)) return value.flatMap(flatten)
  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k)
  }
  return []
}

/** Join class names without extra dependencies (Tailwind-friendly). */
export function cn(...inputs: ClassValue[]): string {
  return inputs.flatMap(flatten).join(" ")
}
