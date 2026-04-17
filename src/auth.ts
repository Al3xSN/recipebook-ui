import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { verifyUserPassword } from '@/lib/server/user';

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

        const user = await verifyUserPassword(email, password);
        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          username: user.username,
          displayName: user.displayName ?? null,
          avatarUrl: user.avatarUrl ?? null,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.displayName = (user as any).displayName ?? null;
        token.avatarUrl = (user as any).avatarUrl ?? null;
      }
      if (trigger === 'update' && session?.avatarUrl !== undefined) {
        token.avatarUrl = session.avatarUrl;
      }
      if (trigger === 'update' && session?.username !== undefined) {
        token.username = session.username;
        token.displayName = session.displayName ?? null;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.displayName = (token.displayName as string | null) ?? null;
      session.user.avatarUrl = (token.avatarUrl as string | null) ?? null;

      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
