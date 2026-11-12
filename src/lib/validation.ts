// Pure, framework-free validation helpers shared by server actions that
// accept public/untrusted input (currently the application form). Kept
// dependency-free so they're trivially unit-testable without mocking
// Next.js or Prisma.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function clamp(value: string, max: number): string {
  return value.slice(0, max);
}

export const APPLICATION_MAX_LEN = {
  name: 120,
  email: 200,
  text: 2000,
};

export type ApplicationInput = {
  name: string;
  email: string;
  experience: string;
  workGoal: string;
  consent: boolean;
};

export type ApplicationFieldErrors = Partial<
  Record<"name" | "email" | "experience" | "workGoal" | "consent", string>
>;

/**
 * Pure server-side validation for the public application form (brief
 * §11 "Application form"). Trims/normalizes first, then validates —
 * callers are responsible for the DB write and the honeypot check.
 */
export function validateApplication(raw: {
  name: string;
  email: string;
  experience: string;
  workGoal: string;
  consent: boolean;
}): { ok: true; value: ApplicationInput } | { ok: false; errors: ApplicationFieldErrors } {
  const name = clamp(raw.name.trim(), APPLICATION_MAX_LEN.name);
  const email = clamp(normalizeEmail(raw.email), APPLICATION_MAX_LEN.email);
  const experience = clamp(raw.experience.trim(), APPLICATION_MAX_LEN.text);
  const workGoal = clamp(raw.workGoal.trim(), APPLICATION_MAX_LEN.text);
  const consent = raw.consent;

  const errors: ApplicationFieldErrors = {};
  if (!name) errors.name = "Укажи имя";
  if (!email || !isValidEmail(email)) errors.email = "Укажи корректный email";
  if (!experience) errors.experience = "Расскажи коротко про опыт";
  if (!workGoal) errors.workGoal = "Опиши рабочую задачу";
  if (!consent) errors.consent = "Нужно согласие на обработку данных заявки";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, value: { name, email, experience, workGoal, consent } };
}
