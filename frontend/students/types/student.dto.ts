// frontend/students/types/student.dto.ts

import type { Gender, StudentStatus } from "./student";

/**
 * Create Student Request
 */
export interface CreateStudentRequest {
  admissionNumber: string;

  firstName: string;
  middleName?: string | null;
  lastName: string;

  gender: Gender;
  dateOfBirth: string;

  mobileNumber?: string | null;
  email?: string | null;

  fatherName: string;
  motherName: string;
  guardianName?: string | null;

  address: string;

  status?: StudentStatus;
}

/**
 * Update Student Request
 */
export interface UpdateStudentRequest
  extends Partial<CreateStudentRequest> {}