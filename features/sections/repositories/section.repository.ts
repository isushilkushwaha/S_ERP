import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class SectionRepository {
  async findMany(params: {
    search?: string;
    classId?: string;
    skip?: number;
    take?: number;
  }) {
    const {
      search,
      classId,
      skip = 0,
      take = 100,
    } = params;

    return prisma.section.findMany({
      where: {
        ...(classId && { classId }),

        ...(search && {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      },

      include: {
        class: true,
      },

      orderBy: [
        {
          classId: "asc",
        },
        {
          name: "asc",
        },
      ],

      skip,
      take,
    });
  }

  async count(params: {
    search?: string;
    classId?: string;
  }) {
    const { search, classId } = params;

    return prisma.section.count({
      where: {
        ...(classId && { classId }),

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
    return prisma.section.findUnique({
      where: {
        id,
      },

      include: {
        class: true,
      },
    });
  }
}

export const sectionRepository =
  new SectionRepository();