import { studentRepository } from "../../repositories/student.repository";
import {
  profileRepository,
  type UpdateProfilePayload,
} from "../../repositories/update/profile.repository";

class ProfileService {
  async updateProfile(
    id: string,
    payload: UpdateProfilePayload
  ) {
    const student = await studentRepository.findById(id);

    if (!student) {
      throw new Error("Student not found.");
    }

    return profileRepository.update(id, payload);
  }
}

export const profileService = new ProfileService();