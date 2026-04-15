import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { verifyPassword, hashPassword } from '@/lib/server/password';

// PUT /api/profile/password
export async function PUT(req: NextRequest) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const body = await req.json().catch(() => null);
  const { currentPassword, newPassword } = body ?? {};

  if (!currentPassword || !newPassword) return apiError(422, 'Both passwords are required.');

  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) return apiError(404, 'User not found.');

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return apiError(422, 'Current password is incorrect.');

  const passwordHash = await hashPassword(newPassword);
  await db.user.update({ where: { id: session.userId }, data: { passwordHash } });

  return new NextResponse(null, { status: 204 });
}
