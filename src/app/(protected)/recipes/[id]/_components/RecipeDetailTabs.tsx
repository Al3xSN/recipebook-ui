'use client';

import { useState } from 'react';
import { OverviewTab } from './OverviewTab';
import { IngredientsTab } from './IngredientsTab';
import { StepsTab } from './StepsTab';
import { CommentsTab } from './CommentsTab';

type Tab = 'overview' | 'ingredients' | 'steps' | 'comments';

interface IRecipeData {
  description: string | null;
  tags: number[];
  ingredients: { name: string; amount: number; unit: number }[];
  instructions: { stepNumber: number; text: string }[];
}

interface IRecipeDetailTabs {
  recipe: IRecipeData;
  recipeId: string;
  commentCount: number;
  isOwner: boolean;
}

export const RecipeDetailTabs = ({
  recipe,
  recipeId,
  commentCount,
  isOwner,
}: IRecipeDetailTabs) => {
  const [active, setActive] = useState<Tab>('overview');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'ingredients', label: 'Ingredients' },
    { key: 'steps', label: 'Steps' },
    { key: 'comments', label: `Comments (${commentCount})` },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-gray-200">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={`flex-1 py-3 text-xs font-medium transition-colors sm:text-sm ${
              active === key
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {active === 'overview' && <OverviewTab description={recipe.description} tags={recipe.tags} />}
      {active === 'ingredients' && <IngredientsTab ingredients={recipe.ingredients} />}
      {active === 'steps' && <StepsTab steps={recipe.instructions} />}
      {active === 'comments' && <CommentsTab recipeId={recipeId} isOwner={isOwner} />}
    </div>
  );
};
