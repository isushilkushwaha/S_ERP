import fetcher from "./client";
import { ClassConfiguration, UpdateConfigurationPayload } from "../types/configuration";

export const configurationApi = {
  /**
   * Fetch class configuration settings by classId
   */
  async getByClassId(classId: string): Promise<ClassConfiguration> {
    return fetcher<ClassConfiguration>(`/api/settings/classes/configuration?classId=${classId}`);
  },

  /**
   * Update or create class configuration settings
   */
  async update(payload: UpdateConfigurationPayload): Promise<ClassConfiguration> {
    return fetcher<ClassConfiguration>("/api/settings/classes/configuration", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};