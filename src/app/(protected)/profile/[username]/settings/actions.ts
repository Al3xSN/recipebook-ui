'use server';

import { put, del } from '@vercel/blob';
import { auth } from '@/auth';
import {
  getUserById,
  updateUserAvatar,
  updateUserProfile,
  updateUserPassword,
  UserConflictError,
} from '@/lib/server/user';
import { IUpdateProfileInfoRequest } from '@/interfaces/IProfile';

const getSession = async () => {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session;
};

export const updateProfileInfo = async (
  data: IUpdateProfileInfoRequest,
): Promise<{
  data: { username: string; displayName: string | null; usernameChanged: boolean } | null;
  error: string | null;
}> => {
  const session = await getSession();

  if (!data.username?.trim()) return { data: null, error: 'Username is required.' };

  const currentUser = await getUserById(session.user.id);
  if (!currentUser) return { data: null, error: 'User not found.' };

  const usernameChanged = data.username.trim() !== currentUser.username;

  try {
    const updated = await updateUserProfile(session.user.id, {
      username: data.username.trim(),
      displayName: data.displayName?.trim() || null,
      bio: data.bio?.trim() || null,
    });

    return {
      data: { username: updated.username, displayName: updated.displayName, usernameChanged },
      error: null,
    };
  } catch (err) {
    if (err instanceof UserConflictError)
      return { data: null, error: 'Username is already taken.' };
    throw err;
  }
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;

export const uploadAvatar = async (
  formData: FormData,
): Promise<{ data: { url: string } | null; error: string | null }> => {
  const session = await getSession();

  const file = formData.get('avatar');
  if (!(file instanceof File)) return { data: null, error: 'No file provided.' };
  if (!ALLOWED_TYPES.includes(file.type))
    return { data: null, error: 'Only JPEG, PNG, and WebP images are supported.' };
  if (file.size > MAX_BYTES) return { data: null, error: 'File must be 5 MB or smaller.' };

  const user = await getUserById(session.user.id);
  if (!user) return { data: null, error: 'User not found.' };

  if (user.avatarUrl) {
    await del(user.avatarUrl).catch(() => {});
  }

  const blob = await put(`avatars/${session.user.id}`, file, {
    access: 'public',
    contentType: file.type,
    addRandomSuffix: true,
  });

  await updateUserAvatar(session.user.id, blob.url);

  return { data: { url: blob.url }, error: null };
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ data: null; error: string | null }> => {
  const session = await getSession();

  if (!data.currentPassword || !data.newPassword)
    return { data: null, error: 'Both passwords are required.' };

  const ok = await updateUserPassword(session.user.id, data.currentPassword, data.newPassword);
  if (!ok) return { data: null, error: 'Current password is incorrect.' };

  return { data: null, error: null };
};
