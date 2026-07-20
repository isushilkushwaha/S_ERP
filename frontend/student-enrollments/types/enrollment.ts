


import {
  AdmissionType,
  EnrollmentStatus,
  Medium,
  Stream,
} from "@prisma/client";

export { EnrollmentStatus };


/**
 * Student Enrollment
 */
export interface StudentEnrollment {
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

  joinedDate: string;

  leftDate: string | null;

  remarks: string | null;

  createdAt: string;
  updatedAt: string;
  student: StudentSummary;

academicYear: AcademicYearSummary;

class: ClassSummary;

section: SectionSummary;
}

/**
 * Create Enrollment Request
 */
export interface CreateEnrollmentRequest {
  studentId: string;

  academicYearId: string;

  classId: string;

  sectionId: string;

  rollNumber: number;

  medium: Medium;

  stream?: Stream | null;

  house?: string | null;

  boardRegistrationNumber?: string | null;

  admissionType: AdmissionType;

  enrollmentStatus: EnrollmentStatus;

  joinedDate: Date;

  leftDate?: Date | null;

  remarks?: string | null;
}

/**
 * Update Enrollment Request
 */
export type UpdateEnrollmentRequest =
  Partial<CreateEnrollmentRequest>;

/**
 * Enrollment Response
 */
export interface EnrollmentResponse {
  data: StudentEnrollment;
}

/**
 * Enrollment List Response
 */
export interface EnrollmentListResponse {
  data: StudentEnrollment[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

/**
 * Enrollment Query
 */
export interface EnrollmentQuery {
  search?: string;

  academicYearId?: string;

  classId?: string;

  sectionId?: string;

  enrollmentStatus?: EnrollmentStatus;

  page?: number;

  limit?: number;
}

export interface StudentSummary {
  id: string;

  studentCode: string | null;

  admissionNumber: string;

  firstName: string;

  middleName: string | null;

  lastName: string;
  fullName?: string;

  admissionDate: string;
}

export interface AcademicYearSummary {
  id: string;

  name: string;
}

export interface ClassSummary {
  id: string;

  name: string;
}

export interface SectionSummary {
  id: string;

  name: string;
}