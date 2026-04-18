interface IAboutTabProps {
  bio: string | null;
  createdAt: string;
}

export const AboutTab = ({ bio, createdAt }: IAboutTabProps) => {
  const joinedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="divide-y divide-[var(--border)]">
      <div className="flex items-center gap-4 py-4">
        <span className="text-[20px]">📅</span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text3)]">
            Joined
          </p>
          <p className="text-[15px] font-medium text-[var(--text)]">{joinedDate}</p>
        </div>
      </div>
      <div className="flex items-start gap-4 py-4">
        <span className="text-[20px]">📝</span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text3)]">
            Bio
          </p>
          <p
            className={`text-[15px] font-medium ${bio ? 'text-[var(--text)]' : 'text-[var(--text3)]'}`}
          >
            {bio ?? 'No bio yet'}
          </p>
        </div>
      </div>
    </div>
  );
};
