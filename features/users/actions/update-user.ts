
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserGuard } from "@/lib/guards/user-guard";
import { updateUserSchema } from "../schemas/update-user-schema";

export async function updateUser(
  id: string,
  values: unknown
) {
  const allowed = await UserGuard.canEdit(id);

  if (!allowed) {
    return {
      success: false,
      message: "Primary Administrator cannot be edited.",
    };
  }

  const validated = updateUserSchema.safeParse(values);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const data = validated.data;

  const role = await prisma.role.findUnique({
    where: {
      name: data.role,
    },
  });

  if (!role) {
    return {
      success: false,
      message: "Role not found.",
    };
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      fullName: data.fullName,
      email: data.email,
      username: data.username,
      roleId: role.id,
      isActive: data.isActive,
    },
  });

  revalidatePath("/users");

  return {
    success: true,
  };
}