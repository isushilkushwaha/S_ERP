import { parentRepository } from "../../repositories/update/parent.repository";
import { studentRepository } from "../../repositories/student.repository";

import type { UpdateStudentRequest } from "@/frontend/students/types";

class ParentService {
  async update(
    id: string,
    data: UpdateStudentRequest,
  ) {
    const student = await studentRepository.findById(id);

    if (!student) {
      throw new Error("Student not found.");
    }

    return parentRepository.update(id, {
      fatherName: data.fatherName ?? undefined,
      fatherOccupation: data.fatherOccupation ?? undefined,
      fatherMobile: data.fatherMobile ?? undefined,
      fatherEmail: data.fatherEmail ?? undefined,

      motherName: data.motherName ?? undefined,
      motherOccupation: data.motherOccupation ?? undefined,
      motherMobile: data.motherMobile ?? undefined,
      motherEmail: data.motherEmail ?? undefined,

      guardianName: data.guardianName ?? undefined,
      guardianRelation: data.guardianRelation ?? undefined,
      guardianMobile: data.guardianMobile ?? undefined,
      guardianEmail: data.guardianEmail ?? undefined,
    });
  }
}

export const parentService = new ParentService();