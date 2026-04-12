'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PLACEHOLDER_PROFILE, PLACEHOLDER_RECIPES } from '@/lib/placeholder-data';
import { RecipeCard } from '../../recipes/_components/RecipeCard';
import { TabBar } from '@/components/ui/TabBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProfileHeader } from './_components/ProfileHeader';
import { ProfileStats } from './_components/ProfileStats';

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState('recipes');

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <ProfileHeader profile={PLACEHOLDER_PROFILE} />
      <ProfileStats profile={PLACEHOLDER_PROFILE} />

      <div className="mb-6">
        <TabBar
          tabs={[
            { id: 'recipes', label: 'My Recipes', count: PLACEHOLDER_RECIPES.length },
            { id: 'imported', label: 'Imported Recipes', count: 0 },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {activeTab === 'recipes' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_RECIPES.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="block">
              <RecipeCard recipe={recipe} />
            </Link>
          ))}
        </div>
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
