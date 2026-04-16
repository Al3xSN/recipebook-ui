import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { FriendRequestStatus } from '@generated/prisma/client';

// GET /api/friends — list all accepted friends
export async function GET() {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const accepted = await db.friendRequest.findMany({
    where: {
      status: FriendRequestStatus.ACCEPTED,
      OR: [{ senderId: session.userId }, { receiverId: session.userId }],
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          _count: { select: { recipes: true } },
        },
      },
      receiver: {
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

  const friends = accepted.map((f) => {
    const friend = f.senderId === session.userId ? f.receiver : f.sender;
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
