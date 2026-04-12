import Link from 'next/link';
import { PLACEHOLDER_RECIPES } from '@/lib/placeholder-data';
import { RecipeCard } from '../../recipes/_components/RecipeCard';
import { PublicProfileHeader } from './_components/PublicProfileHeader';

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  const recipes = PLACEHOLDER_RECIPES.slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PublicProfileHeader username={params.username} />

      <h2 className="mb-4 text-base font-semibold text-gray-900">Recipes</h2>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="block">
              <RecipeCard recipe={recipe} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <p className="text-sm text-gray-500">No recipes to show.</p>
        </div>
      )}
    </div>
  );
}
