import { prisma } from "@/lib/prisma";

import type { Prisma } from "@prisma/client";

export class ParentRepository {
  async update(
    id: string,
    data: Prisma.StudentUpdateInput,
  ) {
    return prisma.student.update({
      where: {
        id,
      },
      data: {
        fatherName: data.fatherName ?? undefined,
        fatherOccupation:
          data.fatherOccupation ?? undefined,
        fatherMobile:
          data.fatherMobile ?? undefined,
        fatherEmail:
          data.fatherEmail ?? undefined,

        motherName: data.motherName ?? undefined,
        motherOccupation:
          data.motherOccupation ?? undefined,
        motherMobile:
          data.motherMobile ?? undefined,
        motherEmail:
          data.motherEmail ?? undefined,

        guardianName:
          data.guardianName ?? undefined,
        guardianRelation:
          data.guardianRelation ?? undefined,
        guardianMobile:
          data.guardianMobile ?? undefined,
        guardianEmail:
          data.guardianEmail ?? undefined,

        updatedAt: new Date(),
      },
    });
  }
}

export const parentRepository =
  new ParentRepository();