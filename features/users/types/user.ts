export type UserRole = "ADMIN" | "TEACHER";

export interface User {
  id: string;

  fullName: string;

  email: string;

  username: string;

  role: UserRole;

  isActive: boolean;

  lastLoginAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}