'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';

export interface IPublicProfileData {
  userId: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

// 0=NotFriends, 1=PendingOutgoing, 2=PendingIncoming, 3=Friends
type TFriendshipStatus = 0 | 1 | 2 | 3;

interface IPublicProfileHeader {
  profile: IPublicProfileData;
  initialFriendshipStatus: TFriendshipStatus;
  isOwner?: boolean;
}

export function PublicProfileHeader({
  profile,
  initialFriendshipStatus,
  isOwner = false,
}: IPublicProfileHeader) {
  const [status, setStatus] = useState<TFriendshipStatus>(initialFriendshipStatus);
  const [isActing, setIsActing] = useState(false);

  const displayName = profile.displayName ?? profile.username;
  const initials = displayName.slice(0, 2).toUpperCase();

  async function handleAddFriend() {
    setIsActing(true);
    try {
      await apiFetch('/api/friends/requests', {
        method: 'POST',
        body: JSON.stringify({ receiverUsername: profile.username }),
      });
      setStatus(1);
    } catch {
      // silently ignore
    } finally {
      setIsActing(false);
    }
  }

  async function handleRemoveFriend() {
    setIsActing(true);
    try {
      await apiFetch(`/api/friends/${profile.userId}`, { method: 'DELETE' });
      setStatus(0);
    } catch {
      // silently ignore
    } finally {
      setIsActing(false);
    }
  }

  return (
    <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
      {/* Avatar */}
      <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-600">
        {profile.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            alt={displayName}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{displayName}</h1>
        <p className="text-sm text-gray-500">@{profile.username}</p>
        {profile.bio && <p className="mt-2 text-sm text-gray-600">{profile.bio}</p>}
      </div>

      {/* Owner: settings button */}
      {isOwner && (
        <Link
          href="/profile/me/settings"
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Settings
        </Link>
      )}

      {/* Friendship action */}
      {!isOwner && status === 0 && (
        <button
          type="button"
          onClick={handleAddFriend}
          disabled={isActing}
          className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          Add friend
        </button>
      )}

      {!isOwner && status === 1 && (
        <button
          type="button"
          disabled
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm opacity-75"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Request sent
        </button>
      )}

      {!isOwner && status === 2 && (
        <span className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
          Sent you a request — check Friends page
        </span>
      )}

      {!isOwner && status === 3 && (
        <button
          type="button"
          onClick={handleRemoveFriend}
          disabled={isActing}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <polyline points="17 11 19 13 23 9" />
          </svg>
          Friends
        </button>
      )}
    </div>
  );
}
