/**
 * Normalizes company names for consistent storage and deduplication.
 * "Google", "GOOGLE", "google " → "google"
 */
export function normalizeCompany(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // strip special chars
    .replace(/\s+/g, " ");       // collapse whitespace
}

/**
 * Display-friendly version of a normalized company name
 * "google" → "Google"
 */
export function displayCompany(name: string): string {
  return name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Validates and parses a numeric field. Returns null if invalid.
 */
export function parsePositiveNumber(
  value: unknown,
  fieldName: string
): { value: number } | { error: string } {
  const n = Number(value);
  if (isNaN(n) || n < 0) {
    return { error: `${fieldName} must be a non-negative number` };
  }
  return { value: n };
}
