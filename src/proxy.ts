import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { canAccess, type Role } from "@/lib/access";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname, search } = req.nextUrl;

  if (!isLoggedIn) {
    const signInUrl = new URL("/auth/signin", req.nextUrl);
    signInUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(signInUrl);
  }

  const role = (req.auth?.user as { role?: Role } | undefined)?.role ?? null;
  if (!canAccess(pathname, role)) {
    const forbiddenUrl = new URL("/forbidden", req.nextUrl);
    forbiddenUrl.searchParams.set("from", pathname);
    return NextResponse.rewrite(forbiddenUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
