import { apiClient } from "@/lib/api-client";

import type {
  Section,
  SectionListResponse,
  SectionQuery,
  SectionResponse,
} from "../types/section";

/**
 * Get all sections
 */
export async function getSections(
  params?: SectionQuery
): Promise<Section[]> {
  const query = params?.classId
    ? `?classId=${params.classId}`
    : "";

  const response =
    await apiClient.get<SectionListResponse>(
      `/api/sections${query}`
    );

  return response.data;
}

/**
 * Get section by id
 */
export async function getSectionById(
  id: string
): Promise<Section> {
  const response =
    await apiClient.get<SectionResponse>(
      `/api/sections/${id}`
    );

  return response.data;
}