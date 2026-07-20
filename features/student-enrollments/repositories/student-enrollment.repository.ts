import {
  EnrollmentStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class StudentEnrollmentRepository {
  // ======================================================
  // LIST
  // ======================================================

  async findMany(params: {
    search?: string;
    academicYearId?: string;
    classId?: string;
    sectionId?: string;
    enrollmentStatus?: EnrollmentStatus;
    skip?: number;
    take?: number;
  }) {
    const {
      search,
      academicYearId,
      classId,
      sectionId,
      enrollmentStatus,
      skip = 0,
      take = 10,
    } = params;

    return prisma.studentEnrollment.findMany({
      where: {
        ...(academicYearId && { academicYearId }),
        ...(classId && { classId }),
        ...(sectionId && { sectionId }),
        ...(enrollmentStatus && { enrollmentStatus }),

        ...(search && {
          student: {
            OR: [
              {
                firstName: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                lastName: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                admissionNumber: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                studentCode: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          },
        }),
      },

      include: {
        student: true,
        academicYear: true,
        class: true,
        section: true,
      },

      skip,
      take,

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // ======================================================
  // COUNT
  // ======================================================

  async count(params: {
    search?: string;
    academicYearId?: string;
    classId?: string;
    sectionId?: string;
    enrollmentStatus?: EnrollmentStatus;
  }) {
    const {
      search,
      academicYearId,
      classId,
      sectionId,
      enrollmentStatus,
    } = params;

    return prisma.studentEnrollment.count({
      where: {
        ...(academicYearId && { academicYearId }),
        ...(classId && { classId }),
        ...(sectionId && { sectionId }),
        ...(enrollmentStatus && { enrollmentStatus }),

        ...(search && {
          student: {
            OR: [
              {
                firstName: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                lastName: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                admissionNumber: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                studentCode: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          },
        }),
      },
    });
  }

  // ======================================================
  // FIND ONE
  // ======================================================

  async findById(id: string) {
    return prisma.studentEnrollment.findUnique({
      where: { id },

      include: {
        student: true,
        academicYear: true,
        class: true,
        section: true,
      },
    });
  }

  // ======================================================
  // LOOKUP MASTER TABLES
  // ======================================================

  async findStudentById(studentId: string) {
    return prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });
  }

  async findAcademicYearById(academicYearId: string) {
    return prisma.academicYear.findUnique({
      where: {
        id: academicYearId,
      },
    });
  }

  async findClassById(classId: string) {
    return prisma.class.findUnique({
      where: {
        id: classId,
      },
    });
  }

  async findSectionById(sectionId: string) {
    return prisma.section.findUnique({
      where: {
        id: sectionId,
      },
    });
  }

  // ======================================================
  // BUSINESS LOOKUPS
  // ======================================================

  async findStudentEnrollment(
    studentId: string,
    academicYearId: string
  ) {
    return prisma.studentEnrollment.findFirst({
      where: {
        studentId,
        academicYearId,
      },
    });
  }

  async findRollNumber(
    academicYearId: string,
    classId: string,
    sectionId: string,
    rollNumber: number
  ) {
    return prisma.studentEnrollment.findFirst({
      where: {
        academicYearId,
        classId,
        sectionId,
        rollNumber,
      },
    });
  }

  // ======================================================
  // CREATE
  // ======================================================

  async create(
    data: Prisma.StudentEnrollmentCreateInput
  ) {
    return prisma.studentEnrollment.create({
      data,

      include: {
        student: true,
        academicYear: true,
        class: true,
        section: true,
      },
    });
  }

  // ======================================================
  // UPDATE
  // ======================================================

  async update(
    id: string,
    data: Prisma.StudentEnrollmentUpdateInput
  ) {
    return prisma.studentEnrollment.update({
      where: {
        id,
      },

      data,

      include: {
        student: true,
        academicYear: true,
        class: true,
        section: true,
      },
    });
  }

  // ======================================================
  // DELETE
  // ======================================================

  async delete(id: string) {
    return prisma.studentEnrollment.delete({
      where: {
        id,
      },
    });
  }


  // ======================================================
// FIND DUPLICATE ENROLLMENT EXCLUDING CURRENT
// ======================================================

async findStudentEnrollmentExceptId(
  id: string,
  studentId: string,
  academicYearId: string
) {
  return prisma.studentEnrollment.findFirst({
    where: {
      studentId,
      academicYearId,

      NOT: {
        id,
      },
    },
  });
}

// ======================================================
// FIND ROLL NUMBER EXCLUDING CURRENT
// ======================================================

async findRollNumberExceptId(
  id: string,
  academicYearId: string,
  classId: string,
  sectionId: string,
  rollNumber: number
) {
  return prisma.studentEnrollment.findFirst({
    where: {
      academicYearId,
      classId,
      sectionId,
      rollNumber,

      NOT: {
        id,
      },
    },
  });
}
}



export const studentEnrollmentRepository =
  new StudentEnrollmentRepository();