'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchInput from './SearchInput';
import UserRow from './UserRow';
import { IFriendDto } from './types';

const MyFriendsTab = ({
  friends,
  onRemove,
}: {
  friends: IFriendDto[];
  onRemove: (userId: string) => void;
}) => {
  const [search, setSearch] = useState('');

  const filtered = friends.filter((f) => {
    const q = search.toLowerCase();
    return (
      (f.displayName ?? f.username).toLowerCase().includes(q) ||
      f.username.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <SearchInput placeholder="Search your friends..." value={search} onChange={setSearch} />
      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-[var(--text3)]">
          {search ? 'No friends match your search.' : "You haven't added any friends yet."}
        </p>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {filtered.map((f) => {
            const name = f.displayName ?? f.username;
            return (
              <UserRow
                key={f.userId}
                name={name}
                username={f.username}
                bio={f.bio}
                avatarUrl={f.avatarUrl}
                mutualFriendCount={f.mutualFriendCount}
                actions={
                  <>
                    <Link
                      href={`/profile/${f.username}`}
                      className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-[13px] font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      Recipes
                    </Link>
                    <button
                      type="button"
                      onClick={() => onRemove(f.userId)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text3)] transition-colors hover:border-red-300 hover:text-red-400"
                      aria-label="Remove friend"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyFriendsTab;
