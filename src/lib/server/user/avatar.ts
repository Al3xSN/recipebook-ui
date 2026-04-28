import { put, del } from '@vercel/blob';
import { getUserById, updateUserAvatar } from '@/lib/server/user';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;

export class AvatarValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AvatarValidationError';
  }
}

export const uploadUserAvatar = async (userId: string, file: File): Promise<{ url: string }> => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new AvatarValidationError('Only JPEG, PNG, and WebP images are supported.');
  }

  if (file.size > MAX_BYTES) {
    throw new AvatarValidationError('File must be 5 MB or smaller.');
  }

  const user = await getUserById(userId);
  if (!user) throw new AvatarValidationError('User not found.');

  if (user.avatarUrl) {
    await del(user.avatarUrl).catch(() => {});
  }

  const blob = await put(`avatars/${userId}`, file, {
    access: 'public',
    contentType: file.type,
    addRandomSuffix: true,
  });

  await updateUserAvatar(userId, blob.url);

  return { url: blob.url };
};
