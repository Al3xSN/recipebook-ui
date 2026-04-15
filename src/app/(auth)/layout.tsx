import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Navbar } from '@/components/layout/Navbar';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session) redirect('/recipes');

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
