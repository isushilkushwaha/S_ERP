/**
 * Permission constants for the School ERP.
 * Format: <resource>.<action>
 */

export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard.view",

  // Students
  STUDENTS_VIEW: "students.view",
  STUDENTS_CREATE: "students.create",
  STUDENTS_UPDATE: "students.update",
  STUDENTS_DELETE: "students.delete",

  // Fees
  FEES_VIEW: "fees.view",
  FEES_COLLECT: "fees.collect",
  FEES_UPDATE: "fees.update",
  FEES_DELETE: "fees.delete",

  // Attendance
  ATTENDANCE_VIEW: "attendance.view",
  ATTENDANCE_MARK: "attendance.mark",
  ATTENDANCE_UPDATE: "attendance.update",

  // Examination
  EXAMINATION_VIEW: "examination.view",
  EXAMINATION_CREATE: "examination.create",
  EXAMINATION_UPDATE: "examination.update",
  EXAMINATION_DELETE: "examination.delete",

  // SMS
  SMS_VIEW: "sms.view",
  SMS_SEND: "sms.send",

  // Users
  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",

  // Roles
  ROLES_VIEW: "roles.view",
  ROLES_CREATE: "roles.create",
  ROLES_UPDATE: "roles.update",
  ROLES_DELETE: "roles.delete",

  // Profile
  PROFILE_VIEW: "profile.view",
  PROFILE_UPDATE: "profile.update",

  // Settings
  SETTINGS_VIEW: "settings.view",
  SETTINGS_MANAGE: "settings.manage",
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];