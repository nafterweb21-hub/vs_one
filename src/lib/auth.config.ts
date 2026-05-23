import type { NextAuthConfig } from "next-auth";

// Edge-safe NextAuth config: no DB-touching providers, no Node-only imports.
// Used by middleware to check auth state via the JWT cookie.
// The full config in auth.ts extends this with the Credentials provider.
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role: string }).role;
        token.employeeId = (user as { employeeId: string | null }).employeeId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-expect-error augmented in auth.ts
        session.user.id = token.id;
        // @ts-expect-error augmented in auth.ts
        session.user.role = token.role;
        // @ts-expect-error augmented in auth.ts
        session.user.employeeId = token.employeeId;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
