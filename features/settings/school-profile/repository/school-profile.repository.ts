import { Prisma, SchoolProfile } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class SchoolProfileRepository {
  /**
   * Returns the active school profile including admissionPrefix.
   */
  async findProfile(): Promise<SchoolProfile | null> {
    return prisma.schoolProfile.findFirst({
      where: {
        deletedAt: null,
      },
    });
  }

  /**
   * Returns a school profile by id including admissionPrefix.
   */
  async findById(id: string): Promise<SchoolProfile | null> {
    return prisma.schoolProfile.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  /**
   * Checks whether a school profile already exists.
   */
  async exists(): Promise<boolean> {
    const profile = await this.findProfile();

    return profile !== null;
  }

  /**
   * Creates a new school profile with admissionPrefix support.
   */
  async create(
    data: Prisma.SchoolProfileCreateInput,
  ): Promise<SchoolProfile> {
    return prisma.schoolProfile.create({
      data,
    });
  }

  /**
   * Updates an existing school profile including admissionPrefix updates.
   */
  async update(
    id: string,
    data: Prisma.SchoolProfileUpdateInput,
  ): Promise<SchoolProfile> {
    return prisma.schoolProfile.update({
      where: {
        id,
      },
      data,
    });
  }
}

export const schoolProfileRepository = new SchoolProfileRepository();