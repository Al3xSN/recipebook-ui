import { db } from '@/lib/db';
import { FriendRequestStatus } from '@generated/prisma/client';

export const areFriends = async (userAId: string, userBId: string): Promise<boolean> => {
  const f = await db.friendRequest.findFirst({
    where: {
      status: FriendRequestStatus.ACCEPTED,
      OR: [
        { senderId: userAId, receiverId: userBId },
        { senderId: userBId, receiverId: userAId },
      ],
    },
  });
  return f !== null;
};

export const removeFriendship = async (userAId: string, userBId: string): Promise<void> => {
  await db.friendRequest.deleteMany({
    where: {
      status: FriendRequestStatus.ACCEPTED,
      OR: [
        { senderId: userAId, receiverId: userBId },
        { senderId: userBId, receiverId: userAId },
      ],
    },
  });
};
