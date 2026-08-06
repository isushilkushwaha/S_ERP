import { PrismaClient, Section, Prisma, Status } from "@prisma/client";

export interface CreateSectionInput {
  classId: string;
  name: string;
  displayOrder: number;
  capacity: number;
  status?: Status;
  createdBy?: string;
  updatedBy?: string;
}

export interface UpdateSectionInput {
  name?: string;
  displayOrder?: number;
  capacity?: number;
  status?: Status;
  updatedBy?: string;
}

export class SectionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Find all active, non-deleted sections belonging to a specific class ordered by displayOrder
   */
  async findByClassId(classId: string, status?: Status): Promise<Section[]> {
    return this.prisma.section.findMany({
      where: {
        classId,
        deletedAt: null,
        ...(status && { status }),
      },
      orderBy: { displayOrder: "asc" },
    });
  }

  /**
   * Find section by ID
   */
  async findById(id: string): Promise<Section | null> {
    return this.prisma.section.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  /**
   * Find section by Name within a Class
   */
  async findByNameAndClassId(classId: string, name: string): Promise<Section | null> {
    return this.prisma.section.findFirst({
      where: {
        classId,
        name,
        deletedAt: null,
      },
    });
  }

  /**
   * Find active sections ordered for Automatic Allocation
   */
  async findActiveSectionsForAllocation(
    classId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Section[]> {
    const client = tx || this.prisma;
    return client.section.findMany({
      where: {
        classId,
        status: Status.ACTIVE,
        deletedAt: null,
      },
      orderBy: { displayOrder: "asc" },
    });
  }

  /**
   * Create a new Section
   */
  async create(data: CreateSectionInput, tx?: Prisma.TransactionClient): Promise<Section> {
    const client = tx || this.prisma;
    return client.section.create({
      data: {
        classId: data.classId,
        name: data.name,
        displayOrder: data.displayOrder,
        capacity: data.capacity,
        status: data.status || Status.ACTIVE,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy || data.createdBy,
      },
    });
  }

  /**
   * Update an existing Section
   */
  async update(
    id: string,
    data: UpdateSectionInput,
    tx?: Prisma.TransactionClient
  ): Promise<Section> {
    const client = tx || this.prisma;
    return client.section.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        ...(data.capacity !== undefined && { capacity: data.capacity }),
        ...(data.status && { status: data.status }),
        ...(data.updatedBy && { updatedBy: data.updatedBy }),
        version: { increment: 1 },
      },
    });
  }

  /**
   * Soft delete a Section
   */
  async softDelete(
    id: string,
    deletedBy: string,
    tx?: Prisma.TransactionClient
  ): Promise<Section> {
    const client = tx || this.prisma;
    return client.section.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: deletedBy,
      },
    });
  }
}