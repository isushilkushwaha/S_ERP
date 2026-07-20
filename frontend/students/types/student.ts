// frontend/students/types/student.ts

export type Gender =
  | "MALE"
  | "FEMALE"
  | "OTHER";

export type StudentStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "TRANSFERRED"
  | "ALUMNI";

export interface Student {
  id: string;

  studentCode: string;
  admissionNumber: string;
  admissionDate: string;

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

  mobileNumber: string | null;
  email: string | null;

  previousSchool: string | null;
  remarks: string | null;

  fatherName: string;
  fatherOccupation: string | null;
  fatherMobile: string | null;
  fatherEmail: string | null;

  motherName: string;
  motherOccupation: string | null;
  motherMobile: string | null;
  motherEmail: string | null;

  guardianName: string | null;
  guardianRelation: string | null;
  guardianMobile: string | null;
  guardianEmail: string | null;

  addressLine1: string;
  addressLine2: string | null;

  city: string;
  district: string;
  state: string;
  country: string | null;
  postalCode: string;

  isTransportRequired: boolean;
  isHostelRequired: boolean;

  status: StudentStatus;

  createdAt: string;
  updatedAt: string;
}

export interface StudentListItem extends Student {
  currentEnrollment?: {
    academicYear: string;
    className: string;
    sectionName: string;
    rollNumber: string;
  };
}