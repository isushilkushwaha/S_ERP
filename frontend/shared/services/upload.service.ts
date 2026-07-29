export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
  };
  message?: string;
}

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

export async function uploadFile(
  file: File,
  uploadUrl: string,
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;

  try {
    response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new UploadError(
      "Unable to connect to the server. Please try again.",
    );
  }

  let result: UploadResponse;

  try {
    result = (await response.json()) as UploadResponse;
  } catch {
    throw new UploadError("Invalid server response.");
  }

  if (!response.ok || !result.success) {
    throw new UploadError(
      result.message ?? "File upload failed.",
    );
  }

  return result;
}