import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { ROLE_PERMISSIONS } from "@/lib/rbac/role-permissions";
import type { Permission } from "@/lib/rbac/permissions";

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        login: {
          label: "Email or Username",
          type: "text",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const parsed = z
          .object({
            login: z
              .string()
              .min(1, "Email or username is required"),

            password: z
              .string()
              .min(1, "Password is required"),
          })
          .safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { login, password } = parsed.data;

        const user = await prisma.user.findFirst({
          where: {
            deletedAt: null,
            OR: [
              {
                email: login,
              },
              {
                username: login,
              },
            ],
          },

          include: {
            role: true,
          },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const passwordMatched = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!passwordMatched) {
          return null;
        }

        await prisma.user.update({
          where: {
            id: user.id,
          },

          data: {
            lastLoginAt: new Date(),
          },
        });

        const role = user.role.name;

        const permissions = [
          ...(
            ROLE_PERMISSIONS[
              role as keyof typeof ROLE_PERMISSIONS
            ] ?? []
          ),
        ];

        return {
          id: user.id,

          name: user.fullName,

          email: user.email,

          username: user.username,

          role,

          isActive: user.isActive,

          permissions,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        token.role = user.role;

        token.username = user.username;

        token.isActive = user.isActive;

        token.permissions = user.permissions;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;

        session.user.role = token.role as string;

        session.user.username = token.username as string;

        session.user.isActive =
          token.isActive as boolean;

        session.user.permissions =
          (token.permissions as Permission[]) ?? [];
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;