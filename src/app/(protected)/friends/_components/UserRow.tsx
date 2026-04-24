import UserAvatar from './UserAvatar';

const UserRow = ({
  name,
  username,
  bio,
  avatarUrl,
  mutualFriendCount,
  actions,
}: {
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  mutualFriendCount: number;
  actions: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 py-3.5">
    <UserAvatar name={name} avatarUrl={avatarUrl} />
    <div className="min-w-0 flex-1">
      <p className="text-[15px] font-semibold text-(--text)">{name}</p>
      <p className="text-[13px] text-(--text2)">@{username}</p>
      {bio && <p className="truncate text-[13px] text-(--text2)">{bio}</p>}
      {mutualFriendCount > 0 && (
        <p className="text-[12px] font-medium text-(--accent)">
          {mutualFriendCount} mutual friend{mutualFriendCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
    <div className="flex shrink-0 items-center gap-2">{actions}</div>
  </div>
);

export default UserRow;
