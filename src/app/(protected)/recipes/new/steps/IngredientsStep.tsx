'use client';

import { useState } from 'react';
import { UNIT_LABELS } from '@/lib/recipe-enums';
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, XIcon } from '@/components/icons';

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
      <p className="text-sm text-(--text2)">List all ingredients with quantities.</p>

      <div className="flex flex-col gap-2">
        {ingredients.map((ing, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              id={ing.name}
              type="number"
              min="0"
              step="any"
              value={ing.amount}
              onChange={(e) => update(i, 'amount', e.target.value)}
              placeholder="Qty"
              aria-label="Quantity"
              className="w-14 flex-none rounded-lg border border-(--border) bg-white px-2 py-2.5 text-center text-base text-(--text) transition-colors outline-none focus:ring-2"
            />

            <select
              value={ing.unit}
              onChange={(e) => update(i, 'unit', Number(e.target.value))}
              aria-label="Unit"
              className="w-20 flex-none rounded-lg border border-(--border) bg-white px-2 py-2.5 text-base text-(--text) transition-colors outline-none focus:ring-2"
            >
              {Object.entries(UNIT_LABELS).map(([val, lbl]) => (
                <option key={val} value={val}>
                  {lbl}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={ing.name}
              onChange={(e) => update(i, 'name', e.target.value)}
              placeholder="Ingredient name"
              aria-label="Ingredient name"
              className="min-w-0 flex-1 rounded-lg border border-(--border) bg-white px-2 py-2.5 text-base text-(--text) transition-colors outline-none focus:ring-2"
            />

            <button
              type="button"
              onClick={() => remove(i)}
              disabled={ingredients.length === 1}
              aria-label="Remove ingredient"
              className="rounded-lg p-1.5 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <XIcon className="h-5 w-5 stroke-black" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="flex w-fit items-center justify-center gap-1 rounded-lg border border-dashed border-(--border) px-4 py-2 text-sm font-medium text-(--text2) transition-colors hover:opacity-80"
      >
        <PlusIcon />
        <span>Add ingredient</span>
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
          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-(--border) py-3 text-sm font-medium text-(--text) transition-colors hover:opacity-80"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="flex flex-2 items-center justify-center gap-1 rounded-lg bg-(--accent) py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          <span>Continue</span>
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
