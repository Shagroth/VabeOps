// Pure editorial permission predicates (brief §9). Kept framework-free so
// the actual rule — not the plumbing around it — is what gets tested.
// Studio server actions (src/app/studio/actions.ts) call these and throw
// on `false`; the predicates themselves never throw or touch the DB.

export type StudioRole = "ADMIN" | "EDITOR" | "AUTHOR" | "MENTOR" | "STUDENT";
export type ContentStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";

/**
 * Editor/Admin can edit any row at any status. Author may only edit their
 * own row, and only before it's published — once PUBLISHED/ARCHIVED,
 * further edits must go through an editor rather than silently mutating
 * live public content. Mentor/Student have no content-edit rights.
 */
export function canEditContent(
  role: StudioRole,
  authorId: string,
  status: ContentStatus,
  userId: string
): boolean {
  if (role === "ADMIN" || role === "EDITOR") return true;
  if (role === "AUTHOR") {
    return authorId === userId && status !== "PUBLISHED" && status !== "ARCHIVED";
  }
  return false;
}

/** Only Editor/Admin can move content to PUBLISHED or ARCHIVED. */
export function canPublishContent(role: StudioRole): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

/**
 * Anyone who should land in /studio at all. Mentor is deliberately
 * excluded — per the brief, Mentor works with cohort feedback/comments
 * (see admin/actions.ts reviewSubmission) but has no publication access,
 * so it never sees Article/Signal editorial rows.
 */
export function canAccessStudio(role: StudioRole): boolean {
  return role === "ADMIN" || role === "EDITOR" || role === "AUTHOR";
}
