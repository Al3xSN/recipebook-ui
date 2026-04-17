import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';

// PUT /api/notifications/read-all — mark all unread notifications as read
export const PUT = async () => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  await db.notification.updateMany({
    where: { userId: session.userId, read: false },
    data: { read: true },
  });

  return new NextResponse(null, { status: 204 });
};
