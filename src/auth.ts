import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { verifyUserPassword, getUserById } from '@/lib/server/user';
import { generateUniqueUsername } from '@/lib/server/user/username';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: {
    ...PrismaAdapter(db),
    async createUser(adapterUser) {
      const { email, name, image } = adapterUser;
      const username = await generateUniqueUsername(name ?? email?.split('@')[0] ?? 'user');
      const user = await db.user.create({
        data: { email: email!, username, displayName: name ?? null, avatarUrl: image ?? null },
      });
      return {
        id: user.id,
        email: user.email,
        emailVerified: null,
        name: user.username,
        image: user.avatarUrl,
      };
    },
  },
  session: { strategy: 'jwt' },
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
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
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        if (account?.provider === 'google') {
          const dbUser = await getUserById(user.id!);
          if (dbUser) {
            token.id = dbUser.id;
            token.username = dbUser.username;
            token.displayName = dbUser.displayName ?? null;
            token.avatarUrl = dbUser.avatarUrl ?? null;
          }
        } else {
          token.id = user.id;
          token.username = (user as any).username;
          token.displayName = (user as any).displayName ?? null;
          token.avatarUrl = (user as any).avatarUrl ?? null;
        }
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
    async session({ session, token }) {
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
