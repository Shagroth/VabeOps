// Which course modules are readable on the public /demo-course pages.
// The rest of the program is only rendered inside the cohort workspace
// (/modules/[id]) for enrolled participants. Kept as one list so the
// public page, the program overview and the tests agree on it.
export const PUBLIC_DEMO_MODULES: readonly number[] = [1, 2];

export function isPublicDemoModule(moduleNumber: number): boolean {
  return PUBLIC_DEMO_MODULES.includes(moduleNumber);
}
