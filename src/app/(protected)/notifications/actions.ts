'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/server/auth-session';
import { markNotificationRead, markAllNotificationsRead } from '@/lib/server/notifications';

export const markReadAction = async (id: string): Promise<void> => {
  const session = await getSession();
  await markNotificationRead(session.user.id, id);

  revalidatePath('/notifications');
};

export const markAllReadAction = async (): Promise<void> => {
  const session = await getSession();
  await markAllNotificationsRead(session.user.id);

  revalidatePath('/notifications');
};
