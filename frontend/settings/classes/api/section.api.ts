import fetcher from "./client";
import { Section, CreateSectionPayload, UpdateSectionPayload } from "../types/section";
import { Status } from "../types/class";

export const sectionApi = {
  /**
   * Fetch sections by classId with optional status filter
   */
  async getByClassId(classId: string, status?: Status): Promise<Section[]> {
    const statusQuery = status ? `&status=${status}` : "";
    return fetcher<Section[]>(`/api/settings/classes/sections?classId=${classId}${statusQuery}`);
  },

  /**
   * Create a new section
   */
  async create(payload: CreateSectionPayload): Promise<Section> {
    return fetcher<Section>("/api/settings/classes/sections", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update section
   */
  async update(id: string, payload: UpdateSectionPayload): Promise<Section> {
    return fetcher<Section>(`/api/settings/classes/sections/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Soft delete section
   */
  async delete(id: string): Promise<{ message: string }> {
    return fetcher<{ message: string }>(`/api/settings/classes/sections/${id}`, {
      method: "DELETE",
    });
  },
};