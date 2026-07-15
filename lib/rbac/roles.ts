export const ROLES = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
} as const;

export type Role =
  (typeof ROLES)[keyof typeof ROLES];