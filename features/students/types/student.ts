import {
  Gender,
  StudentCategory,
  StudentStatus,
} from "@prisma/client";

/**
 * Student List Item
 * Used in tables and search results.
 */
export interface StudentListItem {
  id: string;
  studentCode: string;
  admissionNumber: string;

  firstName: string;
  middleName: string | null;
  lastName: string;

  gender: Gender;

  mobile: string | null;

  status: StudentStatus;

  createdAt: Date;
}

/**
 * Student Details
 * Used for GET /api/students/:id
 */
export interface StudentDetails {
  id: string;

  studentCode: string;
  admissionNumber: string;

  emisNumber: string | null;
  apaarId: string | null;
  penNumber: string | null;

  firstName: string;
  middleName: string | null;
  lastName: string;

  gender: Gender;

  dateOfBirth: Date;

  bloodGroup: string | null;
  religion: string | null;

  category: StudentCategory | null;
  caste: string | null;
  nationality: string | null;

  aadhaarNumber: string | null;
  birthCertificateNo: string | null;

  email: string | null;
  mobile: string | null;

  photo: string | null;

  admissionDate: Date;

  previousSchool: string | null;

  status: StudentStatus;

  remarks: string | null;

  fatherName: string;
  fatherOccupation: string | null;
  fatherMobile: string;
  fatherEmail: string | null;

  motherName: string | null;
  motherOccupation: string | null;
  motherMobile: string | null;
  motherEmail: string | null;

  guardianName: string | null;
  guardianRelation: string | null;
  guardianMobile: string |null;
  guardianEmail: string | null;

  addressLine1: string;
  addressLine2: string | null;

  city: string;
  district: string;
  state: string;
  country: string;
  postalCode: string;

  isTransportRequired: boolean;
  isHostelRequired: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Search Parameters
 */
export interface StudentQuery {
  search?: string;
  status?: StudentStatus;
  page?: number;
  limit?: number;
}

/**
 * Pagination Result
 */
export interface StudentPaginationResult {
  data: StudentListItem[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}