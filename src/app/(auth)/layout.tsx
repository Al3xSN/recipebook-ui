import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Navbar } from '@/components/layout/Navbar';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (session) redirect('/recipes');

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default AuthLayout;
