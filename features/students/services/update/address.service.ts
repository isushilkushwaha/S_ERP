import { studentRepository } from "../../repositories/student.repository";
import {
  addressRepository,
  type UpdateAddressPayload,
} from "../../repositories/update/address.repository";

class AddressService {
  async updateAddress(
    id: string,
    payload: UpdateAddressPayload
  ) {
    const student = await studentRepository.findById(id);

    if (!student) {
      throw new Error("Student not found");
    }

    return addressRepository.update(id, payload);
  }
}

export const addressService = new AddressService();