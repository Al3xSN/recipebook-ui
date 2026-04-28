import { db } from '@/lib/db';
import { FriendRequest, FriendRequestStatus } from '@generated/prisma/client';
import {
  IFriendDto,
  IIncomingRequestDto,
  ISentRequestDto,
  IUserSuggestionDto,
} from '@/interfaces/IFriend';
import { getUserSuggestions } from '@/lib/server/user/search';

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

export const getFriends = async (userId: string): Promise<IFriendDto[]> => {
  const accepted = await db.friendRequest.findMany({
    where: {
      status: FriendRequestStatus.ACCEPTED,
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
          _count: { select: { recipes: true } },
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
          _count: { select: { recipes: true } },
        },
      },
    },
  });

  const myFriendIds = accepted.map((f) => (f.senderId === userId ? f.receiverId : f.senderId));

  return Promise.all(
    accepted.map(async (f) => {
      const friend = f.senderId === userId ? f.receiver : f.sender;
      const otherFriendIds = myFriendIds.filter((id) => id !== friend.id);

      const mutualFriendCount =
        otherFriendIds.length === 0
          ? 0
          : await db.friendRequest.count({
              where: {
                status: FriendRequestStatus.ACCEPTED,
                OR: [
                  { senderId: friend.id, receiverId: { in: otherFriendIds } },
                  { receiverId: friend.id, senderId: { in: otherFriendIds } },
                ],
              },
            });

      return {
        userId: friend.id,
        username: friend.username,
        displayName: friend.displayName,
        avatarUrl: friend.avatarUrl,
        bio: friend.bio,
        recipeCount: friend._count.recipes,
        mutualFriendCount,
      };
    }),
  );
};

export const getIncomingRequests = async (userId: string): Promise<IIncomingRequestDto[]> => {
  const requests = await db.friendRequest.findMany({
    where: { receiverId: userId, status: FriendRequestStatus.PENDING },
    include: {
      sender: {
        select: { id: true, username: true, displayName: true, avatarUrl: true, bio: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const myConnections = await db.friendRequest.findMany({
    where: {
      status: FriendRequestStatus.ACCEPTED,
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
  });
  const myFriendIds = myConnections.map((c) => (c.senderId === userId ? c.receiverId : c.senderId));

  return Promise.all(
    requests.map(async (r) => {
      const mutualFriendCount =
        myFriendIds.length === 0
          ? 0
          : await db.friendRequest.count({
              where: {
                status: FriendRequestStatus.ACCEPTED,
                OR: [
                  { senderId: r.sender.id, receiverId: { in: myFriendIds } },
                  { receiverId: r.sender.id, senderId: { in: myFriendIds } },
                ],
              },
            });
      return {
        id: r.id,
        senderId: r.senderId,
        senderUsername: r.sender.username,
        senderDisplayName: r.sender.displayName,
        senderAvatarUrl: r.sender.avatarUrl,
        senderBio: r.sender.bio,
        receiverId: r.receiverId,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
        mutualFriendCount,
      };
    }),
  );
};

export const getSentRequests = async (userId: string): Promise<ISentRequestDto[]> => {
  const requests = await db.friendRequest.findMany({
    where: { senderId: userId, status: FriendRequestStatus.PENDING },
    include: { receiver: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return requests.map((r) => ({
    id: r.id,
    receiverId: r.receiverId,
    receiverUsername: r.receiver.username,
  }));
};

export const getFriendSuggestions = async (userId: string): Promise<IUserSuggestionDto[]> => {
  const connections = await db.friendRequest.findMany({
    where: {
      status: FriendRequestStatus.ACCEPTED,
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
  });
  const friendIds = connections.map((c) => (c.senderId === userId ? c.receiverId : c.senderId));

  if (friendIds.length === 0) return [];

  const secondDegree = await db.friendRequest.findMany({
    where: {
      status: FriendRequestStatus.ACCEPTED,
      OR: [{ senderId: { in: friendIds } }, { receiverId: { in: friendIds } }],
    },
  });

  const candidateIds = new Set<string>();
  for (const c of secondDegree) {
    if (c.senderId !== userId && !friendIds.includes(c.senderId)) candidateIds.add(c.senderId);
    if (c.receiverId !== userId && !friendIds.includes(c.receiverId))
      candidateIds.add(c.receiverId);
  }

  const excludeIds = [userId, ...friendIds];
  const suggestions = await getUserSuggestions([...candidateIds], excludeIds);

  return Promise.all(
    suggestions.map(async (u) => {
      const mutualFriendCount = await db.friendRequest.count({
        where: {
          status: FriendRequestStatus.ACCEPTED,
          OR: [
            { senderId: u.id, receiverId: { in: friendIds } },
            { receiverId: u.id, senderId: { in: friendIds } },
          ],
        },
      });
      return {
        userId: u.id,
        username: u.username,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        bio: u.bio,
        mutualFriendCount,
      };
    }),
  );
};
