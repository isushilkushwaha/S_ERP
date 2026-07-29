import { ConflictError } from "@/lib/errors/conflict-error";
import { NotFoundError } from "@/lib/errors/not-found-error";

import {
  CreateSchoolProfileInput,
  UpdateSchoolProfileInput,
} from "../schemas/school-profile.schema";

import {
  schoolProfileRepository,
} from "../repository/school-profile.repository";

export class SchoolProfileService {
  getSchoolProfile() {
      throw new Error("Method not implemented.");
  }
  constructor(
    private readonly repository = schoolProfileRepository,
  ) {}

  /**
   * Returns the current school profile.
   */
//   async get() {
//     const profile = await this.repository.findProfile();

//     if (!profile) {
//       throw new NotFoundError(
//         "School profile not found."
//       );
//     }

//     return profile;
//   }

async get() {
  return this.repository.findProfile();
}

  /**
   * Creates a school profile.
   *
   * Business Rule:
   * Only one school profile can exist.
   */
  async create(
    data: CreateSchoolProfileInput,
  ) {
    const exists = await this.repository.exists();

    if (exists) {
      throw new ConflictError(
        "School profile already exists."
      );
    }

    return this.repository.create(data);
  }

  /**
   * Updates the existing school profile.
   */
  async update(
    data: UpdateSchoolProfileInput,
  ) {
    const profile = await this.repository.findProfile();

    if (!profile) {
      throw new NotFoundError(
        "School profile not found."
      );
    }

    return this.repository.update(
      profile.id,
      data,
    );
  }
}

export const schoolProfileService =
  new SchoolProfileService();