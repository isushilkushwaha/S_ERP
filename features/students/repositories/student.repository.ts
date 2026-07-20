import { Prisma, StudentStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class StudentRepository {
  async findMany(params: {
    search?: string;
    status?: StudentStatus;
    skip?: number;
    take?: number;
  }) {
    const { search, status, skip = 0, take = 10 } = params;

    return prisma.student.findMany({
      where: {
        deletedAt: null,

        ...(status && { status }),

        ...(search && {
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
        }),
      },

      skip,
      take,

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async count(params: {
    search?: string;
    status?: StudentStatus;
  }) {
    const { search, status } = params;

    return prisma.student.count({
      where: {
        deletedAt: null,

        ...(status && { status }),

        ...(search && {
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
        }),
      },
    });
  }

  async findById(id: string) {
    return prisma.student.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByStudentCode(studentCode: string) {
    return prisma.student.findUnique({
      where: {
        studentCode,
      },
    });
  }

  async findByAdmissionNumber(admissionNumber: string) {
    return prisma.student.findUnique({
      where: {
        admissionNumber,
      },
    });
  }

  async create(data: Prisma.StudentCreateInput) {
    return prisma.student.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.StudentUpdateInput
  ) {
    return prisma.student.update({
      where: {
        id,
      },
      data,
    });
  }

  async softDelete(id: string) {
    return prisma.student.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export const studentRepository =
  new StudentRepository();