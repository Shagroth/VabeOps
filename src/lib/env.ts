// Centralized server-only environment access. Importing this from a
// Client Component fails the build (via the "server-only" package)
// instead of silently bundling secrets into client JS.
//
// Deliberately lazy: nothing here runs at module-load time, so pages
// that never call these functions don't need the variable to be set
// during `next build` (e.g. static marketing pages that don't touch the
// database or email). Validation only happens where a value is actually
// used — see AGENTS.md Phase 5.
import "server-only";
import { requireEnv, isConfigured } from "./env-schema";

export { MissingEnvError } from "./env-schema";

export function requireDatabaseUrl(): string {
  return requireEnv(process.env, "DATABASE_URL");
}

export function requireAuthSecret(): string {
  return requireEnv(process.env, "AUTH_SECRET");
}

const RESEND_KEYS = ["AUTH_RESEND_KEY", "EMAIL_FROM"] as const;
const R2_KEYS = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"] as const;
const SENTRY_KEYS = ["SENTRY_DSN"] as const;

/** Resend (magic-link email) is configured — false means a quiet no-op, not a crash. */
export function isEmailProviderConfigured(): boolean {
  return isConfigured(process.env, RESEND_KEYS);
}

/** Cloudflare R2 (lesson video storage) is configured. */
export function isR2Configured(): boolean {
  return isConfigured(process.env, R2_KEYS);
}

/** Optional Sentry error monitoring — see docs/production-readiness.md Phase 6. */
export function isSentryConfigured(): boolean {
  return isConfigured(process.env, SENTRY_KEYS);
}

export function requireR2Config() {
  return {
    accountId: requireEnv(process.env, "R2_ACCOUNT_ID"),
    accessKeyId: requireEnv(process.env, "R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv(process.env, "R2_SECRET_ACCESS_KEY"),
    bucket: requireEnv(process.env, "R2_BUCKET"),
  };
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://vabeops.example.com";
}

/** Recipient for "new submission" notifications. Unset = quiet no-op, not a crash. */
export function notifyAdminEmail(): string | null {
  return process.env.NOTIFY_ADMIN_EMAIL || null;
}

export type ResendCredentials = { apiKey?: string; from?: string };

/** Raw Resend credentials for a best-effort send — callers already check isEmailProviderConfigured(). */
export function resendCredentials(): ResendCredentials {
  return { apiKey: process.env.AUTH_RESEND_KEY, from: process.env.EMAIL_FROM };
}
