// Shared between the client form (maxLength) and the server action (clamp),
// so a pasted lab artifact is never silently truncated on save.
export const MAX_SUBMISSION_CONTENT_LEN = 12000;
