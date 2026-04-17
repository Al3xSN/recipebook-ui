import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { createNotification, NotificationType } from '@/lib/server/notifications';
import { FriendRequestStatus } from '@generated/prisma/client';

type Params = { params: Promise<{ id: string }> };

// PUT /api/friends/requests/[id] — accept or decline
export const PUT = async (req: NextRequest, { params }: Params) => {
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

  const updated = await db.$transaction(async (tx) => {
    const r = await tx.friendRequest.update({
      where: { id },
      data: { status: accept ? FriendRequestStatus.ACCEPTED : FriendRequestStatus.REJECTED },
      include: { sender: { select: { username: true } } },
    });
    if (accept) {
      await createNotification(tx, {
        userId: r.senderId,
        senderId: session.userId,
        type: NotificationType.FRIEND_ACCEPTED,
        referenceId: r.id,
      });
    }
    return r;
  });

  return NextResponse.json({
    id: updated.id,
    senderId: updated.senderId,
    senderUsername: updated.sender.username,
    receiverId: updated.receiverId,
    status: updated.status,
    createdAt: updated.createdAt,
  });
};

// DELETE /api/friends/requests/[id] — cancel a sent request
export const DELETE = async (_req: NextRequest, { params }: Params) => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;
  const request = await db.friendRequest.findUnique({ where: { id } });
  if (!request) return apiError(404, 'Friend request not found.');
  if (request.senderId !== session.userId)
    return apiError(403, 'You can only cancel requests you sent.');
  if (request.status !== FriendRequestStatus.PENDING)
    return apiError(422, 'This request is no longer pending.');

  await db.friendRequest.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
};
