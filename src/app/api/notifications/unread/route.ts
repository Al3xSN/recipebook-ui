import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';

// GET /api/notifications/unread — { hasUnread: boolean } for the navbar dot
export const GET = async () => {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const exists = await db.notification.findFirst({
    where: { userId: session.userId, read: false },
    select: { id: true },
  });

  return NextResponse.json({ hasUnread: !!exists });
};
