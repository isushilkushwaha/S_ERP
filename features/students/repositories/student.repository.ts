import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class StudentRepository {
  private buildWhere(search?: string): Prisma.StudentWhereInput {
    const where: Prisma.StudentWhereInput = {
      deletedAt: null,
    };

    if (!search?.trim()) {
      return where;
    }

    const terms = search
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const nameFilter: Prisma.StudentWhereInput = {
      AND: terms.map((term) => ({
        OR: [
          {
            firstName: {
              contains: term,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            middleName: {
              contains: term,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            lastName: {
              contains: term,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      })),
    };

    where.OR = [
      nameFilter,

      {
        fatherName: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },

      {
        motherName: {
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

      {
        aadhaarNumber: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },

      {
        mobile: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },

      {
        fatherMobile: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },

      {
        motherMobile: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    ];

    return where;
  }

  async findMany(params: {
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const {
      search,
      skip = 0,
      take = 10,
    } = params;

    return prisma.student.findMany({
      where: this.buildWhere(search),

      skip,
      take,

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async count(params: {
    search?: string;
  }) {
    return prisma.student.count({
      where: this.buildWhere(params.search),
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

  // async softDelete(id: string) {
  //   return prisma.student.update({
  //     where: {
  //       id,
  //     },
  //     data: {
  //       deletedAt: new Date(),
  //     },
  //   });
  // }

  async delete(id: string) {
  return prisma.student.delete({
    where: {
      id,
    },
  });
}
}

export const studentRepository = new StudentRepository();