import Link from 'next/link';
import type { IRecipeDto } from '@/interfaces/IRecipe';
import { RecipeListCard } from '@/app/(protected)/recipes/_components/RecipeListCard';

interface IRecipesTabProps {
  recipes: IRecipeDto[];
  isOwner: boolean;
  currentUserId?: string;
}

export const RecipesTab = ({ recipes, isOwner }: IRecipesTabProps) => {
  if (recipes.length > 0) {
    return (
      <div className="flex flex-col gap-3">
        {recipes.map((recipe) => (
          <RecipeListCard key={recipe.id} recipe={recipe} showVisibility={isOwner} />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] py-20 text-center">
      <p className="text-sm text-[var(--text3)]">
        {isOwner ? 'No recipes yet. Add your first recipe!' : 'No recipes to show.'}
      </p>
      {isOwner && (
        <Link
          href="/recipes/new"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:opacity-90"
        >
          Add recipe
        </Link>
      )}
    </div>
  );
};
