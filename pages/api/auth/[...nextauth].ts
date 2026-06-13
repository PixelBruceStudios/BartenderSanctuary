import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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

        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL ||
          "https://bartender-sanctuary-app.vercel.app";

        const res = await fetch(
          `${baseUrl}/api/auth/user-by-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email }),
          }
        );
        const data = await res.json();

        if (!res.ok || !data.user) return null;

        const bcrypt = await import("bcryptjs");
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          data.user.password_hash
        );
        if (!passwordMatch) return null;

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          emailVerified: data.user.email_verified,
        };
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
        session.user.id = token.sub ?? '';
      }
      return session;
    },
  },
});

export const { handlers, auth, signIn, signOut } = _nextAuth;
export default _nextAuth;
