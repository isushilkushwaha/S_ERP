import {
  PrismaClient,
  AcademicYearClass,
} from "@prisma/client";

import {
  ConfigurationRepository,
  UpsertConfigurationInput,
} from "../repositories/configuration.repository";

export class ConfigurationService {
  private readonly configRepo: ConfigurationRepository;

  constructor(
    private readonly prisma: PrismaClient
  ) {
    this.configRepo =
      new ConfigurationRepository(prisma);
  }

  /**
   * Get configuration for a class
   * in a specific academic year.
   */
  async getConfigurationByClassId(
    academicYearId: string,
    classId: string
  ): Promise<AcademicYearClass> {
    const config =
      await this.configRepo.findByClassId(
        academicYearId,
        classId
      );

    if (!config) {
      throw new Error(
        `Configuration for Class ID "${classId}" was not found in the selected academic year.`
      );
    }

    return config;
  }

  /**
   * Create/update configuration for a
   * class in an academic year.
   */
  async updateConfiguration(
tenantId: string, dto: UpsertConfigurationInput  ): Promise<AcademicYearClass> {
    // ---------------------------------------------
    // Validate academic year
    // ---------------------------------------------

    const academicYear =
      await this.prisma.academicYear.findFirst({
        where: {
          id: dto.academicYearId,
          deletedAt: null,
        },
      });

    if (!academicYear) {
      throw new Error(
        `Academic year "${dto.academicYearId}" was not found.`
      );
    }

    // ---------------------------------------------
    // Validate class
    // ---------------------------------------------

    const classRecord =
      await this.prisma.class.findFirst({
        where: {
          id: dto.classId,
          tenantId: undefined,
          deletedAt: null,
        },
      });

    if (!classRecord) {
      throw new Error(
        `Class "${dto.classId}" was not found.`
      );
    }

    // ---------------------------------------------
    // Validate assignment
    // ---------------------------------------------

    const assignment =
      await this.prisma.academicYearClass.findUnique({
        where: {
          unique_academic_year_class: {
            academicYearId:
              dto.academicYearId,

            classId:
              dto.classId,
          },
        },
      });

    if (!assignment) {
      throw new Error(
        `Class "${dto.classId}" is not assigned to the selected academic year.`
      );
    }

    // ---------------------------------------------
    // Rule 1
    // ---------------------------------------------

    if (!dto.sectionsEnabled) {
      if (
        dto.maxStudentsWithoutSection ===
          null ||
        dto.maxStudentsWithoutSection ===
          undefined ||
        dto.maxStudentsWithoutSection <= 0
      ) {
        throw new Error(
          "Maximum student capacity must be greater than zero when sections are disabled."
        );
      }
    }

    // ---------------------------------------------
    // Rule 2
    // ---------------------------------------------

    if (dto.sectionsEnabled) {
      if (
        dto.defaultSectionCapacity ===
          null ||
        dto.defaultSectionCapacity ===
          undefined ||
        dto.defaultSectionCapacity <= 0
      ) {
        throw new Error(
          "Default section capacity must be greater than zero when sections are enabled."
        );
      }
    }

    return this.configRepo.upsert(dto);
  }

  /**
   * Delete configuration for a specific
   * academic year/class assignment.
   */
  async deleteConfiguration(
    academicYearId: string,
    classId: string
  ): Promise<void> {
    const config =
      await this.configRepo.findByClassId(
        academicYearId,
        classId
      );

    if (!config) {
      return;
    }

    // ---------------------------------------------
    // Dependency check
    //
    // Check enrollments belonging to this
    // academic year + class.
    // ---------------------------------------------

    const enrollmentCount =
      await this.prisma.studentEnrollment.count({
        where: {
          academicYearId,
          classId,
        },
      });

    if (enrollmentCount > 0) {
      throw new Error(
        `Cannot delete configuration. There are ${enrollmentCount} student enrollment(s) using this class in the selected academic year.`
      );
    }

    await this.configRepo.delete(
      academicYearId,
      classId
    );
  }
}