import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { FriendRequestStatus } from '@generated/prisma/client';

// GET /api/friends — list all accepted friends with mutual friend count
export const GET = async () => {
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
          bio: true,
          _count: { select: { recipes: true } },
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
          _count: { select: { recipes: true } },
        },
      },
    },
  });

  const myFriendIds = accepted.map((f) =>
    f.senderId === session.userId ? f.receiverId : f.senderId,
  );

  const friends = await Promise.all(
    accepted.map(async (f) => {
      const friend = f.senderId === session.userId ? f.receiver : f.sender;
      const otherFriendIds = myFriendIds.filter((id) => id !== friend.id);

      const mutualFriendCount =
        otherFriendIds.length === 0
          ? 0
          : await db.friendRequest.count({
              where: {
                status: FriendRequestStatus.ACCEPTED,
                OR: [
                  { senderId: friend.id, receiverId: { in: otherFriendIds } },
                  { receiverId: friend.id, senderId: { in: otherFriendIds } },
                ],
              },
            });

      return {
        userId: friend.id,
        username: friend.username,
        displayName: friend.displayName,
        avatarUrl: friend.avatarUrl,
        bio: friend.bio,
        recipeCount: friend._count.recipes,
        mutualFriendCount,
      };
    }),
  );

  return NextResponse.json(friends);
};
