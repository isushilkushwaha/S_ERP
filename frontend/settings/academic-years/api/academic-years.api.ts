import {
  AcademicYearListApiResponse,
  AcademicYearQueryParams,
  AcademicYearResponse,
  CreateAcademicYearRequest,
  DeleteAcademicYearResponse,
  UpdateAcademicYearRequest,
} from "../types/academic-year";
import type { AcademicYear } from "../types/academic-year";

import { ACADEMIC_YEAR_API } from "../constants";
import { buildQueryString } from "../utils";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

async function request<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "Something went wrong.");
  }

  return result as T;
}

/* -------------------------------------------------------------------------- */
/*                              Academic Years                                */
/* -------------------------------------------------------------------------- */

export async function getAcademicYears(
  params?: AcademicYearQueryParams
): Promise<AcademicYearListApiResponse> {
  const query = params ? `?${buildQueryString(params)}` : "";

  return request<AcademicYearListApiResponse>(
    `${ACADEMIC_YEAR_API}${query}`
  );
}

export async function getAcademicYear(
  id: string
): Promise<AcademicYear> {
  const response = await request<AcademicYearResponse>(
    `${ACADEMIC_YEAR_API}/${id}`
  );

  return response.data;
}

export async function createAcademicYear(
  data: CreateAcademicYearRequest
): Promise<AcademicYear> {
  const response = await request<AcademicYearResponse>(
    ACADEMIC_YEAR_API,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  return response.data;
}
export async function updateAcademicYear(
  id: string,
  data: UpdateAcademicYearRequest
): Promise<AcademicYear> {
  const response = await request<AcademicYearResponse>(
    `${ACADEMIC_YEAR_API}/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );

  return response.data;
}

export async function deleteAcademicYear(
  id: string
): Promise<DeleteAcademicYearResponse> {
  return request<DeleteAcademicYearResponse>(
    `${ACADEMIC_YEAR_API}/${id}`,
    {
      method: "DELETE",
    }
  );
}

export async function activateAcademicYear(
  id: string
): Promise<AcademicYear> {
  const response = await request<AcademicYearResponse>(
    `${ACADEMIC_YEAR_API}/${id}/activate`,
    {
      method: "PATCH",
    }
  );

  return response.data;
}


export async function archiveAcademicYear(
  id: string
): Promise<AcademicYear> {
  const response = await request<AcademicYearResponse>(
    `${ACADEMIC_YEAR_API}/${id}/archive`,
    {
      method: "PATCH",
    }
  );

  return response.data;
}


export async function restoreAcademicYear(
  id: string
): Promise<AcademicYear> {
  const response = await request<AcademicYearResponse>(
    `${ACADEMIC_YEAR_API}/${id}/restore`,
    {
      method: "PATCH",
    }
  );

  return response.data;
}


export async function getActiveAcademicYear(): Promise<AcademicYear | null> {
  const response = await getAcademicYears({
    status: "ACTIVE",
    page: 1,
    limit: 1,
  });

  if (response.data.length === 0) {
    return null;
  }

  return response.data[0];
}