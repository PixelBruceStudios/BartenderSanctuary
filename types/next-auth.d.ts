import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      emailVerified: boolean;
    };
  }

  interface User {
    emailVerified: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    emailVerified: boolean;
  }
}
