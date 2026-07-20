import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class ClassRepository {
  async findMany(params: {
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const {
      search,
      skip = 0,
      take = 100,
    } = params;

    return prisma.class.findMany({
      where: {
        ...(search && {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      },

      orderBy: {
        name: "asc",
      },

      skip,
      take,
    });
  }

  async count(params: {
    search?: string;
  }) {
    const { search } = params;

    return prisma.class.count({
      where: {
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
    return prisma.class.findUnique({
      where: {
        id,
      },
    });
  }
}

export const classRepository =
  new ClassRepository();