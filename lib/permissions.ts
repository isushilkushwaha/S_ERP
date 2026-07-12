export const PERMISSIONS = {
  DASHBOARD: "dashboard",

  STUDENTS_VIEW: "students:view",
  STUDENTS_CREATE: "students:create",
  STUDENTS_UPDATE: "students:update",
  STUDENTS_DELETE: "students:delete",

  FEES: "fees",

  ATTENDANCE: "attendance",

  EXAMINATION: "examination",

  SMS: "sms",

  SETTINGS: "settings",

  USERS: "users",

  ROLES: "roles",

  PROFILE: "profile",
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];