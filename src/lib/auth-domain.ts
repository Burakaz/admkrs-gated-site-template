/**
 * Domain-Gate fuer den Google-Login (identisches Muster wie der admkrs-Hub).
 * Zugriff haben ausschliesslich Konten der erlaubten Domain
 * (ALLOWED_EMAIL_DOMAIN, Default "admkrs.com").
 */

export function allowedEmailDomain(): string {
  return process.env.ALLOWED_EMAIL_DOMAIN ?? "admkrs.com";
}

/** Prueft case-insensitiv, ob eine E-Mail zur erlaubten Domain gehoert. */
export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase().endsWith(`@${allowedEmailDomain().toLowerCase()}`);
}
