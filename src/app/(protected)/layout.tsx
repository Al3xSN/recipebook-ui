import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Navbar } from '@/components/layout/Navbar';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
