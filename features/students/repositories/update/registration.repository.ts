import { prisma } from "@/lib/prisma";

import type { UpdateRegistrationRequest } from "../../schemas/update/update-registration-schema";

export class RegistrationRepository {
  async update(
   id: string,
    data: UpdateRegistrationRequest,
  ) {
    return prisma.student.update({
      where: {
        id: id,
      },
      data: {
        emisNumber: data.emisNumber ?? undefined,
        apaarId: data.apaarId ?? undefined,
        penNumber: data.penNumber ?? undefined,
      },
    });
  }
}

export const registrationRepository =
  new RegistrationRepository();