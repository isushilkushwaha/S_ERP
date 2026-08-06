import { Prisma } from "@prisma/client";
import { RollNumberCounterRepository } from "../repositories/roll-number-counter.repository";

export class RollNumberService {
  private rollNumberCounterRepository: RollNumberCounterRepository;

  constructor() {
    this.rollNumberCounterRepository = new RollNumberCounterRepository();
  }

  /**
   * Generates an incremental, thread-safe Roll Number for a specific
   * Academic Year, Class, and Section combination.
   *
   * @param tx - Active Prisma Transaction Client
   * @param academicYearId - Unique ID of the target Academic Year
   * @param classId - Unique ID of the target Class
   * @param sectionId - Unique ID of the target Section
   * @returns Sequential roll number integer (e.g., 1, 2, 3)
   */
  async generateRollNumber(
    tx: Prisma.TransactionClient,
    academicYearId: string,
    classId: string,
    sectionId: string
  ): Promise<number> {
    if (!academicYearId || !classId || !sectionId) {
      throw new Error(
        "[RollNumberService] Missing required scope parameters: academicYearId, classId, and sectionId are mandatory."
      );
    }

    return await this.rollNumberCounterRepository.incrementAndGetRollNumber(
      tx,
      academicYearId,
      classId,
      sectionId
    );
  }
}