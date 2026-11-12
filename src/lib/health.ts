// Pure health-check orchestration, framework-free so it's testable without
// a real database or a running Next.js server. `route.ts` supplies the
// real database probe; tests supply fakes.

export type CheckStatus = "ok" | "error";

export type HealthResult = {
  status: CheckStatus;
  checks: {
    app: CheckStatus;
    database: CheckStatus;
  };
};

export type DatabaseProbe = () => Promise<void>;

class TimeoutError extends Error {
  constructor() {
    super("timed out");
    this.name = "TimeoutError";
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError()), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

export const DEFAULT_HEALTH_TIMEOUT_MS = 2000;

/**
 * Runs the app + database checks and reports an overall status. The
 * process simply being able to run this function is the "app" check —
 * if it can't, the HTTP layer never gets far enough to respond anyway.
 */
export async function runHealthCheck(
  probeDatabase: DatabaseProbe,
  timeoutMs: number = DEFAULT_HEALTH_TIMEOUT_MS
): Promise<HealthResult & { error?: unknown }> {
  try {
    await withTimeout(probeDatabase(), timeoutMs);
    return { status: "ok", checks: { app: "ok", database: "ok" } };
  } catch (error) {
    return { status: "error", checks: { app: "ok", database: "error" }, error };
  }
}
