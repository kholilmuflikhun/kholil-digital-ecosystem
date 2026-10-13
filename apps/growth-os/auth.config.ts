import type { NextAuthConfig } from "next-auth";

/** Konfigurasi ringan (aman untuk Edge/middleware): tanpa Prisma dan bcrypt. */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const loggedIn = !!auth?.user;
      const isPublic =
        nextUrl.pathname === "/" ||
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register") ||
        nextUrl.pathname.startsWith("/api/auth") ||
        nextUrl.pathname.startsWith("/api/leads") || // dilindungi API key di route handler
        nextUrl.pathname.startsWith("/api/cron"); // dilindungi CRON_SECRET di route handler
      if (isPublic) {
        if (loggedIn && (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register"))) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }
      return loggedIn;
    },
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.sub && session.user) session.user.id = token.sub;
      return session;
    },
  },
} satisfies NextAuthConfig;
