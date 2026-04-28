import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { ProfileInfoForm } from './_components/ProfileInfoForm';
import { AvatarUpload } from './_components/AvatarUpload';
import { SignOutButton } from '@/components/ui/SignOutButton';
import { DeleteAccountButton } from './_components/DeleteAccountButton';
import { ArrowLeftIcon } from '@/components/icons';
import { getUserById } from '@/lib/server/user';

const SettingsPage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const [session, { username }] = await Promise.all([auth(), params]);

  if (!session?.user?.username || session.user.username !== username) {
    redirect(`/profile/${username}`);
  }

  const user = await getUserById(session.user.id);
  if (!user) redirect(`/profile/${username}`);

  return (
    <div className="max-w-lg p-5">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href={`/profile/${username}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-(--border) bg-white text-(--text2) transition-colors hover:bg-(--bg2)"
          aria-label="Back to profile"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
        </Link>

        <h1 className="text-xl font-bold text-(--text)">Profile Settings</h1>
      </div>

      <div className="mb-6">
        <AvatarUpload />
      </div>

      <hr className="mb-6 border-(--border)" />

      <ProfileInfoForm user={user} />

      <hr className="my-6 border-(--border)" />

      <div className="mt-6 flex flex-col items-center gap-3">
        <SignOutButton />

        <DeleteAccountButton />
      </div>
    </div>
  );
};

export default SettingsPage;
