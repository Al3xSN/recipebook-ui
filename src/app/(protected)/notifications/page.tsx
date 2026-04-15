'use client';

import { useState } from 'react';
import { PLACEHOLDER_NOTIFICATIONS, type PlaceholderNotification } from '@/lib/placeholder-data';

function NotificationIcon({ type }: { type: PlaceholderNotification['type'] }) {
  if (type === 'friend_request') {
    return (
      <svg
        className="h-5 w-5"
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
    );
  }

  if (type === 'friend_accepted') {
    return (
      <svg
        className="h-5 w-5"
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
    );
  }

  if (type === 'recipe_comment') {
    return (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }

  // recipe_imported
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="8 17 12 21 16 17" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
    </svg>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(PLACEHOLDER_NOTIFICATIONS);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Notifications</h1>
          {unreadCount > 0 && <p className="mt-0.5 text-sm text-gray-500">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="text-sm font-medium text-orange-500 transition-colors hover:text-orange-600"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <p className="text-sm text-gray-500">No notifications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => markRead(n.id)}
              className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors ${
                n.read
                  ? 'border-gray-200 bg-white hover:bg-gray-50'
                  : 'border-orange-100 bg-orange-50 hover:bg-orange-100/50'
              }`}
            >
              {/* Icon */}
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                <NotificationIcon type={n.type} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{n.message}</p>
                <p className="mt-0.5 text-xs text-gray-400">{n.createdAt}</p>
              </div>

              {/* Unread dot */}
              {!n.read && <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
