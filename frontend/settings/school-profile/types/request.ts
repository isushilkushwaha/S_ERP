// frontend/settings/school-profile/types/request.ts

export interface CreateSchoolProfileRequest {
  schoolName: string;
  schoolCode?: string;
  admissionPrefix?: string;

  logoUrl?: string;
  faviconUrl?: string;

  email?: string;
  phone?: string;
  alternatePhone?: string;
  website?: string;

  addressLine1: string;
  addressLine2?: string;
  city: string;
  district?: string;
  state: string;
  country?: string;
  postalCode?: string;

  board?: string;
  affiliationNumber?: string;
  principalName?: string;

  timezone?: string;
  currency?: string;

  isActive?: boolean;
}

export type UpdateSchoolProfileRequest = Partial<CreateSchoolProfileRequest>;

export interface SchoolProfile {
  id: string;

  // Basic Information
  schoolName: string;
  schoolCode: string | null;
  admissionPrefix: string;

  // Branding
  logoUrl?: string | null;
  faviconUrl?: string | null;

  // Contact
  email: string | null;
  phone: string | null;
  alternatePhone: string | null;
  website: string | null;

  // Address
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  district: string | null;
  state: string;
  country: string;
  postalCode: string | null;

  // Academic
  board: string | null;
  affiliationNumber: string | null;
  principalName: string | null;

  // Localization
  timezone: string;
  currency: string;

  // Status
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface SchoolProfileResponse {
  data: SchoolProfile;
  message: string;
}

export interface SchoolProfileListResponse {
  data: SchoolProfile[];
  message: string;
}