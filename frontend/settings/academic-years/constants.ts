// frontend/settings/academic-years/constants.ts

import type {
  AcademicYearStatus,
  AcademicYearQueryParams,
} from "./types/academic-year";



/* -------------------------------------------------------------------------- */
/*                                 API Routes                                 */
/* -------------------------------------------------------------------------- */

export const ACADEMIC_YEAR_API =
  "/api/settings/academic-years";

/* -------------------------------------------------------------------------- */
/*                             Default Query Values                           */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PAGE = 1;

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_SORT_BY = "sortOrder" as const;

export const DEFAULT_SORT_ORDER = "asc" as const;

export const DEFAULT_QUERY: Readonly<AcademicYearQueryParams> = {
  page: DEFAULT_PAGE,
  limit: DEFAULT_PAGE_SIZE,
  sortBy: DEFAULT_SORT_BY,
  sortOrder: DEFAULT_SORT_ORDER,
};

/* -------------------------------------------------------------------------- */
/*                              Search & Pagination                           */
/* -------------------------------------------------------------------------- */

export const MIN_SEARCH_LENGTH = 2;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

/* -------------------------------------------------------------------------- */
/*                              Academic Year Status                          */
/* -------------------------------------------------------------------------- */

export const ACADEMIC_YEAR_DATE_FORMAT = "en-IN";

export const ACADEMIC_YEAR_STATUS = {
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
  UPCOMING: "UPCOMING",
} as const;

export const ACADEMIC_YEAR_STATUS_LABELS: Record<
  AcademicYearStatus,
  string
> = {
  ACTIVE: "Active",
  ARCHIVED: "Archived",
  UPCOMING: "Upcoming",
};

/* -------------------------------------------------------------------------- */
/*                              Badge Variants                                */
/* -------------------------------------------------------------------------- */

export const ACADEMIC_YEAR_STATUS_VARIANTS: Record<
  AcademicYearStatus,
  "default" | "secondary"
> = {
  ACTIVE: "default",
  ARCHIVED: "secondary",
  UPCOMING: "secondary",
};

/* -------------------------------------------------------------------------- */
/*                               Date Formats                                 */
/* -------------------------------------------------------------------------- */

export const DATE_FORMAT = "dd MMM yyyy";

/* -------------------------------------------------------------------------- */
/*                              UI Messages                                   */
/* -------------------------------------------------------------------------- */

export const ACADEMIC_YEAR_MESSAGES = {
  TABLE_EMPTY: "No academic years found.",

  DELETE_CONFIRMATION:
    "Are you sure you want to delete this academic year?",

  ARCHIVE_CONFIRMATION:
    "Are you sure you want to archive this academic year?",

  RESTORE_CONFIRMATION:
    "Are you sure you want to restore this academic year?",

  ACTIVATE_CONFIRMATION:
    "Activate this academic year? The currently active academic year will be archived.",

  CREATE_SUCCESS:
    "Academic year created successfully.",

  UPDATE_SUCCESS:
    "Academic year updated successfully.",

  DELETE_SUCCESS:
    "Academic year deleted successfully.",

  ACTIVATE_SUCCESS:
    "Academic year activated successfully.",

  ARCHIVE_SUCCESS:
    "Academic year archived successfully.",

  RESTORE_SUCCESS:
    "Academic year restored successfully.",

  UNKNOWN_ERROR:
    "Something went wrong. Please try again.",
} as const;

export const ACADEMIC_YEAR_QUERY_KEYS = {
  all: ["academic-years"] as const,

  lists: () => [...ACADEMIC_YEAR_QUERY_KEYS.all, "list"] as const,

  list: (params: unknown) =>
    [...ACADEMIC_YEAR_QUERY_KEYS.lists(), params] as const,

  detail: (id: string) =>
    [...ACADEMIC_YEAR_QUERY_KEYS.all, "detail", id] as const,

  active: () =>
    [...ACADEMIC_YEAR_QUERY_KEYS.all, "active"] as const,
};



export const DEFAULT_ACADEMIC_YEAR_QUERY: AcademicYearQueryParams = {
  page: 1,
  limit: 10,
  search: "",
  sortBy: "sortOrder",
  sortOrder: "asc",
};