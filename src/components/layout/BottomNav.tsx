'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon } from '../icons/HomeIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { UserIcon, UsersIcon } from '../icons';

interface IBottomNavProps {
  username: string;
}

export const BottomNav = ({ username }: IBottomNavProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  const tabColor = (href: string) => (isActive(href) ? '--accent' : '--text3');

  return (
    <nav className="fixed right-0 bottom-0 left-0 flex h-(--nav-h) items-start border-t border-solid border-(--border) bg-(--card)">
      <Link
        href="/recipes"
        className={`flex flex-1 flex-col items-center justify-center gap-1 pt-3 text-[10px] font-medium tracking-wider transition-colors text-(${tabColor('/recipes')})`}
      >
        <HomeIcon className="h-6 w-6" />

        <span>Home</span>
      </Link>

      <Link
        href="/explore"
        className={`flex flex-1 flex-col items-center justify-center gap-1 pt-3 text-[10px] font-medium tracking-wider transition-colors text-(${tabColor('/explore')})`}
      >
        <SearchIcon className="h-6 w-6" />

        <span>Discover</span>
      </Link>

      <div className="flex flex-1 items-center justify-center pt-1.5">
        <Link
          href="/recipes/new"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-(--accent) shadow-(--shadow-accent) transition-all"
          aria-label="Add recipe"
        >
          <PlusIcon className="h-6 w-6 stroke-white" />
        </Link>
      </div>

      <Link
        href="/friends"
        className={`flex flex-1 flex-col items-center justify-center gap-1 pt-3 text-[10px] font-medium tracking-wider transition-colors text-(${tabColor('/friends')})`}
      >
        <UsersIcon className="h-6 w-6" />

        <span>Friends</span>
      </Link>

      <Link
        href={`/profile/${username}`}
        className={`flex flex-1 flex-col items-center justify-center gap-1 pt-3 text-[10px] font-medium tracking-wider transition-colors text-(${tabColor(`/profile`)})`}
      >
        <UserIcon className="h-6 w-6" />

        <span>Profile</span>
      </Link>
    </nav>
  );
};
