import type { ComponentType } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { StudentFormValues } from "../schemas/student-form.schema";

import { RegistrationInformation } from "./admission-information";
import { PersonalInformation } from "./personal-information";
import { ParentInformation } from "./parent-information";
import { AddressInformation } from "./address-information";
import { ReviewInformation } from "./review-information";

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  component?: ComponentType<{
    form: UseFormReturn<StudentFormValues>;
  }>;
  fields: (keyof StudentFormValues)[];
}

export const STUDENT_REGISTRATION_STEPS: WizardStep[] = [
  {
    id: "registration",
    title: "Registration",
    description: "Registration Information",
    component: RegistrationInformation,
    fields: [
      "emisNumber",
      "apaarId",
      "penNumber",
    ],
  },

  {
    id: "personal",
    title: "Personal",
    description: "Personal Information",
    component: PersonalInformation,
    fields: [
      "firstName",
      "middleName",
      "lastName",

      "gender",
      "dateOfBirth",

      "bloodGroup",
      "religion",
      "category",
      "caste",
      "nationality",

      "aadhaarNumber",
      "birthCertificateNo",

      "email",
      "mobile",

      "photo",

      "previousSchool",
      "remarks",
    ],
  },

  {
    id: "parent",
    title: "Parents",
    description: "Parent Information",
    component: ParentInformation,
    fields: [
      "fatherName",
      "fatherOccupation",
      "fatherMobile",
      "fatherEmail",

      "motherName",
      "motherOccupation",
      "motherMobile",
      "motherEmail",

      "guardianName",
      "guardianRelation",
      "guardianMobile",
      "guardianEmail",
    ],
  },

  {
    id: "address",
    title: "Address",
    description: "Address Information",
    component: AddressInformation,
    fields: [
      "addressLine1",
      "addressLine2",
      "city",
      "district",
      "state",
      "country",
      "postalCode",
    ],
  },

  {
    id: "review",
    title: "Review",
    description: "Review all information before submitting.",
    component: ReviewInformation,
    fields: [],
  },
];