import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';

// GET /api/friends — list all accepted friends
export async function GET() {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const friendships = await db.friendship.findMany({
    where: { OR: [{ userAId: session.userId }, { userBId: session.userId }] },
    include: {
      userA: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          _count: { select: { recipes: true } },
        },
      },
      userB: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          _count: { select: { recipes: true } },
        },
      },
    },
  });

  const friends = friendships.map((f) => {
    const friend = f.userAId === session.userId ? f.userB : f.userA;
    return {
      userId: friend.id,
      username: friend.username,
      displayName: friend.displayName,
      avatarUrl: friend.avatarUrl,
      recipeCount: friend._count.recipes,
    };
  });

  return NextResponse.json(friends);
}
