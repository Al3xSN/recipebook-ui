import Link from 'next/link';
import Image from 'next/image';

export interface ProfileData {
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

export function ProfileHeader({ profile }: { profile: ProfileData }) {
  const displayName = profile.displayName ?? profile.username;
  const initials = displayName.slice(0, 2).toUpperCase();

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

      {/* Settings link */}
      <Link
        href="/profile/me/settings"
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-orange-500"
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
    </div>
  );
}
