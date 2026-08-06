import type {
  CreateSchoolProfileInput,
} from "@/features/settings/school-profile/schemas/school-profile.schema";

import type { SchoolProfile } from "../types";

export function mapSchoolProfileToForm(
  profile: SchoolProfile
): CreateSchoolProfileInput {
  return {
    schoolName: profile.schoolName,
    schoolCode: profile.schoolCode ?? "",
    admissionPrefix: profile.admissionPrefix ?? "ADM",
    logoUrl: profile.logoUrl ?? "",
    faviconUrl: profile.faviconUrl ?? "",

    email: profile.email ?? "",
    phone: profile.phone ?? "",
    alternatePhone: profile.alternatePhone ?? "",
    website: profile.website ?? "",

    addressLine1: profile.addressLine1,
    addressLine2: profile.addressLine2 ?? "",
    city: profile.city,
    district: profile.district ?? "",
    state: profile.state,
    country: profile.country,
    postalCode: profile.postalCode ?? "",

    board: profile.board ?? "",
    affiliationNumber: profile.affiliationNumber ?? "",
    principalName: profile.principalName ?? "",

    timezone: profile.timezone,
    currency: profile.currency,

    isActive: profile.isActive,
  };
}