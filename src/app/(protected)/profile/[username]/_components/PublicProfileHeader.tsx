'use client';

import { useState } from 'react';
import { PLACEHOLDER_PUBLIC_PROFILE } from '@/lib/placeholder-data';

type FriendshipStatus = 'none' | 'pending' | 'friends';

export function PublicProfileHeader({ username }: { username: string }) {
  const [status, setStatus] = useState<FriendshipStatus>('none');

  // Use placeholder profile data (username displayed is from the URL)
  const profile = { ...PLACEHOLDER_PUBLIC_PROFILE, username };

  const initials = profile.displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
      {/* Avatar */}
      <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-600">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{profile.displayName}</h1>
        <p className="text-sm text-gray-500">@{profile.username}</p>
        {profile.bio && <p className="mt-2 text-sm text-gray-600">{profile.bio}</p>}
        <div className="mt-2 flex gap-4 text-sm text-gray-500">
          <span>
            <span className="font-semibold text-gray-900">{profile.recipeCount}</span> recipes
          </span>
          <span>
            <span className="font-semibold text-gray-900">{profile.friendCount}</span> friends
          </span>
        </div>
      </div>

      {/* Friendship action button */}
      {status === 'none' && (
        <button
          type="button"
          onClick={() => setStatus('pending')}
          className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
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

      {status === 'pending' && (
        <button
          type="button"
          onClick={() => setStatus('none')}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
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

      {status === 'friends' && (
        <button
          type="button"
          onClick={() => setStatus('none')}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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
