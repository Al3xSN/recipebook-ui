import { db } from '@/lib/db';

/** Canonical ordering: userAId < userBId (lexicographic) */
export function orderedPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export async function areFriends(userAId: string, userBId: string): Promise<boolean> {
  const [a, b] = orderedPair(userAId, userBId);
  const f = await db.friendship.findUnique({
    where: { userAId_userBId: { userAId: a, userBId: b } },
  });
  return f !== null;
}

export async function removeFriendship(userAId: string, userBId: string): Promise<void> {
  const [a, b] = orderedPair(userAId, userBId);
  await db.friendship.deleteMany({ where: { userAId: a, userBId: b } });
}

export async function createFriendship(userAId: string, userBId: string): Promise<void> {
  const [a, b] = orderedPair(userAId, userBId);
  await db.friendship.create({ data: { userAId: a, userBId: b } });
}
