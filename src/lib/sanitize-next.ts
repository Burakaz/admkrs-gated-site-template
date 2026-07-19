/**
 * Sanitisiert den "next"-Parameter des OAuth-Callbacks gegen Open-Redirects.
 * Erlaubt sind nur interne Pfade (wie im admkrs-Hub).
 */
export function sanitizeNext(next: string | null | undefined): string {
  if (!next) return "/";
  if (!next.startsWith("/")) return "/";
  if (next.startsWith("//")) return "/";
  if (next.includes("://")) return "/";
  if (next.includes("\\")) return "/";
  return next;
}
