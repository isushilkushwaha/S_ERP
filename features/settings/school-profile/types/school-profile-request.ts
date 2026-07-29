export interface CreateSchoolProfileRequest {
  schoolName: string;
  schoolCode?: string;

  logoUrl?: string;

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

export interface UpdateSchoolProfileRequest
  extends Partial<CreateSchoolProfileRequest> {}