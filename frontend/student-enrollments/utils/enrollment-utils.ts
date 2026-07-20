import { EnrollmentStatus, StudentEnrollment } from "../types/enrollment";

/**
 * Get student's full name.
 */
export function getStudentFullName(
  enrollment: Pick<StudentEnrollment, "student">
): string {
  return enrollment.student.fullName;
}

/**
 * Format admission number.
 */
export function getAdmissionNumber(
  enrollment: Pick<StudentEnrollment, "student">
): string {
  return enrollment.student.admissionNumber;
}

/**
 * Format class and section.
 */
export function getClassSection(
  enrollment: Pick<StudentEnrollment, "class" | "section">
): string {
  return `${enrollment.class.name} - ${enrollment.section.name}`;
}

/**
 * Format academic year.
 */
export function getAcademicYear(
  enrollment: Pick<StudentEnrollment, "academicYear">
): string {
  return enrollment.academicYear.name;
}

/**
 * Format admission date.
 */
export function formatAdmissionDate(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Enrollment status label.
 */
export function getEnrollmentStatusLabel(
  status: EnrollmentStatus
): string {
  switch (status) {
    case EnrollmentStatus.ACTIVE:
      return "Active";

    case EnrollmentStatus.PROMOTED:
      return "Promoted";

    case EnrollmentStatus.TRANSFERRED:
      return "Transferred";

    case EnrollmentStatus.PASSED_OUT:
      return "PASSED_OUT";

    

    case EnrollmentStatus.LEFT:
      return "Left";

    default:
      return status;
  }
}

/**
 * Badge variant for shadcn/ui Badge.
 */
export function getEnrollmentStatusVariant(
  status: EnrollmentStatus
):
  | "default"
  | "secondary"
  | "destructive"
  | "outline" {
  switch (status) {
    case EnrollmentStatus.ACTIVE:
      return "default";

    case EnrollmentStatus.PROMOTED:
      return "secondary";

    case EnrollmentStatus.TRANSFERRED:
      return "outline";

    case EnrollmentStatus.PASSED_OUT:
      return "secondary";

    

    case EnrollmentStatus.LEFT:
      return "destructive";

    default:
      return "outline";
  }
}

/**
 * Check whether enrollment is active.
 */
export function isActiveEnrollment(
  enrollment: Pick<StudentEnrollment, "status">
): boolean {
  return enrollment.status === EnrollmentStatus.ACTIVE;
}