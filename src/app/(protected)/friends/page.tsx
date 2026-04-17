'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { TabBar } from '@/components/ui/TabBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { FriendsPageSkeleton } from './_components/FriendsPageSkeleton';

interface IFriendDto {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  recipeCount: number;
}

interface IIncomingRequestDto {
  id: string;
  senderId: string;
  senderUsername: string;
  receiverId: string;
  status: number;
  createdAt: string;
}

interface ISentRequestDto {
  id: string;
  senderId: string;
  receiverId: string;
  receiverUsername: string;
  status: number;
  createdAt: string;
}

const Avatar = ({ name }: { name: string }) => {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
      {initials}
    </div>
  );
};

const FriendList = ({
  friends,
  onRemove,
}: {
  friends: IFriendDto[];
  onRemove: (userId: string) => void;
}) => {
  if (friends.length === 0) {
    return (
      <EmptyState
        icon={
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        }
        title="No friends yet"
        description="Find people to follow by exploring the community."
        action={
          <Link
            href="/explore"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            Explore
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {friends.map((friend) => {
        const displayName = friend.displayName ?? friend.username;
        return (
          <div
            key={friend.userId}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <Avatar name={displayName} />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900">{displayName}</p>
              <p className="text-sm text-gray-500">
                @{friend.username} · {friend.recipeCount} recipe
                {friend.recipeCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-2">
              <Link
                href={`/profile/${friend.username}`}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-orange-500"
              >
                View profile
              </Link>
              <button
                type="button"
                onClick={() => onRemove(friend.userId)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const RequestList = ({
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
      <EmptyState
        icon={
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
        }
        title="No pending requests"
        description="When someone sends you a friend request, it will appear here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {requests.map((req) => (
        <div
          key={req.id}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <Avatar name={req.senderUsername} />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900">@{req.senderUsername}</p>
            <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => onAccept(req.id)}>
              Accept
            </Button>
            <Button variant="secondary" onClick={() => onDecline(req.id)}>
              Decline
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const SentList = ({
  requests,
  onCancel,
}: {
  requests: ISentRequestDto[];
  onCancel: (id: string) => void;
}) => {
  if (requests.length === 0) {
    return (
      <EmptyState
        icon={
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        }
        title="No sent requests"
        description="Friend requests you have sent will appear here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {requests.map((req) => (
        <div
          key={req.id}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <Avatar name={req.receiverUsername} />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900">@{req.receiverUsername}</p>
            <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</p>
          </div>
          <Button variant="secondary" onClick={() => onCancel(req.id)}>
            Cancel
          </Button>
        </div>
      ))}
    </div>
  );
};

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState<IFriendDto[]>([]);
  const [requests, setRequests] = useState<IIncomingRequestDto[]>([]);
  const [sent, setSent] = useState<ISentRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<IFriendDto[]>('/api/friends'),
      apiFetch<IIncomingRequestDto[]>('/api/friends/requests'),
      apiFetch<ISentRequestDto[]>('/api/friends/requests?direction=sent'),
    ])
      .then(([f, r, s]) => {
        setFriends(f);
        setRequests(r);
        setSent(s);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await apiFetch(`/api/friends/requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ accept: true }),
      });
      // Move from requests to friends (we don't have the friend data yet, so just remove from requests)
      const accepted = requests.find((r) => r.id === id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (accepted) {
        // Optimistically add to friends list with minimal data
        setFriends((prev) => [
          ...prev,
          {
            userId: accepted.senderId,
            username: accepted.senderUsername,
            displayName: null,
            avatarUrl: null,
            recipeCount: 0,
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

  const handleCancelSent = async (id: string) => {
    try {
      await apiFetch(`/api/friends/requests/${id}`, { method: 'DELETE' });
      setSent((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // ignore
    }
  };

  if (isLoading) {
    return <FriendsPageSkeleton />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Friends</h1>
      </div>

      <div className="mb-6">
        <TabBar
          tabs={[
            { id: 'friends', label: 'Friends', count: friends.length },
            { id: 'requests', label: 'Requests', count: requests.length },
            { id: 'sent', label: 'Sent', count: sent.length },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {activeTab === 'friends' && <FriendList friends={friends} onRemove={handleRemoveFriend} />}
      {activeTab === 'requests' && (
        <RequestList requests={requests} onAccept={handleAccept} onDecline={handleDecline} />
      )}
      {activeTab === 'sent' && <SentList requests={sent} onCancel={handleCancelSent} />}
    </div>
  );
};

export default FriendsPage;
