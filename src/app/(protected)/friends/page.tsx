'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { FriendsPageSkeleton } from './_components/FriendsPageSkeleton';

interface IFriendDto {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  recipeCount: number;
  mutualFriendCount: number;
}

interface IIncomingRequestDto {
  id: string;
  senderId: string;
  senderUsername: string;
  senderDisplayName: string | null;
  senderAvatarUrl: string | null;
  senderBio: string | null;
  receiverId: string;
  status: number;
  createdAt: string;
  mutualFriendCount: number;
}

interface IUserSuggestionDto {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  mutualFriendCount: number;
}

interface ISentRequestDto {
  id: string;
  receiverId: string;
  receiverUsername: string;
}

type Tab = 'my-friends' | 'find-people' | 'requests';

const UserAvatar = ({ name, avatarUrl }: { name: string; avatarUrl: string | null }) => {
  const initials = name.slice(0, 2).toUpperCase();
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={44}
        height={44}
        className="h-11 w-11 flex-shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--bg2)] text-sm font-semibold text-[var(--text)]">
      {initials}
    </div>
  );
};

const UserRow = ({
  name,
  username,
  bio,
  avatarUrl,
  mutualFriendCount,
  actions,
}: {
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  mutualFriendCount: number;
  actions: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 py-3.5">
    <UserAvatar name={name} avatarUrl={avatarUrl} />
    <div className="min-w-0 flex-1">
      <p className="text-[15px] font-semibold text-[var(--text)]">{name}</p>
      <p className="text-[13px] text-[var(--text2)]">@{username}</p>
      {bio && <p className="truncate text-[13px] text-[var(--text2)]">{bio}</p>}
      {mutualFriendCount > 0 && (
        <p className="text-[12px] font-medium text-[var(--accent)]">
          {mutualFriendCount} mutual friend{mutualFriendCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
    <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>
  </div>
);

const SearchInput = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="relative mb-4">
    <svg
      className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text3)]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-full border border-[var(--border)] bg-white py-2.5 pl-10 pr-4 text-[14px] text-[var(--text)] placeholder-[var(--text3)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
    />
  </div>
);

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
    try {
      await apiFetch('/api/friends/requests', {
        method: 'POST',
        body: JSON.stringify({ receiverUsername: username }),
      });
      onAdd(userId);
    } catch {
      // ignore
    }
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
                ? 'cursor-default border border-[var(--border)] text-[var(--text3)]'
                : 'bg-[var(--accent)] text-white hover:opacity-90'
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
        <p className="py-4 text-center text-sm text-[var(--text3)]">Searching...</p>
      ) : (
        <>
          {showSuggestedLabel && (
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text3)]">
              Suggested for you
            </p>
          )}
          {displayList.length === 0 && (
            <p className="py-10 text-center text-sm text-[var(--text3)]">
              {search.trim() ? 'No users found.' : 'No suggestions available.'}
            </p>
          )}
          <div className="divide-y divide-[var(--border)]">{displayList.map(renderRow)}</div>
        </>
      )}
    </div>
  );
};

const RequestsTab = ({
  requests,
  onAccept,
  onDecline,
}: {
  requests: IIncomingRequestDto[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) => {
  if (requests.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-[var(--text3)]">No pending friend requests.</p>
    );
  }

  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text3)]">
        {requests.length} pending
      </p>
      <div className="divide-y divide-[var(--border)]">
        {requests.map((r) => {
          const name = r.senderDisplayName ?? r.senderUsername;
          return (
            <UserRow
              key={r.id}
              name={name}
              username={r.senderUsername}
              bio={r.senderBio}
              avatarUrl={r.senderAvatarUrl}
              mutualFriendCount={r.mutualFriendCount}
              actions={
                <>
                  <button
                    type="button"
                    onClick={() => onAccept(r.id)}
                    className="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => onDecline(r.id)}
                    className="rounded-lg border border-[var(--border)] px-4 py-1.5 text-[13px] font-medium text-[var(--text2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    Decline
                  </button>
                </>
              }
            />
          );
        })}
      </div>
    </div>
  );
};

const FriendsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('my-friends');
  const [friends, setFriends] = useState<IFriendDto[]>([]);
  const [requests, setRequests] = useState<IIncomingRequestDto[]>([]);
  const [suggestions, setSuggestions] = useState<IUserSuggestionDto[]>([]);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<IFriendDto[]>('/api/friends'),
      apiFetch<IIncomingRequestDto[]>('/api/friends/requests'),
      apiFetch<IUserSuggestionDto[]>('/api/users/suggestions'),
      apiFetch<ISentRequestDto[]>('/api/friends/requests?direction=sent'),
    ])
      .then(([f, r, s, sent]) => {
        setFriends(f);
        setRequests(r);
        setSuggestions(s);
        setPendingIds(new Set(sent.map((sr) => sr.receiverId)));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddPending = (userId: string) => {
    setPendingIds((prev) => new Set(prev).add(userId));
  };

  const handleAccept = async (id: string) => {
    try {
      await apiFetch(`/api/friends/requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ accept: true }),
      });
      const accepted = requests.find((r) => r.id === id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (accepted) {
        setFriends((prev) => [
          ...prev,
          {
            userId: accepted.senderId,
            username: accepted.senderUsername,
            displayName: accepted.senderDisplayName,
            avatarUrl: accepted.senderAvatarUrl,
            bio: accepted.senderBio,
            recipeCount: 0,
            mutualFriendCount: accepted.mutualFriendCount,
          },
        ]);
      }
    } catch {
      // ignore
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await apiFetch(`/api/friends/requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ accept: false }),
      });
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // ignore
    }
  };

  const handleRemoveFriend = async (userId: string) => {
    try {
      await apiFetch(`/api/friends/${userId}`, { method: 'DELETE' });
      setFriends((prev) => prev.filter((f) => f.userId !== userId));
    } catch {
      // ignore
    }
  };

  if (isLoading) return <FriendsPageSkeleton />;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'my-friends', label: 'My Friends', count: friends.length },
    { id: 'find-people', label: 'Find People' },
    { id: 'requests', label: 'Requests', count: requests.length },
  ];

  return (
    <div className="mx-auto max-w-lg px-4 pb-10 pt-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text)] transition-colors hover:bg-[var(--bg2)]"
            aria-label="Go back"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="font-playfair text-[22px] font-bold text-[var(--text)]">Friends</h1>
        </div>
      </div>

      <div className="mb-5 flex border-b border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-3 pb-3 text-[13px] font-medium transition-colors ${
              activeTab === tab.id
                ? "text-[var(--accent)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[var(--accent)] after:content-['']"
                : 'text-[var(--text3)] hover:text-[var(--text2)]'
            }`}
          >
            {tab.label}

            {tab.count !== undefined && <span className="ml-1 text-[13px]">({tab.count})</span>}
          </button>
        ))}
      </div>

      {activeTab === 'my-friends' && (
        <MyFriendsTab friends={friends} onRemove={handleRemoveFriend} />
      )}

      {activeTab === 'find-people' && (
        <FindPeopleTab
          initialSuggestions={suggestions}
          pendingIds={pendingIds}
          onAdd={handleAddPending}
        />
      )}

      {activeTab === 'requests' && (
        <RequestsTab requests={requests} onAccept={handleAccept} onDecline={handleDecline} />
      )}
    </div>
  );
};

export default FriendsPage;
