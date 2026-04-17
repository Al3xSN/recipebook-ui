import { auth } from '@/auth';
import { NavbarClient } from '@/components/layout/NavbarClient';

export const Navbar = async () => {
  const session = await auth();
  const user = session?.user ?? null;

  return <NavbarClient user={user} />;
};
