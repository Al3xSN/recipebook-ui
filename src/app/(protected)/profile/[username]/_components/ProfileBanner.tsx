'use client';

import { useOptimistic, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sendFriendRequest, removeFriend } from '@/app/(protected)/friends/actions';
import { FriendshipStatus } from '@/enums/FriendshipStatus';
import { SettingsIcon, UserPlusIcon, ClockIcon, UserCheckIcon } from '@/components/icons';
import { IUserDto } from '@/interfaces/IUser';

interface IProfileBannerProps {
  profile: IUserDto;
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
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(initialFriendshipStatus);
  const [isPending, startTransition] = useTransition();

  const displayName = profile.displayName ?? profile.username;
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleAddFriend = () => {
    startTransition(async () => {
      setOptimisticStatus(FriendshipStatus.PendingOutgoing);
      await sendFriendRequest(profile.username);
    });
  };

  const handleRemoveFriend = () => {
    startTransition(async () => {
      setOptimisticStatus(FriendshipStatus.NotFriends);
      await removeFriend(profile.id);
    });
  };

  return (
    <div className="relative bg-(--accent) p-5">
      <div className="mb-3 flex items-center gap-3.5">
        <div className="flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-2xl font-bold text-(--accent)">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={displayName}
              width={72}
              height={72}
              loading="eager"
              placeholder="empty"
              className="h-18 w-18 rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className="flex items-center justify-between text-white">
          <div>
            <h2 className="text-[21px] leading-tight font-bold">{displayName}</h2>
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

        {!isOwner && (
          <>
            {optimisticStatus === FriendshipStatus.NotFriends && (
              <button
                type="button"
                onClick={handleAddFriend}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30 disabled:opacity-50"
              >
                <UserPlusIcon className="h-4 w-4" />
                Add friend
              </button>
            )}

            {optimisticStatus === FriendshipStatus.PendingOutgoing && (
              <button
                type="button"
                disabled
                className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white/60"
              >
                <ClockIcon className="h-4 w-4" />
                Request sent
              </button>
            )}

            {optimisticStatus === FriendshipStatus.PendingIncoming && (
              <span className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
                Sent you a request
              </span>
            )}

            {optimisticStatus === FriendshipStatus.Friends && (
              <button
                type="button"
                onClick={handleRemoveFriend}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-red-300/50 hover:bg-red-500/30 disabled:opacity-50"
              >
                <UserCheckIcon className="h-4 w-4" />
                Friends
              </button>
            )}
          </>
        )}
      </div>

      {profile.bio && (
        <p className="my-2 text-[13px] leading-[1.55] text-white/80">{profile.bio}</p>
      )}

      <div className="flex gap-7">
        <div className="text-white">
          <div className="text-xl font-bold">{recipeCount}</div>
          <div className="mt-0.5 text-[11px] text-white/65">Recipes</div>
        </div>

        {isOwner ? (
          <Link href="/friends" className="text-white transition-opacity hover:opacity-80">
            <div className="text-xl font-bold">{friendCount}</div>
            <div className="mt-0.5 text-[11px] text-white/65">Friends</div>
          </Link>
        ) : (
          <div className="text-white">
            <div className="text-xl font-bold">{friendCount}</div>
            <div className="mt-0.5 text-[11px] text-white/65">Friends</div>
          </div>
        )}
      </div>
    </div>
  );
};
