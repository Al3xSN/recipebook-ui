'use server';

import { auth, signOut } from '@/auth';
import {
  getUserById,
  updateUserProfile,
  updateUserPassword,
  UserConflictError,
} from '@/lib/server/user';
import { uploadUserAvatar, AvatarValidationError } from '@/lib/server/user/avatar';
import { IUpdateProfileInfoRequest } from '@/interfaces/IProfile';
import { db } from '@/lib/db';

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

export const uploadAvatar = async (
  formData: FormData,
): Promise<{ data: { url: string } | null; error: string | null }> => {
  const session = await getSession();

  const file = formData.get('avatar');
  if (!(file instanceof File)) return { data: null, error: 'No file provided.' };

  try {
    const { url } = await uploadUserAvatar(session.user.id, file);
    return { data: { url }, error: null };
  } catch (err) {
    if (err instanceof AvatarValidationError) return { data: null, error: err.message };
    throw err;
  }
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

export const deleteAccount = async (): Promise<{ error: string | null }> => {
  const session = await getSession();
  await db.user.delete({ where: { id: session.user.id } });
  await signOut({ redirectTo: '/' });
  return { error: null };
};
