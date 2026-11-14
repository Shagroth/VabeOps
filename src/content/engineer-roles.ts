// Engineering roles the first cohort is made of. Kept free of course
// content so client components can import it without pulling lessons of
// closed modules into the browser bundle.

export const ENGINEER_ROLES = ["platform", "devops", "sre", "fullstack"] as const;
export type EngineerRole = (typeof ENGINEER_ROLES)[number];

export const ENGINEER_ROLE_LABEL: Record<EngineerRole, string> = {
  platform: "Platform",
  devops: "DevOps",
  sre: "SRE",
  fullstack: "Fullstack",
};

/** A task for one engineering role, to be solved on the participant's own stack. */
export type RoleTask = { role: EngineerRole; task: string };
