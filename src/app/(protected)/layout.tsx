import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { BottomNav } from '@/components/layout/BottomNav';

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session) redirect('/');

  const user = session.user as { displayName?: string | null; username: string };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
      <main className="pb-[calc(var(--nav-h)+env(safe-area-inset-bottom,0px)+8px)]">
        {children}
      </main>
      <BottomNav username={user.username} />
    </div>
  );
};

export default ProtectedLayout;
