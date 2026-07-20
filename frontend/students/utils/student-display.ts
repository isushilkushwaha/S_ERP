// frontend/students/utils/student-display.ts

import type { Student } from "../types";

export function getStudentFullName(student: Student): string {
  return [
    student.firstName,
    student.middleName,
    student.lastName,
  ]
    .filter(Boolean)
    .join(" ");
}

export function getStudentInitials(student: Student): string {
  return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`
    .toUpperCase();
}

export function getStudentStatusColor(status: Student["status"]) {
  switch (status) {
    case "ACTIVE":
      return "success";

    case "INACTIVE":
      return "secondary";

    case "TRANSFERRED":
      return "warning";

    case "ALUMNI":
      return "outline";

    default:
      return "secondary";
  }
}