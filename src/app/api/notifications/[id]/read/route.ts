import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';

type Params = { params: Promise<{ id: string }> };

// PUT /api/notifications/[id]/read — mark a single notification as read
export async function PUT(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const { id } = await params;
  const notification = await db.notification.findUnique({ where: { id } });

  if (!notification) return apiError(404, 'Notification not found.');
  if (notification.userId !== session.userId) return apiError(403, 'Not your notification.');

  await db.notification.update({ where: { id }, data: { read: true } });

  return new NextResponse(null, { status: 204 });
}
