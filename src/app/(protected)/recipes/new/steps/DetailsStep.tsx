'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { CATEGORY_LABELS, TAG_LABELS, DIFFICULTY_LABELS } from '@/lib/recipe-enums';
import { ArrowRightIcon } from '@/components/icons';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface DetailsStepProps {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  category: number;
  setCategory: (v: number) => void;
  tags: number[];
  setTags: (v: number[]) => void;
  difficulty: Difficulty;
  setDifficulty: (v: Difficulty) => void;
  prepTimeMinutes: string;
  setPrepTimeMinutes: (v: string) => void;
  cookTimeMinutes: string;
  setCookTimeMinutes: (v: string) => void;
  servings: string;
  setServings: (v: string) => void;
  pendingImagePreview: string | null;
  onImageSelect: (file: File, preview: string) => void;
  onImageRemove: () => void;
  onContinue: () => void;
}

const DIFFICULTIES: Array<{ key: Difficulty; label: string }> = [
  { key: 'EASY', label: DIFFICULTY_LABELS['EASY'] ?? 'Easy' },
  { key: 'MEDIUM', label: DIFFICULTY_LABELS['MEDIUM'] ?? 'Medium' },
  { key: 'HARD', label: DIFFICULTY_LABELS['HARD'] ?? 'Hard' },
];

export const DetailsStep = ({
  title,
  description,
  category,
  tags,
  difficulty,
  prepTimeMinutes,
  cookTimeMinutes,
  servings,
  pendingImagePreview,
  setTitle,
  setDescription,
  setCategory,
  setTags,
  setDifficulty,
  setPrepTimeMinutes,
  setCookTimeMinutes,
  setServings,
  onImageSelect,
  onImageRemove,
  onContinue,
}: DetailsStepProps) => {
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: number) => {
    setTags(tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]);
  };

  const handleContinue = () => {
    if (!title.trim()) {
      setError('Recipe title is required.');
      return;
    }
    if (category === -1) {
      setError('Please select a category.');
      return;
    }
    setError(null);
    onContinue();
  };

  return (
    <div className="flex flex-col gap-5">
      <ImageUpload
        currentImageUrl={pendingImagePreview}
        shape="rectangle"
        onFileSelect={onImageSelect}
        onRemove={onImageRemove}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="title"
          className="text-[10px] font-semibold tracking-widest text-(--text2) uppercase"
        >
          Recipe Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Roasted Tomato Pasta"
          className="w-full rounded-lg border border-(--border) bg-white px-3 py-2.5 text-(--text) transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="category"
          className="text-[10px] font-semibold tracking-widest text-(--text2) uppercase"
        >
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(Number(e.target.value))}
          className="w-full rounded-lg border border-(--border) bg-white px-3 py-2.5 text-base text-(--text) transition-colors outline-none focus:ring-2"
        >
          <option value={-1} disabled>
            Select a category…
          </option>
          {Object.entries(CATEGORY_LABELS).map(([val, lbl]) => (
            <option key={val} value={val}>
              {lbl}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="text-[10px] font-semibold tracking-widest text-(--text2) uppercase"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="A short description of your recipe…"
          className="w-full resize-none rounded-lg border border-(--border) bg-white px-3 py-2.5 text-base text-(--text) transition-colors outline-none focus:ring-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="cookTime"
            className="text-[10px] font-semibold tracking-widest text-(--text2) uppercase"
          >
            Cook Time (min)
          </label>
          <input
            id="cookTime"
            type="number"
            min="0"
            value={cookTimeMinutes}
            onChange={(e) => setCookTimeMinutes(e.target.value)}
            placeholder="45"
            className="w-full rounded-lg border border-(--border) bg-white px-3 py-2.5 text-base text-(--text) transition-colors outline-none focus:ring-2"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="servings"
            className="text-[10px] font-semibold tracking-widest text-(--text2) uppercase"
          >
            Servings
          </label>
          <input
            id="servings"
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder="4"
            className="w-full rounded-lg border border-(--border) bg-white px-3 py-2.5 text-base text-(--text) transition-colors outline-none focus:ring-2"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="prepTime"
          className="text-[10px] font-semibold tracking-widest text-(--text2) uppercase"
        >
          Prep Time (min)
        </label>
        <input
          id="prepTime"
          type="number"
          min="0"
          value={prepTimeMinutes}
          onChange={(e) => setPrepTimeMinutes(e.target.value)}
          placeholder="15"
          className="w-full rounded-lg border border-(--border) bg-white px-3 py-2.5 text-base text-(--text) transition-colors outline-none focus:ring-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold tracking-widest text-(--text2) uppercase">
          Difficulty
        </span>
        <div className="flex gap-2">
          {DIFFICULTIES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setDifficulty(key)}
              className="flex-1 rounded-lg py-2 text-sm font-medium transition-colors"
              style={
                difficulty === key
                  ? { backgroundColor: 'var(--accent)', color: 'white' }
                  : {
                      border: '1px solid var(--border)',
                      color: 'var(--text2)',
                      backgroundColor: 'transparent',
                    }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold tracking-widest text-(--text2) uppercase">
          Tags
        </span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TAG_LABELS).map(([val, lbl]) => {
            const tagNum = Number(val);
            const active = tags.includes(tagNum);
            return (
              <button
                key={val}
                type="button"
                onClick={() => toggleTag(tagNum)}
                className="rounded-full px-3 py-1 text-sm font-medium transition-colors"
                style={
                  active
                    ? { backgroundColor: 'var(--accent)', color: 'white' }
                    : {
                        border: '1px solid var(--border)',
                        color: 'var(--text2)',
                        backgroundColor: 'transparent',
                      }
                }
              >
                {lbl}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleContinue}
        className="flex w-full items-center justify-center gap-1 rounded-lg bg-(--accent) py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
      >
        <span>Continue</span>
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
};
