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

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    emailVerified: boolean;
  }
}

const _nextAuth = NextAuth({
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          console.log("[nextauth] missing credentials");
          return null;
        }

        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL ||
          "https://bartender-sanctuary-app.vercel.app";
        console.log("[nextauth] authorize start", {
          email: credentials.email,
          baseUrl,
          hasPassword: Boolean(credentials.password),
          passwordLen: credentials.password?.length,
        });

        const res = await fetch(
          `${baseUrl}/api/auth/user-by-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email }),
          }
        );
        const data = await res.json();
        console.log("[nextauth] user-by-email response", {
          status: res.status,
          ok: res.ok,
          hasUser: Boolean(data.user),
          keys: Object.keys(data),
        });

        if (!res.ok || !data.user) return null;

        const bcrypt = await import("bcryptjs");
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          data.user.password_hash
        );
        console.log("[nextauth] password match", {
          match: passwordMatch,
          hashPrefix: data.user.password_hash?.slice(0, 10),
        });
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
        token.id = user.id;
        token.emailVerified = Boolean((user as any).emailVerified);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },
});

export const { handlers, auth, signIn, signOut } = _nextAuth;
export default _nextAuth;
