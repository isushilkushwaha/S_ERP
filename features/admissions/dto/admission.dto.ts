import { 
  Gender, 
  AdmissionType, 
  Medium, 
  Stream, 
  StudentStatus 
} from "@prisma/client";

// ==========================================
// SEARCH & LOOKUP DTOs
// ==========================================

export interface SearchRegisteredStudentDTO {
  query?: string;
  registrationNumber?: string;
  studentId?: string;
  fatherMobile?: string;
}

export interface StudentRegistrationSummaryDTO {
  id: string;
  studentCode: string;
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
  dateOfBirth?: Date | string | null;
  gender?: Gender | null;
  fatherName: string;
  motherName?: string | null;
  fatherMobile?: string | null;
  mobile?: string | null;
  email?: string | null;
  photo?: string | null;
  aadhaarNumber?: string | null;
  aadhaar?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  registrationDate?: Date | string | null;
  hasActiveEnrollment: boolean;
  enrollments?: {
    id: string;
    academicYearId: string;
    academicYearName: string;
    className: string;
    status: string;
  }[];
}

// ==========================================
// ADMISSION WIZARD STEP DTOs
// ==========================================

export interface Step1SelectStudentDTO {
  studentId: string;
}

export interface Step3AcademicAdmissionDTO {
  academicYearId: string;
  classId: string;
  sectionId: string;
  admissionDate: Date;
  admissionNumber: string;
  rollNumber: number;
  admissionType: AdmissionType;
  medium: Medium;
  stream?: Stream | null;
  house?: string | null;
  boardRegistrationNumber?: string | null;
  isHostelRequired: boolean;
  isTransportRequired: boolean;
  remarks?: string | null;
}

export interface FeeComponentItemDTO {
  feeComponentId: string;
  name: string;
  code: string;
  amount: number;
  isRequired: boolean;
}

export interface AssignedFeeStructureDTO {
  feeStructureId: string;
  academicYearId: string;
  classId: string;
  totalAmount: number;
  items: FeeComponentItemDTO[];
}

export interface CreateAdmissionPayloadDTO {
  studentId: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  admissionDate: Date;
  admissionNumber: string;
  rollNumber: number;
  medium: Medium;
  stream?: Stream | null;
  admissionType: AdmissionType;
  house?: string | null;
  boardRegistrationNumber?: string | null;
  isHostelRequired: boolean;
  isTransportRequired: boolean;
  remarks?: string | null;
  tenantId: string;
  createdBy?: string;
}

// ==========================================
// RESPONSE DTOs
// ==========================================

export interface AdmissionResponseDTO {
  enrollmentId: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  academicYear: string;
  className: string;
  sectionName: string;
  admissionNumber: string;
  rollNumber: number;
  admissionDate: Date;
  status: StudentStatus;
  totalFeesAssigned: number;
}