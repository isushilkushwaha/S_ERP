"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "../schemas/reset-password-schema";

export async function resetUserPassword(
  id: string,
  values: unknown
) {
  const validated =
    resetPasswordSchema.safeParse(values);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const passwordHash = await bcrypt.hash(
    validated.data.password,
    12
  );

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      passwordHash,
    },
  });

  revalidatePath("/users");

  return {
    success: true,
    message: "Password reset successfully.",
  };
}