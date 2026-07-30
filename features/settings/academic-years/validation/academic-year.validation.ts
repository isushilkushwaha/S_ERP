import {
  AcademicYearRepositoryCreateInput,
  AcademicYearRepositoryUpdateInput,
} from "../types/academic-year.types";

/* -------------------------------------------------------------------------- */
/*                               Date Validation                              */
/* -------------------------------------------------------------------------- */

export function validateDateRange(
  startDate: Date,
  endDate: Date
): void {
  if (startDate >= endDate) {
    throw new Error(
      "Academic year end date must be later than the start date."
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                              Name Validation                               */
/* -------------------------------------------------------------------------- */

export function normalizeAcademicYearName(
  name: string
): string {
  return name.trim().replace(/\s+/g, " ");
}

/* -------------------------------------------------------------------------- */
/*                              Code Validation                               */
/* -------------------------------------------------------------------------- */

export function normalizeAcademicYearCode(
  code: string
): string {
  return code.trim().toUpperCase();
}

/* -------------------------------------------------------------------------- */
/*                         Create Request Validation                           */
/* -------------------------------------------------------------------------- */

export function validateCreateAcademicYear(
  data: AcademicYearRepositoryCreateInput
): AcademicYearRepositoryCreateInput {
  validateDateRange(data.startDate, data.endDate);

  return {
    ...data,
    name: normalizeAcademicYearName(data.name),
    code: normalizeAcademicYearCode(data.code),
  };
}

/* -------------------------------------------------------------------------- */
/*                         Update Request Validation                           */
/* -------------------------------------------------------------------------- */

export function validateUpdateAcademicYear(
  data: AcademicYearRepositoryUpdateInput
): AcademicYearRepositoryUpdateInput {
  if (data.startDate && data.endDate) {
    validateDateRange(data.startDate, data.endDate);
  }

  return {
    ...data,
    ...(data.name && {
      name: normalizeAcademicYearName(data.name),
    }),
    ...(data.code && {
      code: normalizeAcademicYearCode(data.code),
    }),
  };
}

/* -------------------------------------------------------------------------- */
/*                           Soft Delete Validation                           */
/* -------------------------------------------------------------------------- */

export function validateSoftDelete(
  deletedAt: Date | null
): boolean {
  return deletedAt === null;
}

/* -------------------------------------------------------------------------- */
/*                          Restore Validation                                */
/* -------------------------------------------------------------------------- */

export function validateRestore(
  deletedAt: Date | null
): boolean {
  return deletedAt !== null;
}