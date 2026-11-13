// What other participants see instead of an email address. Emails stay
// visible only in admin screens; the workspace never sends them to peers.
export const MAX_DISPLAY_NAME_LEN = 60;

export function displayName(
  user: { name?: string | null } | null | undefined,
  fallback = "Участник",
): string {
  const name = user?.name?.trim();
  return name ? name.slice(0, MAX_DISPLAY_NAME_LEN) : fallback;
}

/** Normalises a name typed into a form: trims, collapses whitespace, caps length. Empty → null. */
export function normalizeDisplayName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw.replace(/\s+/g, " ").trim().slice(0, MAX_DISPLAY_NAME_LEN);
  return cleaned || null;
}
