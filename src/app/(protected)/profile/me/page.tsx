import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function MyProfilePage() {
  const session = await auth();
  if (!session?.user?.username) redirect('/');
  redirect(`/profile/${session.user.username}`);
}
