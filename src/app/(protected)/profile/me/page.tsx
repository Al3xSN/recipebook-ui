'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { RecipeCard } from '../../recipes/_components/RecipeCard';
import { TabBar } from '@/components/ui/TabBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProfileHeader, type ProfileData } from './_components/ProfileHeader';
import { ProfileStats } from './_components/ProfileStats';
import type { RecipeDto } from '@/types/recipe';

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState('recipes');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [friendCount, setFriendCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<ProfileData>('/api/profile'),
      apiFetch<RecipeDto[]>('/api/recipes'),
      apiFetch<{ userId: string }[]>('/api/friends'),
    ])
      .then(([p, r, f]) => {
        setProfile(p);
        setRecipes(r);
        setFriendCount(f.length);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !profile) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm text-gray-400">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <ProfileHeader profile={profile} />
      <ProfileStats recipeCount={recipes.length} importedCount={0} friendCount={friendCount} />

      <div className="mb-6">
        <TabBar
          tabs={[
            { id: 'recipes', label: 'My Recipes', count: recipes.length },
            { id: 'imported', label: 'Imported Recipes', count: 0 },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {activeTab === 'recipes' && (
        <>
          {recipes.length === 0 ? (
            <EmptyState
              icon={
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              }
              title="No recipes yet"
              description="Start building your cookbook by adding your first recipe."
              action={
                <Link
                  href="/recipes/new"
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                >
                  Add recipe
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="block">
                  <RecipeCard recipe={recipe} />
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'imported' && (
        <EmptyState
          icon={
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="8 17 12 21 16 17" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
            </svg>
          }
          title="No imported recipes yet"
          description="Browse Explore to discover recipes from the community and import ones you love."
          action={
            <Link
              href="/explore"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
            >
              Browse Explore
            </Link>
          }
        />
      )}
    </div>
  );
}
