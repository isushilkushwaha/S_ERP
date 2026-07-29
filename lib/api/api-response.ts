import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export function apiSuccess<T>(
  data: T,
  message = "Success",
  status = 200
) {
  return NextResponse.json<ApiSuccessResponse<T>>(
    {
      success: true,
      message,
      data,
    },
    {
      status,
    }
  );
}