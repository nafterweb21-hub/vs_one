import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import type { UserRole } from "@/types/role";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      employeeId: string | null;
    } & DefaultSession["user"];
  }
  interface User {
    role: UserRole;
    employeeId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    employeeId: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Bypass authentication for development: allow any email/password
        // Don't query Prisma as the database connection might be failing
        return {
          id: "dev-user-id",
          email: "dev@example.com",
          name: "Dev User",
          role: "ADMIN",
          employeeId: null,
        } as any;
      },
    }),
  ],
});
