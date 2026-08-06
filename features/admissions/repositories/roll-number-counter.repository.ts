import { Prisma } from "@prisma/client";

export class RollNumberCounterRepository {
  /**
   * Atomically increments and returns the last generated roll number for a given
   * Academic Year, Class, and Section within an active Prisma transaction.
   *
   * Uses PostgreSQL UPSERT with row-level locking on the composite unique index
   * `unique_roll_counter_scope` to support concurrent admissions.
   *
   * @param tx - Active Prisma Transaction Client
   * @param academicYearId - Unique ID of the target Academic Year
   * @param classId - Unique ID of the target Class
   * @param sectionId - Unique ID of the target Section (Required)
   * @returns The newly incremented roll number (integer)
   */
  async incrementAndGetRollNumber(
    tx: Prisma.TransactionClient,
    academicYearId: string,
    classId: string,
    sectionId: string
  ): Promise<number> {
    const result = await tx.$queryRaw<Array<{ last_roll_number: number }>>`
      INSERT INTO "roll_number_counters" (
        "id",
        "academic_year_id",
        "class_id",
        "section_id",
        "last_roll_number",
        "created_at",
        "updated_at"
      )
      VALUES (
        gen_random_uuid(),
        ${academicYearId},
        ${classId},
        ${sectionId},
        1,
        NOW(),
        NOW()
      )
      ON CONFLICT ("academic_year_id", "class_id", "section_id")
      DO UPDATE SET
        "last_roll_number" = "roll_number_counters"."last_roll_number" + 1,
        "updated_at" = NOW()
      RETURNING "last_roll_number";
    `;

    if (!result || result.length === 0) {
      throw new Error(
        `[RollNumberCounterRepository] Failed to increment roll number for scope: AY=${academicYearId}, Class=${classId}, Section=${sectionId}`
      );
    }

    return result[0].last_roll_number;
  }
}