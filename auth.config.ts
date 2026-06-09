import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isLoginPage = nextUrl.pathname === "/admin/login"
      if (!isLoggedIn && !isLoginPage) return false
      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL("/admin", nextUrl))
      }
      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
