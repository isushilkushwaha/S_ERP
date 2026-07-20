import { EnrollmentStatus } from "./types/enrollment";

/**
 * React Query Keys
 */
export const ENROLLMENT_QUERY_KEYS = {
  all: ["student-enrollments"] as const,

  lists: () => [...ENROLLMENT_QUERY_KEYS.all, "list"] as const,

  list: (filters: unknown) =>
    [...ENROLLMENT_QUERY_KEYS.lists(), filters] as const,

  details: () => [...ENROLLMENT_QUERY_KEYS.all, "detail"] as const,

  detail: (id: string) =>
    [...ENROLLMENT_QUERY_KEYS.details(), id] as const,
};

/**
 * Default Pagination
 */
export const DEFAULT_PAGE = 1;

export const DEFAULT_PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

/**
 * Enrollment Status Options
 */
export const ENROLLMENT_STATUS_OPTIONS = [
  {
    value: EnrollmentStatus.ACTIVE,
    label: "Active",
  },
  {
    value: EnrollmentStatus.PROMOTED,
    label: "Promoted",
  },
  {
    value: EnrollmentStatus.TRANSFERRED,
    label: "Transferred",
  },
  {
    value: EnrollmentStatus.PASSED_OUT,
    label: "PASSED OUT",
  },
  
  {
    value: EnrollmentStatus.LEFT,
    label: "Left",
  },
] as const;

/**
 * Default Filters
 */
export const DEFAULT_ENROLLMENT_FILTERS = {
  page: DEFAULT_PAGE,
  limit: DEFAULT_PAGE_SIZE,
  search: "",
  academicYearId: "",
  classId: "",
  sectionId: "",
  status: undefined,
};

/**
 * Status Badge Colors
 */
export const ENROLLMENT_STATUS_COLORS: Record<
  EnrollmentStatus,
  string
> = {
  [EnrollmentStatus.ACTIVE]:
    "bg-green-100 text-green-800",

  [EnrollmentStatus.PROMOTED]:
    "bg-blue-100 text-blue-800",

  [EnrollmentStatus.TRANSFERRED]:
    "bg-yellow-100 text-yellow-800",

  [EnrollmentStatus.PASSED_OUT]:
    "bg-purple-100 text-purple-800",

  

  [EnrollmentStatus.LEFT]:
    "bg-gray-100 text-gray-800",
};