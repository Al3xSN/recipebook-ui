import { ArrowLeftIcon } from '@/components/icons';
import Link from 'next/link';

export const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-dvh bg-(--bg) p-5">
      <div className="flex items-center">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-(--border) bg-white text-(--text2) transition-colors hover:bg-(--bg2)"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
        </Link>
      </div>

      <div className="mx-auto mt-4 max-w-sm">{children}</div>
    </div>
  );
};
