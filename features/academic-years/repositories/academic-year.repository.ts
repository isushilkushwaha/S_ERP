import {
  AcademicYearStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class AcademicYearRepository {
  async findMany(params: {
    search?: string;
    status?: AcademicYearStatus;
    skip?: number;
    take?: number;
  }) {
    const {
      search,
      status,
      skip = 0,
      take = 100,
    } = params;

    return prisma.academicYear.findMany({
      where: {
        ...(status && { status }),

        ...(search && {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      },

      orderBy: {
        startDate: "desc",
      },

      skip,
      take,
    });
  }

  async count(params: {
    search?: string;
    status?: AcademicYearStatus;
  }) {
    const { search, status } = params;

    return prisma.academicYear.count({
      where: {
        ...(status && { status }),

        ...(search && {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      },
    });
  }

  async findById(id: string) {
    return prisma.academicYear.findUnique({
      where: {
        id,
      },
    });
  }

  async findCurrent() {
    return prisma.academicYear.findFirst({
      where: {
        isCurrent: true,
      },
    });
  }
}

export const academicYearRepository =
  new AcademicYearRepository();