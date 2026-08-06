

import { PrismaClient, Status, StudentStatus } from "@prisma/client";

export interface AllocationResult {
  sectionId: string | null;
  sectionName: string | null;
  allocated: boolean;
  message: string;
}

export class AutoSectionAllocationService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Automatically assigns an available section for a given target classId.
   */
  async allocateSection(classId: string): Promise<AllocationResult> {
    const config = await this.prisma.classConfiguration.findUnique({
      where: { classId },
    });

    if (!config) {
      throw new Error(`Configuration record for Class ID "${classId}" does not exist.`);
    }

    // Case A: Sections Disabled
    if (!config.sectionsEnabled) {
      const currentEnrolledCount = await this.prisma.studentEnrollment.count({
        where: {
          classId,
          status: StudentStatus.ACTIVE,
        },
      });

      const maxLimit = config.maxStudentsWithoutSection || 0;

      if (maxLimit > 0 && currentEnrolledCount >= maxLimit) {
        return {
          sectionId: null,
          sectionName: null,
          allocated: false,
          message: "No seats are available in this class.",
        };
      }

      return {
        sectionId: null,
        sectionName: null,
        allocated: true,
        message: "Student enrolled directly into class (sections disabled).",
      };
    }

    // Case B: Sections Enabled — Query ACTIVE Sections
    const activeSections = await this.prisma.section.findMany({
      where: {
        classId,
        status: Status.ACTIVE,
        deletedAt: null,
      },
      orderBy: { displayOrder: "asc" },
    });

    if (activeSections.length === 0) {
      return {
        sectionId: null,
        sectionName: null,
        allocated: false,
        message: "No active sections are available for this class.",
      };
    }

    for (const section of activeSections) {
      const currentSectionStudents = await this.prisma.studentEnrollment.count({
        where: {
          sectionId: section.id,
          status: StudentStatus.ACTIVE,
        },
      });

      if (currentSectionStudents < section.capacity) {
        return {
          sectionId: section.id,
          sectionName: section.name,
          allocated: true,
          message: `Successfully allocated to Section ${section.name}.`,
        };
      }
    }

    return {
      sectionId: null,
      sectionName: null,
      allocated: false,
      message: "No seats are available in this class.",
    };
  }
}