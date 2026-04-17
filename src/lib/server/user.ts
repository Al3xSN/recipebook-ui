import { Prisma } from '@generated/prisma/client';
import { db } from '@/lib/db';
import { verifyPassword, hashPassword } from '@/lib/server/password';
import type { IUserDto, ICreateUserData, IUpdateUserProfileData } from '@/interfaces/IUser';

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

export async function getUserById(id: string): Promise<IUserDto | null> {
  const user = await db.user.findUnique({ where: { id } });
  return user ? toDto(user) : null;
}

export async function getUserByUsername(username: string): Promise<IUserDto | null> {
  const user = await db.user.findUnique({ where: { username } });
  return user ? toDto(user) : null;
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

export async function createUser(data: ICreateUserData): Promise<IUserDto> {
  const existing = await db.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });
  if (existing) {
    throw new UserConflictError(existing.email === data.email ? 'email' : 'username');
  }
  const user = await db.user.create({ data });
  return toDto(user);
}

export async function updateUserProfile(
  id: string,
  data: IUpdateUserProfileData,
): Promise<IUserDto> {
  if (data.username) {
    const conflict = await db.user.findFirst({
      where: { username: data.username, NOT: { id } },
    });
    if (conflict) throw new UserConflictError('username');
  }
  const user = await db.user.update({ where: { id }, data });
  return toDto(user);
}

export async function updateUserAvatar(id: string, avatarUrl: string): Promise<void> {
  await db.user.update({ where: { id }, data: { avatarUrl } });
}

export async function updateUserPassword(
  id: string,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return false;
  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return false;
  const passwordHash = await hashPassword(newPassword);
  await db.user.update({ where: { id }, data: { passwordHash } });
  return true;
}

export async function searchUsers(query: string, excludeIds: string[]): Promise<IUserDto[]> {
  const users = await db.user.findMany({
    where: {
      username: { contains: query, mode: Prisma.QueryMode.insensitive },
      id: { notIn: excludeIds },
    },
    take: 20,
  });
  return users.map(toDto);
}

export async function getUserSuggestions(
  candidateIds: string[],
  excludeIds: string[],
): Promise<IUserDto[]> {
  const users = await db.user.findMany({
    where: { id: { in: candidateIds, notIn: excludeIds } },
    take: 10,
  });
  return users.map(toDto);
}
