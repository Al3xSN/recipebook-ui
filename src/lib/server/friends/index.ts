import { db } from '@/lib/db';
import { FriendRequest, FriendRequestStatus } from '@generated/prisma/client';

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

export const getFriendCount = async (userId: string): Promise<number> =>
  db.friendRequest.count({
    where: {
      status: FriendRequestStatus.ACCEPTED,
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
  });

export const getPendingRequest = async (
  userAId: string,
  userBId: string,
): Promise<FriendRequest | null> =>
  db.friendRequest.findFirst({
    where: {
      OR: [
        { senderId: userAId, receiverId: userBId, status: FriendRequestStatus.PENDING },
        { senderId: userBId, receiverId: userAId, status: FriendRequestStatus.PENDING },
      ],
    },
  });

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
