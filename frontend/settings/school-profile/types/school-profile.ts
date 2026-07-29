export interface SchoolProfile {
  id: string;

  // Basic Information
  schoolName: string;
  schoolCode: string | null;

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