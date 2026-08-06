import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateAdmissionInput } from "@/features/admissions/validators/admission.validator";
import { AdmissionResponseDTO } from "@/features/admissions/dto/admission.dto";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export function useCreateAdmissionMutation() {
  const queryClient = useQueryClient();

  return useMutation<AdmissionResponseDTO, Error, CreateAdmissionInput>({
    mutationFn: async (payload: CreateAdmissionInput) => {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json: ApiResponse<AdmissionResponseDTO> = await res.json();

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "Failed to process student admission.");
      }

      return json.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh tables and candidate lists
      queryClient.invalidateQueries({ queryKey: ["admissions-list"] });
      queryClient.invalidateQueries({ queryKey: ["registered-students"] });
    },
  });
}