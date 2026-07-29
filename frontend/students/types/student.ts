// frontend/students/types/student.ts

export type Gender =
  | "MALE"
  | "FEMALE"
  | "OTHER";

export interface Student {
  data: Student;
  id: string;

  // System Generated
  studentCode: string;

  // Government IDs
  emisNumber: string | null;
  apaarId: string | null;
  penNumber: string | null;

  // Personal Details
  firstName: string;
  middleName: string | null;
  lastName: string;

  gender: Gender;
  dateOfBirth: string;

  bloodGroup: string | null;
  religion: string | null;
  category: string | null;
  caste: string | null;
  nationality: string | null;

  aadhaarNumber: string | null;
  birthCertificateNo: string | null;

  // Contact
  mobile: string | null;
  email: string | null;

  photo: string | null;

  // Registration
  registrationDate: string;

  previousSchool: string | null;
  remarks: string | null;

  // Father Details
  fatherName: string;
  fatherOccupation: string | null;
  fatherMobile: string | null;
  fatherEmail: string | null;

  // Mother Details
  motherName: string | null;
  motherOccupation: string | null;
  motherMobile: string | null;
  motherEmail: string | null;

  // Guardian Details
  guardianName: string | null;
  guardianRelation: string | null;
  guardianMobile: string | null;
  guardianEmail: string | null;

  // Address
  addressLine1: string;
  addressLine2: string | null;

  city: string;
  district: string;
  state: string;
  country: string | null;
  postalCode: string;

  createdAt: string;
  updatedAt: string;
}

export interface UpdatePersonalRequest {
  dateOfBirth?: string | null;

  gender?: Gender;

  bloodGroup?: string | null;

  religion?: string | null;

  category?: string | null;

  caste?: string | null;

  nationality?: string | null;

  aadhaarNumber?: string | null;

  birthCertificateNo?: string | null;

  previousSchool?: string | null;

  remarks?: string | null;
}

export interface StudentListItem extends Student {
  currentEnrollment?: {
    id: string;
    academicYearId: string;
    academicYear: string;
    classId: string;
    className: string;
    sectionId: string;
    sectionName: string;
    rollNumber: number;
    admissionNumber: string;
    admissionDate: string;
    status: "ACTIVE" | "INACTIVE" | "TRANSFERRED" | "ALUMNI";
    isTransportRequired: boolean;
    isHostelRequired: boolean;
    photo?: string | null;
  } | null;
}

export interface UpdateProfileRequest {
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
  mobile?: string | null;
  email?: string | null;
}