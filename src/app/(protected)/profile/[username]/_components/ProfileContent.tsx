'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { FriendshipStatus } from '@/enums/FriendshipStatus';
import { ProfileBanner, type IProfileData } from './ProfileBanner';
import { ProfileTabs, type ProfileTab } from './ProfileTabs';
import { SavedTab } from './SavedTab';
import { AboutTab } from './AboutTab';

interface IProfileContentProps {
  profile: IProfileData;
  isOwner: boolean;
  initialFriendshipStatus: FriendshipStatus;
  recipeCount: number;
  friendCount: number;
  recipesContent: ReactNode;
}

export const ProfileContent = ({
  profile,
  isOwner,
  initialFriendshipStatus,
  recipeCount,
  friendCount,
  recipesContent,
}: IProfileContentProps) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('recipes');

  return (
    <div className="mx-auto max-w-5xl">
      <ProfileBanner
        profile={profile}
        isOwner={isOwner}
        initialFriendshipStatus={initialFriendshipStatus}
        recipeCount={recipeCount}
        friendCount={friendCount}
      />
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="px-5 py-5">
        <div className={activeTab === 'recipes' ? 'block' : 'hidden'}>{recipesContent}</div>
        {activeTab === 'saved' && <SavedTab />}
        {activeTab === 'about' && <AboutTab bio={profile.bio} createdAt={profile.createdAt} />}
      </div>
    </div>
  );
};
