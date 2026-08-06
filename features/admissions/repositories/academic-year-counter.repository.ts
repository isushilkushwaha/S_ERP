import { Prisma } from "@prisma/client";

export class AcademicYearCounterRepository {
  /**
   * Atomically increments and returns the last generated admission sequence number
   * for a given Academic Year within an active Prisma transaction.
   *
   * Uses PostgreSQL UPSERT with row-level locking to handle high concurrency.
   *
   * @param tx - Active Prisma Transaction Client
   * @param academicYearId - The unique ID of the target Academic Year
   * @returns The newly incremented sequence number (integer)
   */
  async incrementAndGetSequence(
    tx: Prisma.TransactionClient,
    academicYearId: string
  ): Promise<number> {
    const result = await tx.$queryRaw<Array<{ last_admission_sequence: number }>>`
      INSERT INTO "academic_year_counters" (
        "id",
        "academic_year_id",
        "last_admission_sequence",
        "created_at",
        "updated_at"
      )
      VALUES (
        gen_random_uuid(),
        ${academicYearId},
        1,
        NOW(),
        NOW()
      )
      ON CONFLICT ("academic_year_id")
      DO UPDATE SET
        "last_admission_sequence" = "academic_year_counters"."last_admission_sequence" + 1,
        "updated_at" = NOW()
      RETURNING "last_admission_sequence";
    `;

    if (!result || result.length === 0) {
      throw new Error(
        `[AcademicYearCounterRepository] Failed to increment sequence for AcademicYear ID: ${academicYearId}`
      );
    }

    return result[0].last_admission_sequence;
  }
}