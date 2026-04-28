import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { BottomNav } from '@/components/layout/BottomNav';

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session) redirect('/');

  const user = session.user as { displayName?: string | null; username: string };

  return (
    <div className="min-h-dvh bg-(--bg)">
      <main className="pb-(--nav-h)">{children}</main>
      <BottomNav username={user.username} />
    </div>
  );
};

export default ProtectedLayout;
