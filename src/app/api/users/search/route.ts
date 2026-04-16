import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';

// GET /api/users/search?username=
export async function GET(req: NextRequest) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const query = req.nextUrl.searchParams.get('username')?.trim() || '';

  const friendships = await db.friendship.findMany({
    where: { OR: [{ userAId: session.userId }, { userBId: session.userId }] },
  });
  const friendIds = friendships.map((f) => (f.userAId === session.userId ? f.userBId : f.userAId));

  const excludeIds = [session.userId, ...friendIds];

  const users = await db.user.findMany({
    where: {
      username: { contains: query, mode: Prisma.QueryMode.insensitive },
      id: { notIn: excludeIds },
    },
    select: { id: true, username: true },
    take: 20,
  });

  return NextResponse.json(users.map((u) => ({ userId: u.id, username: u.username })));
}
