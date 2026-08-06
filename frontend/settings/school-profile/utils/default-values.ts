import type {
  CreateSchoolProfileInput,
} from "@/features/settings/school-profile/schemas/school-profile.schema";

export const defaultSchoolProfileValues: CreateSchoolProfileInput = {
  schoolName: "",
  schoolCode: "",
  admissionPrefix: "ADM",
  logoUrl: "",
  faviconUrl: "",

  email: "",
  phone: "",
  alternatePhone: "",
  website: "",

  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  state: "",
  country: "India",
  postalCode: "",

  board: "",
  affiliationNumber: "",
  principalName: "",

  timezone: "Asia/Kolkata",
  currency: "INR",

  isActive: true,
};