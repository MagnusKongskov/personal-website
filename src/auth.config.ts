import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/pw/login",
    verifyRequest: "/pw/login?verify=1",
    error: "/pw/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user?.email);
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isDashboard) {
        return isLoggedIn;
      }

      return true;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
