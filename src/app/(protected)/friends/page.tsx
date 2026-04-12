'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  PLACEHOLDER_FRIENDS,
  PLACEHOLDER_FRIEND_REQUESTS,
  PLACEHOLDER_SENT_REQUESTS,
  type PlaceholderFriend,
  type PlaceholderRequest,
} from '@/lib/placeholder-data';
import { TabBar } from '@/components/ui/TabBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
      {initials}
    </div>
  );
}

function FriendList({ friends }: { friends: PlaceholderFriend[] }) {
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
      {friends.map((friend) => (
        <div
          key={friend.username}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <Avatar name={friend.displayName} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900">{friend.displayName}</p>
            <p className="text-sm text-gray-500">
              @{friend.username} · {friend.recipeCount} recipes
            </p>
          </div>
          <Link
            href={`/profile/${friend.username}`}
            className="flex-shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-orange-500"
          >
            View profile
          </Link>
        </div>
      ))}
    </div>
  );
}

function RequestList({
  requests,
  onAccept,
  onDecline,
}: {
  requests: PlaceholderRequest[];
  onAccept: (username: string) => void;
  onDecline: (username: string) => void;
}) {
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
          key={req.username}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <Avatar name={req.displayName} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900">{req.displayName}</p>
            <p className="text-sm text-gray-500">@{req.username}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => onAccept(req.username)}>
              Accept
            </Button>
            <Button variant="secondary" onClick={() => onDecline(req.username)}>
              Decline
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SentList({
  requests,
  onCancel,
}: {
  requests: PlaceholderRequest[];
  onCancel: (username: string) => void;
}) {
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
          key={req.username}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <Avatar name={req.displayName} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900">{req.displayName}</p>
            <p className="text-sm text-gray-500">@{req.username}</p>
          </div>
          <Button variant="secondary" onClick={() => onCancel(req.username)}>
            Cancel
          </Button>
        </div>
      ))}
    </div>
  );
}

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends] = useState(PLACEHOLDER_FRIENDS);
  const [requests, setRequests] = useState(PLACEHOLDER_FRIEND_REQUESTS);
  const [sent, setSent] = useState(PLACEHOLDER_SENT_REQUESTS);

  function handleAccept(username: string) {
    setRequests((prev) => prev.filter((r) => r.username !== username));
  }

  function handleDecline(username: string) {
    setRequests((prev) => prev.filter((r) => r.username !== username));
  }

  function handleCancel(username: string) {
    setSent((prev) => prev.filter((r) => r.username !== username));
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

      {activeTab === 'friends' && <FriendList friends={friends} />}
      {activeTab === 'requests' && (
        <RequestList requests={requests} onAccept={handleAccept} onDecline={handleDecline} />
      )}
      {activeTab === 'sent' && <SentList requests={sent} onCancel={handleCancel} />}
    </div>
  );
}
