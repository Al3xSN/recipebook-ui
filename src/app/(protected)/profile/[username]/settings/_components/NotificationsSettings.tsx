interface INotificationsSettingsProps {
  notifications: Record<string, boolean>;
  toggleNotification: (id: string) => void;
}

export const NotificationsSettings = ({
  notifications,
  toggleNotification,
}: INotificationsSettingsProps) => {
  const NOTIFICATIONS = [
    { id: 'comments', label: 'New comments on your recipes' },
    { id: 'ratings', label: 'New ratings received' },
    { id: 'followers', label: 'New followers' },
    { id: 'newsletter', label: 'Weekly recipe newsletter' },
  ];

  return (
    <>
      <h2 className="text-base font-semibold text-(--text)">Notifications</h2>

      <div className="-mt-2 flex flex-col">
        {NOTIFICATIONS.map(({ id, label }, i) => (
          <div
            key={id}
            className={`flex items-center justify-between py-3 ${i < NOTIFICATIONS.length - 1 ? 'border-b border-(--border)' : ''}`}
          >
            <span className="text-sm text-(--text)">{label}</span>

            <button
              type="button"
              role="switch"
              aria-checked={notifications[id]}
              onClick={() => toggleNotification(id)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:outline-none ${notifications[id] ? 'bg-[var(--accent)]' : 'bg-gray-200'}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform duration-200 ${notifications[id] ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
