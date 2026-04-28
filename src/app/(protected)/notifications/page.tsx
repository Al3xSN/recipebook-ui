import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getNotifications } from '@/lib/server/notifications';
import { NotificationsList } from './_components/NotificationsList';
import { NotificationsHeader } from './_components/NotificationsHeader';

const NotificationsPage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect('/');

  const notifications = await getNotifications(session.user.id);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-160 p-5">
      <NotificationsHeader unreadCount={unreadCount} />
      <NotificationsList notifications={notifications} />
    </div>
  );
};

export default NotificationsPage;
