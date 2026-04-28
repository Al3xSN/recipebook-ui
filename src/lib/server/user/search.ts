import { Prisma } from '@generated/prisma/client';
import { db } from '@/lib/db';
import { IUserDto } from '@/interfaces/IUser';

const toDto = (user: {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}): IUserDto => ({
  id: user.id,
  username: user.username,
  email: user.email,
  displayName: user.displayName,
  bio: user.bio,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt,
});

export const searchUsers = async (query: string, excludeIds: string[]): Promise<IUserDto[]> => {
  const users = await db.user.findMany({
    where: {
      username: { contains: query, mode: Prisma.QueryMode.insensitive },
      id: { notIn: excludeIds },
    },
    take: 20,
  });

  return users.map(toDto);
};

export const getUserSuggestions = async (
  candidateIds: string[],
  excludeIds: string[],
): Promise<IUserDto[]> => {
  const users = await db.user.findMany({
    where: { id: { in: candidateIds, notIn: excludeIds } },
    take: 10,
  });

  return users.map(toDto);
};
