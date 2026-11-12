"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";
import { canEditContent, canPublishContent, type StudioRole, type ContentStatus } from "@/lib/studio-permissions";
import { clamp } from "@/lib/validation";

const MAX_TITLE = 200;
const MAX_DEK = 400;
const MAX_BODY = 20000;
const MAX_CATEGORY = 60;
const MAX_TAG = 30;
const MAX_TAGS = 8;
const MAX_URL = 500;

function assertCanEdit(role: StudioRole, authorId: string, status: ContentStatus, userId: string) {
  if (!canEditContent(role, authorId, status, userId)) {
    throw new Error("Not allowed to edit this content");
  }
}

function assertCanPublish(role: StudioRole) {
  if (!canPublishContent(role)) {
    throw new Error("Only an editor or admin can publish/archive content");
  }
}

function readTags(formData: FormData) {
  return String(formData.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, MAX_TAGS)
    .map((t) => clamp(t, MAX_TAG));
}

// ---------- Article ----------

export async function createArticle(formData: FormData) {
  const session = await requireRole(["ADMIN", "EDITOR", "AUTHOR"]);

  const article = await prisma.article.create({
    data: {
      slug: clamp(String(formData.get("slug") || "").trim(), 160) || `article-${Date.now()}`,
      title: clamp(String(formData.get("title") || ""), MAX_TITLE),
      dek: clamp(String(formData.get("dek") || ""), MAX_DEK),
      bodyMd: clamp(String(formData.get("bodyMd") || ""), MAX_BODY),
      category: clamp(String(formData.get("category") || "Инженерные заметки"), MAX_CATEGORY),
      readMinutes: Math.min(60, Math.max(1, Number(formData.get("readMinutes")) || 5)),
      authorId: session.user.id,
      status: "DRAFT",
    },
  });

  revalidatePath("/studio");
  redirect(`/studio/articles/${article.id}`);
}

export async function updateArticle(id: string, formData: FormData) {
  const session = await requireRole(["ADMIN", "EDITOR", "AUTHOR"]);
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) throw new Error("Article not found");
  assertCanEdit(session.user.role, existing.authorId, existing.status, session.user.id);

  await prisma.article.update({
    where: { id },
    data: {
      title: clamp(String(formData.get("title") || ""), MAX_TITLE),
      dek: clamp(String(formData.get("dek") || ""), MAX_DEK),
      bodyMd: clamp(String(formData.get("bodyMd") || ""), MAX_BODY),
      category: clamp(String(formData.get("category") || existing.category), MAX_CATEGORY),
      readMinutes: Math.min(60, Math.max(1, Number(formData.get("readMinutes")) || existing.readMinutes)),
    },
  });

  revalidatePath("/studio");
  revalidatePath(`/studio/articles/${id}`);
}

export async function submitArticleForReview(id: string) {
  const session = await requireRole(["ADMIN", "EDITOR", "AUTHOR"]);
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) throw new Error("Article not found");
  assertCanEdit(session.user.role, existing.authorId, existing.status, session.user.id);

  await prisma.article.update({ where: { id }, data: { status: "IN_REVIEW" } });
  revalidatePath("/studio");
  revalidatePath(`/studio/articles/${id}`);
}

export async function publishArticle(id: string) {
  const session = await requireRole(["ADMIN", "EDITOR"]);
  assertCanPublish(session.user.role);

  await prisma.article.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
  revalidatePath("/studio");
  revalidatePath(`/studio/articles/${id}`);
  revalidatePath("/journal");
}

export async function archiveArticle(id: string) {
  const session = await requireRole(["ADMIN", "EDITOR"]);
  assertCanPublish(session.user.role);

  await prisma.article.update({ where: { id }, data: { status: "ARCHIVED" } });
  revalidatePath("/studio");
  revalidatePath(`/studio/articles/${id}`);
}

// ---------- Signal ----------

export async function createSignal(formData: FormData) {
  const session = await requireRole(["ADMIN", "EDITOR", "AUTHOR"]);

  const signal = await prisma.signal.create({
    data: {
      slug: clamp(String(formData.get("slug") || "").trim(), 160) || `signal-${Date.now()}`,
      title: clamp(String(formData.get("title") || ""), MAX_TITLE),
      summary: clamp(String(formData.get("summary") || ""), MAX_DEK),
      whyItMatters: clamp(String(formData.get("whyItMatters") || ""), 1000),
      kind: formData.get("kind") === "external" ? "EXTERNAL" : "ORIGINAL",
      sourceUrl: clamp(String(formData.get("sourceUrl") || ""), MAX_URL) || null,
      tags: readTags(formData),
      authorId: session.user.id,
      status: "DRAFT",
    },
  });

  revalidatePath("/studio");
  redirect(`/studio/signals/${signal.id}`);
}

export async function updateSignal(id: string, formData: FormData) {
  const session = await requireRole(["ADMIN", "EDITOR", "AUTHOR"]);
  const existing = await prisma.signal.findUnique({ where: { id } });
  if (!existing) throw new Error("Signal not found");
  assertCanEdit(session.user.role, existing.authorId, existing.status, session.user.id);

  await prisma.signal.update({
    where: { id },
    data: {
      title: clamp(String(formData.get("title") || ""), MAX_TITLE),
      summary: clamp(String(formData.get("summary") || ""), MAX_DEK),
      whyItMatters: clamp(String(formData.get("whyItMatters") || ""), 1000),
      kind: formData.get("kind") === "external" ? "EXTERNAL" : "ORIGINAL",
      sourceUrl: clamp(String(formData.get("sourceUrl") || ""), MAX_URL) || null,
      tags: readTags(formData),
    },
  });

  revalidatePath("/studio");
  revalidatePath(`/studio/signals/${id}`);
}

export async function submitSignalForReview(id: string) {
  const session = await requireRole(["ADMIN", "EDITOR", "AUTHOR"]);
  const existing = await prisma.signal.findUnique({ where: { id } });
  if (!existing) throw new Error("Signal not found");
  assertCanEdit(session.user.role, existing.authorId, existing.status, session.user.id);

  await prisma.signal.update({ where: { id }, data: { status: "IN_REVIEW" } });
  revalidatePath("/studio");
  revalidatePath(`/studio/signals/${id}`);
}

export async function publishSignal(id: string) {
  const session = await requireRole(["ADMIN", "EDITOR"]);
  assertCanPublish(session.user.role);

  await prisma.signal.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
  revalidatePath("/studio");
  revalidatePath(`/studio/signals/${id}`);
  revalidatePath("/signals");
}

export async function archiveSignal(id: string) {
  const session = await requireRole(["ADMIN", "EDITOR"]);
  assertCanPublish(session.user.role);

  await prisma.signal.update({ where: { id }, data: { status: "ARCHIVED" } });
  revalidatePath("/studio");
  revalidatePath(`/studio/signals/${id}`);
}
