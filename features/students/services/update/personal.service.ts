import { studentRepository } from "../../repositories/student.repository";
import {
  personalRepository,
  type UpdatePersonalPayload,
} from "../../repositories/update/personal.repository";

class PersonalService {
  async update(
    id: string,
    payload: UpdatePersonalPayload,
  ) {
    const student =
      await studentRepository.findById(id);

    if (!student) {
      throw new Error("Student not found");
    }

    return personalRepository.update(
      id,
      payload,
    );
  }
}

export const personalService =
  new PersonalService();