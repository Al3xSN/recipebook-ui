'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Brand */}
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

        {/* Right side */}
        {!isLoading && (
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {user.displayName && (
                  <span className="hidden text-sm text-gray-500 sm:block">{user.displayName}</span>
                )}
                <Button variant="ghost" onClick={handleLogout}>
                  Sign out
                </Button>
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
      </div>
    </header>
  );
}
