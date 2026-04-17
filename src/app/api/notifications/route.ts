import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';

// GET /api/notifications — unread or created within the last 7 days
export const GET = async () => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const notifications = await db.notification.findMany({
    where: {
      userId: session.userId,
      OR: [{ read: false }, { createdAt: { gte: sevenDaysAgo } }],
    },
    include: {
      sender: { select: { username: true, displayName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    notifications.map((n) => ({
      id: n.id,
      type: n.type,
      read: n.read,
      createdAt: n.createdAt,
      referenceId: n.referenceId,
      senderId: n.senderId,
      senderUsername: n.sender.username,
      senderDisplayName: n.sender.displayName,
    })),
  );
};
