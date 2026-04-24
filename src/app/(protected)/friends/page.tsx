'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { FriendsPageSkeleton } from './_components/FriendsPageSkeleton';
import MyFriendsTab from './_components/MyFriendsTab';
import FindPeopleTab from './_components/FindPeopleTab';
import RequestsTab from './_components/RequestsTab';
import type {
  IFriendDto,
  IIncomingRequestDto,
  IUserSuggestionDto,
  ISentRequestDto,
  Tab,
} from './_components/types';

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

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'my-friends', label: 'My Friends', count: friends.length },
    { id: 'find-people', label: 'Find People' },
    { id: 'requests', label: 'Requests', count: requests.length },
  ];

  if (isLoading) return <FriendsPageSkeleton />;

  return (
    <div className="mx-auto max-w-lg p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-(--text)">Friends</h1>
        </div>
      </div>

      <div className="mb-5 flex border-b border-(--border)">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-3 pb-3 text-[13px] font-medium transition-colors ${
              activeTab === tab.id
                ? "text-(--accent) after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-(--accent) after:content-['']"
                : 'text-(--text3) hover:text-(--text2)'
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
