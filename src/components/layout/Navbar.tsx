'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/Button';
import { UserMenu } from '@/components/layout/UserMenu';

// Hardcoded until notifications API is wired up
const hasUnread = true;

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMobileMenuOpen(false);
    router.replace('/');
  }

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
          {/* Left: Brand */}
          <div className="flex flex-1 items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-900 transition-colors hover:text-orange-500"
            >
              <div className="flex items-center justify-center rounded-lg bg-orange-500 p-1.5 text-white">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <span className="text-base font-semibold tracking-tight">RecipeBook</span>
            </Link>
          </div>

          {/* Center: Nav links (desktop) */}
          <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-orange-500"
            >
              Home
            </Link>
            {!isLoading && user && (
              <>
                <Link
                  href="/recipes"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-orange-500"
                >
                  Recipes
                </Link>
                <Link
                  href="/explore"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-orange-500"
                >
                  Explore
                </Link>
                <Link
                  href="/friends"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-orange-500"
                >
                  Friends
                </Link>
              </>
            )}
          </nav>

          {/* Right: Auth + Notifications (desktop) */}
          <div className="flex flex-1 items-center justify-end gap-2">
            {!isLoading && (
              <div className="hidden items-center gap-2 md:flex">
                {user ? (
                  <>
                    {/* Notifications bell */}
                    <Link
                      href="/notifications"
                      className="relative flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      aria-label="Notifications"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.437L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
                      </svg>
                      {hasUnread && (
                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </Link>
                    {user.displayName && (
                      <UserMenu displayName={user.displayName} onLogout={handleLogout} />
                    )}
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => router.push('/login')}>
                      Sign in
                    </Button>
                    <Button variant="primary" onClick={() => router.push('/register')}>
                      Get started
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Hamburger (mobile) */}
            <button
              className="flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 z-30 flex h-screen w-72 flex-col bg-white shadow-xl transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center justify-center rounded-lg bg-orange-500 p-1.5 text-white">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight">RecipeBook</span>
          </Link>
          <button
            className="flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 py-4">
          <Link
            href="/"
            className="flex w-full items-center rounded-lg px-3 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          {!isLoading && user && (
            <>
              <Link
                href="/recipes"
                className="flex w-full items-center rounded-lg px-3 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Recipes
              </Link>
              <Link
                href="/explore"
                className="flex w-full items-center rounded-lg px-3 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                href="/friends"
                className="flex w-full items-center rounded-lg px-3 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Friends
              </Link>
              <Link
                href="/notifications"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.437L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
                  </svg>
                  {hasUnread && (
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </span>
                Notifications
              </Link>
              <Link
                href="/profile/me"
                className="flex w-full items-center rounded-lg px-3 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </>
          )}
        </nav>

        {/* Auth section */}
        {!isLoading && (
          <div className="border-t border-gray-200 px-4 py-4">
            {user ? (
              <Button variant="secondary" onClick={handleLogout}>
                Sign out
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push('/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign in
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    router.push('/register');
                    setMobileMenuOpen(false);
                  }}
                >
                  Get started
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
