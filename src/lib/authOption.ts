import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.email === "zanjtechnologies@gmail.com" &&
          credentials?.password === "my_password"
        ) {
          return { id: "1", name: "Admin", email: "zanjtechnologies@gmail.com", role: "admin" };
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
