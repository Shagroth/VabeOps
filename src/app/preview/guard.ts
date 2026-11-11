import { notFound } from "next/navigation";

// Preview routes are static fixture-data mockups for developer/admin
// inspection — see VIBE_OPS redesign mandate §5. They never touch the
// database and must not exist on the deployed production site.
export function requirePreviewEnv() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
}
