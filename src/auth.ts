import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/server/password';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          username: user.username,
          displayName: user.displayName ?? null,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        token.username = (user as any).username;

        token.displayName = (user as any).displayName ?? null;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.displayName = (token.displayName as string | null) ?? null;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
