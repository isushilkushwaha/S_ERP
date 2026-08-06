// features/settings/classes/services/occupancy.service.ts

import { PrismaClient, Prisma } from "@prisma/client";

interface SectionItem {
  id: string;
  name: string;
  capacity?: number;
}

interface EnrollmentItem {
  sectionId: string | null;
  academicYearId: string;
}

export class OccupancyService {
  constructor(private prisma: PrismaClient) {}

  async getClassOccupancy(classId: string, academicYearId?: string) {
    // 1. Fetch class details
    const classItem = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classItem) {
      throw new Error("Class not found");
    }

    // 2. Fetch sections belonging to this class
    const sections = await this.prisma.section.findMany({
      where: {
        classId,
        status: "ACTIVE",
        deletedAt: null,
      },
      orderBy: { displayOrder: "asc" },
    });

    // 3. 🔒 STRICTLY filter student enrollments by classId and academicYearId
    const enrollmentWhere: Prisma.StudentEnrollmentWhereInput = {
      classId,
      status: "ACTIVE",
    };

    if (academicYearId && academicYearId !== "ALL") {
      enrollmentWhere.academicYearId = academicYearId;
    }

    const enrollments = await this.prisma.studentEnrollment.findMany({
      where: enrollmentWhere,
      select: { sectionId: true, academicYearId: true },
    });

    // 4. Fetch configuration for default capacity rules
    const configuration = await this.prisma.classConfiguration.findUnique({
      where: { classId },
    });

    const sectionsEnabled = configuration?.sectionsEnabled ?? true;
    let totalCapacity = 0;

    const computedSections = sections.map((sec: SectionItem) => {
      const capacity = sec.capacity || configuration?.defaultSectionCapacity || 40;
      totalCapacity += capacity;
      
      // Count students assigned to this section for this specific academic year
      const currentStudents = enrollments.filter((e: EnrollmentItem) => e.sectionId === sec.id).length;
      const seatsLeft = Math.max(0, capacity - currentStudents);
      const occupancyPercentage = capacity > 0 ? Number(((currentStudents / capacity) * 100).toFixed(1)) : 0;

      return {
        sectionId: sec.id,
        sectionName: sec.name,
        capacity,
        currentStudents,
        seatsLeft,
        occupancyPercentage,
      };
    });

    const totalEnrolledStudents = enrollments.length;
    const totalSeatsLeft = Math.max(0, totalCapacity - totalEnrolledStudents);

    return {
      className: classItem.name,
      totalCapacity,
      totalEnrolledStudents,
      totalSeatsLeft,
      sectionsEnabled,
      sections: computedSections,
    };
  }
}