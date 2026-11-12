// Core magic-link send logic, factored out of auth.ts so it's testable
// without constructing the full NextAuth/Prisma stack — the fetch
// implementation is injected, so tests never make a real network call.
import { log, maskEmail } from "./logger.ts";
import { magicLinkEmailHtml, magicLinkEmailText } from "./magic-link-email.ts";

export type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

export const EMAIL_SEND_TIMEOUT_MS = 8000;
export const SEND_FAILED_MESSAGE = "Could not send the sign-in email. Please try again.";

export type MagicLinkParams = {
  identifier: string;
  url: string;
  apiKey?: string;
  from?: string;
};

/** Throws SEND_FAILED_MESSAGE (never a provider/network detail) on any failure. */
export async function sendMagicLinkEmail(
  params: MagicLinkParams,
  correlationId: string,
  fetchImpl: FetchLike = fetch,
  timeoutMs: number = EMAIL_SEND_TIMEOUT_MS
): Promise<void> {
  const start = Date.now();
  const { host } = new URL(params.url);
  const maskedEmail = maskEmail(params.identifier);

  const fail = (errorCode: string, error?: unknown): never => {
    log({
      level: "error",
      event: "magic_link_send_failed",
      operation: "auth.sendVerificationRequest",
      correlationId,
      durationMs: Date.now() - start,
      errorCode,
      meta: { email: maskedEmail, reason: error instanceof Error ? error.name : undefined },
    });
    throw new Error(SEND_FAILED_MESSAGE);
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
        to: params.identifier,
        subject: `Sign in to ${host}`,
        html: magicLinkEmailHtml({ url: params.url, host }),
        text: magicLinkEmailText({ url: params.url, host }),
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      fail(`RESEND_HTTP_${res.status}`);
    }

    log({
      level: "info",
      event: "magic_link_sent",
      operation: "auth.sendVerificationRequest",
      correlationId,
      durationMs: Date.now() - start,
      meta: { email: maskedEmail },
    });
  } catch (error) {
    // Already logged and wrapped by `fail` above — just propagate.
    if (error instanceof Error && error.message === SEND_FAILED_MESSAGE) throw error;
    fail(error instanceof Error && error.name === "TimeoutError" ? "RESEND_TIMEOUT" : "RESEND_NETWORK_ERROR", error);
  }
}
