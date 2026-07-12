

import { AdminType, RoleName } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class UserGuard {
  /**
   * Maximum 2 admin accounts
   */
  static async canCreateAdmin() {
    const count = await prisma.user.count({
      where: {
        deletedAt: null,
        role: {
          name: RoleName.ADMIN,
        },
      },
    });

    return count < 2;
  }

  /**
   * Returns PRIMARY or SECONDARY
   * Returns null if limit reached
   */
  static async getNextAdminType() {
    const admins = await prisma.user.findMany({
      where: {
        deletedAt: null,
        role: {
          name: RoleName.ADMIN,
        },
      },
      select: {
        adminType: true,
      },
    });

    const hasPrimary = admins.some(
      (admin) => admin.adminType === AdminType.PRIMARY
    );

    const hasSecondary = admins.some(
      (admin) => admin.adminType === AdminType.SECONDARY
    );

    if (!hasPrimary) {
      return AdminType.PRIMARY;
    }

    if (!hasSecondary) {
      return AdminType.SECONDARY;
    }

    return null;
  }

  /**
   * Check Primary Admin
   */
  static async isPrimaryAdmin(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return false;
    }

    return (
      user.role.name === RoleName.ADMIN &&
      user.adminType === AdminType.PRIMARY
    );
  }

  static async canEdit(userId: string) {
    return !(await this.isPrimaryAdmin(userId));
  }

  static async canDelete(userId: string) {
    return !(await this.isPrimaryAdmin(userId));
  }

  static async canDeactivate(userId: string) {
    return !(await this.isPrimaryAdmin(userId));
  }
}