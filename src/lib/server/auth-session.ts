import { auth } from '@/auth';

export const getSession = async () => {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session;
};
