'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { CATEGORY_LABELS, TAG_LABELS, DIFFICULTY_LABELS } from '@/lib/recipe-enums';

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

const inputClass =
  'w-full rounded-lg border px-3 py-2.5 text-base outline-none transition-colors focus:ring-2';
const inputStyle = {
  borderColor: 'var(--border)',
  backgroundColor: 'white',
  color: 'var(--text)',
};
const focusAccentStyle = {
  '--tw-ring-color': 'color-mix(in srgb, var(--accent) 20%, transparent)',
} as React.CSSProperties;

const labelClass = 'text-[10px] font-semibold tracking-widest uppercase';
const labelStyle = { color: 'var(--text2)' };

const DIFFICULTIES: Array<{ key: Difficulty; label: string }> = [
  { key: 'EASY', label: DIFFICULTY_LABELS['EASY'] ?? 'Easy' },
  { key: 'MEDIUM', label: DIFFICULTY_LABELS['MEDIUM'] ?? 'Medium' },
  { key: 'HARD', label: DIFFICULTY_LABELS['HARD'] ?? 'Hard' },
];

export const DetailsStep = ({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  tags,
  setTags,
  difficulty,
  setDifficulty,
  prepTimeMinutes,
  setPrepTimeMinutes,
  cookTimeMinutes,
  setCookTimeMinutes,
  servings,
  setServings,
  pendingImagePreview,
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
      {/* Cover photo */}
      <ImageUpload
        currentImageUrl={pendingImagePreview}
        shape="rectangle"
        onFileSelect={onImageSelect}
        onRemove={onImageRemove}
      />

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className={labelClass} style={labelStyle}>
          Recipe Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Roasted Tomato Pasta"
          className={inputClass}
          style={{ ...inputStyle, ...focusAccentStyle }}
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="category" className={labelClass} style={labelStyle}>
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(Number(e.target.value))}
          className={inputClass}
          style={inputStyle}
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

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className={labelClass} style={labelStyle}>
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="A short description of your recipe…"
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>

      {/* Cook Time & Servings */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cookTime" className={labelClass} style={labelStyle}>
            Cook Time (min)
          </label>
          <input
            id="cookTime"
            type="number"
            min="0"
            value={cookTimeMinutes}
            onChange={(e) => setCookTimeMinutes(e.target.value)}
            placeholder="45"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="servings" className={labelClass} style={labelStyle}>
            Servings
          </label>
          <input
            id="servings"
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder="4"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Prep Time */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="prepTime" className={labelClass} style={labelStyle}>
          Prep Time (min)
        </label>
        <input
          id="prepTime"
          type="number"
          min="0"
          value={prepTimeMinutes}
          onChange={(e) => setPrepTimeMinutes(e.target.value)}
          placeholder="15"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Difficulty */}
      <div className="flex flex-col gap-2">
        <span className={labelClass} style={labelStyle}>
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

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <span className={labelClass} style={labelStyle}>
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

      {/* Error */}
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Continue */}
      <button
        type="button"
        onClick={handleContinue}
        className="w-full rounded-lg py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        Continue →
      </button>
    </div>
  );
};
