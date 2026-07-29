import { prisma } from "@/lib/prisma";

export interface UpdateAddressPayload {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
}

class AddressRepository {
  async update(id: string, data: UpdateAddressPayload) {
    return prisma.student.update({
      where: {
        id,
      },
      data: {
        addressLine1: data.addressLine1 ?? undefined,
        addressLine2: data.addressLine2 ?? undefined,
        city: data.city ?? undefined,
        district: data.district ?? undefined,
        state: data.state ?? undefined,
        country: data.country ?? undefined,
        postalCode: data.postalCode ?? undefined,
      },
    });
  }
}

export const addressRepository = new AddressRepository();