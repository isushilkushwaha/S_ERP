// import { PrismaClient, Class, Status, Medium,  } from "@prisma/client";
// import { ClassRepository, CreateClassInput, UpdateClassInput } from "../repositories/class.repository";
// import { ConfigurationRepository } from "../repositories/configuration.repository";

// export interface CreateClassDTO {
//   name: string;
//   shortName?: string;
//   code: string;
//   description?: string;
//   medium?: Medium;
//   displayOrder: number;
//   status?: Status;
//   createdBy?: string;
//   defaultConfig?: {
//     sectionsEnabled?: boolean;
//     defaultSectionCapacity?: number;
//     maxStudentsWithoutSection?: number;
//   };
// }

// export interface UpdateClassDTO {
//   name?: string;
//   shortName?: string;
//   code?: string;
//   description?: string;
//   medium?: Medium;
//   displayOrder?: number;
//   status?: Status;
//   updatedBy?: string;
// }

// export class ClassService {
//   private classRepo: ClassRepository;
//   private configRepo: ConfigurationRepository;

//   constructor(private readonly prisma: PrismaClient) {
//     this.classRepo = new ClassRepository(prisma);
//     this.configRepo = new ConfigurationRepository(prisma);
//   }

//   /**
//    * Retrieves all non-deleted classes for a specific tenant.
//    */
//   async getAllClasses(tenantId: string, status: string | undefined, p0: string | undefined, status?: Status): Promise<Class[]> {
//     return this.classRepo.findAll(tenantId, status);
//   }

//   /**
//    * Retrieves a single class by ID and tenant ID.
//    */
//   async getClassById(tenantId: string, id: string): Promise<Class> {
//     const classRecord = await this.classRepo.findById(tenantId, id);
//     if (!classRecord) {
//       throw new Error(`Class with ID "${id}" was not found.`);
//     }
//     return classRecord;
//   }

//   /**
//    * Creates a new Class along with its mandatory default ClassConfiguration inside an atomic transaction.
//    */
//   async createClass(tenantId: string, dto: CreateClassDTO): Promise<Class> {
//     // 1. Validate Unique Class Code
//     const existingCode = await this.classRepo.findByCode(tenantId, dto.code);
//     if (existingCode) {
//       throw new Error(`Class code "${dto.code}" is already in use by another class.`);
//     }

//     // 2. Validate Unique Display Order
//     const existingOrder = await this.classRepo.findByDisplayOrder(tenantId, dto.displayOrder);
//     if (existingOrder) {
//       throw new Error(`Display order ${dto.displayOrder} is already assigned to "${existingOrder.name}".`);
//     }

//     // 3. Perform Transactional Creation (Class + Configuration)
//     return this.prisma.$transaction(async (tx) => {
//       const createInput: CreateClassInput = {
//         tenantId,
//         name: dto.name,
//         shortName: dto.shortName,
//         code: dto.code,
//         description: dto.description,
//         medium: dto.medium || Medium.ENGLISH,
//         displayOrder: dto.displayOrder,
//         status: dto.status || Status.ACTIVE,
//         createdBy: dto.createdBy,
//         updatedBy: dto.createdBy,
//       };

//       const createdClass = await this.classRepo.create(createInput, tx);

//       // Create linked ClassConfiguration
//       await this.configRepo.upsert(
//         {
//           classId: createdClass.id,
//           sectionsEnabled: dto.defaultConfig?.sectionsEnabled ?? true,
//           defaultSectionCapacity: dto.defaultConfig?.defaultSectionCapacity ?? 40,
//           maxStudentsWithoutSection: dto.defaultConfig?.maxStudentsWithoutSection ?? null,
//           autoAllocationEnabled: true,
//         },
//         tx
//       );

//       return createdClass;
//     });
//   }

//   /**
//    * Updates an existing Class record with uniqueness validation checks.
//    */
//   async updateClass(tenantId: string, id: string, dto: UpdateClassDTO): Promise<Class> {
//     const existingClass = await this.getClassById(tenantId, id);

//     // Validate code if it is changing
//     if (dto.code && dto.code !== existingClass.code) {
//       const codeCheck = await this.classRepo.findByCode(tenantId, dto.code);
//       if (codeCheck) {
//         throw new Error(`Class code "${dto.code}" is already in use.`);
//       }
//     }

//     // Validate display order if it is changing
//     if (dto.displayOrder !== undefined && dto.displayOrder !== existingClass.displayOrder) {
//       const orderCheck = await this.classRepo.findByDisplayOrder(tenantId, dto.displayOrder);
//       if (orderCheck) {
//         throw new Error(`Display order ${dto.displayOrder} is already in use by "${orderCheck.name}".`);
//       }
//     }

//     const updateInput: UpdateClassInput = {
//       name: dto.name,
//       shortName: dto.shortName,
//       code: dto.code,
//       description: dto.description,
//       medium: dto.medium,
//       displayOrder: dto.displayOrder,
//       status: dto.status,
//       updatedBy: dto.updatedBy,
//     };

//     return this.classRepo.update(tenantId, id, updateInput);
//   }

//   /**
//    * Get the next recommended display order for a new class
//    */
//   async getNextDisplayOrder(tenantId: string): Promise<number> {
//     const maxOrder = await this.classRepo.findMaxDisplayOrder(tenantId);
//     return maxOrder + 1;
//   }

//   /**
//    * Hard-deletes a Class and its configuration permanently ONLY IF no dependent records exist.
//    */
//   /**
//    * Hard-deletes a Class and its configuration permanently ONLY IF no dependent records exist.
//    */
//   async deleteClass(tenantId: string, id: string): Promise<Class> {
//     const existingClass = await this.getClassById(tenantId, id);

//     // 1. Audit Dependencies Across All Modules
//     const [enrollmentCount, sectionCount, feeStructureCount] = await Promise.all([
//       // Check for any student enrollments via Class relation
//       this.prisma.studentEnrollment.count({
//         where: {
//           class: {
//             id: id,
//             tenantId: tenantId,
//           },
//         },
//       }),

//       // Check attached sections (Filter tenant via Class relation, remove deletedAt)
//       this.prisma.section.count({
//         where: {
//           classId: id,
//           class: {
//             tenantId: tenantId,
//           },
//         },
//       }),

//       // Check attached fee structures via Class relation
//       this.prisma.feeStructure.count({
//         where: {
//           classId: id,
//           class: {
//             tenantId: tenantId,
//           },
//         },
//       }),
//     ]);

//     // 2. Block Hard Delete if dependencies exist
//     if (enrollmentCount > 0 || sectionCount > 0 || feeStructureCount > 0) {
//       const blockers: string[] = [];
//       if (enrollmentCount > 0) blockers.push(`${enrollmentCount} student enrollment(s)`);
//       if (sectionCount > 0) blockers.push(`${sectionCount} section(s)`);
//       if (feeStructureCount > 0) blockers.push(`${feeStructureCount} fee structure(s)`);

//       throw new Error(
//         `Cannot permanently delete "${existingClass.name}". It is currently referenced by: ${blockers.join(
//           ", "
//         )}. Please delete or reassign those items first.`
//       );
//     }

//     // 3. Perform Transactional Hard Delete (Config + Class)
//     return this.prisma.$transaction(async (tx) => {
//       // Remove master class configuration record first if it exists
//       await tx.classConfiguration.deleteMany({
//         where: { classId: id },
//       });

//       // Hard-delete the class record permanently from PostgreSQL
//       return tx.class.delete({
//         where: { id },
//       });
//     });
//   }
// }

import {
  PrismaClient,
  Class,
  Status,
  Medium,
} from "@prisma/client";

import {
  ClassRepository,
  CreateClassInput,
  UpdateClassInput,
} from "../repositories/class.repository";

export interface CreateClassDTO {
  academicYearId: string;

  name: string;
  shortName?: string;
  code: string;
  description?: string;
  medium?: Medium;
  displayOrder: number;
  status?: Status;

  createdBy?: string;

  defaultConfig?: {
    sectionsEnabled?: boolean;
    defaultSectionCapacity?: number;
    maxStudentsWithoutSection?: number;
  };
}

export interface UpdateClassDTO {
  name?: string;
  shortName?: string;
  code?: string;
  description?: string;
  medium?: Medium;
  displayOrder?: number;
  status?: Status;
  updatedBy?: string;
}

export class ClassService {
  private readonly classRepo: ClassRepository;

  constructor(
    private readonly prisma: PrismaClient
  ) {
    this.classRepo =
      new ClassRepository(prisma);
  }

  /**
   * Get classes.
   *
   * If academicYearId is supplied:
   * return only classes assigned to that year.
   *
   * If academicYearId is not supplied:
   * return all master classes.
   */
  async getAllClasses(
    tenantId: string,
    status?: Status,
    academicYearId?: string
  ): Promise<Class[]> {
    return this.classRepo.findAll(
      tenantId,
      status,
      academicYearId
    );
  }

  /**
   * Get one master class.
   */
  async getClassById(
    tenantId: string,
    id: string
  ): Promise<Class> {
    const classRecord =
      await this.classRepo.findById(
        tenantId,
        id
      );

    if (!classRecord) {
      throw new Error(
        `Class with ID "${id}" was not found.`
      );
    }

    return classRecord;
  }

  /**
   * Create or assign a class to an academic year.
   *
   * IMPORTANT:
   *
   * A Class is a MASTER record.
   *
   * The same master class can be assigned
   * to multiple academic years.
   *
   * Example:
   *
   * Class 1
   *   ├── 2025-26
   *   ├── 2026-27
   *   └── 2027-28
   */
  async createClass(
    tenantId: string,
    dto: CreateClassDTO
  ): Promise<Class> {
    // --------------------------------------------------
    // 1. Validate academic year
    // --------------------------------------------------

    const academicYear =
      await this.prisma.academicYear.findFirst({
        where: {
          id: dto.academicYearId,
          deletedAt: null,
        },
      });

    if (!academicYear) {
      throw new Error(
        `Academic year with ID "${dto.academicYearId}" was not found.`
      );
    }

    // --------------------------------------------------
    // 2. Start transaction
    // --------------------------------------------------

    return this.prisma.$transaction(
      async (tx) => {
        // ------------------------------------------------
        // 3. Find existing master class by CODE
        // ------------------------------------------------

        const existingClass =
          await tx.class.findFirst({
            where: {
              tenantId,
              code: dto.code,
              deletedAt: null,
            },
          });

        let classRecord: Class;

        // ------------------------------------------------
        // 4. Existing master class
        // ------------------------------------------------

        if (existingClass) {
          classRecord = existingClass;

          // ----------------------------------------------
          // Check if already assigned to this year
          // ----------------------------------------------

          const existingAssignment =
            await tx.academicYearClass.findUnique({
              where: {
                unique_academic_year_class: {
                  academicYearId:
                    dto.academicYearId,

                  classId:
                    existingClass.id,
                },
              },
            });

          if (existingAssignment) {
            throw new Error(
              `Class "${existingClass.name}" is already assigned to "${academicYear.name}".`
            );
          }

          // ----------------------------------------------
          // IMPORTANT:
          //
          // We DO NOT reject the class because its
          // displayOrder already exists.
          //
          // displayOrder belongs to the master Class.
          // ----------------------------------------------

          await tx.academicYearClass.create({
            data: {
              academicYearId:
                dto.academicYearId,

              classId:
                existingClass.id,

              sectionsEnabled:
                dto.defaultConfig
                  ?.sectionsEnabled ?? true,

              defaultSectionCapacity:
                dto.defaultConfig
                  ?.defaultSectionCapacity ??
                40,

              maxStudentsWithoutSection:
                dto.defaultConfig
                  ?.maxStudentsWithoutSection ??
                null,

              autoAllocationEnabled: true,
            },
          });

          return classRecord;
        }

        // ------------------------------------------------
        // 5. New master class
        // ------------------------------------------------

        // Code does not exist, so we can create
        // a completely new master class.

        const existingOrder =
          await tx.class.findFirst({
            where: {
              tenantId,
              displayOrder:
                dto.displayOrder,
              deletedAt: null,
            },
          });

        if (existingOrder) {
          throw new Error(
            `Display order ${dto.displayOrder} is already assigned to "${existingOrder.name}".`
          );
        }

        // ------------------------------------------------
        // 6. Create master class
        // ------------------------------------------------

        const createInput: CreateClassInput = {
          tenantId,

          name: dto.name,

          shortName:
            dto.shortName,

          code: dto.code,

          description:
            dto.description,

          medium:
            dto.medium ?? Medium.ENGLISH,

          displayOrder:
            dto.displayOrder,

          status:
            dto.status ?? Status.ACTIVE,

          createdBy:
            dto.createdBy,

          updatedBy:
            dto.createdBy,
        };

        classRecord =
          await this.classRepo.create(
            createInput,
            tx
          );

        // ------------------------------------------------
        // 7. Assign new class to academic year
        // ------------------------------------------------

        await tx.academicYearClass.create({
          data: {
            academicYearId:
              dto.academicYearId,

            classId:
              classRecord.id,

            sectionsEnabled:
              dto.defaultConfig
                ?.sectionsEnabled ?? true,

            defaultSectionCapacity:
              dto.defaultConfig
                ?.defaultSectionCapacity ??
              40,

            maxStudentsWithoutSection:
              dto.defaultConfig
                ?.maxStudentsWithoutSection ??
              null,

            autoAllocationEnabled: true,
          },
        });

        return classRecord;
      }
    );
  }

  /**
   * Update a master class.
   */
  async updateClass(
    tenantId: string,
    id: string,
    dto: UpdateClassDTO
  ): Promise<Class> {
    const existingClass =
      await this.getClassById(
        tenantId,
        id
      );

    // --------------------------------------------------
    // Check code only when it changes
    // --------------------------------------------------

    if (
      dto.code !== undefined &&
      dto.code !== existingClass.code
    ) {
      const codeCheck =
        await this.classRepo.findByCode(
          tenantId,
          dto.code
        );

      if (
        codeCheck &&
        codeCheck.id !== id
      ) {
        throw new Error(
          `Class code "${dto.code}" is already in use.`
        );
      }
    }

    // --------------------------------------------------
    // Check display order only when it changes
    // --------------------------------------------------

    if (
      dto.displayOrder !== undefined &&
      dto.displayOrder !==
        existingClass.displayOrder
    ) {
      const orderCheck =
        await this.classRepo.findByDisplayOrder(
          tenantId,
          dto.displayOrder
        );

      if (
        orderCheck &&
        orderCheck.id !== id
      ) {
        throw new Error(
          `Display order ${dto.displayOrder} is already in use by "${orderCheck.name}".`
        );
      }
    }

    const updateInput: UpdateClassInput = {
      name: dto.name,
      shortName: dto.shortName,
      code: dto.code,
      description: dto.description,
      medium: dto.medium,
      displayOrder:
        dto.displayOrder,
      status: dto.status,
      updatedBy: dto.updatedBy,
    };

    return this.classRepo.update(
      tenantId,
      id,
      updateInput
    );
  }

  /**
   * Get next master-class display order.
   */
  async getNextDisplayOrder(
    tenantId: string
  ): Promise<number> {
    const maxOrder =
      await this.classRepo.findMaxDisplayOrder(
        tenantId
      );

    return maxOrder + 1;
  }

  /**
   * Delete master class.
   *
   * Existing dependencies are protected.
   *
   * AcademicYearClass records are automatically
   * deleted through the Prisma cascade relation.
   */
  async deleteClass(
    tenantId: string,
    id: string
  ): Promise<Class> {
    const existingClass =
      await this.getClassById(
        tenantId,
        id
      );

    const [
      enrollmentCount,
      sectionCount,
      feeStructureCount,
    ] = await Promise.all([
      // Student enrollments
      this.prisma.studentEnrollment.count({
        where: {
          class: {
            id,
            tenantId,
          },
        },
      }),

      // Legacy/master sections
      this.prisma.section.count({
        where: {
          classId: id,

          class: {
            tenantId,
          },
        },
      }),

      // Fee structures
      this.prisma.feeStructure.count({
        where: {
          classId: id,

          class: {
            tenantId,
          },
        },
      }),
    ]);

    // --------------------------------------------------
    // Block deletion if dependencies exist
    // --------------------------------------------------

    if (
      enrollmentCount > 0 ||
      sectionCount > 0 ||
      feeStructureCount > 0
    ) {
      const blockers: string[] = [];

      if (enrollmentCount > 0) {
        blockers.push(
          `${enrollmentCount} student enrollment(s)`
        );
      }

      if (sectionCount > 0) {
        blockers.push(
          `${sectionCount} section(s)`
        );
      }

      if (feeStructureCount > 0) {
        blockers.push(
          `${feeStructureCount} fee structure(s)`
        );
      }

      throw new Error(
        `Cannot permanently delete "${existingClass.name}". It is currently referenced by: ${blockers.join(
          ", "
        )}. Please delete or reassign those items first.`
      );
    }

    // --------------------------------------------------
    // Delete
    // --------------------------------------------------

    return this.prisma.$transaction(
      async (tx) => {
        // Delete old master configuration
        await tx.classConfiguration.deleteMany({
          where: {
            classId: id,
          },
        });

        // AcademicYearClass records are removed
        // automatically because of:
        //
        // onDelete: Cascade
        //
        return tx.class.delete({
          where: {
            id,
            tenantId,
          },
        });
      }
    );
  }
}