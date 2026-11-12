// Minimal structured logger, meant to be called from server code (route
// handlers, server actions). JSON lines in production (so Railway's log
// viewer stays greppable by field), human-readable in dev. No tracing
// framework — just lifecycle events, failures, and a correlation ID
// callers can hand to a user as a support reference. Holds no secrets
// itself, so unlike env.ts it doesn't need the "server-only" import
// guard — and skipping it keeps this module trivially unit-testable
// with plain `node --test`.
export type LogLevel = "info" | "warn" | "error";

export type LogFields = {
  level: LogLevel;
  event: string;
  operation?: string;
  correlationId?: string;
  durationMs?: number;
  errorCode?: string;
  meta?: Record<string, unknown>;
};

const SENSITIVE_KEY_RE =
  /token|secret|password|cookie|authorization|auth|database_?url|api[-_]?key|session/i;

// Matches auth.js / Resend magic-link URLs (anything carrying a `token=`
// or `callbackUrl=` query param), so a stray full URL in `meta` doesn't
// leak a usable sign-in link.
const MAGIC_LINK_RE = /^https?:\/\/[^\s]*[?&](token|callbackUrl)=/i;

const REDACTED = "[redacted]";

/** Deep-clones `value`, replacing sensitive keys/values with a redaction marker. */
export function redact(value: unknown, depth = 0): unknown {
  if (depth > 6) return REDACTED;
  if (typeof value === "string") {
    return MAGIC_LINK_RE.test(value) ? REDACTED : value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => redact(item, depth + 1));
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = SENSITIVE_KEY_RE.test(key) ? REDACTED : redact(val, depth + 1);
    }
    return out;
  }
  return value;
}

/** `person@example.com` -> `pe***@example.com`. Never logs a full address. */
export function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return REDACTED;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}

const REQUEST_ID_RE = /^[a-zA-Z0-9_-]{1,64}$/;

/** Reuses a caller-supplied `x-request-id` if it looks safe to log, else mints a UUID. */
export function getOrCreateCorrelationId(headers: Headers | null | undefined): string {
  const incoming = headers?.get("x-request-id");
  if (incoming && REQUEST_ID_RE.test(incoming)) return incoming;
  return crypto.randomUUID();
}

function emit(fields: LogFields) {
  const entry = {
    timestamp: new Date().toISOString(),
    level: fields.level,
    event: fields.event,
    operation: fields.operation,
    correlationId: fields.correlationId,
    durationMs: fields.durationMs,
    errorCode: fields.errorCode,
    ...(fields.meta ? { meta: redact(fields.meta) } : {}),
  };

  const line =
    process.env.NODE_ENV === "production"
      ? JSON.stringify(entry)
      : `[${entry.level.toUpperCase()}] ${entry.event}${entry.operation ? ` (${entry.operation})` : ""}${
          entry.correlationId ? ` cid=${entry.correlationId}` : ""
        }${entry.durationMs !== undefined ? ` ${entry.durationMs}ms` : ""}${
          entry.errorCode ? ` [${entry.errorCode}]` : ""
        }${fields.meta ? ` ${JSON.stringify(redact(fields.meta))}` : ""}`;

  if (fields.level === "error") console.error(line);
  else if (fields.level === "warn") console.warn(line);
  else console.log(line);
}

/**
 * Log a meaningful lifecycle event or failure. Not for per-request access
 * logs — call this for things worth finding later: a health check
 * failure, an application submitted, a magic link that couldn't send, a
 * Studio publish, a submission saved.
 */
export function log(fields: LogFields) {
  emit(fields);
}
