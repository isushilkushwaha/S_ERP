

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserGuard } from "@/lib/guards/user-guard";

export async function toggleUserStatus(
  id: string,
  isActive: boolean
) {
  const allowed = await UserGuard.canDeactivate(id);

  if (!allowed) {
    return {
      success: false,
      message: "Primary Administrator cannot be deactivated.",
    };
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive,
    },
  });

  revalidatePath("/users");

  return {
    success: true,
  };
}