'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface IBottomNavProps {
  username: string;
}

export const BottomNav = ({ username }: IBottomNavProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  const tabColor = (href: string) => (isActive(href) ? 'var(--accent)' : 'var(--text3)');

  return (
    <nav
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'calc(var(--nav-h) + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'var(--card)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'flex-start',
        zIndex: 100,
      }}
    >
      {/* Home */}
      <Link
        href="/recipes"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 12,
          gap: 4,
          color: tabColor('/recipes'),
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.04em',
          textDecoration: 'none',
          transition: 'color 0.18s',
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
        >
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1z" />
          <polyline points="9,21 9,13 15,13 15,21" />
        </svg>
        Home
      </Link>

      {/* Discover */}
      <Link
        href="/explore"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 12,
          gap: 4,
          color: tabColor('/explore'),
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.04em',
          textDecoration: 'none',
          transition: 'color 0.18s',
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        Discover
      </Link>

      {/* Add FAB */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 6,
        }}
      >
        <Link
          href="/recipes/new"
          style={{
            width: 50,
            height: 50,
            background: 'var(--accent)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 18px color-mix(in oklch, var(--accent) 45%, transparent)',
            textDecoration: 'none',
            transition: 'transform 0.18s',
          }}
          aria-label="Add recipe"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.4"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Link>
      </div>

      {/* Profile */}
      <Link
        href={`/profile/${username}`}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 12,
          gap: 4,
          color: tabColor(`/profile/${username}`),
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.04em',
          textDecoration: 'none',
          transition: 'color 0.18s',
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
        >
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Profile
      </Link>
    </nav>
  );
};
