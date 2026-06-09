import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string
        if (!email || !password) return null
        if (email !== process.env.ADMIN_EMAIL) return null
        const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!)
        if (!valid) return null
        return { id: "admin", email, name: "Admin" }
      },
    }),
  ],
})
