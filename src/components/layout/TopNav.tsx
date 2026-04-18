'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { BookIcon } from '@/components/icons';
import { UserMenu } from '@/components/layout/UserMenu';

interface ITopNavProps {
  user: { displayName?: string | null; username: string };
}

export const TopNav = ({ user }: ITopNavProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  const linkStyle = (href: string): React.CSSProperties => ({
    fontSize: 14,
    fontWeight: 500,
    color: isActive(href) ? 'var(--accent)' : 'var(--text2)',
    textDecoration: 'none',
    transition: 'color 0.15s',
  });

  const handleLogout = async () => {
    await signOut({ redirectTo: '/' });
  };

  return (
    <header
      className="hidden md:block"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          maxWidth: 1024,
          margin: '0 auto',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 32,
        }}
      >
        {/* Logo */}
        <Link
          href="/recipes"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            color: 'var(--text)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              background: 'var(--accent)',
              padding: 6,
              color: 'white',
            }}
          >
            <BookIcon className="h-4 w-4" />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}
          >
            RecipeBook
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1 }}>
          <Link href="/recipes" style={linkStyle('/recipes')}>
            Home
          </Link>
          <Link href="/explore" style={linkStyle('/explore')}>
            Discover
          </Link>
          <Link href="/recipes/new" style={linkStyle('/recipes/new')}>
            Add Recipe
          </Link>
        </nav>

        {/* User menu */}
        <UserMenu
          displayName={user.displayName ?? user.username}
          username={user.username}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};
