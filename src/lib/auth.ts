import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * Converted from app/modules/auth/services/AuthService.php (login) and
 * app/modules/auth/controllers/LoginController.php.
 * Laravel used session-based `Auth::login()`; NextAuth JWT sessions replace
 * the `sessions` table / `remember_token` mechanism.
 */
export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { role: true },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          roleId: user.roleId,
          role: user.role.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roleId = (user as { roleId: number }).roleId;
        token.role = (user as { role: string }).role;
        token.mobile = (user as { mobile: string }).mobile;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roleId = token.roleId as number;
        session.user.role = token.role as string;
        session.user.mobile = token.mobile as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/** Roles allowed into the /dashboard area (mirrors the Laravel `auth` middleware groups). */
export const DASHBOARD_ROLES = ["Super Admin", "Admin", "Doctor"];
