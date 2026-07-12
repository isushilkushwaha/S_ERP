import { AdminType, RoleName } from "@prisma/client";

export interface UserWithRole {
  id: string;

  fullName: string;

  email: string;

  username: string;

  isActive: boolean;

  adminType: AdminType | null;

  lastLoginAt: Date | null;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;

  role: {
    name: RoleName;
  };
}