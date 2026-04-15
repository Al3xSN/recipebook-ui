import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';

// PUT /api/profile/info
export async function PUT(req: NextRequest) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const body = await req.json().catch(() => null);
  if (!body) return apiError(400, 'Invalid request body.');

  const { username, displayName, bio, avatarUrl } = body as {
    username?: string;
    displayName?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
  };

  if (!username?.trim()) return apiError(422, 'Username is required.');

  const currentUser = await db.user.findUnique({ where: { id: session.userId } });
  if (!currentUser) return apiError(404, 'User not found.');

  const usernameChanged = username.trim() !== currentUser.username;

  if (usernameChanged) {
    const conflict = await db.user.findUnique({ where: { username: username.trim() } });
    if (conflict) return apiError(409, 'Username is already taken.');
  }

  const updated = await db.user.update({
    where: { id: session.userId },
    data: {
      username: username.trim(),
      displayName: displayName?.trim() || null,
      bio: bio?.trim() || null,
      avatarUrl: avatarUrl?.trim() || null,
    },
  });

  return NextResponse.json({
    username: updated.username,
    displayName: updated.displayName,
    bio: updated.bio,
    avatarUrl: updated.avatarUrl,
    usernameChanged,
  });
}
