import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/server/password';
import type { IUserDto } from '@/interfaces/IUser';

export class UserConflictError extends Error {
  constructor(public field: 'email' | 'username') {
    super(`${field} already in use`);
    this.name = 'UserConflictError';
  }
}

function toDto(user: {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}): IUserDto {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

export async function getUserByEmail(email: string): Promise<IUserDto | null> {
  const user = await db.user.findUnique({ where: { email } });
  return user ? toDto(user) : null;
}

export async function verifyUserPassword(
  email: string,
  password: string,
): Promise<IUserDto | null> {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await verifyPassword(password, user.passwordHash);
  return valid ? toDto(user) : null;
}
