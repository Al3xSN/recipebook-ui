interface IAboutTabProps {
  bio: string | null;
  createdAt: Date;
}

export const AboutTab = ({ bio, createdAt }: IAboutTabProps) => {
  const joinedDate = createdAt.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="divide-y divide-(--border)">
      <div className="flex items-center gap-4 py-4">
        <span className="text-[20px]">📅</span>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-(--text3) uppercase">
            Joined
          </p>
          <p className="text-[15px] font-medium text-(--text)">{joinedDate}</p>
        </div>
      </div>
      <div className="flex items-start gap-4 py-4">
        <span className="text-[20px]">📝</span>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-(--text3) uppercase">Bio</p>
          <p className={`text-[15px] font-medium ${bio ? 'text-(--text)' : 'text-(--text3)'}`}>
            {bio ?? 'No bio yet'}
          </p>
        </div>
      </div>
    </div>
  );
};
