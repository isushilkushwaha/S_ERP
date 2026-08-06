import { PrismaClient, Class, Status, Medium,  } from "@prisma/client";
import { ClassRepository, CreateClassInput, UpdateClassInput } from "../repositories/class.repository";
import { ConfigurationRepository } from "../repositories/configuration.repository";

export interface CreateClassDTO {
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
  private classRepo: ClassRepository;
  private configRepo: ConfigurationRepository;

  constructor(private readonly prisma: PrismaClient) {
    this.classRepo = new ClassRepository(prisma);
    this.configRepo = new ConfigurationRepository(prisma);
  }

  /**
   * Retrieves all non-deleted classes for a specific tenant.
   */
  async getAllClasses(tenantId: string, status?: Status): Promise<Class[]> {
    return this.classRepo.findAll(tenantId, status);
  }

  /**
   * Retrieves a single class by ID and tenant ID.
   */
  async getClassById(tenantId: string, id: string): Promise<Class> {
    const classRecord = await this.classRepo.findById(tenantId, id);
    if (!classRecord) {
      throw new Error(`Class with ID "${id}" was not found.`);
    }
    return classRecord;
  }

  /**
   * Creates a new Class along with its mandatory default ClassConfiguration inside an atomic transaction.
   */
  async createClass(tenantId: string, dto: CreateClassDTO): Promise<Class> {
    // 1. Validate Unique Class Code
    const existingCode = await this.classRepo.findByCode(tenantId, dto.code);
    if (existingCode) {
      throw new Error(`Class code "${dto.code}" is already in use by another class.`);
    }

    // 2. Validate Unique Display Order
    const existingOrder = await this.classRepo.findByDisplayOrder(tenantId, dto.displayOrder);
    if (existingOrder) {
      throw new Error(`Display order ${dto.displayOrder} is already assigned to "${existingOrder.name}".`);
    }

    // 3. Perform Transactional Creation (Class + Configuration)
    return this.prisma.$transaction(async (tx) => {
      const createInput: CreateClassInput = {
        tenantId,
        name: dto.name,
        shortName: dto.shortName,
        code: dto.code,
        description: dto.description,
        medium: dto.medium || Medium.ENGLISH,
        displayOrder: dto.displayOrder,
        status: dto.status || Status.ACTIVE,
        createdBy: dto.createdBy,
        updatedBy: dto.createdBy,
      };

      const createdClass = await this.classRepo.create(createInput, tx);

      // Create linked ClassConfiguration
      await this.configRepo.upsert(
        {
          classId: createdClass.id,
          sectionsEnabled: dto.defaultConfig?.sectionsEnabled ?? true,
          defaultSectionCapacity: dto.defaultConfig?.defaultSectionCapacity ?? 40,
          maxStudentsWithoutSection: dto.defaultConfig?.maxStudentsWithoutSection ?? null,
          autoAllocationEnabled: true,
        },
        tx
      );

      return createdClass;
    });
  }

  /**
   * Updates an existing Class record with uniqueness validation checks.
   */
  async updateClass(tenantId: string, id: string, dto: UpdateClassDTO): Promise<Class> {
    const existingClass = await this.getClassById(tenantId, id);

    // Validate code if it is changing
    if (dto.code && dto.code !== existingClass.code) {
      const codeCheck = await this.classRepo.findByCode(tenantId, dto.code);
      if (codeCheck) {
        throw new Error(`Class code "${dto.code}" is already in use.`);
      }
    }

    // Validate display order if it is changing
    if (dto.displayOrder !== undefined && dto.displayOrder !== existingClass.displayOrder) {
      const orderCheck = await this.classRepo.findByDisplayOrder(tenantId, dto.displayOrder);
      if (orderCheck) {
        throw new Error(`Display order ${dto.displayOrder} is already in use by "${orderCheck.name}".`);
      }
    }

    const updateInput: UpdateClassInput = {
      name: dto.name,
      shortName: dto.shortName,
      code: dto.code,
      description: dto.description,
      medium: dto.medium,
      displayOrder: dto.displayOrder,
      status: dto.status,
      updatedBy: dto.updatedBy,
    };

    return this.classRepo.update(tenantId, id, updateInput);
  }

  /**
   * Get the next recommended display order for a new class
   */
  async getNextDisplayOrder(tenantId: string): Promise<number> {
    const maxOrder = await this.classRepo.findMaxDisplayOrder(tenantId);
    return maxOrder + 1;
  }

  /**
   * Hard-deletes a Class and its configuration permanently ONLY IF no dependent records exist.
   */
  /**
   * Hard-deletes a Class and its configuration permanently ONLY IF no dependent records exist.
   */
  async deleteClass(tenantId: string, id: string): Promise<Class> {
    const existingClass = await this.getClassById(tenantId, id);

    // 1. Audit Dependencies Across All Modules
    const [enrollmentCount, sectionCount, feeStructureCount] = await Promise.all([
      // Check for any student enrollments via Class relation
      this.prisma.studentEnrollment.count({
        where: {
          class: {
            id: id,
            tenantId: tenantId,
          },
        },
      }),

      // Check attached sections (Filter tenant via Class relation, remove deletedAt)
      this.prisma.section.count({
        where: {
          classId: id,
          class: {
            tenantId: tenantId,
          },
        },
      }),

      // Check attached fee structures via Class relation
      this.prisma.feeStructure.count({
        where: {
          classId: id,
          class: {
            tenantId: tenantId,
          },
        },
      }),
    ]);

    // 2. Block Hard Delete if dependencies exist
    if (enrollmentCount > 0 || sectionCount > 0 || feeStructureCount > 0) {
      const blockers: string[] = [];
      if (enrollmentCount > 0) blockers.push(`${enrollmentCount} student enrollment(s)`);
      if (sectionCount > 0) blockers.push(`${sectionCount} section(s)`);
      if (feeStructureCount > 0) blockers.push(`${feeStructureCount} fee structure(s)`);

      throw new Error(
        `Cannot permanently delete "${existingClass.name}". It is currently referenced by: ${blockers.join(
          ", "
        )}. Please delete or reassign those items first.`
      );
    }

    // 3. Perform Transactional Hard Delete (Config + Class)
    return this.prisma.$transaction(async (tx) => {
      // Remove master class configuration record first if it exists
      await tx.classConfiguration.deleteMany({
        where: { classId: id },
      });

      // Hard-delete the class record permanently from PostgreSQL
      return tx.class.delete({
        where: { id },
      });
    });
  }
}