import { apiClient } from "@/lib/api-client";


import { RegistrationFormValues } from "../../schemas/update/registration-schema";
import type { Student } from "../../types/student";

export async function updateRegistration(
  id: string,
  data: RegistrationFormValues,
): Promise<Student> {
  return apiClient.patch<Student>(
    `/api/students/${id}/registration`,
    data,
  );
}