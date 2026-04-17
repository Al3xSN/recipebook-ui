'use client';

import { useSession } from 'next-auth/react';
import { ImageUpload } from '@/components/ui/ImageUpload';

export const AvatarUpload = () => {
  const { data: session, update: updateSession } = useSession();

  const displayName = session?.user?.displayName ?? session?.user?.username ?? '';
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleSuccess = async (url: string) => {
    await updateSession({ avatarUrl: url });
  };

  return (
    <ImageUpload
      uploadUrl="/api/profile/avatar"
      currentImageUrl={session?.user?.avatarUrl}
      shape="circle"
      placeholder={initials}
      onSuccess={handleSuccess}
    />
  );
};
