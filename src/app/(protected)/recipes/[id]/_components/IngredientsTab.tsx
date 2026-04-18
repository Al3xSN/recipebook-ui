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
        <span className="text-sm font-semibold text-gray-800">
          {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''}
        </span>
        <button
          type="button"
          onClick={cycleScale}
          className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 transition-colors hover:border-orange-300 hover:text-orange-600"
        >
          Scale ×{scale}
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {ingredients.map((ing, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-800">{ing.name}</span>
            <span className="text-sm font-medium text-orange-500">
              {Number((ing.amount * scale).toFixed(2)).toString()} {UNIT_LABELS[ing.unit]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
