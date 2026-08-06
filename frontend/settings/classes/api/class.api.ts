import fetcher from "./client";
import { Class, CreateClassPayload, UpdateClassPayload, Status } from "../types/class";

export const classApi = {
  /**
   * Fetch all classes with optional status filter
   */
  async getAll(status?: Status): Promise<Class[]> {
    const query = status ? `?status=${status}` : "";
    return fetcher<Class[]>(`/api/settings/classes${query}`);
  },

  /**
   * Fetch class by ID
   */
  async getById(id: string): Promise<Class> {
    return fetcher<Class>(`/api/settings/classes/${id}`);
  },

  /**
   * Create a new class
   */
  async create(payload: CreateClassPayload): Promise<Class> {
    return fetcher<Class>("/api/settings/classes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing class
   */
  async update(id: string, payload: UpdateClassPayload): Promise<Class> {
    return fetcher<Class>(`/api/settings/classes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Soft delete a class
   */
  async delete(id: string): Promise<{ message: string }> {
    return fetcher<{ message: string }>(`/api/settings/classes/${id}`, {
      method: "DELETE",
    });
  },
};