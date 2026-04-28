'use client';

import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import { sendFriendRequest } from '../actions';
import SearchInput from './SearchInput';
import UserRow from './UserRow';
import { IUserSuggestionDto } from '@/interfaces/IFriend';

const FindPeopleTab = ({
  initialSuggestions,
  pendingIds,
  onAdd,
}: {
  initialSuggestions: IUserSuggestionDto[];
  pendingIds: Set<string>;
  onAdd: (userId: string) => void;
}) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<IUserSuggestionDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await apiFetch<IUserSuggestionDto[]>(
          `/api/users/search?username=${encodeURIComponent(search.trim())}`,
        );
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, [search]);

  const handleAdd = async (username: string, userId: string) => {
    await sendFriendRequest(username);
    onAdd(userId);
  };

  const displayList = search.trim() ? results : initialSuggestions;
  const showSuggestedLabel = !search.trim() && initialSuggestions.length > 0;

  const renderRow = (u: IUserSuggestionDto) => {
    const name = u.displayName ?? u.username;
    const sent = pendingIds.has(u.userId);
    return (
      <UserRow
        key={u.userId}
        name={name}
        username={u.username}
        bio={u.bio}
        avatarUrl={u.avatarUrl}
        mutualFriendCount={u.mutualFriendCount}
        actions={
          <button
            type="button"
            disabled={sent}
            onClick={() => handleAdd(u.username, u.userId)}
            className={`rounded-lg px-4 py-1.5 text-[13px] font-medium transition-opacity ${
              sent
                ? 'cursor-default border border-(--border) text-(--text3)'
                : 'bg-(--accent) text-white hover:opacity-90'
            }`}
          >
            {sent ? 'Sent' : '+ Add'}
          </button>
        }
      />
    );
  };

  return (
    <div>
      <SearchInput
        placeholder="Search by name or username..."
        value={search}
        onChange={setSearch}
      />
      {isSearching ? (
        <p className="py-4 text-center text-sm text-(--text3)">Searching...</p>
      ) : (
        <>
          {showSuggestedLabel && (
            <p className="mb-1 text-[11px] font-semibold tracking-wider text-(--text3) uppercase">
              Suggested for you
            </p>
          )}
          {displayList.length === 0 && (
            <p className="py-10 text-center text-sm text-(--text3)">
              {search.trim() ? 'No users found.' : 'No suggestions available.'}
            </p>
          )}
          <div className="divide-y divide-(--border)">{displayList.map(renderRow)}</div>
        </>
      )}
    </div>
  );
};

export default FindPeopleTab;
