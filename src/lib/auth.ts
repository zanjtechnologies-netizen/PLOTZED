// ================================================
// src/lib/auth.ts - NextAuth v5 Configuration
// ================================================

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { loginSchema } from './validators'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.password_hash) {
            return null // User not found or password not set
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
          )

          if (isPasswordValid) {
            // Update last login
            await prisma.user.update({
              where: { id: user.id },
              data: { last_login: new Date() },
            })
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            }
          }
        }
        return null // Invalid credentials
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.id = token.id as string
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
})
