import { PrismaClient, Section, Status } from "@prisma/client";
import { SectionRepository, CreateSectionInput, UpdateSectionInput } from "../repositories/section.repository";

export class SectionService {
  private sectionRepo: SectionRepository;

  constructor(private readonly prisma: PrismaClient) {
    this.sectionRepo = new SectionRepository(prisma);
  }

  /**
   * Gets all sections belonging to a specific class.
   */
  async getSectionsByClassId(classId: string, status?: Status): Promise<Section[]> {
    return this.sectionRepo.findByClassId(classId, status);
  }

  /**
   * Creates a new section under a class after validating name uniqueness and capacity bounds.
   */
  async createSection(dto: CreateSectionInput): Promise<Section> {
    // 1. Capacity Validation
    if (dto.capacity <= 0) {
      throw new Error("Section capacity must be greater than zero.");
    }

    // 2. Prevent Duplicate Section Name within the same Class
    const existingSection = await this.sectionRepo.findByNameAndClassId(dto.classId, dto.name);
    if (existingSection) {
      throw new Error(`Section "${dto.name}" already exists in this class.`);
    }

    return this.sectionRepo.create(dto);
  }

  /**
   * Updates an existing section record.
   */
  async updateSection(id: string, dto: UpdateSectionInput): Promise<Section> {
    const existing = await this.sectionRepo.findById(id);
    if (!existing) {
      throw new Error(`Section with ID "${id}" was not found.`);
    }

    if (dto.capacity !== undefined && dto.capacity <= 0) {
      throw new Error("Section capacity must be greater than zero.");
    }

    return this.sectionRepo.update(id, dto);
  }

  /**
   * Hard-deletes a section permanently from PostgreSQL ONLY IF no student enrollments reference it.
   */
  async deleteSection(id: string,): Promise<Section> {
    const section = await this.sectionRepo.findById(id);
    if (!section) {
      throw new Error(`Section with ID "${id}" was not found.`);
    }

    // 1. Dependency Guard: Check for any student enrollments referencing this sectionId directly
    const enrollmentCount = await this.prisma.studentEnrollment.count({
      where: {
        sectionId: id,
      },
    });

    // 2. Block Hard Delete if referenced in transactional student records
    if (enrollmentCount > 0) {
      throw new Error(
        `Cannot permanently delete Section "${section.name}". It is associated with ${enrollmentCount} student enrollment(s). Please reassign or remove those student enrollments first.`
      );
    }

    // 3. Perform Safe Hard Delete permanently from database
    return this.prisma.section.delete({
      where: { id },
    });
  }
}