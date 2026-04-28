import { PrismaClient, NotificationType } from '@generated/prisma/client';
import { db } from '@/lib/db';

type NotificationWriter = Pick<PrismaClient, 'notification'>;

interface CreateNotificationParams {
  userId: string;
  senderId: string;
  type: NotificationType;
  referenceId?: string;
}

export interface INotificationDto {
  id: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  referenceId: string | null;
  senderId: string;
  senderUsername: string;
  senderDisplayName: string | null;
}

export const createNotification = async (
  tx: NotificationWriter,
  { userId, senderId, type, referenceId }: CreateNotificationParams,
): Promise<void> => {
  await tx.notification.create({
    data: { userId, senderId, type, referenceId: referenceId ?? null },
  });
};

export const getNotifications = async (userId: string): Promise<INotificationDto[]> => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const notifications = await db.notification.findMany({
    where: {
      userId,
      OR: [{ read: false }, { createdAt: { gte: sevenDaysAgo } }],
    },
    select: {
      id: true,
      type: true,
      read: true,
      createdAt: true,
      referenceId: true,
      senderId: true,
      sender: { select: { username: true, displayName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return notifications.map((n) => ({
    id: n.id,
    type: n.type,
    read: n.read,
    createdAt: n.createdAt.toISOString(),
    referenceId: n.referenceId,
    senderId: n.senderId,
    senderUsername: n.sender.username,
    senderDisplayName: n.sender.displayName,
  }));
};

export const markNotificationRead = async (userId: string, id: string): Promise<void> => {
  const notification = await db.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== userId) return;
  await db.notification.update({ where: { id }, data: { read: true } });
};

export const markAllNotificationsRead = async (userId: string): Promise<void> => {
  await db.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
};

export { NotificationType };
