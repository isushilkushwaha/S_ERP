

import { Prisma, PrismaClient } from "@prisma/client";

import { AcademicYearRepository } from "./academic-year.repository";

import {
  AcademicYearDTO,
  AcademicYearEntity,
  AcademicYearListResponse,
  AcademicYearQueryOptions,
  AcademicYearRepositoryCreateInput,
  AcademicYearRepositoryUpdateInput,
  PaginationMeta,
} from "../types/academic-year.types";

import {
  ACADEMIC_YEAR_ERRORS,
  ACADEMIC_YEAR_STATUS,
  DEFAULT_QUERY_OPTIONS,
  QUERY_MODE,
} from "../constants/academic-year.constants";

export class PrismaAcademicYearRepository
  implements AcademicYearRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  /* -------------------------------------------------------------------------- */
  /*                                 DTO Mapper                                 */
  /* -------------------------------------------------------------------------- */

  private toDTO(entity: AcademicYearEntity): AcademicYearDTO {
    return {
      id: entity.id,

      name: entity.name,
      code: entity.code,

      startDate: entity.startDate,
      endDate: entity.endDate,

      status: entity.status,

      description: entity.description,

      sortOrder: entity.sortOrder,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,

      deletedAt: entity.deletedAt,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                              Pagination Meta                               */
  /* -------------------------------------------------------------------------- */

  private buildPaginationMeta(
    page: number,
    limit: number,
    total: number
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,

      total,
      totalPages,

      hasNextPage: page < totalPages,

      hasPreviousPage: page > 1,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                Where Builder                               */
  /* -------------------------------------------------------------------------- */

  private buildWhereClause(
    options: AcademicYearQueryOptions
  ): Prisma.AcademicYearWhereInput {
    const where: Prisma.AcademicYearWhereInput = {};

    /* ---------------------------- Soft Delete ---------------------------- */

    if (!options.includeDeleted) {
      where.deletedAt = null;
    }

    /* ------------------------------ Status ------------------------------ */

    if (options.status) {
      where.status = options.status;
    }

    /* ------------------------------ Search ------------------------------ */

    if (options.search?.trim()) {
      where.OR = [
        {
          name: {
            contains: options.search.trim(),
            mode: QUERY_MODE.INSENSITIVE,
          },
        },
        {
          code: {
            contains: options.search.trim(),
            mode: QUERY_MODE.INSENSITIVE,
          },
        },
        {
          description: {
            contains: options.search.trim(),
            mode: QUERY_MODE.INSENSITIVE,
          },
        },
      ];
    }

    return where;
  }

  /* -------------------------------------------------------------------------- */
  /*                              Pagination Config                             */
  /* -------------------------------------------------------------------------- */

  protected getPagination(options: AcademicYearQueryOptions) {
    const page =
      options.page ?? DEFAULT_QUERY_OPTIONS.PAGE;

    const limit =
      options.limit ?? DEFAULT_QUERY_OPTIONS.LIMIT;

    return {
      page,
      limit,

      skip: (page - 1) * limit,

      take: limit,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Create                                   */
  /* -------------------------------------------------------------------------- */

  async create(
    data: AcademicYearRepositoryCreateInput
  ): Promise<AcademicYearDTO> {
    try {
      const academicYear = await this.prisma.academicYear.create({
        data: {
          name: data.name,
          code: data.code,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
          description: data.description,
          sortOrder: data.sortOrder ?? 0,
        },
      });

      return this.toDTO(academicYear);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const target = (error.meta?.target as string[]) || [];

        if (target.includes("name")) {
          throw new Error(ACADEMIC_YEAR_ERRORS.DUPLICATE_NAME);
        }
        if (target.includes("code")) {
          throw new Error(ACADEMIC_YEAR_ERRORS.DUPLICATE_CODE);
        }
      }
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Update                                   */
  /* -------------------------------------------------------------------------- */

  async update(
    id: string,
    data: AcademicYearRepositoryUpdateInput
  ): Promise<AcademicYearDTO> {
    try {
      const academicYear = await this.prisma.academicYear.update({
        where: {
          id,
        },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.code !== undefined && { code: data.code }),
          ...(data.startDate !== undefined && {
            startDate: data.startDate,
          }),
          ...(data.endDate !== undefined && {
            endDate: data.endDate,
          }),
          ...(data.status !== undefined && {
            status: data.status,
          }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.sortOrder !== undefined && {
            sortOrder: data.sortOrder,
          }),
        },
      });

      return this.toDTO(academicYear);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const target = (error.meta?.target as string[]) || [];

        if (target.includes("name")) {
          throw new Error(ACADEMIC_YEAR_ERRORS.DUPLICATE_NAME);
        }
        if (target.includes("code")) {
          throw new Error(ACADEMIC_YEAR_ERRORS.DUPLICATE_CODE);
        }
      }
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                              Permanent Delete                              */
  /* -------------------------------------------------------------------------- */

  async delete(id: string): Promise<void> {
    await this.prisma.academicYear.delete({
      where: {
        id,
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                Soft Delete                                 */
  /* -------------------------------------------------------------------------- */

  async softDelete(id: string): Promise<void> {
    await this.prisma.academicYear.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Restore                                  */
  /* -------------------------------------------------------------------------- */

  async restore(id: string): Promise<AcademicYearDTO> {
    const academicYear = await this.prisma.academicYear.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      },
    });

    return this.toDTO(academicYear);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Find By Id                                 */
  /* -------------------------------------------------------------------------- */

  async findById(
    id: string,
    includeDeleted = false
  ): Promise<AcademicYearDTO | null> {
    const where: Prisma.AcademicYearWhereInput = { id };

    if (!includeDeleted) {
      where.deletedAt = null;
    }

    const academicYear = await this.prisma.academicYear.findFirst({ where });

    return academicYear ? this.toDTO(academicYear) : null;
  }

  /* -------------------------------------------------------------------------- */
  /*                                Find By Name                                */
  /* -------------------------------------------------------------------------- */

  async findByName(
    name: string,
    includeDeleted = false
  ): Promise<AcademicYearDTO | null> {
    const where: Prisma.AcademicYearWhereInput = { name };

    if (!includeDeleted) {
      where.deletedAt = null;
    }

    const academicYear = await this.prisma.academicYear.findFirst({ where });

    return academicYear ? this.toDTO(academicYear) : null;
  }

  /* -------------------------------------------------------------------------- */
  /*                                Find By Code                                */
  /* -------------------------------------------------------------------------- */

  async findByCode(
    code: string,
    includeDeleted = false
  ): Promise<AcademicYearDTO | null> {
    const where: Prisma.AcademicYearWhereInput = { code };

    if (!includeDeleted) {
      where.deletedAt = null;
    }

    const academicYear = await this.prisma.academicYear.findFirst({ where });

    return academicYear ? this.toDTO(academicYear) : null;
  }

  /* -------------------------------------------------------------------------- */
  /*                               Find Active Year                             */
  /* -------------------------------------------------------------------------- */

  async findActive(): Promise<AcademicYearDTO | null> {
    const academicYear = await this.prisma.academicYear.findFirst({
      where: {
        status: ACADEMIC_YEAR_STATUS.ACTIVE,
        deletedAt: null,
      },
    });

    return academicYear ? this.toDTO(academicYear) : null;
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Count                                    */
  /* -------------------------------------------------------------------------- */

  async count(): Promise<number> {
    return this.prisma.academicYear.count({
      where: {
        deletedAt: null,
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Find All                                  */
  /* -------------------------------------------------------------------------- */

  async findAll(
    options: AcademicYearQueryOptions
  ): Promise<AcademicYearListResponse> {
    const where = this.buildWhereClause(options);

    const { page, limit, skip, take } = this.getPagination(options);

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.academicYear.findMany({
        where,
        skip,
        take,
      }),

      this.prisma.academicYear.count({
        where,
      }),
    ]);

    const statusOrder = {
      [ACADEMIC_YEAR_STATUS.UPCOMING]: 1,
      [ACADEMIC_YEAR_STATUS.ACTIVE]: 2,
      [ACADEMIC_YEAR_STATUS.ARCHIVED]: 3,
    } as const;

    rows.sort((a, b) => {
      const statusCompare =
        statusOrder[a.status] - statusOrder[b.status];

      if (statusCompare !== 0) {
        return statusCompare;
      }

      return a.sortOrder - b.sortOrder;
    });

    return {
      data: rows.map((row) => this.toDTO(row)),
      meta: this.buildPaginationMeta(page, limit, total),
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Search                                   */
  /* -------------------------------------------------------------------------- */

  async search(
    query: string
  ): Promise<AcademicYearDTO[]> {
    const rows = await this.prisma.academicYear.findMany({
      where: {
        deletedAt: null,
        OR: [
          {
            name: {
              contains: query,
              mode: QUERY_MODE.INSENSITIVE,
            },
          },
          {
            code: {
              contains: query,
              mode: QUERY_MODE.INSENSITIVE,
            },
          },
          {
            description: {
              contains: query,
              mode: QUERY_MODE.INSENSITIVE,
            },
          },
        ],
      },

      orderBy: {
        startDate: "desc",
      },
    });

    return rows.map((row) => this.toDTO(row));
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Archive                                   */
  /* -------------------------------------------------------------------------- */

  async archive(
    id: string
  ): Promise<AcademicYearDTO> {
    const academicYear =
      await this.prisma.academicYear.update({
        where: {
          id,
        },
        data: {
          status: ACADEMIC_YEAR_STATUS.ARCHIVED,
        },
      });

    return this.toDTO(academicYear);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Activate                                  */
  /* -------------------------------------------------------------------------- */

  async activate(
    id: string
  ): Promise<AcademicYearDTO> {
    const academicYear =
      await this.prisma.academicYear.update({
        where: {
          id,
        },
        data: {
          status: ACADEMIC_YEAR_STATUS.ACTIVE,
        },
      });

    return this.toDTO(academicYear);
  }
}