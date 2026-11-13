// Client-side hand-off of a lab artifact (built in a course flow component)
// into the submission form on the same workspace page. A DOM event keeps
// the two client components decoupled — the server page renders both but
// can't pass callbacks between them.

export const ARTIFACT_EVENT = "vabeops:artifact";
export const SUBMISSION_ANCHOR = "submission";

/** Where the course flow links to when rendered inside the cohort workspace. */
export type WorkspaceFlowLinks = {
  nextHref: string | null;
  nextLabel?: string;
  overviewHref: string;
};

export function sendArtifactToSubmission(artifact: string) {
  window.dispatchEvent(new CustomEvent<string>(ARTIFACT_EVENT, { detail: artifact }));
  document.getElementById(SUBMISSION_ANCHOR)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Appends the artifact to whatever the participant already typed, without duplicating it. */
export function mergeArtifactIntoContent(current: string, artifact: string): string {
  const trimmed = current.trim();
  if (!trimmed) return artifact.trim();
  if (trimmed.includes(artifact.trim())) return current;
  return `${trimmed}\n\n${artifact.trim()}`;
}
