import { prisma } from "@/lib/prisma";

export const userService = {
  async findAll() {
    return prisma.user.findMany({
      where: {
        deletedAt: null,
      },

      include: {
        role: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },

      include: {
        role: true,
      },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: {
        username,
      },
    });
  },
};