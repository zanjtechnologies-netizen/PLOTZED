// ================================================
// src/lib/auth.ts - NextAuth v4 Configuration
// ================================================

import { NextAuthOptions, getServerSession } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
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
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true, // Auto-link if email matches
    }),

    // Facebook OAuth Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true, // Auto-link if email matches
    }),

    // Credentials Provider (Email/Password)
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

        // 4️⃣ Check if user has password (OAuth users don't have passwords)
        if (!user.password_hash) {
          throw new Error("Please sign in with your social account (Google or Facebook)");
        }

        // 5️⃣ Validate password
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

        // 6️⃣ Reset failed attempts
        await recordSuccessfulLogin(email);

        // 7️⃣ Update last login
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
    async signIn({ user, account, profile }) {
      // For OAuth providers, ensure email is verified
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          // Update email_verified for OAuth users
          // Use updateMany to avoid error if user doesn't exist yet
          await prisma.user.updateMany({
            where: { id: user.id },
            data: {
              email_verified: true,
              last_login: new Date(),
            },
          });
        } catch (error) {
          // Log error but allow sign-in to continue
          console.error('[OAuth] Failed to update user during sign-in:', error);
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      // For OAuth sign-ins, fetch role from database
      if (account && (account.provider === "google" || account.provider === "facebook")) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
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

  debug: process.env.NODE_ENV === "development",

  events: {
    async createUser(message) {
      console.log('[NextAuth] User created:', message.user.email);
    },
    async linkAccount(message) {
      console.log('[NextAuth] Account linked:', message.user.email, message.account.provider);
    },
    async signIn(message) {
      console.log('[NextAuth] Sign in:', message.user.email);
    },
  },
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
