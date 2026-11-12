import { prisma } from "@/lib/prisma";
import { runHealthCheck, DEFAULT_HEALTH_TIMEOUT_MS } from "@/lib/health";
import { log, getOrCreateCorrelationId } from "@/lib/logger";

// Never prerendered/cached — this must reflect live DB state on every call.
export const dynamic = "force-dynamic";

async function probeDatabase() {
  // `statement_timeout` bounds how long Postgres itself will run the
  // query for; the transaction `timeout` bounds how long Prisma will wait
  // for the whole interactive transaction. Together they make sure a
  // slow/unreachable database doesn't leave work running indefinitely —
  // not just that we stop waiting for it.
  await prisma.$transaction(
    async (tx) => {
      await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = '1500ms'`);
      await tx.$queryRaw`SELECT 1`;
    },
    { timeout: DEFAULT_HEALTH_TIMEOUT_MS, maxWait: DEFAULT_HEALTH_TIMEOUT_MS }
  );
}

export async function GET(request: Request) {
  const correlationId = getOrCreateCorrelationId(request.headers);
  const start = Date.now();

  const result = await runHealthCheck(probeDatabase, DEFAULT_HEALTH_TIMEOUT_MS);
  const durationMs = Date.now() - start;

  if (result.status !== "ok") {
    log({
      level: "error",
      event: "health_check_failed",
      operation: "health.check",
      correlationId,
      durationMs,
      errorCode: "DB_UNAVAILABLE",
    });
  }

  return Response.json(
    { status: result.status, checks: result.checks },
    {
      status: result.status === "ok" ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
