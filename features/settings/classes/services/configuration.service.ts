

import { PrismaClient, ClassConfiguration } from "@prisma/client";
import { ConfigurationRepository, UpsertConfigurationInput } from "../repositories/configuration.repository";

export class ConfigurationService {
  private configRepo: ConfigurationRepository;

  constructor(private readonly prisma: PrismaClient) {
    this.configRepo = new ConfigurationRepository(prisma);
  }

  /**
   * Fetches configuration settings for a given class ID.
   */
  async getConfigurationByClassId(classId: string): Promise<ClassConfiguration> {
    const config = await this.configRepo.findByClassId(classId);
    if (!config) {
      throw new Error(`Configuration settings for Class ID "${classId}" were not found.`);
    }
    return config;
  }

  /**
   * Updates or creates configuration settings for a class with capacity rule enforcement.
   */
  async updateConfiguration(dto: UpsertConfigurationInput): Promise<ClassConfiguration> {
    // Rule 1: If sections are disabled, maxStudentsWithoutSection must be positive
    if (!dto.sectionsEnabled) {
      if (!dto.maxStudentsWithoutSection || dto.maxStudentsWithoutSection <= 0) {
        throw new Error(
          "Maximum student capacity ('maxStudentsWithoutSection') must be greater than zero when sections are disabled."
        );
      }
    }

    // Rule 2: If sections are enabled, defaultSectionCapacity must be positive
    if (dto.sectionsEnabled && dto.defaultSectionCapacity) {
      if (dto.defaultSectionCapacity <= 0) {
        throw new Error("Default section capacity must be a positive integer greater than zero.");
      }
    }

    return this.configRepo.upsert(dto);
  }

  /**
   * Hard-deletes configuration settings for a class permanently.
   */
  async deleteConfigurationByClassId(classId: string): Promise<void> {
    const config = await this.configRepo.findByClassId(classId);
    if (!config) {
      return; // Already non-existent, idempotent success
    }

    // Dependency Guard: Check if students are enrolled in this class directly without a section
    const unsectionedEnrollments = await this.prisma.studentEnrollment.count({
      where: {
        class: {
          id: classId,
        },
        // ✅ Fixed: Use empty string or omit null if sectionId is non-nullable string in Prisma
        sectionId: "", 
      },
    });

    if (unsectionedEnrollments > 0) {
      throw new Error(
        `Cannot delete class configuration. There are ${unsectionedEnrollments} student enrollment(s) relying on this unsectioned class configuration.`
      );
    }

    await this.prisma.classConfiguration.delete({
      where: { classId },
    });
  }
}