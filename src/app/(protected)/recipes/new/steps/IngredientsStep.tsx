'use client';

import { useState } from 'react';
import { UNIT_LABELS } from '@/lib/recipe-enums';

interface Ingredient {
  name: string;
  amount: string;
  unit: number;
}

interface IngredientsStepProps {
  ingredients: Ingredient[];
  setIngredients: (v: Ingredient[]) => void;
  onBack: () => void;
  onContinue: () => void;
}

const inputClass =
  'rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2';
const inputStyle = { borderColor: 'var(--border)', backgroundColor: 'white', color: 'var(--text)' };

export const IngredientsStep = ({
  ingredients,
  setIngredients,
  onBack,
  onContinue,
}: IngredientsStepProps) => {
  const [error, setError] = useState<string | null>(null);

  const add = () => setIngredients([...ingredients, { name: '', amount: '', unit: 0 }]);

  const remove = (i: number) => setIngredients(ingredients.filter((_, idx) => idx !== i));

  const update = (i: number, field: keyof Ingredient, value: string | number) =>
    setIngredients(ingredients.map((ing, idx) => (idx === i ? { ...ing, [field]: value } : ing)));

  const handleContinue = () => {
    if (ingredients.some((ing) => !ing.name.trim())) {
      setError('Each ingredient must have a name.');
      return;
    }
    setError(null);
    onContinue();
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm" style={{ color: 'var(--text2)' }}>
        List all ingredients with quantities.
      </p>

      <div className="flex flex-col gap-2">
        {ingredients.map((ing, i) => (
          <div key={i} className="flex items-center gap-2">
            {/* Qty */}
            <input
              type="number"
              min="0"
              step="any"
              value={ing.amount}
              onChange={(e) => update(i, 'amount', e.target.value)}
              placeholder="Qty"
              aria-label="Quantity"
              className={`${inputClass} w-16 text-center`}
              style={inputStyle}
            />
            {/* Unit */}
            <select
              value={ing.unit}
              onChange={(e) => update(i, 'unit', Number(e.target.value))}
              aria-label="Unit"
              className={`${inputClass} w-20`}
              style={inputStyle}
            >
              {Object.entries(UNIT_LABELS).map(([val, lbl]) => (
                <option key={val} value={val}>
                  {lbl}
                </option>
              ))}
            </select>
            {/* Name */}
            <input
              type="text"
              value={ing.name}
              onChange={(e) => update(i, 'name', e.target.value)}
              placeholder="Ingredient name"
              aria-label="Ingredient name"
              className={`${inputClass} flex-1`}
              style={inputStyle}
            />
            {/* Remove */}
            <button
              type="button"
              onClick={() => remove(i)}
              disabled={ingredients.length === 1}
              aria-label="Remove ingredient"
              className="rounded-lg p-1.5 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
              style={{ color: 'var(--text3)' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="w-fit rounded-lg border border-dashed px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
        style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
      >
        + Add ingredient
      </button>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-lg border py-3 text-sm font-medium transition-colors hover:opacity-80"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="flex-[2] rounded-lg py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};
