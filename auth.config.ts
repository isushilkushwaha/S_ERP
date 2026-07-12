

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        login: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            login: z.string().min(1, "Email or username is required"),
            password: z.string().min(1, "Password is required"),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { login, password } = parsed.data;

        const user = await prisma.user.findFirst({
          where: {
            deletedAt: null,
            OR: [{ email: login }, { username: login }],
          },
          include: { role: true },
        });

        if (!user || !user.isActive) return null;

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          username: user.username,
          role: user.role.name,
          isActive: user.isActive,
        };
      },
    }),
  ],
  // Callbacks are defined at the root level of authConfig, next to providers
  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //       token.role = (user as any).role;
  //       token.username = (user as any).username;
  //       token.isActive = (user as any).isActive;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (session.user) {
  //       session.user.id = token.id as string;
  //       session.user.role = token.role as string;
  //       session.user.username = token.username as string;
  //       session.user.isActive = token.isActive as boolean;
  //     }
  //     return session;
  //   },
  // },

  // auth.config.ts

callbacks: {
  async jwt({ token, user }) {
    // When a user signs in, the 'user' object is available
    if (user) {
      token.id = user.id;
      token.role = user.role;
      token.username = user.username;
      token.isActive = user.isActive;
    }
    return token;
  },
  async session({ session, token }) {
    // Populate the session object from the JWT token
    if (session.user) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.username = token.username;
      session.user.isActive = token.isActive;
    }
    return session;
  },
},


} satisfies NextAuthConfig;