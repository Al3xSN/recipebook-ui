import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

import { db } from '@/lib/db';
import { requireAuth } from '@/lib/server/require-auth';
import { apiError } from '@/lib/server/api-error';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (session instanceof Response) return session;

  const formData = await req.formData().catch(() => null);
  if (!formData) return apiError(400, 'Invalid form data.');

  const file = formData.get('avatar');
  if (!(file instanceof File)) return apiError(422, 'No file provided.');
  if (!ALLOWED_TYPES.includes(file.type))
    return apiError(422, 'Only JPEG, PNG, and WebP images are supported.');
  if (file.size > MAX_BYTES) return apiError(422, 'File must be 2 MB or smaller.');

  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) return apiError(404, 'User not found.');

  const blob = await put(`avatars/${session.userId}`, file, {
    access: 'public',
    contentType: file.type,
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  await db.user.update({
    where: { id: session.userId },
    data: { avatarUrl: blob.url },
  });

  return NextResponse.json({ avatarUrl: blob.url });
}
