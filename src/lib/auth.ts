// ================================================
// src/lib/auth.ts - NextAuth v4 Configuration
// ================================================

import { NextAuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { loginSchema } from "./validators";
import {
  checkAccountLockout,
  recordFailedLogin,
  recordSuccessfulLogin,
  formatRemainingTime,
} from "./account-lockout";

const MAX_ATTEMPTS = 5; // ✅ Define max failed attempts before lockout

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // 1️⃣ Validate inputs
        const validatedCredentials = loginSchema.parse(credentials);
        const { email, password } = validatedCredentials;

        // 2️⃣ Check for account lockout
        const lockoutStatus = await checkAccountLockout(email);
        if (lockoutStatus.locked) {
          const timeRemaining = formatRemainingTime(lockoutStatus.remainingTime || 0);
          throw new Error(
            `Account temporarily locked due to multiple failed login attempts. Try again in ${timeRemaining}.`
          );
        }

        // 3️⃣ Check if user exists
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          await recordFailedLogin(email);
          throw new Error("Invalid email or password");
        }

        // 4️⃣ Validate password
        const isPasswordValid = await bcrypt.compare(
          password,
          user.password_hash
        );

        if (!isPasswordValid) {
          await recordFailedLogin(email);

          const attempts = lockoutStatus.attempts || 0;
          const remaining = MAX_ATTEMPTS - attempts - 1;

          if (remaining > 0) {
            throw new Error(
              `Invalid email or password. ${remaining} ${remaining === 1 ? "attempt" : "attempts"} remaining.`
            );
          } else {
            throw new Error(
              "Invalid email or password. Account will be locked after one more failed attempt."
            );
          }
        }

        // 5️⃣ Reset failed attempts
        await recordSuccessfulLogin(email);

        // 6️⃣ Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { last_login: new Date() },
        });

        // ✅ Success — return safe user object
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// ================================================
// Helper function for NextAuth v4 compatibility
// ================================================

/**
 * Get the current session in server components and API routes
 * This replaces the NextAuth v5 `auth()` function
 */
export function auth() {
  return getServerSession(authOptions);
}
