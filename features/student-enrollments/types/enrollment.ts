import {
  AdmissionType,
  EnrollmentStatus,
  Medium,
  Stream,
} from "@prisma/client";

/**
 * Enrollment List Item
 * Used in tables.
 */
export interface StudentEnrollmentListItem {
  id: string;

  studentId: string;
  studentName: string;

  academicYearId: string;
  academicYear: string;

  classId: string;
  className: string;

  sectionId: string;
  sectionName: string;

  rollNumber: number;

  medium: Medium;

  stream: Stream | null;

  enrollmentStatus: EnrollmentStatus;

  joinedDate: Date;

  createdAt: Date;
}

/**
 * Enrollment Details
 * Used for GET /api/student-enrollments/:id
 */
export interface StudentEnrollmentDetails {
  id: string;

  studentId: string;

  academicYearId: string;

  classId: string;

  sectionId: string;

  rollNumber: number;

  medium: Medium;

  stream: Stream | null;

  house: string | null;

  boardRegistrationNumber: string | null;

  admissionType: AdmissionType;

  enrollmentStatus: EnrollmentStatus;

  joinedDate: Date;

  leftDate: Date | null;

  remarks: string | null;

  createdAt: Date;

  updatedAt: Date;
}

/**
 * Search Parameters
 */
export interface StudentEnrollmentQuery {
  search?: string;

  academicYearId?: string;

  classId?: string;

  sectionId?: string;

  enrollmentStatus?: EnrollmentStatus;

  page?: number;

  limit?: number;
}

/**
 * Pagination Result
 */
export interface StudentEnrollmentPaginationResult {
  data: StudentEnrollmentListItem[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}