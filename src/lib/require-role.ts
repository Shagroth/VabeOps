import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canAccessStudio } from "@/lib/studio-permissions";

export { canAccessStudio };

export const STUDIO_ROLES = ["ADMIN", "EDITOR", "AUTHOR", "MENTOR"];

export async function requireRole(roles: string[]) {
  const session = await auth();
  if (!session?.user || !roles.includes(session.user.role)) {
    redirect("/");
  }
  return session;
}

// Everyone who gets into Studio at all, except STUDENT. Individual pages
// and actions narrow further (e.g. only EDITOR/ADMIN can publish).
export async function requireStudioAccess() {
  return requireRole(STUDIO_ROLES);
}
