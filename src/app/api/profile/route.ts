import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { getUserById } from '@/lib/server/user';

// GET /api/profile
export async function GET() {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const user = await getUserById(session.userId);
  if (!user) return apiError(404, 'User not found.');

  return NextResponse.json({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
  });
}
