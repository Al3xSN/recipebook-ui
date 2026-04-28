'use client';

import { useState, useOptimistic, useTransition } from 'react';
import { acceptRequest, declineRequest, removeFriend } from '../actions';
import MyFriendsTab from './MyFriendsTab';
import FindPeopleTab from './FindPeopleTab';
import RequestsTab from './RequestsTab';
import { IFriendDto, IIncomingRequestDto, IUserSuggestionDto } from '@/interfaces/IFriend';
import { Tab } from './types';

interface IFriendsContentProps {
  initialFriends: IFriendDto[];
  initialRequests: IIncomingRequestDto[];
  initialSuggestions: IUserSuggestionDto[];
  initialSentReceiverIds: string[];
}

export const FriendsContent = ({
  initialFriends,
  initialRequests,
  initialSuggestions,
  initialSentReceiverIds,
}: IFriendsContentProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('my-friends');
  const [pendingIds, setPendingIds] = useState(() => new Set(initialSentReceiverIds));
  const [, startTransition] = useTransition();

  const [optimisticFriends, updateOptimisticFriends] = useOptimistic(initialFriends);
  const [optimisticRequests, updateOptimisticRequests] = useOptimistic(initialRequests);

  const handleAccept = (id: string) => {
    startTransition(async () => {
      const accepted = optimisticRequests.find((r) => r.id === id);
      updateOptimisticRequests((prev) => prev.filter((r) => r.id !== id));
      if (accepted) {
        updateOptimisticFriends((prev) => [
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
      await acceptRequest(id);
    });
  };

  const handleDecline = (id: string) => {
    startTransition(async () => {
      updateOptimisticRequests((prev) => prev.filter((r) => r.id !== id));
      await declineRequest(id);
    });
  };

  const handleRemoveFriend = (userId: string) => {
    startTransition(async () => {
      updateOptimisticFriends((prev) => prev.filter((f) => f.userId !== userId));
      await removeFriend(userId);
    });
  };

  const handleAddPending = (userId: string) => {
    setPendingIds((prev) => new Set(prev).add(userId));
  };

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'my-friends', label: 'My Friends', count: optimisticFriends.length },
    { id: 'find-people', label: 'Find People' },
    { id: 'requests', label: 'Requests', count: optimisticRequests.length },
  ];

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
        <MyFriendsTab friends={optimisticFriends} onRemove={handleRemoveFriend} />
      )}

      {activeTab === 'find-people' && (
        <FindPeopleTab
          initialSuggestions={initialSuggestions}
          pendingIds={pendingIds}
          onAdd={handleAddPending}
        />
      )}

      {activeTab === 'requests' && (
        <RequestsTab
          requests={optimisticRequests}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </div>
  );
};
