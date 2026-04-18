import Link from 'next/link';
import { BookIcon } from '@/components/icons';

interface IHeroSectionProps {
  user: { displayName?: string | null; username: string } | null;
}

export const HeroSection = ({ user }: IHeroSectionProps) => {
  if (user) {
    return (
      <section style={{ background: 'var(--bg)' }} className="px-5 py-10 text-center">
        <h1
          style={{ color: 'var(--text)', fontSize: 30, fontWeight: 700 }}
          className="mb-3 leading-tight"
        >
          Welcome back,{' '}
          <span style={{ color: 'var(--accent)' }}>{user.displayName ?? user.username}</span>
        </h1>
        <p style={{ color: 'var(--text2)' }} className="mb-8 text-sm">
          Pick up where you left off — your collection is waiting.
        </p>
        <Link
          href="/recipes"
          style={{ background: 'var(--accent)', borderRadius: 12 }}
          className="inline-flex w-full max-w-sm items-center justify-center py-3.5 text-sm font-semibold text-white"
        >
          My recipes
        </Link>
      </section>
    );
  }

  return (
    <>
      <div
        style={{ background: 'var(--accent)' }}
        className="flex h-52 flex-col items-center justify-center"
      >
        <div
          style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 18 }}
          className="mb-2.5 flex h-14 w-14 items-center justify-center"
        >
          <BookIcon className="h-8 w-8 text-white" strokeWidth={1.75} />
        </div>
        <span className="text-base font-semibold text-white">RecipeBook</span>
      </div>

      <section style={{ background: 'var(--bg)' }} className="px-5 py-8">
        <h1
          style={{ color: 'var(--text)', fontSize: 30, fontWeight: 700 }}
          className="mb-3 leading-tight"
        >
          Your personal recipe book, elevated.
        </h1>
        <p style={{ color: 'var(--text2)' }} className="mb-7 text-sm leading-relaxed">
          Discover, create, and share recipes with a community of passionate home cooks.
        </p>

        <ul className="mb-8 flex flex-col gap-4">
          <FeatureBullet
            icon={<SearchIcon />}
            text="Thousands of recipes from home cooks worldwide"
          />
          <FeatureBullet icon={<ListIcon />} text="Step-by-step instructions with smart scaling" />
          <FeatureBullet icon={<StarIcon />} text="Rate, review, and save your favourites" />
        </ul>

        <div className="flex flex-col gap-3">
          <Link
            href="/register"
            style={{
              background: 'var(--accent)',
              borderRadius: 12,
              boxShadow: '0 4px 18px color-mix(in oklch, var(--accent) 45%, transparent)',
            }}
            className="flex w-full items-center justify-center py-3.5 text-sm font-semibold text-white transition-transform active:scale-[0.97]"
          >
            Create free account
          </Link>
          <Link
            href="/login"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 12,
              color: 'var(--text)',
              background: 'var(--card)',
            }}
            className="flex w-full items-center justify-center py-3.5 text-sm font-semibold transition-transform active:scale-[0.97]"
          >
            Log in
          </Link>
        </div>
      </section>
    </>
  );
};

const FeatureBullet = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <li className="flex items-center gap-3">
    <div
      style={{ background: 'var(--bg2)', borderRadius: 10, flexShrink: 0 }}
      className="flex h-9 w-9 items-center justify-center"
    >
      {icon}
    </div>
    <span style={{ color: 'var(--text2)' }} className="text-sm leading-snug">
      {text}
    </span>
  </li>
);

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--accent)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ListIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--accent)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </svg>
);

const StarIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="var(--accent)"
    stroke="var(--accent)"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
