import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { updateUserPassword } from '@/lib/server/user';

// PUT /api/profile/password
export async function PUT(req: NextRequest) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const body = await req.json().catch(() => null);
  const { currentPassword, newPassword } = body ?? {};

  if (!currentPassword || !newPassword) return apiError(422, 'Both passwords are required.');

  const ok = await updateUserPassword(session.userId, currentPassword, newPassword);
  if (!ok) return apiError(422, 'Current password is incorrect.');

  return new NextResponse(null, { status: 204 });
}
