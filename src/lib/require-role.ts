import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canAccessStudio, canReviewSubmissions } from "@/lib/studio-permissions";

export { canAccessStudio, canReviewSubmissions };

// Mentor is intentionally not here — see canAccessStudio in
// studio-permissions.ts for why.
export const STUDIO_ROLES = ["ADMIN", "EDITOR", "AUTHOR"];

export async function requireRole(roles: string[]) {
  const session = await auth();
  if (!session?.user || !roles.includes(session.user.role)) {
    redirect("/");
  }
  return session;
}

// Admin/Editor/Author only — Mentor and Student have no Studio access.
// Individual pages and actions narrow further (e.g. only EDITOR/ADMIN can
// publish).
export async function requireStudioAccess() {
  return requireRole(STUDIO_ROLES);
}
