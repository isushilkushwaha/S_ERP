import { ApiResponse } from "../types/api";

async function fetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.error || `HTTP error! status: ${response.status}`);
  }

  return json.data as T;
}

export default fetcher;