import { PrismaClient } from '@generated/prisma/client';
import { NotificationType } from '@generated/prisma/client';

type NotificationWriter = Pick<PrismaClient, 'notification'>;

interface CreateNotificationParams {
  userId: string;
  senderId: string;
  type: NotificationType;
  referenceId?: string;
}

export const createNotification = async (
  tx: NotificationWriter,
  { userId, senderId, type, referenceId }: CreateNotificationParams,
): Promise<void> => {
  await tx.notification.create({
    data: { userId, senderId, type, referenceId: referenceId ?? null },
  });
};

export { NotificationType };
