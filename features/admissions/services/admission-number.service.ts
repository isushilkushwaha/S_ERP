import { Prisma } from "@prisma/client";
import { AcademicYearCounterRepository } from "../repositories/academic-year-counter.repository";

export class AdmissionNumberService {
  private academicYearCounterRepository: AcademicYearCounterRepository;

  constructor() {
    this.academicYearCounterRepository = new AcademicYearCounterRepository();
  }

  /**
   * Generates a sequential, thread-safe Admission Number for an Academic Year.
   * Format: {Prefix}-{StartYear}-{Sequence} (e.g., ADM-2026-0001)
   *
   * @param tx - Active Prisma Transaction Client
   * @param academicYearId - Unique ID of the target Academic Year
   * @returns Formatted admission number string
   */
  async generateAdmissionNumber(
    tx: Prisma.TransactionClient,
    academicYearId: string
  ): Promise<string> {
    // 1. Fetch School Profile Admission Prefix (Default to "ADM" if unconfigured)
    const schoolProfile = await tx.schoolProfile.findFirst({
      select: { admissionPrefix: true },
    });
    const prefix = schoolProfile?.admissionPrefix || "ADM";

    // 2. Fetch Academic Year Start Date to derive four-digit year (YYYY)
    const academicYear = await tx.academicYear.findUniqueOrThrow({
      where: { id: academicYearId },
      select: { startDate: true },
    });
    const startYear = new Date(academicYear.startDate).getFullYear();

    // 3. Atomically increment counter via Repository
    const sequenceNumber =
      await this.academicYearCounterRepository.incrementAndGetSequence(
        tx,
        academicYearId
      );

    // 4. Pad sequence number to 4 digits (e.g., 1 -> "0001")
    const paddedSequence = String(sequenceNumber).padStart(4, "0");

    // 5. Construct and return formatted Admission Number
    return `${prefix}-${startYear}-${paddedSequence}`;
  }
}