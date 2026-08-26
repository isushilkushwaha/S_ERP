// import { PrismaClient, Class, Prisma, Status, Medium } from "@prisma/client";

// export interface CreateClassInput {
//   tenantId: string;
//   name: string;
//   shortName?: string;
//   code: string;
//   description?: string;
//   medium?: Medium;
//   displayOrder: number;
//   status?: Status;
//   createdBy?: string;
//   updatedBy?: string;
// }

// export interface UpdateClassInput {
//   name?: string;
//   shortName?: string;
//   code?: string;
//   description?: string;
//   medium?: Medium;
//   displayOrder?: number;
//   status?: Status;
//   updatedBy?: string;
//   version?: number;
// }

// export class ClassRepository {
//   constructor(private readonly prisma: PrismaClient) {}

//   /**
//    * Find all non-deleted classes for a tenant with optional status filtering
//    */
//   async findAll(tenantId: string, status?: Status): Promise<Class[]> {
//     return this.prisma.class.findMany({
//       where: {
//         tenantId,
//         deletedAt: null,
//         ...(status && { status }),
//       },
//       include: {
//         configuration: true,
//         sections: {
//           where: { deletedAt: null },
//           orderBy: { displayOrder: "asc" },
//         },
//       },
//       orderBy: { displayOrder: "asc" },
//     });
//   }

//   /**
//    * Find a single class by ID and tenant ID
//    */
//   async findById(tenantId: string, id: string): Promise<Class | null> {
//     return this.prisma.class.findFirst({
//       where: {
//         id,
//         tenantId,
//         deletedAt: null,
//       },
//       include: {
//         configuration: true,
//         sections: {
//           where: { deletedAt: null },
//           orderBy: { displayOrder: "asc" },
//         },
//       },
//     });
//   }

//   /**
//    * Find class by unique code within tenant
//    */
//   async findByCode(tenantId: string, code: string): Promise<Class | null> {
//     return this.prisma.class.findFirst({
//       where: {
//         tenantId,
//         code,
//         deletedAt: null,
//       },
//     });
//   }

//   /**
//    * Find class by unique display order within tenant
//    */
//   async findByDisplayOrder(tenantId: string, displayOrder: number): Promise<Class | null> {
//     return this.prisma.class.findFirst({
//       where: {
//         tenantId,
//         displayOrder,
//         deletedAt: null,
//       },
//     });
//   }

//   /**
//    * Get the current maximum display order for a tenant
//    */
//   async findMaxDisplayOrder(tenantId: string): Promise<number> {
//     const result = await this.prisma.class.aggregate({
//       where: {
//         tenantId,
//         deletedAt: null,
//       },
//       _max: {
//         displayOrder: true,
//       },
//     });

//     return result._max.displayOrder ?? 0;
//   }

//   /**
//    * Create a new Class record
//    */
//   async create(data: CreateClassInput, tx?: Prisma.TransactionClient): Promise<Class> {
//     const client = tx || this.prisma;
//     return client.class.create({
//       data: {
//         tenantId: data.tenantId,
//         name: data.name,
//         shortName: data.shortName,
//         code: data.code,
//         description: data.description,
//         medium: data.medium || Medium.ENGLISH,
//         displayOrder: data.displayOrder,
//         status: data.status || Status.ACTIVE,
//         createdBy: data.createdBy,
//         updatedBy: data.updatedBy || data.createdBy,
//       },
//     });
//   }

//   /**
//    * Update an existing Class record with optimistic concurrency handling
//    */
//   async update(
//     tenantId: string,
//     id: string,
//     data: UpdateClassInput,
//     tx?: Prisma.TransactionClient
//   ): Promise<Class> {
//     const client = tx || this.prisma;

//     return client.class.update({
//       where: {
//         id,
//         tenantId,
//       },
//       data: {
//         ...(data.name && { name: data.name }),
//         ...(data.shortName !== undefined && { shortName: data.shortName }),
//         ...(data.code && { code: data.code }),
//         ...(data.description !== undefined && { description: data.description }),
//         ...(data.medium && { medium: data.medium }),
//         ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
//         ...(data.status && { status: data.status }),
//         ...(data.updatedBy && { updatedBy: data.updatedBy }),
//         version: { increment: 1 },
//       },
//     });
//   }

//   /**
//    * Hard-delete a Class record permanently from PostgreSQL
//    */
//   async hardDelete(
//     tenantId: string,
//     id: string,
//     tx?: Prisma.TransactionClient
//   ): Promise<Class> {
//     const client = tx || this.prisma;
//     return client.class.delete({
//       where: { id, tenantId },
//     });
//   }
// }

import {
  PrismaClient,
  Class,
  Prisma,
  Status,
  Medium,
} from "@prisma/client";

export interface CreateClassInput {
  tenantId: string;
  name: string;
  shortName?: string;
  code: string;
  description?: string;
  medium?: Medium;
  displayOrder: number;
  status?: Status;
  createdBy?: string;
  updatedBy?: string;
}

export interface UpdateClassInput {
  name?: string;
  shortName?: string;
  code?: string;
  description?: string;
  medium?: Medium;
  displayOrder?: number;
  status?: Status;
  updatedBy?: string;
  version?: number;
}

export class ClassRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Find classes.
   *
   * If academicYearId is provided:
   * return only classes assigned to that academic year.
   *
   * If academicYearId is not provided:
   * return all master classes.
   */
  async findAll(
    tenantId: string,
    status?: Status,
    academicYearId?: string
  ): Promise<Class[]> {
    return this.prisma.class.findMany({
      where: {
        tenantId,
        deletedAt: null,

        ...(status && {
          status,
        }),

        ...(academicYearId && {
          academicYearClasses: {
            some: {
              academicYearId,
            },
          },
        }),
      },

      include: {
        configuration: true,

        sections: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            displayOrder: "asc",
          },
        },

        ...(academicYearId
          ? {
              academicYearClasses: {
                where: {
                  academicYearId,
                },
                include: {
                  sections: {
                    where: {
                      deletedAt: null,
                    },
                    orderBy: {
                      displayOrder: "asc",
                    },
                  },
                },
              },
            }
          : {}),
      },

      orderBy: {
        displayOrder: "asc",
      },
    });
  }

  /**
   * Find a class by ID.
   */
  async findById(
    tenantId: string,
    id: string
  ): Promise<Class | null> {
    return this.prisma.class.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },

      include: {
        configuration: true,

        sections: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            displayOrder: "asc",
          },
        },

        academicYearClasses: {
          include: {
            sections: {
              where: {
                deletedAt: null,
              },
              orderBy: {
                displayOrder: "asc",
              },
            },
          },
        },
      },
    });
  }

  /**
   * Find an existing master class by code.
   *
   * Code is unique at tenant/master-class level.
   */
  async findByCode(
    tenantId: string,
    code: string
  ): Promise<Class | null> {
    return this.prisma.class.findFirst({
      where: {
        tenantId,
        code,
        deletedAt: null,
      },
    });
  }

  /**
   * Find an existing master class by display order.
   *
   * Display order is currently stored on Class,
   * therefore it is global for the tenant.
   */
  async findByDisplayOrder(
    tenantId: string,
    displayOrder: number
  ): Promise<Class | null> {
    return this.prisma.class.findFirst({
      where: {
        tenantId,
        displayOrder,
        deletedAt: null,
      },
    });
  }

  /**
   * Get the current maximum display order.
   */
  async findMaxDisplayOrder(
    tenantId: string
  ): Promise<number> {
    const result =
      await this.prisma.class.aggregate({
        where: {
          tenantId,
          deletedAt: null,
        },

        _max: {
          displayOrder: true,
        },
      });

    return result._max.displayOrder ?? 0;
  }

  /**
   * Create a new master Class.
   *
   * AcademicYearClass assignment is handled
   * by ClassService.
   */
  async create(
    data: CreateClassInput,
    tx?: Prisma.TransactionClient
  ): Promise<Class> {
    const client = tx ?? this.prisma;

    return client.class.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        shortName: data.shortName,
        code: data.code,
        description: data.description,
        medium: data.medium ?? Medium.ENGLISH,
        displayOrder: data.displayOrder,
        status: data.status ?? Status.ACTIVE,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy ?? data.createdBy,
      },
    });
  }

  /**
   * Update an existing master Class.
   */
  async update(
    tenantId: string,
    id: string,
    data: UpdateClassInput,
    tx?: Prisma.TransactionClient
  ): Promise<Class> {
    const client = tx ?? this.prisma;

    return client.class.update({
      where: {
        id,
        tenantId,
      },

      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),

        ...(data.shortName !== undefined && {
          shortName: data.shortName,
        }),

        ...(data.code !== undefined && {
          code: data.code,
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.medium !== undefined && {
          medium: data.medium,
        }),

        ...(data.displayOrder !== undefined && {
          displayOrder: data.displayOrder,
        }),

        ...(data.status !== undefined && {
          status: data.status,
        }),

        ...(data.updatedBy !== undefined && {
          updatedBy: data.updatedBy,
        }),

        version: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Permanently delete a master Class.
   */
  async hardDelete(
    tenantId: string,
    id: string,
    tx?: Prisma.TransactionClient
  ): Promise<Class> {
    const client = tx ?? this.prisma;

    return client.class.delete({
      where: {
        id,
        tenantId,
      },
    });
  }
}