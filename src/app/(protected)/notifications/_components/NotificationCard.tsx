'use client';

import { markReadAction } from '../actions';
import { INotification } from '../types';
import { notificationMessage } from '../utils';
import { NotificationIcon } from './NotificationIcon';

interface INotificationCardProps {
  notification: INotification;
}

export const NotificationCard = ({ notification }: INotificationCardProps) => {
  const handleMarkAsRead = async (id: string) => {
    await markReadAction(id);
  };

  return (
    <button
      key={notification.id}
      type="button"
      onClick={() => handleMarkAsRead(notification.id)}
      className={`flex w-full items-start gap-4 rounded-xl border border-solid p-4 text-left transition-colors duration-150 ${notification.read ? 'border-(--border) bg-(--card)' : 'border-(--accent-border-tint-20) bg-(--accent-tint-8)'}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--bg2) text-(--accent)">
        <NotificationIcon type={notification.type} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-(--text)">{notificationMessage(notification)}</p>

        <p className="mt-0.5 text-xs text-(--text3)">
          {new Date(notification.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {!notification.read && <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-(--accent)" />}
    </button>
  );
};
