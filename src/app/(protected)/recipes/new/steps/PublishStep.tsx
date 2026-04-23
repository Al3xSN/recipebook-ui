'use client';

import { SpinnerIcon } from '@/components/icons';
import { CATEGORY_LABELS, VISIBILITY_LABELS } from '@/lib/recipe-enums';

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
      {/* Preview card */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg2)' }}>
        <p
          className="mb-2 text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: 'var(--text3)' }}
        >
          Preview
        </p>
        <p className="text-base font-semibold" style={{ color: 'var(--text)' }}>
          {title.trim() || 'Untitled Recipe'}
        </p>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--text2)' }}>
          {meta}
        </p>
        <p className="mt-1 text-xs" style={{ color: 'var(--text3)' }}>
          {ingredientCount} {ingredientCount === 1 ? 'ingredient' : 'ingredients'} · {stepCount}{' '}
          {stepCount === 1 ? 'step' : 'steps'}
        </p>
      </div>

      {/* Visibility */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="visibility"
          className="text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: 'var(--text2)' }}
        >
          Visibility
        </label>
        <select
          id="visibility"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as Visibility)}
          className="w-full rounded-lg border px-3 py-2.5 text-base outline-none transition-colors"
          style={{ borderColor: 'var(--border)', backgroundColor: 'white', color: 'var(--text)' }}
        >
          {VISIBILITY_OPTIONS.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Info banner */}
      {infoBanner && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: 'var(--bg2)', color: 'var(--text2)' }}
        >
          {infoBanner}
        </div>
      )}

      {/* Error */}
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 rounded-lg border py-3 text-sm font-medium transition-colors hover:opacity-80 disabled:opacity-50"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={isLoading}
          className="flex-[2] inline-flex items-center justify-center rounded-lg py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          {isLoading && <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </div>
  );
};
