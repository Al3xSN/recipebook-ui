'use client';

import { useState } from 'react';
import { UNIT_LABELS } from '@/lib/recipe-enums';

interface IIngredient {
  name: string;
  amount: number;
  unit: number;
}

interface IIngredientsTab {
  ingredients: IIngredient[];
}

export const IngredientsTab = ({ ingredients }: IIngredientsTab) => {
  const [scale, setScale] = useState(1);

  const cycleScale = () => setScale((s) => (s >= 6 ? 1 : s + 1));

  return (
    <div className="px-4 py-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-(--text)">
          {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''}
        </span>
        <button
          type="button"
          onClick={cycleScale}
          className="rounded-full border border-(--border) px-3 py-1 text-sm text-(--text2) transition-colors hover:border-(--accent)/30 hover:text-(--accent)"
        >
          Scale ×{scale}
        </button>
      </div>

      <div className="divide-y divide-(--border)">
        {ingredients.map((ing, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <span className="text-sm text-(--text2)">{ing.name}</span>
            <span className="text-sm font-medium text-orange-500">
              {Number((ing.amount * scale).toFixed(2)).toString()} {UNIT_LABELS[ing.unit]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
