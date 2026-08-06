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
  constructor(
    private readonly repository = schoolProfileRepository,
  ) {}

  /**
   * Returns the current school profile.
   */
  async get() {
    return this.repository.findProfile();
  }

  /**
   * Creates a school profile.
   *
   * Business Rules:
   * 1. Only one school profile can exist.
   * 2. Sanitizes admissionPrefix (trims spaces, converts to UPPERCASE, defaults to "ADM").
   */
  async create(data: CreateSchoolProfileInput) {
    const exists = await this.repository.exists();

    if (exists) {
      throw new ConflictError(
        "School profile already exists."
      );
    }

    const sanitizedPrefix = data.admissionPrefix
      ? data.admissionPrefix.trim().toUpperCase()
      : "ADM";

    return this.repository.create({
      ...data,
      admissionPrefix: sanitizedPrefix || "ADM",
    });
  }

  /**
   * Updates the existing school profile.
   *
   * Business Rules:
   * 1. Profile must exist to update.
   * 2. Sanitizes admissionPrefix if provided (trims spaces, converts to UPPERCASE).
   */
  async update(data: UpdateSchoolProfileInput) {
    const profile = await this.repository.findProfile();

    if (!profile) {
      throw new NotFoundError(
        "School profile not found."
      );
    }

    const updateData: UpdateSchoolProfileInput = { ...data };

    if (updateData.admissionPrefix !== undefined) {
      const trimmed = updateData.admissionPrefix.trim().toUpperCase();
      updateData.admissionPrefix = trimmed || "ADM";
    }

    return this.repository.update(
      profile.id,
      updateData,
    );
  }
}

export const schoolProfileService = new SchoolProfileService();