import type { Student } from "../types/student";
import type { StudentFormValues } from "../schemas/student-form.schema";

import {
  BLOOD_GROUP_OPTIONS,
  CATEGORY_OPTIONS,
} from "../constants";

export function mapStudentToFormValues(
  student: Student
): StudentFormValues {
  return {
    // Student Information
  

    firstName: student.firstName,
    middleName: student.middleName ?? "",
    lastName: student.lastName,

    gender: student.gender,

    dateOfBirth: student.dateOfBirth,

    bloodGroup: BLOOD_GROUP_OPTIONS.includes(
      student.bloodGroup as (typeof BLOOD_GROUP_OPTIONS)[number]
    )
      ? (student.bloodGroup as (typeof BLOOD_GROUP_OPTIONS)[number])
      : "",

    religion: student.religion ?? "",

    category: CATEGORY_OPTIONS.includes(
      student.category as (typeof CATEGORY_OPTIONS)[number]
    )
      ? (student.category as (typeof CATEGORY_OPTIONS)[number])
      : "",

    caste: student.caste ?? "",

    nationality: student.nationality ?? "India",

    aadhaarNumber: student.aadhaarNumber ?? "",

    birthCertificateNo:
      student.birthCertificateNo ?? "",

    email: student.email ?? "",

    mobile: student.mobile ?? "",

    previousSchool: student.previousSchool ?? "",

    remarks: student.remarks ?? "",

    // Father
    fatherName: student.fatherName,

    fatherOccupation:
      student.fatherOccupation ?? "",

    fatherMobile:
      student.fatherMobile ?? "",

    fatherEmail:
      student.fatherEmail ?? "",

    // Mother
    motherName:
      student.motherName ?? "",

    motherOccupation:
      student.motherOccupation ?? "",

    motherMobile:
      student.motherMobile ?? "",

    motherEmail:
      student.motherEmail ?? "",

    // Guardian
    guardianName:
      student.guardianName ?? "",

    guardianRelation:
      student.guardianRelation ?? "",

    guardianMobile:
      student.guardianMobile ?? "",

    guardianEmail:
      student.guardianEmail ?? "",

    // Address
    addressLine1:
      student.addressLine1,

    addressLine2:
      student.addressLine2 ?? "",

    city: student.city,

    district: student.district,

    state: student.state,

    country: student.country ?? "India",

    postalCode:
      student.postalCode,
  };
}