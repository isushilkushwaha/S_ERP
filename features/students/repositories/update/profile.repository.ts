import { prisma } from "@/lib/prisma";

export interface UpdateProfilePayload {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  mobile?: string | null;
  email?: string | null;
}

class ProfileRepository {
  async update(id: string, data: UpdateProfilePayload) {
    return prisma.student.update({
      where: {
        id,
      },
      data: {
        firstName: data.firstName ?? undefined,
        middleName: data.middleName ?? undefined,
        lastName: data.lastName ?? undefined,
        mobile: data.mobile ?? undefined,
        email: data.email ?? undefined,
      },
    });
  }
}

export const profileRepository = new ProfileRepository();