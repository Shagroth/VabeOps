// Pure environment-variable helpers, framework-free and unit-testable
// without touching real process.env or importing "server-only" (that
// package throws on import outside a server bundle — see env.ts, which
// wraps this module with that guard for actual runtime use).

export class MissingEnvError extends Error {
  readonly key: string;

  constructor(key: string) {
    super(`Missing required environment variable: ${key}`);
    this.name = "MissingEnvError";
    this.key = key;
  }
}

export type EnvSource = Record<string, string | undefined>;

/** Throws MissingEnvError (never logs the value — there usually isn't one). */
export function requireEnv(source: EnvSource, key: string): string {
  const value = source[key];
  if (!value) throw new MissingEnvError(key);
  return value;
}

/** True only when every key in `keys` has a non-empty value. */
export function isConfigured(source: EnvSource, keys: readonly string[]): boolean {
  return keys.every((key) => Boolean(source[key]));
}
