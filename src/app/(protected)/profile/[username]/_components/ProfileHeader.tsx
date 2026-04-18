'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import { FriendshipStatus } from '@/enums/FriendshipStatus';
import { SettingsIcon, UserPlusIcon, ClockIcon, UserCheckIcon } from '@/components/icons';

export interface IProfileData {
  userId: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

interface IProfileHeaderProps {
  profile: IProfileData;
  initialFriendshipStatus: FriendshipStatus;
  isOwner?: boolean;
}

export const ProfileHeader = ({
  profile,
  initialFriendshipStatus,
  isOwner = false,
}: IProfileHeaderProps) => {
  const [friendshipStatus, setFriendshipStatus] =
    useState<FriendshipStatus>(initialFriendshipStatus);
  const [isManagingFriend, setIsManagingFriend] = useState(false);

  const displayName = profile.displayName ?? profile.username;
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleAddFriend = async () => {
    setIsManagingFriend(true);
    try {
      await apiFetch('/api/friends/requests', {
        method: 'POST',
        body: JSON.stringify({ receiverUsername: profile.username }),
      });

      setFriendshipStatus(FriendshipStatus.PendingOutgoing);
    } catch {
      // silently ignore
    } finally {
      setIsManagingFriend(false);
    }
  };

  const handleRemoveFriend = async () => {
    setIsManagingFriend(true);
    try {
      await apiFetch(`/api/friends/${profile.userId}`, { method: 'DELETE' });
      setFriendshipStatus(FriendshipStatus.NotFriends);
    } catch {
      // silently ignore
    } finally {
      setIsManagingFriend(false);
    }
  };

  return (
    <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
      <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-600">
        {profile.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            alt={displayName}
            placeholder="empty"
            loading="eager"
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{displayName}</h1>
        <p className="text-sm text-gray-500">@{profile.username}</p>
        {profile.bio && <p className="mt-2 text-sm text-gray-600">{profile.bio}</p>}
      </div>

      {isOwner && (
        <Link
          href={`/profile/${profile.username}/settings`}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          <SettingsIcon className="h-4 w-4" />
          Settings
        </Link>
      )}

      {!isOwner && friendshipStatus === FriendshipStatus.NotFriends && (
        <button
          type="button"
          onClick={handleAddFriend}
          disabled={isManagingFriend}
          className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
        >
          <UserPlusIcon className="h-4 w-4" />
          Add friend
        </button>
      )}

      {!isOwner && friendshipStatus === FriendshipStatus.PendingOutgoing && (
        <button
          type="button"
          disabled
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm opacity-75"
        >
          <ClockIcon className="h-4 w-4" />
          Request sent
        </button>
      )}

      {!isOwner && friendshipStatus === FriendshipStatus.PendingIncoming && (
        <span className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
          Sent you a request — check Friends page
        </span>
      )}

      {!isOwner && friendshipStatus === FriendshipStatus.Friends && (
        <button
          type="button"
          onClick={handleRemoveFriend}
          disabled={isManagingFriend}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <UserCheckIcon className="h-4 w-4" />
          Friends
        </button>
      )}
    </div>
  );
};
