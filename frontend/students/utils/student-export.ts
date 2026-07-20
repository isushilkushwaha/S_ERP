// frontend/students/utils/student-export.ts

import type { StudentListItem } from "../types";

export function mapStudentsForExport(
  students: StudentListItem[]
) {
  return students.map((student) => ({
    AdmissionNo: student.admissionNumber,
    Name: `${student.firstName} ${student.lastName}`,
    Class: student.currentEnrollment?.className ?? "",
    Section: student.currentEnrollment?.sectionName ?? "",
    Status: student.status,
  }));
}