

"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { UserGuard } from "@/lib/guards/user-guard";

export async function deleteUser(id: string) {
  try {
    const allowed = await UserGuard.canDelete(id);

    if (!allowed) {
      return {
        success: false,
        message: "Primary Administrator cannot be deleted.",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Delete all sessions
      await tx.session.deleteMany({
        where: {
          userId: id,
        },
      });

      // Delete linked OAuth accounts (future-proof)
      await tx.account.deleteMany({
        where: {
          userId: id,
        },
      });

      // Delete user
      await tx.user.delete({
        where: {
          id,
        },
      });
    });

    revalidatePath("/users");

    return {
      success: true,
      message: "User deleted successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to delete user.",
    };
  }
}