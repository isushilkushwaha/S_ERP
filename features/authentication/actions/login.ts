"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

import { loginSchema } from "../schemas/login-schema";

export async function login(values: unknown) {
  const validated = loginSchema.safeParse(values);

  if (!validated.success) {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }

  const { login, password } = validated.data;

  try {
    await signIn("credentials", {
      login,
      password,
      redirectTo: "/dashboard",
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid email/username or password.",
          };

        default:
          return {
            success: false,
            message: "Authentication failed.",
          };
      }
    }

    throw error;
  }
}