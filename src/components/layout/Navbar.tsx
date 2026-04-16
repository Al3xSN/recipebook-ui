import { auth } from '@/auth';
import { NavbarClient } from '@/components/layout/NavbarClient';

export async function Navbar() {
  const session = await auth();
  const user = session?.user ?? null;

  return <NavbarClient user={user} />;
}
