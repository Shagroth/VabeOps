// Pure parsing for the admin "enroll participant" form. Auth.js lower-cases
// the email before looking the user up, so we store it the same way —
// otherwise a pre-created user wouldn't match their own magic-link sign-in.
import { isValidEmail, normalizeEmail } from "./validation.ts";
import { normalizeDisplayName } from "./display-name.ts";

export type EnrollmentInput = {
  email: string;
  level: "NOVICE" | "STRONG";
  name: string | null;
};

export function parseEnrollmentInput(raw: {
  email: unknown;
  level: unknown;
  name?: unknown;
}): { ok: true; value: EnrollmentInput } | { ok: false; error: string } {
  const email = typeof raw.email === "string" ? normalizeEmail(raw.email) : "";
  if (!isValidEmail(email)) return { ok: false, error: "Некорректный email" };
  const level = raw.level === "STRONG" ? "STRONG" : raw.level === "NOVICE" ? "NOVICE" : null;
  if (!level) return { ok: false, error: "Не выбран уровень" };
  return { ok: true, value: { email, level, name: normalizeDisplayName(raw.name) } };
}

/** Roles an admin may assign from the UI. ADMIN itself is deliberately excluded. */
export const ASSIGNABLE_ROLES = ["STUDENT", "MENTOR"] as const;
export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export function isAssignableRole(role: unknown): role is AssignableRole {
  return (ASSIGNABLE_ROLES as readonly unknown[]).includes(role);
}
