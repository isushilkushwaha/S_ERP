/**
 * ============================================================================
 * Academic Year Module Constants
 * ============================================================================
 * Purpose:
 * Centralized constants for the Academic Year module.
 *
 * Rules:
 * - Do NOT hardcode strings anywhere else.
 * - Do NOT store Prisma queries here.
 * - Do NOT store business logic here.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*                               Module Name                                  */
/* -------------------------------------------------------------------------- */

export const ACADEMIC_YEAR_MODULE = "Academic Year" as const;

/* -------------------------------------------------------------------------- */
/*                                  Status                                    */
/* -------------------------------------------------------------------------- */

export const ACADEMIC_YEAR_STATUS = {
  UPCOMING: "UPCOMING",
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
} as const;

/* -------------------------------------------------------------------------- */
/*                                 Sort Fields                                */
/* -------------------------------------------------------------------------- */

export const ACADEMIC_YEAR_SORT_FIELDS = {
  NAME: "name",
  CODE: "code",
  START_DATE: "startDate",
  END_DATE: "endDate",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
  SORT_ORDER_FIELD: "sortOrder"
} as const;

/* -------------------------------------------------------------------------- */
/*                                 Sort Order                                 */
/* -------------------------------------------------------------------------- */

export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
} as const;

/* -------------------------------------------------------------------------- */
/*                              Default Sorting                               */
/* -------------------------------------------------------------------------- */

export const DEFAULT_SORT = {
  FIELD: ACADEMIC_YEAR_SORT_FIELDS.START_DATE,
  ORDER: SORT_ORDER.DESC,
} as const;

/* -------------------------------------------------------------------------- */
/*                                Pagination                                  */
/* -------------------------------------------------------------------------- */

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/* -------------------------------------------------------------------------- */
/*                              Validation Rules                              */
/* -------------------------------------------------------------------------- */

export const ACADEMIC_YEAR_LIMITS = {
  NAME_MIN_LENGTH: 4,
  NAME_MAX_LENGTH: 20,

  CODE_MIN_LENGTH: 4,
  CODE_MAX_LENGTH: 20,

  DESCRIPTION_MAX_LENGTH: 500,

  SEARCH_MIN_LENGTH: 2,
  SEARCH_MAX_LENGTH: 100,
} as const;

/* -------------------------------------------------------------------------- */
/*                              Default Values                                */
/* -------------------------------------------------------------------------- */

export const DEFAULT_ACADEMIC_YEAR = {
  STATUS: ACADEMIC_YEAR_STATUS.UPCOMING,
} as const;

/* -------------------------------------------------------------------------- */
/*                              Search Settings                               */
/* -------------------------------------------------------------------------- */

export const SEARCH = {
  DEFAULT_QUERY: "",
  SEARCHABLE_FIELDS: [
  "name",
  "code",
  "description",
] as const,
} as const;

/* -------------------------------------------------------------------------- */
/*                            Default Query Options                           */
/* -------------------------------------------------------------------------- */

export const DEFAULT_QUERY_OPTIONS = {
  PAGE: PAGINATION.DEFAULT_PAGE,
  LIMIT: PAGINATION.DEFAULT_LIMIT,
  SORT_BY: DEFAULT_SORT.FIELD,
  SORT_ORDER: DEFAULT_SORT.ORDER,
} as const;

/* -------------------------------------------------------------------------- */
/*                               Business Rules                               */
/* -------------------------------------------------------------------------- */

export const BUSINESS_RULES = {
  ONLY_ONE_ACTIVE_YEAR: true,
  ENABLE_SOFT_DELETE: true,
  ALLOW_DELETE_WITH_LINKED_RECORDS: false,
} as const;

/* -------------------------------------------------------------------------- */
/*                                API Messages                                */
/* -------------------------------------------------------------------------- */

export const ACADEMIC_YEAR_MESSAGES = {
  CREATED: "Academic year created successfully.",
  UPDATED: "Academic year updated successfully.",
  DELETED: "Academic year deleted successfully.",
  ARCHIVED: "Academic year archived successfully.",
  ACTIVATED: "Academic year activated successfully.",
  RESTORED: "Academic year restored successfully.",
  FETCHED: "Academic years fetched successfully.",
  FETCHED_ONE: "Academic year fetched successfully.",
  ACTIVE_FETCHED: "Active academic year fetched successfully.",
} as const;

/* -------------------------------------------------------------------------- */
/*                              Error Messages                                */
/* -------------------------------------------------------------------------- */

export const ACADEMIC_YEAR_ERRORS = {
  NOT_FOUND: "Academic year not found.",

  DUPLICATE_NAME: "Academic year name already exists.",

  DUPLICATE_CODE: "Academic year code already exists.",

  ACTIVE_ALREADY: "Academic year is already active.",

  INVALID_DATE_RANGE:
    "Start date must be earlier than end date.",

  CANNOT_DELETE_ACTIVE:
    "Active academic year cannot be deleted.",

  CANNOT_ARCHIVE_ACTIVE:
    "Please activate another academic year before archiving this one.",

  LINKED_RECORDS:
    "Academic year contains linked records and cannot be deleted.",

  INVALID_STATUS:
    "Invalid academic year status.",

  UNKNOWN:
    "Something went wrong while processing the academic year.",
} as const;

/* -------------------------------------------------------------------------- */
/*                                Cache Keys                                  */
/* -------------------------------------------------------------------------- */

export const ACADEMIC_YEAR_CACHE_KEYS = {
  ALL: "academic-years",
  DETAIL: "academic-year",
  ACTIVE: "active-academic-year",
} as const;

/* -------------------------------------------------------------------------- */
/*                               Audit Actions                                */
/* -------------------------------------------------------------------------- */

export const ACADEMIC_YEAR_AUDIT_ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  ACTIVATE: "ACTIVATE",
  ARCHIVE: "ARCHIVE",
  DELETE: "DELETE",
  RESTORE: "RESTORE",
} as const;

/* -------------------------------------------------------------------------- */
/*                             Response Metadata                              */
/* -------------------------------------------------------------------------- */

export const RESPONSE_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

/* -------------------------------------------------------------------------- */
/*                              Query Options                                 */
/* -------------------------------------------------------------------------- */

export const QUERY_MODE = {
  INSENSITIVE: "insensitive",
} as const;