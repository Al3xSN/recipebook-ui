import { Prisma } from '@generated/prisma/client';
import { db } from '@/lib/db';
import { IUserDto } from '@/interfaces/IUser';
import { toUserDto } from './mapper';

export const searchUsers = async (query: string, excludeIds: string[]): Promise<IUserDto[]> => {
  const users = await db.user.findMany({
    where: {
      username: { contains: query, mode: Prisma.QueryMode.insensitive },
      id: { notIn: excludeIds },
    },
    take: 20,
  });

  return users.map(toUserDto);
};

export const getUserSuggestions = async (
  candidateIds: string[],
  excludeIds: string[],
): Promise<IUserDto[]> => {
  const users = await db.user.findMany({
    where: { id: { in: candidateIds, notIn: excludeIds } },
    take: 10,
  });

  return users.map(toUserDto);
};
