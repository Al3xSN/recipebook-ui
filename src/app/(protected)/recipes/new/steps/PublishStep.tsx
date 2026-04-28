'use client';

import { ArrowLeftIcon, SpinnerIcon } from '@/components/icons';
import { CATEGORY_LABELS } from '@/lib/recipe-enums';

type Visibility = 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface PublishStepProps {
  title: string;
  category: number;
  prepTimeMinutes: string;
  cookTimeMinutes: string;
  servings: string;
  difficulty: Difficulty;
  ingredientCount: number;
  stepCount: number;
  visibility: Visibility;
  setVisibility: (v: Visibility) => void;
  onBack: () => void;
  onPublish: () => void;
  isLoading: boolean;
  error: string | null;
  submitLabel?: string;
  infoBanner?: string | null;
}

const DIFFICULTY_DISPLAY: Record<Difficulty, string> = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

const VISIBILITY_OPTIONS: Array<{ key: Visibility; label: string }> = [
  { key: 'PUBLIC', label: 'Public — anyone can find this' },
  { key: 'FRIENDS_ONLY', label: 'Friends only' },
  { key: 'PRIVATE', label: 'Private — only you' },
];

export const PublishStep = ({
  title,
  category,
  prepTimeMinutes,
  cookTimeMinutes,
  servings,
  difficulty,
  ingredientCount,
  stepCount,
  visibility,
  setVisibility,
  onBack,
  onPublish,
  isLoading,
  error,
  submitLabel = 'Publish Recipe',
  infoBanner = '🎉 Your recipe is ready to publish. It will appear in the feed and be discoverable via search.',
}: PublishStepProps) => {
  const categoryLabel = category >= 0 ? (CATEGORY_LABELS[category] ?? '?') : '?';

  const meta = [
    categoryLabel,
    prepTimeMinutes ? `${prepTimeMinutes}min prep` : '?min prep',
    cookTimeMinutes ? `${cookTimeMinutes}min cook` : '?min cook',
    servings ? `${servings} servings` : '? servings',
    DIFFICULTY_DISPLAY[difficulty],
  ].join(' · ');

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl bg-(--bg2) p-4">
        <p className="mb-2 text-[10px] font-semibold tracking-widest text-(--text3) uppercase">
          Preview
        </p>
        <p className="text-base font-semibold text-(--text)">{title.trim() || 'Untitled Recipe'}</p>
        <p className="mt-0.5 text-xs text-(--text2)">{meta}</p>
        <p className="mt-1 text-xs text-(--text3)">
          {ingredientCount} {ingredientCount === 1 ? 'ingredient' : 'ingredients'} · {stepCount}{' '}
          {stepCount === 1 ? 'step' : 'steps'}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="visibility"
          className="text-[10px] font-semibold tracking-widest text-(--text2) uppercase"
        >
          Visibility
        </label>
        <select
          id="visibility"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as Visibility)}
          className="w-full rounded-lg border border-(--border) bg-white px-3 py-2.5 text-base text-(--text) transition-colors outline-none"
        >
          {VISIBILITY_OPTIONS.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {infoBanner && (
        <div className="rounded-xl bg-(--bg2) px-4 py-3 text-sm text-(--text2)">{infoBanner}</div>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex flex-1 items-center justify-center rounded-lg border border-(--border) py-3 text-sm font-medium text-(--text) transition-colors hover:opacity-80 disabled:opacity-50"
        >
          <ArrowLeftIcon className="h-6 w-6" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={isLoading}
          className="inline-flex flex-2 items-center justify-center rounded-lg bg-(--accent) py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading && <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </div>
  );
};
