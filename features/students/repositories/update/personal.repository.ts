import { prisma } from "@/lib/prisma";
import type { Gender, StudentCategory } from "@prisma/client";

export interface UpdatePersonalPayload {
  dateOfBirth?: Date | null;
  gender?: Gender | null;
  bloodGroup?: string | null;
  religion?: string | null;
  category?: StudentCategory | null;
  caste?: string | null;
  nationality?: string | null;
  aadhaarNumber?: string | null;
  birthCertificateNo?: string | null;
  previousSchool?: string | null;
  remarks?: string | null;
}

class PersonalRepository {
  async update(id: string, data: UpdatePersonalPayload) {
    return prisma.student.update({
      where: {
        id,
      },
      data: {
        dateOfBirth: data.dateOfBirth ?? undefined,
        gender: data.gender ?? undefined,
        bloodGroup: data.bloodGroup ?? undefined,
        religion: data.religion ?? undefined,
        category: data.category ?? undefined,
        caste: data.caste ?? undefined,
        nationality: data.nationality ?? undefined,
        aadhaarNumber: data.aadhaarNumber ?? undefined,
        birthCertificateNo: data.birthCertificateNo ?? undefined,
        previousSchool: data.previousSchool ?? undefined,
        remarks: data.remarks ?? undefined,
      },
    });
  }
}

export const personalRepository = new PersonalRepository();