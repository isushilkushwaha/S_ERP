import type {
  SchoolProfile,
  CreateSchoolProfileRequest,
  UpdateSchoolProfileRequest,
} from "../types";

const BASE_URL = "/api/settings/school-profile";

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data.data as T;
}

export const schoolProfileApi = {
  async getSchoolProfile(): Promise<SchoolProfile | null> {
    const response = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
    });

    const data = await response.json();

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch school profile.");
    }

    return data.data as SchoolProfile;
  },

  async createSchoolProfile(
    payload: CreateSchoolProfileRequest
  ): Promise<SchoolProfile> {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<SchoolProfile>(response);
  },

  async updateSchoolProfile(
    payload: UpdateSchoolProfileRequest
  ): Promise<SchoolProfile> {
    const response = await fetch(BASE_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<SchoolProfile>(response);
  },
};