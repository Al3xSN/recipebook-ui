import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { removeFriendship } from '@/lib/server/friendship-helpers';

type Params = { params: Promise<{ username: string }> };

// POST /api/users/[username]/block
export async function POST(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { username } = await params;
  const target = await db.user.findUnique({ where: { username } });
  if (!target) return apiError(404, 'User not found.');
  if (target.id === session.userId) return apiError(422, 'You cannot block yourself.');

  const existing = await db.block.findUnique({
    where: { blockerId_blockedId: { blockerId: session.userId, blockedId: target.id } },
  });
  if (existing) return apiError(409, 'User is already blocked.');

  // Remove friendship if exists
  await removeFriendship(session.userId, target.id);

  // Remove any pending friend requests between them
  await db.friendRequest.deleteMany({
    where: {
      OR: [
        { senderId: session.userId, receiverId: target.id },
        { senderId: target.id, receiverId: session.userId },
      ],
    },
  });

  await db.block.create({ data: { blockerId: session.userId, blockedId: target.id } });

  return new NextResponse(null, { status: 204 });
}

// DELETE /api/users/[username]/block
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { username } = await params;
  const target = await db.user.findUnique({ where: { username } });
  if (!target) return apiError(404, 'User not found.');
  if (target.id === session.userId) return apiError(422, 'You cannot unblock yourself.');

  const existing = await db.block.findUnique({
    where: { blockerId_blockedId: { blockerId: session.userId, blockedId: target.id } },
  });
  if (!existing) return apiError(404, 'No block exists for this user.');

  await db.block.delete({
    where: { blockerId_blockedId: { blockerId: session.userId, blockedId: target.id } },
  });

  return new NextResponse(null, { status: 204 });
}
