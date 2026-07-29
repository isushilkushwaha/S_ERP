// frontend/students/utils/student-export.ts

import type { StudentListItem } from "../types";

export function mapStudentsForExport(
  students: StudentListItem[]
) {
  return students.map((student) => ({
    StudentCode: student.studentCode,
    Name: `${student.firstName} ${student.lastName}`,
    Gender: student.gender,
    Mobile: student.mobile ?? "",

    AcademicYear:
      student.currentEnrollment?.academicYear ?? "",

    Class:
      student.currentEnrollment?.className ?? "",

    Section:
      student.currentEnrollment?.sectionName ?? "",

    RollNumber:
      student.currentEnrollment?.rollNumber ?? "",

    RegistrationDate: student.registrationDate,
  }));
}