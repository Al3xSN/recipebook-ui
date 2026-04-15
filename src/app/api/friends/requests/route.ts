import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { areFriends } from '@/lib/server/friendship-helpers';

// GET /api/friends/requests — incoming requests, or ?direction=sent for outgoing
export async function GET(req: NextRequest) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const direction = req.nextUrl.searchParams.get('direction');

  if (direction === 'sent') {
    const requests = await db.friendRequest.findMany({
      where: { senderId: session.userId, status: 0 },
      include: { receiver: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(
      requests.map((r) => ({
        id: r.id,
        senderId: r.senderId,
        receiverId: r.receiverId,
        receiverUsername: r.receiver.username,
        status: r.status,
        createdAt: r.createdAt,
      })),
    );
  }

  // Default: incoming pending requests
  const requests = await db.friendRequest.findMany({
    where: { receiverId: session.userId, status: 0 },
    include: { sender: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    requests.map((r) => ({
      id: r.id,
      senderId: r.senderId,
      senderUsername: r.sender.username,
      receiverId: r.receiverId,
      status: r.status,
      createdAt: r.createdAt,
    })),
  );
}

// POST /api/friends/requests — send a friend request
export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const body = await req.json().catch(() => null);
  const receiverUsername = body?.receiverUsername?.trim();
  if (!receiverUsername) return apiError(422, 'receiverUsername is required.');

  const receiver = await db.user.findUnique({ where: { username: receiverUsername } });
  if (!receiver) return apiError(404, 'User not found.');
  if (receiver.id === session.userId)
    return apiError(422, 'You cannot send a request to yourself.');

  if (await areFriends(session.userId, receiver.id))
    return apiError(409, 'Already friends with this user.');

  // Auto-delete rejected request to allow re-request
  await db.friendRequest.deleteMany({
    where: { senderId: session.userId, receiverId: receiver.id, status: 2 },
  });

  const existing = await db.friendRequest.findFirst({
    where: {
      OR: [
        { senderId: session.userId, receiverId: receiver.id },
        { senderId: receiver.id, receiverId: session.userId },
      ],
      status: 0,
    },
  });
  if (existing) return apiError(409, 'A pending friend request already exists.');

  const request = await db.friendRequest.create({
    data: { senderId: session.userId, receiverId: receiver.id, status: 0 },
    include: { sender: { select: { username: true } } },
  });

  return NextResponse.json(
    {
      id: request.id,
      senderId: request.senderId,
      senderUsername: request.sender.username,
      receiverId: request.receiverId,
      status: request.status,
      createdAt: request.createdAt,
    },
    { status: 201 },
  );
}
