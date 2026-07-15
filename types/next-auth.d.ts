
import "next-auth";
import "next-auth/jwt";
import type { Permission } from "@/lib/rbac/permissions";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      username: string;
      isActive: boolean;

      // NEW
      permissions: Permission[];

      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    role: string;
    username: string;
    isActive: boolean;

    // NEW
    permissions: Permission[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    username: string;
    isActive: boolean;

    // NEW
    permissions: Permission[];
  }
}