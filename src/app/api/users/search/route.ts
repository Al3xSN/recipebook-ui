import { NextRequest, NextResponse } from 'next/server';
import { Prisma, FriendRequestStatus } from '@generated/prisma/client';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';

// GET /api/users/search?username=
export async function GET(req: NextRequest) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const query = req.nextUrl.searchParams.get('username')?.trim() || '';

  const connections = await db.friendRequest.findMany({
    where: {
      status: FriendRequestStatus.ACCEPTED,
      OR: [{ senderId: session.userId }, { receiverId: session.userId }],
    },
  });
  const friendIds = connections.map((c) =>
    c.senderId === session.userId ? c.receiverId : c.senderId,
  );

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
