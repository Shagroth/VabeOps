// Generic best-effort transactional email over Resend, shared by the
// submission/feedback notifications below. Same shape as
// magic-link-send.ts (injected fetch, bounded timeout, masked logging)
// but never throws — a failed notification must not fail the server
// action that triggered it (new submission / review decision still has
// to save even if the email bounces).
import { log, maskEmail } from "./logger.ts";

export type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

export const NOTIFY_EMAIL_TIMEOUT_MS = 8000;

export type NotifyEmailParams = {
  to: string;
  subject: string;
  text: string;
  apiKey?: string;
  from?: string;
};

export type NotifyEmailResult = { ok: true } | { ok: false; errorCode: string };

/**
 * `event` names the log event on success (e.g. "submission_notify_sent")
 * — the failure path logs `${event}_failed` with a safe errorCode, same
 * convention as magic_link_send_failed.
 */
export async function sendNotifyEmail(
  params: NotifyEmailParams,
  correlationId: string,
  event: string,
  fetchImpl: FetchLike = fetch,
  timeoutMs: number = NOTIFY_EMAIL_TIMEOUT_MS
): Promise<NotifyEmailResult> {
  const start = Date.now();
  const maskedEmail = maskEmail(params.to);

  const fail = (errorCode: string, error?: unknown): NotifyEmailResult => {
    log({
      level: "warn",
      event: `${event}_failed`,
      operation: "notify.sendEmail",
      correlationId,
      durationMs: Date.now() - start,
      errorCode,
      meta: { email: maskedEmail, reason: error instanceof Error ? error.name : undefined },
    });
    return { ok: false, errorCode };
  };

  try {
    const res = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: params.from,
        to: params.to,
        subject: params.subject,
        text: params.text,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) return fail(`RESEND_HTTP_${res.status}`);

    log({
      level: "info",
      event,
      operation: "notify.sendEmail",
      correlationId,
      durationMs: Date.now() - start,
      meta: { email: maskedEmail },
    });
    return { ok: true };
  } catch (error) {
    return fail(
      error instanceof Error && error.name === "TimeoutError" ? "RESEND_TIMEOUT" : "RESEND_NETWORK_ERROR",
      error
    );
  }
}
