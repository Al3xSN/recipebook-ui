'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { getUserByUsername } from '@/lib/server/user';
import { areFriends, removeFriendship } from '@/lib/server/friends';
import { createNotification, NotificationType } from '@/lib/server/notifications';
import { FriendRequestStatus } from '@generated/prisma/client';

const getSession = async () => {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session;
};

export const sendFriendRequest = async (
  receiverUsername: string,
): Promise<{ error: string | null }> => {
  const session = await getSession();

  const receiver = await getUserByUsername(receiverUsername);
  if (!receiver) return { error: 'User not found.' };
  if (receiver.id === session.user.id) return { error: 'Cannot send a request to yourself.' };

  if (await areFriends(session.user.id, receiver.id)) return { error: 'Already friends.' };

  await db.friendRequest.deleteMany({
    where: {
      senderId: session.user.id,
      receiverId: receiver.id,
      status: FriendRequestStatus.REJECTED,
    },
  });

  const existing = await db.friendRequest.findFirst({
    where: {
      OR: [
        { senderId: session.user.id, receiverId: receiver.id },
        { senderId: receiver.id, receiverId: session.user.id },
      ],
      status: FriendRequestStatus.PENDING,
    },
  });
  if (existing) return { error: 'A pending request already exists.' };

  await db.$transaction(async (tx) => {
    const r = await tx.friendRequest.create({
      data: { senderId: session.user.id, receiverId: receiver.id },
    });
    await createNotification(tx, {
      userId: receiver.id,
      senderId: session.user.id,
      type: NotificationType.FRIEND_REQUEST,
      referenceId: r.id,
    });
  });

  return { error: null };
};

export const removeFriend = async (friendUserId: string): Promise<{ error: string | null }> => {
  const session = await getSession();

  if (!(await areFriends(session.user.id, friendUserId)))
    return { error: 'Not friends with this user.' };

  await removeFriendship(session.user.id, friendUserId);
  return { error: null };
};
