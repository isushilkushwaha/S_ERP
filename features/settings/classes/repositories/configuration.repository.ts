import { PrismaClient, ClassConfiguration, Prisma } from "@prisma/client";

export interface UpsertConfigurationInput {
  classId: string;
  sectionsEnabled: boolean;
  defaultSectionCapacity?: number | null;
  maxStudentsWithoutSection?: number | null;
  autoAllocationEnabled?: boolean;
}

export class ConfigurationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Find configuration by Class ID
   */
  async findByClassId(classId: string): Promise<ClassConfiguration | null> {
    return this.prisma.classConfiguration.findUnique({
      where: { classId },
    });
  }

  /**
   * Create or Update configuration for a class
   */
  async upsert(
    data: UpsertConfigurationInput,
    tx?: Prisma.TransactionClient
  ): Promise<ClassConfiguration> {
    const client = tx || this.prisma;
    return client.classConfiguration.upsert({
      where: { classId: data.classId },
      create: {
        classId: data.classId,
        sectionsEnabled: data.sectionsEnabled,
        defaultSectionCapacity: data.defaultSectionCapacity,
        maxStudentsWithoutSection: data.maxStudentsWithoutSection,
        autoAllocationEnabled: data.autoAllocationEnabled ?? true,
      },
      update: {
        sectionsEnabled: data.sectionsEnabled,
        defaultSectionCapacity: data.defaultSectionCapacity,
        maxStudentsWithoutSection: data.maxStudentsWithoutSection,
        ...(data.autoAllocationEnabled !== undefined && {
          autoAllocationEnabled: data.autoAllocationEnabled,
        }),
      },
    });
  }
}