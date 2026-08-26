import fetcher from "./client";

import {
  ClassConfiguration,
  UpdateConfigurationPayload,
} from "../types/configuration";

export const configurationApi = {
  async getByClassId(
    academicYearId: string,
    classId: string
  ): Promise<ClassConfiguration> {
    const params = new URLSearchParams();

    params.set(
      "academicYearId",
      academicYearId
    );

    params.set(
      "classId",
      classId
    );

    return fetcher<ClassConfiguration>(
      `/api/settings/classes/configuration?${params.toString()}`
    );
  },

  async update(
    payload: UpdateConfigurationPayload
  ): Promise<ClassConfiguration> {
    return fetcher<ClassConfiguration>(
      "/api/settings/classes/configuration",
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
  },
};