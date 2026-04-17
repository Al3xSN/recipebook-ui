import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FriendRequestStatus } from '@generated/prisma/client';
import { requireAuth } from '@/lib/server/require-auth';
import { getUserSuggestions } from '@/lib/server/user';

// GET /api/users/suggestions — friends of friends not already connected
export async function GET() {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const connections = await db.friendRequest.findMany({
    where: {
      status: FriendRequestStatus.ACCEPTED,
      OR: [{ senderId: session.userId }, { receiverId: session.userId }],
    },
  });
  const friendIds = connections.map((c) =>
    c.senderId === session.userId ? c.receiverId : c.senderId,
  );

  if (friendIds.length === 0) return NextResponse.json([]);

  const secondDegree = await db.friendRequest.findMany({
    where: {
      status: FriendRequestStatus.ACCEPTED,
      OR: [{ senderId: { in: friendIds } }, { receiverId: { in: friendIds } }],
    },
  });

  const candidateIds = new Set<string>();
  for (const c of secondDegree) {
    if (c.senderId !== session.userId && !friendIds.includes(c.senderId))
      candidateIds.add(c.senderId);
    if (c.receiverId !== session.userId && !friendIds.includes(c.receiverId))
      candidateIds.add(c.receiverId);
  }

  const excludeIds = [session.userId, ...friendIds];
  const suggestions = await getUserSuggestions([...candidateIds], excludeIds);

  return NextResponse.json(suggestions.map((u) => ({ userId: u.id, username: u.username })));
}
