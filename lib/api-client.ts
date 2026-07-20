// src/lib/api-client.ts

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const DEFAULT_HEADERS: HeadersInit = {
  "Content-Type": "application/json",
};

async function request<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      ...DEFAULT_HEADERS,
      ...init?.headers,
    },
    credentials: "include",
    cache: "no-store",
  });

  const json = await response.json();

  if (!response.ok) {
    throw new ApiError(
      json?.message ?? "Something went wrong.",
      response.status
    );
  }

  return json as T;
}

export const apiClient = {
  get: <T>(url: string) =>
    request<T>(url),

  post: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(url: string) =>
    request<T>(url, {
      method: "DELETE",
    }),
};