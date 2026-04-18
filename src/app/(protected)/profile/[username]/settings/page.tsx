import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { ProfileInfoForm } from '../../_components/ProfileInfoForm';
import { AvatarUpload } from '../../_components/AvatarUpload';
import { SignOutButton } from '@/components/ui/SignOutButton';
import { DeleteAccountButton } from '../../_components/DeleteAccountButton';

const SettingsPage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const [session, { username }] = await Promise.all([auth(), params]);

  if (!session?.user?.username || session.user.username !== username) {
    redirect(`/profile/${username}`);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href={`/profile/${username}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--text2)] transition-colors hover:bg-[var(--bg2)]"
          aria-label="Back to profile"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-2xl font-bold text-[var(--text)]"
        >
          Profile Settings
        </h1>
      </div>

      <div className="mb-6">
        <AvatarUpload />
      </div>

      <hr className="mb-6 border-[var(--border)]" />

      <ProfileInfoForm />

      <div className="mt-6 flex flex-col items-center gap-3">
        <SignOutButton />
        <DeleteAccountButton />
      </div>
    </div>
  );
};

export default SettingsPage;
