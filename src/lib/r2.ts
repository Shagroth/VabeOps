import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { isR2Configured, requireR2Config } from "@/lib/env";
import { log } from "@/lib/logger";

let client: S3Client | null = null;

function getClient(): S3Client | null {
  if (!isR2Configured()) return null;
  if (!client) {
    const config = requireR2Config();
    client = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
  return client;
}

// R2 is an optional integration for this pilot (lesson video storage).
// When it isn't configured, callers get `null` instead of a crash — the
// one call site (modules/[id]/page.tsx) already treats a missing video
// URL as "no video for this lesson".
export async function getVideoUrl(key: string, expiresInSeconds = 3600): Promise<string | null> {
  const r2 = getClient();
  if (!r2) {
    log({ level: "warn", event: "r2_not_configured", operation: "r2.getVideoUrl" });
    return null;
  }
  const command = new GetObjectCommand({ Bucket: requireR2Config().bucket, Key: key });
  return getSignedUrl(r2, command, { expiresIn: expiresInSeconds });
}

export async function getUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 900
): Promise<string | null> {
  const r2 = getClient();
  if (!r2) {
    log({ level: "warn", event: "r2_not_configured", operation: "r2.getUploadUrl" });
    return null;
  }
  const command = new PutObjectCommand({
    Bucket: requireR2Config().bucket,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(r2, command, { expiresIn: expiresInSeconds });
}
