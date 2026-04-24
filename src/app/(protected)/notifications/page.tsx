'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import NotificationIcon from './_components/NotificationIcon';
import { type INotification, notificationMessage } from './_components/types';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<INotification[]>('/api/notifications')
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await apiFetch('/api/notifications/read-all', { method: 'PUT' }).catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = async (id: string) => {
    await apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' }).catch(() => {});
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-160 p-5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-(--text)">Notifications</h1>

          {unreadCount > 0 && <p className="mt-0.5 text-xs text-(--text2)">{unreadCount} unread</p>}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="cursor-pointer border-none bg-none text-xs font-medium text-(--accent)"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-(--bg2)" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-(--border) py-20 text-center">
          <p className="text-sm text-(--text2)">No notifications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => markRead(n.id)}
              className={`flex w-full items-start gap-4 rounded-xl border border-solid p-4 text-left transition-colors duration-150 ${n.read ? 'border-(--border) bg-(--card)' : 'border-(--accent-border-tint-20) bg-(--accent-tint-8)'}`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--bg2) text-(--accent)">
                <NotificationIcon type={n.type} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-(--text)">{notificationMessage(n)}</p>
                <p className="mt-0.5 text-xs text-(--text3)">
                  {new Date(n.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {!n.read && <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-(--accent)" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
