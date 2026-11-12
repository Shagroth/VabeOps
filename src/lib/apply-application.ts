// Core application-submission logic, factored out of
// app/apply/actions.ts so duplicate-submission and DB-failure handling
// are testable with an in-memory fake store instead of a real database.
import { validateApplication, type ApplicationInput, type ApplicationFieldErrors } from "./validation.ts";
import { log, maskEmail } from "./logger.ts";

export type ApplyResult = { ok: true } | { ok: false; errors: ApplicationFieldErrors };

export type ApplicationStore = {
  findByEmail(email: string): Promise<unknown | null>;
  create(data: ApplicationInput): Promise<void>;
};

export async function processApplicationSubmission(
  formData: FormData,
  store: ApplicationStore,
  correlationId: string
): Promise<ApplyResult> {
  // Honeypot: a real visitor never sees or fills this field (hidden from
  // layout + aria-hidden in the form). Bots filling every input trip it.
  // We return success without writing anything, so the bot gets no signal
  // that it was caught.
  if (String(formData.get("company") || "").trim().length > 0) {
    log({ level: "info", event: "application_honeypot_tripped", operation: "apply.submit", correlationId });
    return { ok: true };
  }

  const result = validateApplication({
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    experience: String(formData.get("experience") || ""),
    workGoal: String(formData.get("workGoal") || ""),
    consent: formData.get("consent") === "on",
  });

  if (!result.ok) {
    return { ok: false, errors: result.errors };
  }

  const maskedEmail = maskEmail(result.value.email);

  try {
    // Idempotent on email: a duplicate click or resubmit (e.g. a retried
    // network request) should not pile up multiple rows for one applicant.
    // This is deliberately not a production-grade anti-spam measure — just
    // a single-row-per-email guard appropriate for a 5-10 person free
    // pilot. (No DB-level unique constraint yet — see
    // docs/production-readiness.md for why that's a follow-up, not part
    // of this change.)
    const existing = await store.findByEmail(result.value.email);
    if (existing) {
      log({
        level: "info",
        event: "application_duplicate_ignored",
        operation: "apply.submit",
        correlationId,
        meta: { email: maskedEmail },
      });
      return { ok: true };
    }

    await store.create(result.value);
    log({
      level: "info",
      event: "application_submitted",
      operation: "apply.submit",
      correlationId,
      meta: { email: maskedEmail },
    });
    return { ok: true };
  } catch (error) {
    log({
      level: "error",
      event: "application_submit_failed",
      operation: "apply.submit",
      correlationId,
      errorCode: "DB_WRITE_FAILED",
      meta: { email: maskedEmail, reason: error instanceof Error ? error.name : undefined },
    });
    // Neutral, same shape the UI already handles — no stack trace, no
    // detail about why it failed.
    return { ok: false, errors: { email: "Не получилось отправить заявку. Попробуй ещё раз." } };
  }
}
