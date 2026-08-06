// frontend/students/types/student.dto.ts

import type {
  Gender,
  StudentCategory,
} from "@prisma/client";

/**
 * Create Student Request
 * Student Registration only.
 */
export interface CreateStudentRequest {
  emisNumber?: string | null;
  apaarId?: string | null;
  penNumber?: string | null;

  firstName: string;
  middleName?: string | null;
  lastName: string;

  gender: Gender;
  dateOfBirth: string;

  bloodGroup?: string | null;
  religion?: string | null;
  category?: StudentCategory | null;
  caste?: string | null;
  nationality?: string | null;

  aadhaarNumber?: string | null;
  birthCertificateNo?: string | null;

  mobile?: string | null;
  email?: string | null;

  photo?: string | null;

  previousSchool?: string | null;
  remarks?: string | null;

  fatherName: string;
  fatherOccupation?: string | null;
  fatherMobile: string;
  fatherEmail?: string | null;

  motherName?: string | null;
  motherOccupation?: string | null;
  motherMobile?: string | null;
  motherEmail?: string | null;

  guardianName?: string | null;
  guardianRelation?: string | null;
  guardianMobile?: string | null;
  guardianEmail?: string | null;

  addressLine1: string;
  addressLine2?: string | null;

  city: string;
  district: string;
  state: string;
  country: string;
  postalCode: string;
}

/**
 * Update Student Request
 */
export type UpdateStudentRequest = Partial<CreateStudentRequest>;