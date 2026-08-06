import { AcademicYear, AcademicYearQueryParams } from "./types/academic-year";
import {
  ACADEMIC_YEAR_STATUS,
  ACADEMIC_YEAR_STATUS_VARIANTS,
} from "./constants";

/**
 * Format an academic year.
 * Example:
 * 2025-04-01 -> 2026-03-31
 * Result: 2025-26
 */
export function formatAcademicYear(
  startDate: Date | string,
  endDate: Date | string
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startYear = start.getFullYear();
  const endYear = end.getFullYear().toString().slice(-2);

  return `${startYear}-${endYear}`;
}

/**
 * Format date for UI.
 */
export function formatDate(
  date: Date | string,
  locale = "en-IN"
): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Build URL query string.
 */
export function buildQueryString(
  params: AcademicYearQueryParams
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}

/**
 * Badge variant from status.
 */
export function getStatusBadgeVariant(
  status: AcademicYear["status"]
) {
  return ACADEMIC_YEAR_STATUS_VARIANTS[status];
}

/**
 * Check whether academic year is active.
 */
export function isActiveAcademicYear(
  academicYear: Pick<AcademicYear, "status">
): boolean {
  return academicYear.status === ACADEMIC_YEAR_STATUS.ACTIVE;
}