'use client';

import { useState } from 'react';
import { AboutTab } from './AboutTab';
import { ProfileTab, ProfileTabs } from './ProfileTabs';
import { SavedTab } from './SavedTab';
import { RecipesTab } from './RecipesTab';
import { IRecipeCardDto } from '@/interfaces/IRecipe';

interface IProfileTabsSectionProps {
  profileBio: string | null;
  profileCreatedAt: Date;
  recipes: IRecipeCardDto[];
  isOwner: boolean;
}

export const ProfileTabsSection = ({
  profileBio,
  profileCreatedAt,
  recipes,
  isOwner,
}: IProfileTabsSectionProps) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('recipes');

  return (
    <>
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="p-5">
        <div className={activeTab === 'recipes' ? 'block' : 'hidden'}>
          <RecipesTab isOwner={isOwner} recipes={recipes} />
        </div>

        {activeTab === 'saved' && <SavedTab />}

        {activeTab === 'about' && <AboutTab bio={profileBio} createdAt={profileCreatedAt} />}
      </div>
    </>
  );
};
