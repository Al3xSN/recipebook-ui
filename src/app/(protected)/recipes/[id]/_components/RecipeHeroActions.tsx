'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, HeartIcon } from '@/components/icons';

export const RecipeHeroActions = () => {
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-(--card)/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-(--card)"
        aria-label="Go back"
      >
        <ArrowLeftIcon className="h-5 w-5 text-(--text)" />
      </button>

      <button
        type="button"
        onClick={() => setLiked((v) => !v)}
        className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-(--card)/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-(--card)"
        aria-label="Favourite recipe"
      >
        <HeartIcon
          className={`h-5 w-5 transition-colors ${liked ? 'text-red-500' : 'text-(--text3)'}`}
          fill={liked ? 'currentColor' : 'none'}
        />
      </button>
    </>
  );
};
