'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { FriendshipStatus } from '@/enums/FriendshipStatus';
import { SettingsIcon, UserPlusIcon, ClockIcon, UserCheckIcon } from '@/components/icons';

export interface IProfileData {
  userId: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

interface IProfileBannerProps {
  profile: IProfileData;
  isOwner: boolean;
  initialFriendshipStatus: FriendshipStatus;
  recipeCount: number;
  friendCount: number;
}

export const ProfileBanner = ({
  profile,
  isOwner,
  initialFriendshipStatus,
  recipeCount,
  friendCount,
}: IProfileBannerProps) => {
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
    <div className="relative bg-[var(--accent)] px-5 pb-6 pt-11">
      {!isOwner && (
        <div className="absolute right-5 top-4">
          {friendshipStatus === FriendshipStatus.NotFriends && (
            <button
              type="button"
              onClick={handleAddFriend}
              disabled={isManagingFriend}
              className="flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30 disabled:opacity-50"
            >
              <UserPlusIcon className="h-4 w-4" />
              Add friend
            </button>
          )}
          {friendshipStatus === FriendshipStatus.PendingOutgoing && (
            <button
              type="button"
              disabled
              className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white/60"
            >
              <ClockIcon className="h-4 w-4" />
              Request sent
            </button>
          )}
          {friendshipStatus === FriendshipStatus.PendingIncoming && (
            <span className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
              Sent you a request
            </span>
          )}
          {friendshipStatus === FriendshipStatus.Friends && (
            <button
              type="button"
              onClick={handleRemoveFriend}
              disabled={isManagingFriend}
              className="flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-red-300/50 hover:bg-red-500/30 disabled:opacity-50"
            >
              <UserCheckIcon className="h-4 w-4" />
              Friends
            </button>
          )}
        </div>
      )}

      <div className="mb-3 flex items-center gap-3.5">
        <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-2xl font-bold text-[var(--accent)]">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={displayName}
              width={72}
              height={72}
              loading="eager"
              placeholder="empty"
              className="h-[72px] w-[72px] rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className="flex items-center justify-between text-white">
          <div>
            <h2
              className="text-[21px] leading-tight"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
            >
              {displayName}
            </h2>
            <p className="mt-0.5 text-[13px] text-white/75">@{profile.username}</p>
          </div>
        </div>

        {isOwner && (
          <Link
            href={`/profile/${profile.username}/settings`}
            className="ml-auto rounded-lg border border-white/30 bg-white/20 p-2 backdrop-blur-sm transition-colors hover:bg-white/30"
            aria-label="Settings"
          >
            <SettingsIcon className="h-4 w-4 text-white" />
          </Link>
        )}
      </div>

      {profile.bio && (
        <p className="my-2 text-[13px] leading-[1.55] text-white/80">{profile.bio}</p>
      )}

      <div className="flex gap-7">
        <div className="text-white">
          <div
            className="text-[20px]"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            {recipeCount}
          </div>
          <div className="mt-0.5 text-[11px] text-white/65">Recipes</div>
        </div>
        {isOwner ? (
          <Link href="/friends" className="text-white transition-opacity hover:opacity-80">
            <div
              className="text-[20px]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
            >
              {friendCount}
            </div>
            <div className="mt-0.5 text-[11px] text-white/65">Friends</div>
          </Link>
        ) : (
          <div className="text-white">
            <div
              className="text-[20px]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
            >
              {friendCount}
            </div>
            <div className="mt-0.5 text-[11px] text-white/65">Friends</div>
          </div>
        )}
      </div>
    </div>
  );
};
