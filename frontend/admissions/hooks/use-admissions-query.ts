// frontend/admissions/hooks/use-admissions-query.ts

import { useQuery } from "@tanstack/react-query";
import {
  AssignedFeeStructureDTO,
  StudentRegistrationSummaryDTO,
} from "@/features/admissions/dto/admission.dto";

// Default NIL UUID tenant identifier matching database default
const DEFAULT_TENANT_ID = "00000000-0000-0000-0000-000000000000";

interface RawFeeStructureItem {
  feeComponentId?: string;
  id?: string;
  code?: string;
  name?: string;
  amount?: number;
  feeComponent?: {
    id?: string;
    name?: string;
    code?: string;
    isRequired?: boolean;
  };
  isRequired?: boolean;
}

interface RawFeeStructure {
  id: string;
  academicYearId: string;
  classId: string;
  status?: string;
  items?: RawFeeStructureItem[];
  feeStructureItems?: RawFeeStructureItem[];
}

/**
 * Hook to query active fee structure from settings for a specific academic year and class
 */
export function useFeeStructureQuery(
  academicYearId?: string,
  classId?: string,
  tenantId?: string
) {
  // 1. Resolve actual tenant ID dynamically (falling back to NIL UUID)
  const activeTenantId =
    tenantId ||
    (typeof window !== "undefined"
      ? localStorage.getItem("tenantId") || DEFAULT_TENANT_ID
      : DEFAULT_TENANT_ID);

  return useQuery<AssignedFeeStructureDTO>({
    queryKey: ["fee-structure-admission", activeTenantId, academicYearId, classId],
    queryFn: async () => {
      if (!academicYearId || !classId) {
        throw new Error("Academic Year and Class are required.");
      }

      // 2. Build search params using activeTenantId
      const query = new URLSearchParams();
      query.set("tenantId", activeTenantId);
      query.set("academicYearId", academicYearId);
      query.set("classId", classId);
      query.set("status", "ACTIVE");
      query.set("limit", "100");

      const res = await fetch(`/api/settings/fee-structures?${query.toString()}`, {
        headers: {
          "x-tenant-id": activeTenantId,
        },
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch fee structure.");
      }

      // 3. Extract raw list safely
      const rawData = json as { data?: { items?: RawFeeStructure[] } | RawFeeStructure[]; items?: RawFeeStructure[] };
      const rawList: RawFeeStructure[] = Array.isArray(rawData.data)
        ? rawData.data
        : Array.isArray(rawData.data?.items)
        ? rawData.data.items
        : Array.isArray(rawData.items)
        ? rawData.items
        : Array.isArray(json)
        ? (json as RawFeeStructure[])
        : [];

      // 4. Strict match checking against selected Academic Year and Class
      const activeStructure = rawList.find(
        (fs) =>
          fs.academicYearId === academicYearId &&
          fs.classId === classId &&
          (fs.status === "ACTIVE" || !fs.status)
      );

      if (!activeStructure) {
        throw new Error("No active fee structure configured in settings for this class.");
      }

      // 5. Extract and format fee components
      const itemsList = activeStructure.items || activeStructure.feeStructureItems || [];
      const items = itemsList.map((item) => ({
        feeComponentId: item.feeComponentId || item.feeComponent?.id || item.id || "",
        name: item.feeComponent?.name || item.name || "Fee Component",
        code: item.feeComponent?.code || item.code || "FEE",
        amount: Number(item.amount || 0),
        isRequired: item.feeComponent?.isRequired ?? item.isRequired ?? true,
      }));

      const totalAmount = items.reduce((acc, curr) => acc + curr.amount, 0);

      return {
        feeStructureId: activeStructure.id,
        academicYearId: activeStructure.academicYearId,
        classId: activeStructure.classId,
        totalAmount,
        items,
      };
    },
    enabled: Boolean(
      academicYearId &&
      classId &&
      academicYearId.length > 0 &&
      classId.length > 0
    ),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to search registered students during admission Step 1
 */
export function useRegisteredStudentsQuery(searchQuery: string) {
  return useQuery<StudentRegistrationSummaryDTO[]>({
    queryKey: ["registered-students", searchQuery],
    queryFn: async () => {
      const url = new URL("/api/admissions/registered-students", window.location.origin);
      if (searchQuery) url.searchParams.set("query", searchQuery);

      const res = await fetch(url.toString());
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to fetch registered students.");
      }

      return json.data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}