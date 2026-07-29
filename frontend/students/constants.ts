// frontend/students/constants.ts

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
  "Search by Student Code, Name or Mobile...";

/**
 * Table
 */
export const STUDENT_TABLE_COLUMNS = {
  SELECT: "select",
  STUDENT_CODE: "studentCode",
  NAME: "name",
  GENDER: "gender",
  MOBILE: "mobile",
  REGISTRATION_DATE: "registrationDate",
  ACTIONS: "actions",
} as const;

/**
 * Messages
 */
export const STUDENT_MESSAGES = {
  CREATE_SUCCESS: "Student registered successfully.",
  UPDATE_SUCCESS: "Student updated successfully.",
  DELETE_SUCCESS: "Student deleted successfully.",

  CREATE_ERROR: "Failed to register student.",
  UPDATE_ERROR: "Failed to update student.",
  DELETE_ERROR: "Failed to delete student.",
} as const;

/**
 * Master Data
 */
export const GENDER_OPTIONS = [
  "MALE",
  "FEMALE",
  "OTHER",
] as const;

export const BLOOD_GROUP_OPTIONS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const CATEGORY_OPTIONS = [
  "GENERAL",
  "OBC",
  "SC",
  "ST",
  "EWS",
] as const;