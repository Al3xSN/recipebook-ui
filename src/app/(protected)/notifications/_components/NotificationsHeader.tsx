'use client';

import { markAllReadAction } from '../actions';

interface INotificationsHeaderProps {
  unreadCount: number;
}

export const NotificationsHeader = ({ unreadCount }: INotificationsHeaderProps) => {
  const handleMarkAllRead = async () => {
    await markAllReadAction();
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-(--text)">Notifications</h1>

        {unreadCount > 0 && <p className="mt-0.5 text-xs text-(--text2)">{unreadCount} unread</p>}
      </div>

      {unreadCount > 0 && (
        <button
          type="button"
          onClick={handleMarkAllRead}
          className="cursor-pointer border-none bg-none text-xs font-medium text-(--accent)"
        >
          Mark all as read
        </button>
      )}
    </div>
  );
};
