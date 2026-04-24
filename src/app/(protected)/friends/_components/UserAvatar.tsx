import Image from 'next/image';

const UserAvatar = ({ name, avatarUrl }: { name: string; avatarUrl: string | null }) => {
  const initials = name.slice(0, 2).toUpperCase();
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--bg2) text-sm font-semibold text-(--text)">
      {initials}
    </div>
  );
};

export default UserAvatar;
