import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';

// GET /api/users/suggestions — friends of friends not already connected
export async function GET() {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const friendships = await db.friendship.findMany({
    where: { OR: [{ userAId: session.userId }, { userBId: session.userId }] },
  });
  const friendIds = friendships.map((f) => (f.userAId === session.userId ? f.userBId : f.userAId));

  if (friendIds.length === 0) return NextResponse.json([]);

  // Find friends of friends
  const secondDegree = await db.friendship.findMany({
    where: {
      OR: [{ userAId: { in: friendIds } }, { userBId: { in: friendIds } }],
    },
  });

  const candidateIds = new Set<string>();
  for (const f of secondDegree) {
    if (f.userAId !== session.userId && !friendIds.includes(f.userAId)) candidateIds.add(f.userAId);
    if (f.userBId !== session.userId && !friendIds.includes(f.userBId)) candidateIds.add(f.userBId);
  }

  const excludeIds = [session.userId, ...friendIds];
  const suggestions = await db.user.findMany({
    where: {
      id: { in: [...candidateIds], notIn: excludeIds },
      blocksReceived: { none: { blockerId: session.userId } },
      blocksGiven: { none: { blockedId: session.userId } },
    },
    select: { id: true, username: true },
    take: 10,
  });

  return NextResponse.json(suggestions.map((u) => ({ userId: u.id, username: u.username })));
}
