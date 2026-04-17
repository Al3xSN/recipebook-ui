import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';
import { getUserById, updateUserProfile, UserConflictError } from '@/lib/server/user';

// PUT /api/profile/info
export async function PUT(req: NextRequest) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const body = await req.json().catch(() => null);
  if (!body) return apiError(400, 'Invalid request body.');

  const { username, displayName, bio } = body as {
    username?: string;
    displayName?: string | null;
    bio?: string | null;
  };

  if (!username?.trim()) return apiError(422, 'Username is required.');

  const currentUser = await getUserById(session.userId);
  if (!currentUser) return apiError(404, 'User not found.');

  const usernameChanged = username.trim() !== currentUser.username;

  try {
    const updated = await updateUserProfile(session.userId, {
      username: username.trim(),
      displayName: displayName?.trim() || null,
      bio: bio?.trim() || null,
    });

    return NextResponse.json({
      username: updated.username,
      displayName: updated.displayName,
      bio: updated.bio,
      avatarUrl: updated.avatarUrl,
      usernameChanged,
    });
  } catch (err) {
    if (err instanceof UserConflictError) {
      return apiError(409, 'Username is already taken.');
    }
    throw err;
  }
}
