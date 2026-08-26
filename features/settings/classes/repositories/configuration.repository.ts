import {
  PrismaClient,
  AcademicYearClass,
  Prisma,
} from "@prisma/client";

export interface UpsertConfigurationInput {
  academicYearId: string;
  classId: string;
  sectionsEnabled: boolean;
  defaultSectionCapacity?: number | null;
  maxStudentsWithoutSection?: number | null;
  autoAllocationEnabled?: boolean;
}

export class ConfigurationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Find configuration for a specific class
   * inside a specific academic year.
   */
  async findByClassId(
    academicYearId: string,
    classId: string
  ): Promise<AcademicYearClass | null> {
    return this.prisma.academicYearClass.findUnique({
      where: {
        unique_academic_year_class: {
          academicYearId,
          classId,
        },
      },
    });
  }

  /**
   * Create or update academic-year-specific
   * class configuration.
   */
  async upsert(
    data: UpsertConfigurationInput,
    tx?: Prisma.TransactionClient
  ): Promise<AcademicYearClass> {
    const client = tx ?? this.prisma;

    return client.academicYearClass.upsert({
      where: {
        unique_academic_year_class: {
          academicYearId: data.academicYearId,
          classId: data.classId,
        },
      },

      create: {
        academicYearId: data.academicYearId,
        classId: data.classId,

        sectionsEnabled:
          data.sectionsEnabled,

        defaultSectionCapacity:
          data.defaultSectionCapacity,

        maxStudentsWithoutSection:
          data.maxStudentsWithoutSection,

        autoAllocationEnabled:
          data.autoAllocationEnabled ?? true,
      },

      update: {
        sectionsEnabled:
          data.sectionsEnabled,

        defaultSectionCapacity:
          data.defaultSectionCapacity,

        maxStudentsWithoutSection:
          data.maxStudentsWithoutSection,

        ...(data.autoAllocationEnabled !== undefined && {
          autoAllocationEnabled:
            data.autoAllocationEnabled,
        }),
      },
    });
  }

  /**
   * Delete configuration for a specific
   * academic-year/class assignment.
   */
  async delete(
    academicYearId: string,
    classId: string
  ): Promise<void> {
    await this.prisma.academicYearClass.delete({
      where: {
        unique_academic_year_class: {
          academicYearId,
          classId,
        },
      },
    });
  }
}