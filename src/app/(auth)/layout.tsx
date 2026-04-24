import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AuthContainer } from './_components/AuthContainer';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (session) redirect('/recipes');

  return <AuthContainer>{children}</AuthContainer>;
};

export default AuthLayout;
