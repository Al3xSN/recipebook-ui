import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { createFriendship } from '@/lib/server/friendship-helpers';

type Params = { params: Promise<{ id: string }> };

// PUT /api/friends/requests/[id] — accept or decline
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;
  const request = await db.friendRequest.findUnique({
    where: { id },
    include: { sender: { select: { username: true } } },
  });

  if (!request) return apiError(404, 'Friend request not found.');
  if (request.receiverId !== session.userId)
    return apiError(403, 'This request was not sent to you.');

  const body = await req.json().catch(() => null);
  const accept = body?.accept;

  const newStatus = accept ? 1 : 2;

  const updated = await db.friendRequest.update({
    where: { id },
    data: { status: newStatus },
    include: { sender: { select: { username: true } } },
  });

  if (accept) {
    await createFriendship(request.senderId, request.receiverId);
  }

  return NextResponse.json({
    id: updated.id,
    senderId: updated.senderId,
    senderUsername: updated.sender.username,
    receiverId: updated.receiverId,
    status: updated.status,
    createdAt: updated.createdAt,
  });
}

// DELETE /api/friends/requests/[id] — cancel a sent request
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;
  const request = await db.friendRequest.findUnique({ where: { id } });
  if (!request) return apiError(404, 'Friend request not found.');
  if (request.senderId !== session.userId)
    return apiError(403, 'You can only cancel requests you sent.');
  if (request.status !== 0) return apiError(422, 'This request is no longer pending.');

  await db.friendRequest.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
