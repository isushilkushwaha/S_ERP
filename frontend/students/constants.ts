// frontend/students/constants.ts

import type { StudentStatus } from "./types";

/**
 * Module
 */
export const STUDENT_MODULE_NAME = "Students";

/**
 * Routes
 */
export const STUDENT_ROUTES = {
  LIST: "/students",
  CREATE: "/students/new",
  DETAILS: (id: string) => `/students/${id}`,
  EDIT: (id: string) => `/students/${id}/edit`,
} as const;

/**
 * API
 */
export const STUDENT_API_ENDPOINTS = {
  BASE: "/api/students",
} as const;

/**
 * Pagination
 */
export const STUDENT_DEFAULT_PAGE = 1;

export const STUDENT_DEFAULT_PAGE_SIZE = 10;

export const STUDENT_PAGE_SIZE_OPTIONS = [
  10,
  20,
  50,
  100,
] as const;

/**
 * Search
 */
export const STUDENT_SEARCH_PLACEHOLDER =
  "Search by admission no, name, mobile...";

/**
 * Status
 */
export const STUDENT_STATUS_OPTIONS = [
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Inactive",
    value: "INACTIVE",
  },
  {
    label: "Transferred",
    value: "TRANSFERRED",
  },
  {
    label: "Alumni",
    value: "ALUMNI",
  },
] as const;

export const STUDENT_STATUS_VALUES = [
  "ACTIVE",
  "INACTIVE",
  "TRANSFERRED",
  "ALUMNI",
] as const;

/**
 * Table
 */
export const STUDENT_TABLE_COLUMNS = {
  SELECT: "select",
  ADMISSION_NUMBER: "admissionNumber",
  NAME: "name",
  CLASS: "class",
  SECTION: "section",
  MOBILE: "mobileNumber",
  STATUS: "status",
  ACTIONS: "actions",
} as const;

/**
 * Messages
 */
export const STUDENT_MESSAGES = {
  CREATE_SUCCESS: "Student created successfully.",
  UPDATE_SUCCESS: "Student updated successfully.",
  DELETE_SUCCESS: "Student deleted successfully.",

  CREATE_ERROR: "Failed to create student.",
  UPDATE_ERROR: "Failed to update student.",
  DELETE_ERROR: "Failed to delete student.",
} as const;

// Add these exports to your existing constants.ts
export const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"] as const;
export const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export const CATEGORY_OPTIONS = ["GENERAL", "OBC", "SC", "ST", "EWS"] as const;




