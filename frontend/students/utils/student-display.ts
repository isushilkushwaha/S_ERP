// frontend/students/utils/student-display.ts

import type { Student } from "../types";

/**
 * Returns the student's full name.
 */
export function getStudentFullName(student: Student): string {
  return [
    student.firstName,
    student.middleName,
    student.lastName,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Returns the student's initials.
 */
export function getStudentInitials(student: Student): string {
  return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`
    .toUpperCase();
}