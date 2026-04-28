'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { markNotificationRead, markAllNotificationsRead } from '@/lib/server/notifications';

const getSession = async () => {
  const session = await auth();

  if (!session?.user?.id) throw new Error('Unauthorized');
  return session;
};

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
