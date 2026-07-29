export interface SchoolProfile {
  id: string;

  // Basic Information
  schoolName: string;
  schoolCode: string | null;

  // Branding
  logoUrl: string | null;

  // Contact Information
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

  // Academic Information
  board: string | null;
  affiliationNumber: string | null;
  principalName: string | null;

  // Localization
  timezone: string;
  currency: string;

  // Status
  isActive: boolean;

  // Audit
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}