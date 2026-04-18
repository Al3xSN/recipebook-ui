import Link from 'next/link';
import { BookIcon } from '@/components/icons';

interface IHeroSectionProps {
  user: { displayName?: string | null; username: string } | null;
}

export const HeroSection = ({ user }: IHeroSectionProps) => {
  return (
    <section className="bg-gradient-to-b from-orange-50 to-white px-4 py-10 text-center">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-orange-500 p-4 text-white shadow-lg">
          <BookIcon className="h-10 w-10" strokeWidth={1.75} />
        </div>

        {user ? (
          <>
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900">
              Welcome back,
              <br />
              <span className="text-orange-500">{user.displayName ?? user.username}.</span>
            </h1>
            <p className="mb-10 text-lg text-gray-500">
              Pick up where you left off — your collection is waiting.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/recipes"
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                My recipes
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900">
              Your recipes,
              <br />
              <span className="text-orange-500">all in one place.</span>
            </h1>
            <p className="mb-10 text-lg text-gray-500">
              Discover new dishes, save your favourites, and share them with friends — from a
              single, beautiful collection.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                Get started — it&apos;s free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
