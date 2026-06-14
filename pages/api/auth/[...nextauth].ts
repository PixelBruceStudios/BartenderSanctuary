import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Pool } from "pg";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      emailVerified: boolean;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    emailVerified: boolean;
  }
}

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

const _nextAuth = NextAuth({
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const trimmed = String(credentials.email).trim().toLowerCase();
        const client = await pool.connect();
        try {
          const result = await client.query(
            "SELECT id, email, name, password_hash, email_verified FROM users WHERE email = $1",
            [trimmed]
          );
          const user = result.rows[0];
          if (!user) return null;

          const bcrypt = await import("bcryptjs");
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );
          if (!passwordMatch) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            emailVerified: user.email_verified,
          };
        } finally {
          client.release();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
});

export const authOptions = _nextAuth as any;
export const auth = _nextAuth;
export const handlers = _nextAuth.handlers;
export const signIn = _nextAuth.signIn;
export const signOut = _nextAuth.signOut;
export default _nextAuth;
