import { db } from '@/lib/db';
import { verifyPassword, hashPassword } from '@/lib/server/user/password';
import { IUserDto, ICreateUserData, IUpdateUserProfileData } from '@/interfaces/IUser';
import { toUserDto } from './mapper';

export { searchUsers, getUserSuggestions } from './search';

export class UserConflictError extends Error {
  constructor(public field: 'email' | 'username') {
    super(`${field} already in use`);
    this.name = 'UserConflictError';
  }
}

export const getUserById = async (id: string): Promise<IUserDto | null> => {
  const user = await db.user.findUnique({ where: { id } });
  return user ? toUserDto(user) : null;
};

export const getUserByUsername = async (username: string): Promise<IUserDto | null> => {
  const user = await db.user.findUnique({ where: { username } });
  return user ? toUserDto(user) : null;
};

export const getUserByEmail = async (email: string): Promise<IUserDto | null> => {
  const user = await db.user.findUnique({ where: { email } });
  return user ? toUserDto(user) : null;
};

export const verifyUserPassword = async (
  email: string,
  password: string,
): Promise<IUserDto | null> => {
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return null;
  }

  const valid = await verifyPassword(password, user.passwordHash);

  return valid ? toUserDto(user) : null;
};

export const createUser = async (data: ICreateUserData): Promise<IUserDto> => {
  const existing = await db.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existing) {
    throw new UserConflictError(existing.email === data.email ? 'email' : 'username');
  }

  const user = await db.user.create({ data });

  return toUserDto(user);
};

export const updateUserProfile = async (
  id: string,
  data: IUpdateUserProfileData,
): Promise<IUserDto> => {
  if (data.username) {
    const conflict = await db.user.findFirst({
      where: { username: data.username, NOT: { id } },
    });

    if (conflict) {
      throw new UserConflictError('username');
    }
  }

  const user = await db.user.update({ where: { id }, data });

  return toUserDto(user);
};

export const updateUserAvatar = async (id: string, avatarUrl: string): Promise<void> => {
  await db.user.update({ where: { id }, data: { avatarUrl } });
};

export const updateUserPassword = async (
  id: string,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> => {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    return false;
  }

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    return false;
  }

  const passwordHash = await hashPassword(newPassword);

  await db.user.update({ where: { id }, data: { passwordHash } });

  return true;
};
