import { INotificationDto } from '@/lib/server/notifications';
import { NotificationCard } from './NotificationCard';

export const NotificationsList = ({ notifications }: { notifications: INotificationDto[] }) => {
  return (
    <>
      {notifications.length === 0 && (
        <div className="rounded-2xl border border-dashed border-(--border) py-20 text-center">
          <p className="text-sm text-(--text2)">No notifications yet.</p>
        </div>
      )}

      {notifications.length > 0 && (
        <div className="flex flex-col gap-2">
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </>
  );
};
