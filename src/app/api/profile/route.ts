import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';

// GET /api/profile
export async function GET() {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) return apiError(404, 'User not found.');

  return NextResponse.json({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
  });
}
