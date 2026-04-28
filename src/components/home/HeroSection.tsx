import Link from 'next/link';
import { LogoEditorial } from '@/components/ui/LogoMark';
import { SearchIcon } from '../icons/SearchIcon';
import { ListIcon } from '../icons/ListIcon';
import { StarIcon } from '../icons';

export const HeroSection = () => (
  <>
    <div className="relative flex h-64 flex-col items-center justify-center bg-[url('/heroimage.png')] bg-cover bg-center">
      <div className="absolute inset-0 [background:var(--gradient-hero-overlay)]" />
      <div className="relative z-10">
        <LogoEditorial />
      </div>
    </div>

    <section className="bg-(--bg) px-5 py-8">
      <h1 className="mb-3 text-3xl leading-tight font-bold text-(--text)">
        Your personal recipe book, elevated.
      </h1>
      <p className="mb-7 text-sm leading-relaxed text-(--text2)">
        Discover, create, and share recipes with a community of passionate home cooks.
      </p>

      <ul className="mb-8 flex flex-col gap-4">
        <FeatureBullet
          icon={<SearchIcon />}
          text="Thousands of recipes from home cooks worldwide"
        />
        <FeatureBullet icon={<ListIcon />} text="Step-by-step instructions with smart scaling" />
        <FeatureBullet
          icon={<StarIcon className="fill-(--accent) stroke-(--accent)" />}
          text="Rate, review, and save your favourites"
        />
      </ul>

      <div className="flex flex-col gap-3">
        <Link
          href="/register"
          className="flex w-full items-center justify-center rounded-xl bg-(--accent) py-3.5 text-sm font-semibold text-white shadow-(--shadow-accent) transition-transform active:scale-[0.97]"
        >
          Create free account
        </Link>
        <Link
          href="/login"
          className="flex w-full items-center justify-center rounded-xl border border-solid border-(--border) bg-(--card) py-3.5 text-sm font-semibold text-(--text) transition-transform active:scale-[0.97]"
        >
          Log in
        </Link>
      </div>
    </section>
  </>
);

const FeatureBullet = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <li className="flex items-center gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--bg2)">
      {icon}
    </div>
    <span className="text-sm leading-snug text-(--text2)">{text}</span>
  </li>
);
