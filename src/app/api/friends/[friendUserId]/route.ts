import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { areFriends, removeFriendship } from '@/lib/server/friendship-helpers';

type Params = { params: Promise<{ friendUserId: string }> };

// DELETE /api/friends/[friendUserId] — remove a friend
export const DELETE = async (_req: NextRequest, { params }: Params) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { friendUserId } = await params;

  if (!(await areFriends(session.userId, friendUserId)))
    return apiError(404, 'Not friends with this user.');

  await removeFriendship(session.userId, friendUserId);
  return new NextResponse(null, { status: 204 });
};
