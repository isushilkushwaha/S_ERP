import { studentRepository } from "../../repositories/student.repository";
import { registrationRepository } from "../../repositories/update/registration.repository";

import type { UpdateRegistrationRequest } from "../../schemas/update/update-registration-schema";

export class RegistrationService {
  async update(
    id: string,
    payload: UpdateRegistrationRequest,
  ) {
    const student =
      await studentRepository.findById(id);

    if (!student) {
      throw new Error("Student not found");
    }

    return registrationRepository.update(
      id,
      payload,
    );
  }
}

export const registrationService =
  new RegistrationService();